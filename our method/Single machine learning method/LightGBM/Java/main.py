#!/usr/bin/env python3
"""
AI代码检测系统 - 主入口 (Java 高密度专家特征版)
没有高维灾难，有多少特征吃多少特征！
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


def create_directories(config):
    paths = [
        config.OUTPUT_PATHS['features_dir'],
        config.OUTPUT_PATHS['models_dir'],
        config.OUTPUT_PATHS['results_dir'],
        f"{config.OUTPUT_PATHS['results_dir']}/figures"
    ]
    for path in paths:
        Path(path).mkdir(parents=True, exist_ok=True)


def main():
    parser = argparse.ArgumentParser()
    args = parser.parse_args()
    create_directories(config)

    # 1. 加载数据
    logger.info("=" * 60)
    logger.info("步骤1: 加载 Java 数据集 (整文件)")
    data_loader = DataLoader(config)
    functions, labels, groups, metadata = data_loader.load_data()

    if len(functions) == 0:
        logger.error("❌ 数据集为空！请检查文件路径！")
        return

    # 2. 提取特征
    logger.info("=" * 60)
    logger.info("步骤2: 提取 Java 领域专家特征 (无 N-gram)")
    extractor_wrapper = JavaBatchExtractorWrapper(config)
    X_raw = extractor_wrapper.extract_batch(functions)
    feature_names = extractor_wrapper.get_feature_names()
    logger.info(f"初始提取的特征总维度: {X_raw.shape[1]}")

    # ====================================================
    # 步骤2.5 清洗特征：剔除无用死特征（方差为0）
    # ====================================================
    from sklearn.feature_selection import VarianceThreshold, SelectKBest, f_classif

    logger.info("执行特征清洗: 移除在所有样本中值都一样的死特征...")
    selector = VarianceThreshold(threshold=0.0)
    X_clean = selector.fit_transform(X_raw)

    retained_indices = selector.get_support(indices=True)
    clean_feature_names = [feature_names[i] for i in retained_indices]
    logger.info(f"死特征移除完成! 剩余维度: {X_clean.shape[1]}")

    # 【新增】：使用 SelectKBest 降维，以匹配您 LightGBM 的浅树配置
    MAX_FEATURES = 300  # 挑出最强的 200 个特征 (手工+AI语义)
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

    # ====================================================
    # 保存特征 CSV (🚨 新增：加入文件名作为第一列 🚨)
    # ====================================================
    features_path = f"{config.OUTPUT_PATHS['features_dir']}/features_java.csv"
    feature_df = pd.DataFrame(X, columns=feature_names)

    # 提取 metadata 中的文件名，插入到表格的最左侧（第0列）
    file_names_col = [m.get('file', f'unknown_{i}') for i, m in enumerate(metadata)]
    feature_df.insert(0, 'file_name', file_names_col)

    feature_df['label'] = labels
    feature_df.to_csv(features_path, index=False, encoding='utf-8-sig')  # 强制使用 utf-8-sig 防止 Excel 乱码
    logger.info(f"特征数据已保存至: {features_path} (包含文件名列)")

    # 3. 训练模型
    logger.info("=" * 60)
    logger.info("步骤3: 训练 Ensemble 集成模型 (GroupKFold 防泄露)")
    trainer = AdvancedModelTrainer(config)
    results = trainer.train_and_evaluate(X, np.array(labels), groups=groups)

    # 保存模型
    if config.MODEL['save_model']:
        model_path = f"{config.OUTPUT_PATHS['models_dir']}/rf_model_java.joblib"
        trainer.save_model(model_path)
        logger.info(f"模型已保存至: {model_path}")

    # 步骤3.5 导出 Bad Cases
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
    logger.info("🎉 实验全部完成！请查看 results_java 目录")


if __name__ == "__main__":
    main()