#!/usr/bin/env python3
"""
系统配置文件 - C++ HistGB版
"""

DATA_PATHS = {
    'human_code_dir': r"/HUBU-AI022/re_feature/human_written_code/human_written_code/progf/C++",
    'ai_code_dir': r"/HUBU-AI022//re_feature/ai_generated_code/ai_generated_code/progf/C++"
}

OUTPUT_PATHS = {
    'features_dir': r"./data/processed/features_cpp",
    'models_dir': r"./data/processed/models_cpp",
    'results_dir': r"./results_cpp"
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

CPP_CONFIG = {
    'stl_containers': [
        'vector', 'array', 'deque', 'list', 'forward_list', 'stack', 'queue',
        'priority_queue', 'set', 'multiset', 'map', 'multimap', 'unordered_set',
        'unordered_multiset', 'unordered_map', 'unordered_multimap', 'bitset'
    ],
    'stl_algorithms': [
        'sort', 'find', 'binary_search', 'copy', 'move', 'transform', 'accumulate',
        'for_each', 'count', 'max_element', 'min_element', 'reverse', 'unique'
    ],
    'smart_pointers': ['unique_ptr', 'shared_ptr', 'weak_ptr', 'auto_ptr'],
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
