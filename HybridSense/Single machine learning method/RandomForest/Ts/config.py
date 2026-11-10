#!/usr/bin/env python3
"""
AI代码检测系统 - TypeScript 专属配置文件 (随机森林版)
"""

DATA_PATHS = {
    'human_code_dir': r"/HUBU-AI022/ai-human_code_classfication/human_written_code/progf/Typescript",
    'ai_code_dir': r"/HUBU-AI022/ai-human_code_classfication/ai_generated_code/progf/Typescript"
}

OUTPUT_PATHS = {
    'features_dir': "data/processed/features_ts",
    'models_dir': "data/processed/models_ts",
    'results_dir': "results_ts",
}

FEATURES = {
    'lexical': True,
    'syntactic': True,
    'ts_specific': True,
    'human_error': True,
    'codeberta': True
}

CODEBERTA_MODEL = "huggingface/CodeBERTa-small-v1"

MODEL = {
    'type': "rf",
    'save_model': True,
    'cv_folds': 10,
}

# 随机森林参数
RF_PARAMS = {
    'n_estimators': 400,
    'max_depth': 15,
    'min_samples_split': 5,
    'min_samples_leaf': 2,
    'class_weight': 'balanced',
    'random_state': 42,
    'n_jobs': -1
}

VISUALIZATION = {
    'dpi': 300,
    'show_plots': False
}
