#!/usr/bin/env python3
"""
AI代码检测系统 - 主入口 (Python 随机森林版)
基于随机森林算法进行 AI/Human 代码二分类
"""

import logging
from pathlib import Path
import argparse
import pandas as pd
import numpy as np

import config
from data_loader import DataLoader
from feature_extractor_plus import PythonBatchExtractorWrapper  # 修改1：引入最新的提取器包装类
from model_trainer_rf import AdvancedModelTrainer

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def create_directories(config):
    paths = [
        config.OUTPUT_PATHS['features_dir'],
        config.OUTPUT_PATHS['models_dir'],
        config.OUTPUT_PATHS['results_dir']
    ]
    for path in paths:
        Path(path).mkdir(parents=True, exist_ok=True)


def main():
    parser = argparse.ArgumentParser()
    args = parser.parse_args()
    create_directories(config)

    # 1. 加载数据
    logger.info("=" * 60)
    logger.info("步骤1: 加载 Python 数据集 (整文件)")
    data_loader = DataLoader(config)
    
    # 兼容 DataLoader 返回参数的不同情况
    try:
        functions, labels, groups, metadata = data_loader.load_data()
    except ValueError:
        functions, labels, groups = data_loader.load_data()
        metadata = [{'file': f'file_{i}'} for i in range(len(functions))]

    if len(functions) == 0:
        logger.error("未加载到任何数据，请检查路径。程序退出。")
        return

    # 2. 提取特征
    logger.info("=" * 60)
    logger.info("步骤2: 提取特征 (全量多维融合特征)")
    
    # 修改2：调用新的特征提取器
    extractor = PythonBatchExtractorWrapper(config)
    X_raw = extractor.extract_batch(functions)
    feature_names = extractor.get_feature_names()

    logger.info(f"特征提取完成！总维度: {X_raw.shape[1]} 维")

    # 特征清洗
    from sklearn.feature_selection import VarianceThreshold
    logger.info("执行特征清洗: 移除方差为0的死特征...")
    
    selector = VarianceThreshold(threshold=0.0)
    X = selector.fit_transform(X_raw)
    
    retained_indices = selector.get_support(indices=True)
    final_feature_names = [feature_names[i] for i in retained_indices]
    logger.info(f"特征筛选完成! 最终进入模型的维度: {X.shape[1]}")

    # 修改3：保存特征 CSV (追加 file_name 列以供溯源)
    features_path = f"{config.OUTPUT_PATHS['features_dir']}/features_python.csv"
    feature_df = pd.DataFrame(X, columns=final_feature_names)
    
    file_names_col = [m.get('file', f'file_{i}') for i, m in enumerate(metadata)]
    feature_df.insert(0, 'file_name', file_names_col)
    feature_df['label'] = labels
    
    feature_df.to_csv(features_path, index=False, encoding='utf-8-sig')
    logger.info(f"特征已保存至: {features_path}")

    # 3. 训练模型 (这一步会在内部自动保存 TXT 和 JSON 报告)
    logger.info("=" * 60)
    logger.info("步骤3: 训练随机森林模型并生成评估报告")
    trainer = AdvancedModelTrainer(config)
    results = trainer.train_and_evaluate(X, np.array(labels), groups=groups)

    # 4. 记录 Bad Cases (预测错误的样本，帮助你做后续分析)
    logger.info("=" * 60)
    logger.info("步骤4: 导出预测错误的样本分析表 (Bad Cases)")
    
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

            file_name = f'file_{idx}'
            if isinstance(metadata, list) and len(metadata) > idx:
                if isinstance(metadata[idx], dict):
                    file_name = metadata[idx].get('file', file_name)
                else:
                    file_name = str(metadata[idx])

            bad_cases.append({
                'Sample_ID': idx,
                'File_Name': file_name,
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
            logger.info(f"预测错误的 Bad Cases 已保存至: {bad_cases_path}")

    # 保存模型
    if config.MODEL.get('save_model', True):
        model_path = f"{config.OUTPUT_PATHS['models_dir']}/python_classifier_model.pkl"
        trainer.save_model(model_path)

    logger.info("✅ 实验全部跑完！请去 results 文件夹查看你的数据报告！")


if __name__ == '__main__':
    main()
