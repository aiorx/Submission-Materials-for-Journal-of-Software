#!/usr/bin/env python3
"""
AI代码检测系统 - 主入口 (JavaScript 随机森林版)
"""

import logging
from pathlib import Path
import argparse
import pandas as pd
import numpy as np

import config
from data_loader import DataLoader
from feature_extractor import JSBatchExtractorWrapper
from model_trainer import AdvancedModelTrainer
from visualization import ResultVisualizer

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def create_directories(config):
    for path in [config.OUTPUT_PATHS['features_dir'], config.OUTPUT_PATHS['models_dir'],
                 config.OUTPUT_PATHS['results_dir'], f"{config.OUTPUT_PATHS['results_dir']}/figures"]:
        Path(path).mkdir(parents=True, exist_ok=True)


def main():
    parser = argparse.ArgumentParser()
    args = parser.parse_args()
    create_directories(config)

    logger.info("=" * 60)
    logger.info("步骤1: 加载 JS/TS 数据集 (整文件)")
    data_loader = DataLoader(config)
    functions, labels, groups, metadata = data_loader.load_data()

    if not functions:
        logger.error("❌ 数据集为空！请检查文件路径！")
        return

    logger.info("=" * 60)
    logger.info("步骤2: 提取 JS 领域专家特征 & 深度语义特征")
    extractor_wrapper = JSBatchExtractorWrapper(config)
    X_raw = extractor_wrapper.extract_batch(functions)
    feature_names = extractor_wrapper.get_feature_names()

    from sklearn.feature_selection import VarianceThreshold, SelectKBest, f_classif

    logger.info("执行特征清洗: 移除无方差的死特征...")
    selector = VarianceThreshold(threshold=0.0)
    X_clean = selector.fit_transform(X_raw)
    clean_feature_names = [feature_names[i] for i in selector.get_support(indices=True)]
    logger.info(f"清洗完成! 当前有效特征维度: {X_clean.shape[1]}")

    # ====================================================
    # 【新增】降维：为 JS 模型挑选 Top K 黄金特征
    # ====================================================
    MAX_FEATURES = 300  # 针对 JS 浅树模型限制最大特征数
    if X_clean.shape[1] > MAX_FEATURES:
        logger.info(f"检测到高维特征 ({X_clean.shape[1]} 维)，正在筛选 Top {MAX_FEATURES} 最强特征...")
        kbest = SelectKBest(score_func=f_classif, k=MAX_FEATURES)
        X = kbest.fit_transform(X_clean, labels)

        kbest_indices = kbest.get_support(indices=True)
        feature_names = [clean_feature_names[i] for i in kbest_indices]
        logger.info(f"特征筛选完成! 最终进入模型的维度: {X.shape[1]}")
    else:
        X = X_clean
        feature_names = clean_feature_names

    # ====================================================
    # 保存特征 CSV (🚨 包含文件名列)
    # ====================================================
    features_path = f"{config.OUTPUT_PATHS['features_dir']}/features_js.csv"
    feature_df = pd.DataFrame(X, columns=feature_names)

    file_names_col = [m.get('file', f'unknown_{i}') for i, m in enumerate(metadata)]
    feature_df.insert(0, 'file_name', file_names_col)

    feature_df['label'] = labels
    feature_df.to_csv(features_path, index=False, encoding='utf-8-sig')
    logger.info(f"特征数据已保存至: {features_path} (包含文件名列)")
    logger.info("=" * 60)
    logger.info("步骤3: 训练随机森林模型 (GroupKFold 防泄露)")
    trainer = AdvancedModelTrainer(config)
    results = trainer.train_and_evaluate(X, np.array(labels), groups=groups)

    if config.MODEL['save_model']:
        model_path = f"{config.OUTPUT_PATHS['models_dir']}/rf_model_js.joblib"
        trainer.save_model(model_path)

    # 导出 Bad Cases
    y_true, y_pred, y_proba = np.array(labels), np.array(results.get('y_pred', [])), np.array(
        results.get('y_proba', []))
    if len(y_pred) > 0 and len(y_proba) > 0:
        misclassified_idx = np.where(y_true != y_pred)[0]
        bad_cases = [{
            'Sample_ID': idx,
            'File_Name': metadata[idx].get('file', f'file_{idx}'),
            'True_Label': 'AI' if y_true[idx] == 1 else 'Human',
            'Predicted_Label': 'AI' if y_pred[idx] == 1 else 'Human',
            'Model_Confidence': round(y_proba[idx] if y_pred[idx] == 1 else 1.0 - y_proba[idx], 4),
            'Code_Content': functions[idx]
        } for idx in misclassified_idx]

        if bad_cases:
            bad_cases_df = pd.DataFrame(bad_cases).sort_values(by='Model_Confidence', ascending=False)
            bad_cases_path = f"{config.OUTPUT_PATHS['results_dir']}/bad_cases.csv"
            bad_cases_df.to_csv(bad_cases_path, index=False, encoding='utf-8-sig')
            logger.info(f"已导出 {len(bad_cases)} 个误判样本至: {bad_cases_path}")

    logger.info("=" * 60)
    logger.info("步骤4: 生成可视化图表")
    visualizer = ResultVisualizer(config)
    visualizer.generate_all_visualizations(results, trainer.model, X, labels, feature_names)
    logger.info("🎉 实验全部完成！")


if __name__ == "__main__":
    main()