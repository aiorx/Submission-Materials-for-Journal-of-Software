#!/usr/bin/env python3
"""
AI代码检测系统 - JavaScript 专属配置文件 (HistGB版)
"""

DATA_PATHS = {
    'human_code_dir': r"/HUBU-AI022/re_feature/human_written_code/human_written_code/progf/Javascript",
    'ai_code_dir': r"/HUBU-AI022/re_feature/ai_generated_code/ai_generated_code/progf/Javascript"
}

OUTPUT_PATHS = {
    'features_dir': "data/processed/features_js",
    'models_dir': "data/processed/models_js",
    'results_dir': "results_js",
}

FEATURES = {
    'lexical': True,
    'syntactic': True,
    'js_specific': True,
    'human_error': True,
    'codeberta': True
}

MODEL = {
    'type': "histgb",
    'save_model': True,
    'cv_folds': 10,
}

# HistGradientBoosting 参数
HISTGB_PARAMS = {
    'max_iter': 300,
    'max_depth': 8,
    'learning_rate': 0.05,
    'l2_regularization': 1.0,
    'random_state': 42
}

VISUALIZATION = {
    'dpi': 300,
    'show_plots': False
}
