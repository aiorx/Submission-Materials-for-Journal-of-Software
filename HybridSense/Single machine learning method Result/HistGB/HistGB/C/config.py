#!/usr/bin/env python3
"""
系统配置文件 - C语言 HistGB版
"""

DATA_PATHS = {
    'human_code_dir': r"/HUBU-AI022/re_feature/human_written_code/human_written_code/progf/C",
    'ai_code_dir': r"/HUBU-AI022/re_feature/ai_generated_code/ai_generated_code/progf/C"
}

OUTPUT_PATHS = {
    'features_dir': r"./data/processed/features_c",
    'models_dir': r"./data/processed/models_c",
    'results_dir': r"./results_c"
}

FEATURES = {
    'lexical': True,
    'syntactic': True,
    'cpp_specific': True,
    'human_error': True,
    'complexity': True,
    'codeberta': True,
    'ngram_range': [2, 3, 4]
}

C_CONFIG = {
    'standard_libs': [
        'stdio.h', 'stdlib.h', 'string.h', 'math.h', 'ctype.h',
        'stdbool.h', 'stdint.h', 'time.h', 'assert.h', 'stdarg.h'
    ],
    'memory_funcs': ['malloc', 'calloc', 'realloc', 'free', 'memset', 'memcpy', 'memmove'],
    'unsafe_funcs': ['gets', 'strcpy', 'strcat', 'sprintf', 'scanf'],
    'safe_funcs': ['fgets', 'strncpy', 'strncat', 'snprintf']
}

MODEL = {
    'type': "histgb",
    'save_model': True,
    'cv_folds': 10,
}

# HistGradientBoosting 参数
HISTGB_PARAMS = {
    'max_iter': 400,
    'max_depth': 8,
    'learning_rate': 0.05,
    'l2_regularization': 1.0,
    'random_state': 42
}

VISUALIZATION = {
    'dpi': 300,
    'show_plots': False
}
