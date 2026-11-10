#!/usr/bin/env python3
"""
AI代码检测系统 - 消融实验主入口（C++专用版）
支持多种特征组合的消融实验: 123, 12, 13, 23, 1, 3

特征组划分:
  1 = lexical + syntactic (词法 + 语法)
  2 = cpp_specific + human_error (C++特有 + 人类失误)
  3 = codeberta (深度语义)

用法:
  python main_ablation.py                # 默认依次运行所有6种消融模式
  python main_ablation.py -m 12          # 运行单一模式
  python main_ablation.py -m all         # 运行全部
"""

import logging
from pathlib import Path
import argparse
import pandas as pd
import numpy as np

# 导入配置
import config

# 导入其他模块 (C++版使用 _plus 版本)
from data_loader import DataLoader
from feature_extractor_plus import FeatureExtractorFactory
from model_trainer_plus import AdvancedModelTrainer
from visualization import ResultVisualizer

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ========== 消融实验配置映射 ==========
# 特征组:
#   1 = lexical + syntactic
#   2 = cpp_specific + human_error
#   3 = codeberta

ABLATION_CONFIGS = {
    '123': {
        'lexical': True,
        'syntactic': True,
        'cpp_specific': True,
        'human_error': True,
        'codeberta': True,
        'suffix': '123',
        'desc': '全部特征 (词法+语法 + C++特有+人类失误 + CodeBERTa)'
    },
    '12': {
        'lexical': True,
        'syntactic': True,
        'cpp_specific': True,
        'human_error': True,
        'codeberta': False,
        'suffix': '12',
        'desc': '词法+语法 + C++特有+人类失误 (无CodeBERTa)'
    },
    '13': {
        'lexical': True,
        'syntactic': True,
        'cpp_specific': False,
        'human_error': False,
        'codeberta': True,
        'suffix': '13',
        'desc': '词法+语法 + CodeBERTa (无C++特有/人类失误)'
    },
    '23': {
        'lexical': False,
        'syntactic': False,
        'cpp_specific': True,
        'human_error': True,
        'codeberta': True,
        'suffix': '23',
        'desc': 'C++特有+人类失误 + CodeBERTa (无词法/语法)'
    },
    '1': {
        'lexical': True,
        'syntactic': True,
        'cpp_specific': False,
        'human_error': False,
        'codeberta': False,
        'suffix': '1',
        'desc': '仅词法+语法'
    },
    '3': {
        'lexical': False,
        'syntactic': False,
        'cpp_specific': False,
        'human_error': False,
        'codeberta': True,
        'suffix': '3',
        'desc': '仅CodeBERTa'
    },
}


def apply_ablation_config(mode):
    """根据消融模式覆盖 config 模块的特征开关和输出路径"""
    if mode not in ABLATION_CONFIGS:
        raise ValueError(f"未知的消融模式: {mode}，可选: {list(ABLATION_CONFIGS.keys())}")

    ablation = ABLATION_CONFIGS[mode]

    # 覆盖特征开关
    config.FEATURES['lexical'] = ablation['lexical']
    config.FEATURES['syntactic'] = ablation['syntactic']
    config.FEATURES['cpp_specific'] = ablation['cpp_specific']
    config.FEATURES['human_error'] = ablation['human_error']
    config.FEATURES['codeberta'] = ablation['codeberta']

    # 覆盖输出路径
    suffix = ablation['suffix']
    config.OUTPUT_PATHS = {
        'features_dir': f"./data/processed/features_cpp_{suffix}",
        'models_dir': f"./data/processed/models_cpp_{suffix}",
        'results_dir': f"./results_cpp_{suffix}"
    }

    logger.info(f"消融模式: {mode} - {ablation['desc']}")
    logger.info(f"  特征: lexical={ablation['lexical']}, syntactic={ablation['syntactic']}, "
                f"cpp_specific={ablation['cpp_specific']}, human_error={ablation['human_error']}, "
                f"codeberta={ablation['codeberta']}")
    logger.info(f"  输出: features_cpp_{suffix} / models_cpp_{suffix} / results_cpp_{suffix}")


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
        logger.info(f"目录已创建/验证: {path}")


def run_experiment():
    """运行单次消融实验"""
    # 创建目录
    create_directories()

    # 步骤1: 加载数据
    logger.info("=" * 60)
    logger.info("步骤1: 加载C++数据集")
    data_loader = DataLoader(config)
    functions, labels, groups, metadata = data_loader.load_data()

    logger.info(f"总共加载 {len(functions)} 个代码片段")
    logger.info(f"人类代码: {sum(np.array(labels) == 0)} 个")
    logger.info(f"AI代码: {sum(np.array(labels) == 1)} 个")

    # 步骤2: 提取特征
    logger.info("=" * 60)
    logger.info("步骤2: 提取C++特征")

    all_features = []
    feature_names = []

    extractors = FeatureExtractorFactory.create_extractors(config)

    # --- 组1: 词法 + 语法 ---
    if config.FEATURES['lexical']:
        logger.info("提取词法特征...")
        lexical_extractor = extractors['lexical']
        lexical_features = lexical_extractor.extract_batch(functions)
        all_features.append(lexical_features)
        feature_names.extend(lexical_extractor.get_feature_names())
        logger.info(f"词法特征维度: {lexical_features.shape[1]}")

    if config.FEATURES['syntactic']:
        logger.info("提取语法特征...")
        syntactic_extractor = extractors['syntactic']

        logger.info("  提取 AST 结构标量特征...")
        ast_scalar_features = syntactic_extractor.extract_structural_features(functions)
        all_features.append(ast_scalar_features)
        feature_names.extend(syntactic_extractor.get_structural_feature_names())

        for n in config.FEATURES['ngram_range']:
            logger.info(f"  提取 {n}-gram 特征...")
            ngram_features = syntactic_extractor.extract_ngram_features(functions, n)
            all_features.append(ngram_features)
            feature_names.extend(syntactic_extractor.get_feature_names(n))

    # --- 组2: C++特有 + 人类失误 ---
    if config.FEATURES.get('cpp_specific', False):
        logger.info("提取 C++ 语言专属特征...")
        cpp_extractor = extractors['cpp_specific']
        cpp_features = cpp_extractor.extract_batch(functions)
        all_features.append(cpp_features)
        feature_names.extend(cpp_extractor.get_feature_names())
        logger.info(f"C++特有特征维度: {cpp_features.shape[1]}")

    if config.FEATURES.get('human_error', False):
        logger.info("提取人类专属失误特征...")
        human_extractor = extractors['human_error']
        human_features = human_extractor.extract_batch(functions)
        all_features.append(human_features)
        feature_names.extend(human_extractor.get_feature_names())
        logger.info(f"人类特征维度: {human_features.shape[1]}")

    # --- 组3: CodeBERTa ---
    if config.FEATURES.get('codeberta', False):
        logger.info("提取 CodeBERTa 深度语义特征 (使用 GPU 加速)...")
        codeberta_extractor = extractors['codeberta']
        codeberta_features = codeberta_extractor.extract_batch(functions, batch_size=16)
        all_features.append(codeberta_features)
        feature_names.extend(codeberta_extractor.get_feature_names())
        logger.info(f"CodeBERTa 语义特征维度: {codeberta_features.shape[1]}")

    # 合并所有特征
    X = np.hstack(all_features)
    logger.info(f"初始总特征维度: {X.shape[1]}")

    from sklearn.feature_selection import SelectKBest, f_classif
    logger.info("执行特征优选: 计算信息增益，保留最强的前 400 个特征...")

    k_best = min(400, X.shape[1])
    selector = SelectKBest(score_func=f_classif, k=k_best)
    X_clean = selector.fit_transform(X, labels)

    retained_indices = selector.get_support(indices=True)
    feature_names = [feature_names[i] for i in retained_indices]

    X = X_clean
    logger.info(f"特征优选完成! 实际保留的高价值特征维度: {X.shape[1]}")

    # 保存特征
    features_path = f"{config.OUTPUT_PATHS['features_dir']}/features.csv"
    feature_df = pd.DataFrame(X, columns=feature_names)
    feature_df['label'] = labels
    feature_df.to_csv(features_path, index=False)
    logger.info(f"特征已保存至: {features_path}")

    # 步骤3: 训练模型
    logger.info("=" * 60)
    logger.info("步骤3: 训练 Ensemble 集成模型")
    trainer = AdvancedModelTrainer(config)
    results = trainer.train_and_evaluate(X, labels, groups=groups)

    if config.MODEL['save_model']:
        model_path = f"{config.OUTPUT_PATHS['models_dir']}/rf_model_cpp.joblib"
        trainer.save_model(model_path)
        logger.info(f"模型已保存至: {model_path}")

    # 步骤3.5: 导出 Bad Cases
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

    # 步骤4: 生成可视化结果
    logger.info("=" * 60)
    logger.info("步骤4: 生成可视化结果")
    visualizer = ResultVisualizer(config)
    visualizer.generate_all_visualizations(results, trainer.model, X, labels, feature_names)

    logger.info("=" * 60)
    logger.info(f"消融实验模式完成！结果目录: {config.OUTPUT_PATHS['results_dir']}")

    return results


def main():
    parser = argparse.ArgumentParser(
        description='AI代码检测系统 - C++ (消融实验版)',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
消融模式说明:
  123  全部特征 (词法+语法 + C++特有+人类失误 + CodeBERTa)
  12   词法+语法 + C++特有+人类失误 (无CodeBERTa)
  13   词法+语法 + CodeBERTa (无C++特有/人类失误)
  23   C++特有+人类失误 + CodeBERTa (无词法/语法)
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
