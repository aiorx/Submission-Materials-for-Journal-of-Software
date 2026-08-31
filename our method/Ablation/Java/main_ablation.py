#!/usr/bin/env python3
"""
AI代码检测系统 - 消融实验主入口（Java版）
支持多种特征组合的消融实验: 123, 12, 13, 23, 1, 3

特征组划分:
  1 = lexical + syntactic (词法 + 语法)
  2 = java_specific + human_error (Java特有 + 人类失误)
  3 = codeberta (深度语义)

用法:
  python main_ablation.py                # 默认依次运行所有6种消融模式
  python main_ablation.py -m 12          # 运行单一模式
"""

import logging
from pathlib import Path
import argparse
import pandas as pd
import numpy as np

import config
from data_loader import DataLoader
from feature_extractor import JavaBatchExtractorWrapper
from model_trainer import AdvancedModelTrainer
from visualization import ResultVisualizer

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ========== 消融实验配置映射 ==========
# 特征组:
#   1 = lexical + syntactic
#   2 = java_specific + human_error
#   3 = codeberta

ABLATION_CONFIGS = {
    '123': {
        'lexical': True,
        'syntactic': True,
        'java_specific': True,
        'human_error': True,
        'codeberta': True,
        'suffix': '123',
        'desc': '全部特征 (词法+语法 + Java特有+人类失误 + CodeBERTa)'
    },
    '12': {
        'lexical': True,
        'syntactic': True,
        'java_specific': True,
        'human_error': True,
        'codeberta': False,
        'suffix': '12',
        'desc': '词法+语法 + Java特有+人类失误 (无CodeBERTa)'
    },
    '13': {
        'lexical': True,
        'syntactic': True,
        'java_specific': False,
        'human_error': False,
        'codeberta': True,
        'suffix': '13',
        'desc': '词法+语法 + CodeBERTa (无Java特有/人类失误)'
    },
    '23': {
        'lexical': False,
        'syntactic': False,
        'java_specific': True,
        'human_error': True,
        'codeberta': True,
        'suffix': '23',
        'desc': 'Java特有+人类失误 + CodeBERTa (无词法/语法)'
    },
    '1': {
        'lexical': True,
        'syntactic': True,
        'java_specific': False,
        'human_error': False,
        'codeberta': False,
        'suffix': '1',
        'desc': '仅词法+语法'
    },
    '3': {
        'lexical': False,
        'syntactic': False,
        'java_specific': False,
        'human_error': False,
        'codeberta': True,
        'suffix': '3',
        'desc': '仅CodeBERTa'
    },
}


def apply_ablation_config(mode):
    """根据消融模式覆盖 config 的特征开关和输出路径"""
    if mode not in ABLATION_CONFIGS:
        raise ValueError(f"未知的消融模式: {mode}，可选: {list(ABLATION_CONFIGS.keys())}")

    ablation = ABLATION_CONFIGS[mode]

    config.FEATURES['lexical'] = ablation['lexical']
    config.FEATURES['syntactic'] = ablation['syntactic']
    config.FEATURES['java_specific'] = ablation['java_specific']
    config.FEATURES['human_error'] = ablation['human_error']
    config.FEATURES['codeberta'] = ablation['codeberta']

    suffix = ablation['suffix']
    config.OUTPUT_PATHS = {
        'features_dir': f"data/processed/features_java_{suffix}",
        'models_dir': f"data/processed/models_java_{suffix}",
        'results_dir': f"results_java_{suffix}",
    }

    logger.info(f"消融模式: {mode} - {ablation['desc']}")
    logger.info(f"  特征: lexical={ablation['lexical']}, syntactic={ablation['syntactic']}, "
                f"java_specific={ablation['java_specific']}, human_error={ablation['human_error']}, "
                f"codeberta={ablation['codeberta']}")
    logger.info(f"  输出: features_java_{suffix} / models_java_{suffix} / results_java_{suffix}")


def create_directories():
    """创建必要的目录"""
    paths = [
        config.OUTPUT_PATHS['features_dir'],
        config.OUTPUT_PATHS['models_dir'],
        config.OUTPUT_PATHS['results_dir'],
        f"{config.OUTPUT_PATHS['results_dir']}/figures"
    ]
    for path in paths:
        Path(path).mkdir(parents=True, exist_ok=True)


def run_experiment():
    """运行单次消融实验"""
    create_directories()

    # 1. 加载数据
    logger.info("=" * 60)
    logger.info("步骤1: 加载 Java 数据集 (整文件)")
    data_loader = DataLoader(config)
    functions, labels, groups, metadata = data_loader.load_data()

    if len(functions) == 0:
        logger.error("数据集为空！请检查文件路径！")
        return

    logger.info(f"总共加载 {len(functions)} 个代码片段")
    logger.info(f"人类代码: {sum(np.array(labels) == 0)} 个")
    logger.info(f"AI代码: {sum(np.array(labels) == 1)} 个")

    # 2. 提取特征
    logger.info("=" * 60)
    logger.info("步骤2: 提取 Java 领域专家特征 (无 N-gram)")
    extractor_wrapper = JavaBatchExtractorWrapper(config)
    X_raw = extractor_wrapper.extract_batch(functions)
    feature_names = extractor_wrapper.get_feature_names()
    logger.info(f"初始提取的特征总维度: {X_raw.shape[1]}")

    # 2.5 清洗特征
    from sklearn.feature_selection import VarianceThreshold, SelectKBest, f_classif

    logger.info("执行特征清洗: 移除在所有样本中值都一样的死特征...")
    selector = VarianceThreshold(threshold=0.0)
    X_clean = selector.fit_transform(X_raw)

    retained_indices = selector.get_support(indices=True)
    clean_feature_names = [feature_names[i] for i in retained_indices]
    logger.info(f"死特征移除完成! 剩余维度: {X_clean.shape[1]}")

    MAX_FEATURES = 300
    if X_clean.shape[1] > MAX_FEATURES:
        logger.info(f"检测到高维特征 ({X_clean.shape[1]} 维)，正在筛选 Top {MAX_FEATURES} 最强特征...")
        kbest = SelectKBest(score_func=f_classif, k=MAX_FEATURES)
        X = kbest.fit_transform(X_clean, labels)

        kbest_indices = kbest.get_support(indices=True)
        feature_names = [clean_feature_names[i] for i in kbest_indices]
    else:
        X = X_clean
        feature_names = clean_feature_names

    logger.info(f"特征筛选完成! 最终进入模型的维度: {X.shape[1]}")

    # 保存特征 CSV (包含文件名列)
    features_path = f"{config.OUTPUT_PATHS['features_dir']}/features_java.csv"
    feature_df = pd.DataFrame(X, columns=feature_names)

    file_names_col = [m.get('file', f'unknown_{i}') for i, m in enumerate(metadata)]
    feature_df.insert(0, 'file_name', file_names_col)

    feature_df['label'] = labels
    feature_df.to_csv(features_path, index=False, encoding='utf-8-sig')
    logger.info(f"特征数据已保存至: {features_path} (包含文件名列)")

    # 3. 训练模型
    logger.info("=" * 60)
    logger.info("步骤3: 训练 Ensemble 集成模型 (GroupKFold 防泄露)")
    trainer = AdvancedModelTrainer(config)
    results = trainer.train_and_evaluate(X, np.array(labels), groups=groups)

    if config.MODEL['save_model']:
        model_path = f"{config.OUTPUT_PATHS['models_dir']}/rf_model_java.joblib"
        trainer.save_model(model_path)
        logger.info(f"模型已保存至: {model_path}")

    # 3.5 导出 Bad Cases
    logger.info("=" * 60)
    logger.info("步骤3.5: 导出 Bad Cases 进行人工查错...")

    y_true = np.array(labels)
    y_pred = np.array(results.get('y_pred', []))
    y_proba = np.array(results.get('y_proba', []))

    if len(y_pred) > 0 and len(y_proba) > 0:
        misclassified_idx = np.where(y_true != y_pred)[0]

        bad_cases = []
        for idx in misclassified_idx:
            true_label_str = 'AI' if y_true[idx] == 1 else 'Human'
            pred_label_str = 'AI' if y_pred[idx] == 1 else 'Human'
            confidence = y_proba[idx] if pred_label_str == 'AI' else 1.0 - y_proba[idx]

            bad_cases.append({
                'Sample_ID': idx,
                'File_Name': metadata[idx].get('file', f'file_{idx}'),
                'True_Label': true_label_str,
                'Predicted_Label': pred_label_str,
                'Model_Confidence': round(confidence, 4),
                'Code_Content': functions[idx]
            })

        bad_cases_df = pd.DataFrame(bad_cases)
        if not bad_cases_df.empty:
            bad_cases_df = bad_cases_df.sort_values(by='Model_Confidence', ascending=False)
            bad_cases_path = f"{config.OUTPUT_PATHS['results_dir']}/bad_cases.csv"
            bad_cases_df.to_csv(bad_cases_path, index=False, encoding='utf-8-sig')
            logger.info(f"已导出 {len(bad_cases)} 个误判样本至: {bad_cases_path}")

    # 4. 可视化
    logger.info("=" * 60)
    logger.info("步骤4: 生成可视化图表")
    visualizer = ResultVisualizer(config)
    visualizer.generate_all_visualizations(results, trainer.model, X, labels, feature_names)
    logger.info(f"消融实验模式完成！结果目录: {config.OUTPUT_PATHS['results_dir']}")

    return results


def main():
    parser = argparse.ArgumentParser(
        description='AI代码检测系统 - Java (消融实验版)',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
消融模式说明:
  123  全部特征 (词法+语法 + Java特有+人类失误 + CodeBERTa)
  12   词法+语法 + Java特有+人类失误 (无CodeBERTa)
  13   词法+语法 + CodeBERTa (无Java特有/人类失误)
  23   Java特有+人类失误 + CodeBERTa (无词法/语法)
  1    仅词法+语法
  3    仅CodeBERTa
  all  依次运行以上所有6种模式
        '''
    )
    parser.add_argument(
        '--mode', '-m',
        type=str,
        default='all',
        choices=['123', '12', '13', '23', '1', '3', 'all'],
        help='消融实验模式 (默认: all)'
    )
    args = parser.parse_args()

    if args.mode == 'all':
        modes = ['123', '12', '13', '23', '1', '3']
        logger.info(f"将依次运行所有 {len(modes)} 种消融模式: {modes}")
        for i, mode in enumerate(modes, 1):
            logger.info("=" * 70)
            logger.info(f"[{i}/{len(modes)}] 开始消融实验: {mode}")
            logger.info("=" * 70)
            apply_ablation_config(mode)
            try:
                run_experiment()
            except Exception as e:
                logger.error(f"消融模式 {mode} 运行失败: {e}", exc_info=True)
        logger.info("=" * 70)
        logger.info("全部消融实验完成！")
    else:
        apply_ablation_config(args.mode)
        run_experiment()


if __name__ == "__main__":
    main()
