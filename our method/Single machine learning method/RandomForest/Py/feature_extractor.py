#!/usr/bin/env python3
"""
特征提取模块 - Whodunit 论文严格复现版 (Python 专属)
仅提取论文 Table 3 中定义的 31 种基础 Code Stylometry 和 Code Complexity 特征。
"""

import ast
import re
import math
import keyword
import numpy as np
import pandas as pd  # 新增：用于对齐动态特征
import logging
from typing import List, Dict
import tokenize
import io

# 导入复杂度分析库 (必须通过 pip install radon 安装)
try:
    from radon.complexity import cc_visit
    from radon.metrics import h_visit, mi_visit
    RADON_AVAILABLE = True
except ImportError:
    RADON_AVAILABLE = False
    logging.warning("未安装 radon 库，Halstead/Cyclomatic 复杂度特征将失效。请执行: pip install radon")

logger = logging.getLogger(__name__)

class WhodunitFeatureExtractor:
    """严格基于论文 《Whodunit》 Table 3 的特征提取器"""
    
    def __init__(self, config=None):
        self.config = config
        self.python_keywords = set(keyword.kwlist)

    def extract(self, code: str) -> Dict[str, float]:
        features = {}
        
        lines = code.split('\n')
        sloc = len(lines) if len(lines) > 0 else 1
        features['sloc'] = sloc
        
        # --- 基础基于行的特征 (Layout/Textual) ---
        empty_lines = sum(1 for line in lines if not line.strip())
        features['emptyLinesDensity'] = empty_lines / sloc
        
        line_lengths = [len(line) for line in lines]
        features['avgLineLength'] = np.mean(line_lengths) if line_lengths else 0.0
        features['stdDevLineLength'] = np.std(line_lengths) if line_lengths else 0.0
        
        whitespace_chars = sum(line.count(' ') + line.count('\t') for line in lines)
        non_whitespace_chars = sum(len(line.replace(' ', '').replace('\t', '')) for line in lines)
        features['whiteSpaceRatio'] = whitespace_chars / non_whitespace_chars if non_whitespace_chars > 0 else 0.0

        # --- 关键字特征 ---
        tokens = re.findall(r'\b\w+\b', code)
        keyword_counts = {kw: tokens.count(kw) for kw in self.python_keywords}
        total_keywords = sum(keyword_counts.values())
        unique_keywords = sum(1 for v in keyword_counts.values() if v > 0)
        
        features['keywordsDensity'] = total_keywords / sloc
        features['numKeywordsDensity'] = unique_keywords / sloc

        # --- Radon 库特征 (复杂度与 Halstead 指标) ---
        if RADON_AVAILABLE:
            try:
                # 圈复杂度
                cc_blocks = cc_visit(code)
                features['cyclomaticComplexity'] = sum(b.complexity for b in cc_blocks) if cc_blocks else 1.0
                # 可维护性指数
                features['maintainabilityIndex'] = mi_visit(code, multi=False)
                # Halstead 指标
                h_metrics = h_visit(code)
                features['numberOfDistinctOperators'] = h_metrics.total.h1
                features['numberOfDistinctOperands'] = h_metrics.total.h2
                features['totalNumberOfOperators'] = h_metrics.total.N1
                features['totalNumberOfOperands'] = h_metrics.total.N2
            except Exception:
                self._fill_default_radon(features)
        else:
            self._fill_default_radon(features)

        # --- AST 语法树特征 ---
        try:
            tree = ast.parse(code)
        except SyntaxError:
            self._fill_default_ast(features)
            return features

        # 遍历 AST 进行深度统计
        node_depths = {}
        max_depth = 0
        statement_count = 0
        assign_count = 0
        class_count = 0
        func_call_count = 0
        input_call_count = 0
        function_count = 0
        literal_count = 0
        variables_set = set()
        
        def walk_ast(node, depth):
            nonlocal max_depth, statement_count, assign_count, class_count
            nonlocal func_call_count, input_call_count, function_count, literal_count
            
            max_depth = max(max_depth, depth)
            node_type = type(node).__name__
            
            if node_type not in node_depths:
                node_depths[node_type] = []
            node_depths[node_type].append(depth)

            if isinstance(node, ast.stmt):
                statement_count += 1
            if isinstance(node, ast.Assign):
                assign_count += 1
                for target in node.targets:
                    if isinstance(target, ast.Name):
                        variables_set.add(target.id)
            if isinstance(node, ast.ClassDef):
                class_count += 1
            if isinstance(node, ast.Call):
                func_call_count += 1
                if isinstance(node.func, ast.Name) and node.func.id == 'input':
                    input_call_count += 1
            if isinstance(node, ast.FunctionDef):
                function_count += 1
            if isinstance(node, ast.Constant):
                literal_count += 1

            for child in ast.iter_child_nodes(node):
                walk_ast(child, depth + 1)

        walk_ast(tree, 0)
        
        # 提取论文要求的高阶 AST 标量特征
        total_nodes = sum(len(v) for v in node_depths.values())
        
        features['maxDepthASTNode'] = max_depth
        features['numStatementsDensity'] = statement_count / sloc
        features['numAssignmentStmtDensity'] = assign_count / sloc
        features['numClassesDensity'] = class_count / sloc
        features['numFunctionCallsDensity'] = func_call_count / sloc
        features['numFunctionsDensity'] = function_count / sloc
        features['numInputStmtsDensity'] = input_call_count / sloc
        features['numVariablesDensity'] = len(variables_set) / sloc
        features['numLiteralsDensity'] = literal_count / sloc

        # 提取函数级别的特定特征
        func_lengths = []
        param_counts = []
        identifiers = [node.id for node in ast.walk(tree) if isinstance(node, ast.Name)]
        features['avgIdentifierLength'] = np.mean([len(i) for i in identifiers]) if identifiers else 0.0

        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                func_len = getattr(node, 'end_lineno', node.lineno) - node.lineno + 1
                func_lengths.append(func_len)
                param_counts.append(len(node.args.args))
        
        features['avgFunctionLength'] = np.mean(func_lengths) if func_lengths else 0.0
        features['avgParams'] = np.mean(param_counts) if param_counts else 0.0
        features['stdDevNumParams'] = np.std(param_counts) if param_counts else 0.0

        # 控制流决策特征估算 (嵌套与分叉)
        decision_nodes = [n for n in ast.walk(tree) if isinstance(n, (ast.If, ast.While, ast.For))]
        features['maxDecisionTokens'] = max([len(ast.unparse(n.test)) for n in decision_nodes if hasattr(n, 'test')] + [0])
        features['nestingDepth'] = self._calc_max_nesting(tree)
        features['branchingFactor'] = len(decision_nodes) / max(statement_count, 1)

        # 论文特征: 展开 ASTNodeTypesTF 和 ASTNodeTypeAvgDep
        # 论文指出包含 130 种，这里动态展开该代码中出现的类型
        for node_type, depths in node_depths.items():
            features[f'ASTNodeTypesTF_{node_type}'] = len(depths) / total_nodes
            features[f'ASTNodeTypeAvgDep_{node_type}'] = np.mean(depths)

        return features

    def _calc_max_nesting(self, node):
        """计算最大控制流嵌套深度"""
        if not hasattr(node, "body") or not isinstance(node.body, list):
            return 0
        max_child_nesting = 0
        for child in node.body:
            child_nesting = self._calc_max_nesting(child)
            max_child_nesting = max(max_child_nesting, child_nesting)
        
        if isinstance(node, (ast.If, ast.While, ast.For, ast.FunctionDef, ast.ClassDef)):
            return 1 + max_child_nesting
        return max_child_nesting

    def _fill_default_radon(self, features):
        defaults = ['cyclomaticComplexity', 'maintainabilityIndex', 'numberOfDistinctOperators', 
                   'numberOfDistinctOperands', 'totalNumberOfOperators', 'totalNumberOfOperands']
        for k in defaults:
            features[k] = 0.0
            
    def _fill_default_ast(self, features):
        defaults = ['maxDepthASTNode', 'numStatementsDensity', 'numAssignmentStmtDensity', 'numClassesDensity',
                   'numFunctionCallsDensity', 'numFunctionsDensity', 'numInputStmtsDensity', 'numVariablesDensity',
                   'numLiteralsDensity', 'avgIdentifierLength', 'avgFunctionLength', 'avgParams', 'stdDevNumParams',
                   'maxDecisionTokens', 'nestingDepth', 'branchingFactor']
        for k in defaults:
            features[k] = 0.0

    def extract_batch(self, codes: List[str]) -> List[Dict[str, float]]:
        logger.info(f"开始提取 {len(codes)} 个 Python 文件的 Whodunit 论文特征...")
        
        all_features = []
        for i, code in enumerate(codes):
            if i % 100 == 0 and i > 0:
                logger.info(f"  特征提取进度: {i} / {len(codes)}")
            all_features.append(self.extract(code))
            
        return all_features


class PythonBatchExtractorWrapper:
    """
    对接 main.py 的包装器类。
    负责调用 WhodunitFeatureExtractor，并将动态生成的字典列表转换为对齐的 Numpy 数组。
    """
    def __init__(self, config=None):
        self.config = config
        self.extractor = WhodunitFeatureExtractor(config)
        self.feature_names = []

    def extract_batch(self, codes: List[str]) -> np.ndarray:
        # 获取包含不规则字典的列表
        dict_features = self.extractor.extract_batch(codes)
        
        # 使用 pandas DataFrame 自动对齐字典中的键，缺失的特征（NaN）补 0.0
        df = pd.DataFrame(dict_features).fillna(0.0)
        
        # 缓存特征名字供 main.py 调用
        self.feature_names = df.columns.tolist()
        
        # 返回 numpy 数组，完美契合 sklearn/xgboost 和 main.py 的维度要求
        return df.values

    def get_feature_names(self) -> List[str]:
        return self.feature_names