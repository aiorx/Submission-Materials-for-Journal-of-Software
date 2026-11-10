#!/usr/bin/env python3
"""
AI代码检测系统 - 主入口（C HistGB版）
"""

import logging
from pathlib import Path
import argparse
import pandas as pd
import numpy as np

# 导入配置
import config

# 导入其他模块
from data_loader import DataLoader
from feature_extractor import FeatureExtractorFactory
from model_trainer import AdvancedModelTrainer
from visualization import ResultVisualizer

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def load_config():
    """加载配置文件"""
    logger.info("配置已从 config.py 加载")
    return config


def create_directories(config):
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


def main():
    parser = argparse.ArgumentParser(description='AI代码检测系统 - C')
    args = parser.parse_args()

    # 加载配置
    config = load_config()

    # 创建目录
    create_directories(config)

    # 步骤1: 加载数据
    logger.info("=" * 60)
    logger.info("步骤1: 加载C数据集")
    data_loader = DataLoader(config)
    functions, labels, groups, metadata = data_loader.load_data()

    logger.info(f"总共加载 {len(functions)} 个代码")
    logger.info(f"人类代码: {sum(np.array(labels) == 0)} 个")
    logger.info(f"AI代码: {sum(np.array(labels) == 1)} 个")

    # 步骤2: 提取特征
    logger.info("=" * 60)
    logger.info("步骤2: 提取C特征")

    all_features = []
    feature_names = []

    # 创建特征提取器
    extractors = FeatureExtractorFactory.create_extractors(config)

    # 词法特征
    if config.FEATURES['lexical']:
        logger.info("提取词法特征...")
        lexical_extractor = extractors['lexical']
        lexical_features = lexical_extractor.extract_batch(functions)
        all_features.append(lexical_features)
        feature_names.extend(lexical_extractor.get_feature_names())
        logger.info(f"词法特征维度: {lexical_features.shape[1]}")

    # 语法特征
    if config.FEATURES['syntactic']:
        logger.info("提取语法特征...")
        syntactic_extractor = extractors['syntactic']

        # 提取 AST 结构标量特征
        logger.info("  提取 AST 结构标量特征...")
        ast_scalar_features = syntactic_extractor.extract_structural_features(functions)
        all_features.append(ast_scalar_features)
        feature_names.extend(syntactic_extractor.get_structural_feature_names())

        # 原有的 n-gram 提取
        for n in config.FEATURES['ngram_range']:
            logger.info(f"  提取 {n}-gram 特征...")
            ngram_features = syntactic_extractor.extract_ngram_features(functions, n)
            all_features.append(ngram_features)
            feature_names.extend(syntactic_extractor.get_feature_names(n))

    # === 提取 C 语言专属特征 ===
    if True:
        logger.info("提取 C 语言专属特征...")
        c_extractor = extractors['c_specific']
        c_features = c_extractor.extract_batch(functions)
        all_features.append(c_features)
        feature_names.extend(c_extractor.get_feature_names())
        logger.info(f"C语言特有特征维度: {c_features.shape[1]}")

    if config.FEATURES.get('human_error', True):
        logger.info("提取人类专属失误特征...")
        human_extractor = extractors['human_error']
        human_features = human_extractor.extract_batch(functions)
        all_features.append(human_features)
        feature_names.extend(human_extractor.get_feature_names())
        logger.info(f"人类特征维度: {human_features.shape[1]}")

    # =========================================================
    # 新增：提取 CodeBERTa 深度语义特征
    # =========================================================
    if config.FEATURES.get('codeberta', True):
        logger.info("提取 CodeBERTa 深度语义特征 (请确保硬件资源充足)...")
        codeberta_extractor = extractors['codeberta']
        # 注意这里调用我们写的 extract_batch
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
    # 注意：fit_transform 需要传入标签 labels 来计算相关性
    selector = SelectKBest(score_func=f_classif, k=k_best)
    X_clean = selector.fit_transform(X, labels)

    # 找回保留下来的特征名
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
    logger.info("步骤3: 训练 HistGradientBoosting 模型")
    trainer = AdvancedModelTrainer(config)
    results = trainer.train_and_evaluate(X, labels, groups=groups)

    # 保存模型
    if config.MODEL['save_model']:
        model_path = f"{config.OUTPUT_PATHS['models_dir']}/histgb_model_c.joblib"
        trainer.save_model(model_path)
        logger.info(f"模型已保存至: {model_path}")

    # ====================================================
    # 新增：步骤 3.5 导出 Bad Cases (误判样本) 进行人工分析
    # ====================================================
    logger.info("=" * 60)
    logger.info("步骤3.5: 导出 Bad Cases 进行人工查错...")

    y_true = np.array(labels)
    y_pred = np.array(results['y_pred'])
    y_proba = np.array(results['y_proba'])  # 预测为 AI 的概率

    # 找到所有预测错误的索引
    misclassified_idx = np.where(y_true != y_pred)[0]

    bad_cases = []
    for idx in misclassified_idx:
        true_label_str = 'AI' if y_true[idx] == 1 else 'Human'
        pred_label_str = 'AI' if y_pred[idx] == 1 else 'Human'

        # 计算模型的“自信程度” (0.5~1.0 之间，越高说明模型错得越离谱)
        confidence = y_proba[idx] if pred_label_str == 'AI' else 1.0 - y_proba[idx]

        bad_cases.append({
            'Sample_ID': idx,
            'True_Label': true_label_str,
            'Predicted_Label': pred_label_str,
            'Model_Confidence': round(confidence, 4),
            'Code_Content': functions[idx]
        })

    bad_cases_df = pd.DataFrame(bad_cases)
     # 按模型的自信程度降序排序：排在最前面的是模型“非常确信自己对，但其实大错特错”的样本
    bad_cases_df = bad_cases_df.sort_values(by='Model_Confidence', ascending=False)

    bad_cases_path = f"{config.OUTPUT_PATHS['results_dir']}/bad_cases.csv"
    bad_cases_df.to_csv(bad_cases_path, index=False, encoding='utf-8-sig')
    logger.info(f"已导出 {len(bad_cases)} 个误判样本至: {bad_cases_path}")

    # 步骤4: 生成可视化
    logger.info("=" * 60)
    logger.info("步骤4: 生成可视化结果")
    visualizer = ResultVisualizer(config)
    visualizer.generate_all_visualizations(results, trainer.model, X, labels, feature_names)

    logger.info("=" * 60)
    logger.info("实验完成！请查看 results_cpp/figures 目录下的可视化结果")
    logger.info("详细报告请查看: results_cpp/reports/experiment_report.txt")


if __name__ == "__main__":
    main()
