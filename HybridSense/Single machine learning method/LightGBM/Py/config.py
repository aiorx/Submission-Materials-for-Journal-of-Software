#!/usr/bin/env python3
"""
AI代码检测系统 - Python 专属配置文件 (领域专家特征版)
"""

DATA_PATHS = {
    'human_code_dir': r"/HUBU-AI022/re_feature/human_written_code/human_written_code/progf/Python",
    'ai_code_dir': r"/HUBU-AI022/re_feature/ai_generated_code/ai_generated_code/progf/Python"
}

OUTPUT_PATHS = {
    'features_dir': "data/processed/features_python",
    'models_dir': "data/processed/models_python",
    'results_dir': "results_python",
}

FEATURES = {
    'lexical': True,
    'syntactic': True,        # 仅保留 AST 标量结构，无高维 N-gram
    'python_specific': True,
    'human_error': True,
    'codeberta': True
}

# ========== 【新增】CodeBERTa 模型配置 ==========
CODEBERTA_MODEL = "huggingface/CodeBERTa-small-v1"

MODEL = {
    'type': "ensemble",
    'save_model': True,
    'cv_folds': 5,
}

# 专为 Python 密集型强特征（40~60维）调优的抗噪参数
LIGHTGBM_PARAMS = {
    'n_estimators': 300,
    'learning_rate': 0.05,
    'max_depth': 5,              # 密集特征限制深度，防过拟合
    'num_leaves': 25,
    'subsample': 0.8,
    'colsample_bytree': 0.8,     # 提高列采样，让每一个强特征充分发挥
    'reg_alpha': 0.5,            # L1 正则化，剔除噪音特征
    'reg_lambda': 1.0,
    'class_weight': 'balanced',
    'random_state': 42,
    'n_jobs': -1,
    'verbose': -1
}

VISUALIZATION = {
    'dpi': 300,
    'show_plots': False
}
