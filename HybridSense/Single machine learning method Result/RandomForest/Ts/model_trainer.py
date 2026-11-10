
"""
模型训练模块 - 纯随机森林版
"""

import logging
from typing import Dict, Any, List
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GroupKFold, StratifiedKFold, cross_val_score, cross_val_predict
from sklearn.metrics import classification_report, confusion_matrix, roc_curve, auc
import joblib
import json
from pathlib import Path

logger = logging.getLogger(__name__)

class AdvancedModelTrainer:
    """仅使用 Random Forest 的训练器"""

    def __init__(self, config):
        self.config = config
        rf_params = getattr(config, 'RF_PARAMS', {
            'n_estimators': 400,
            'max_depth': 15,
            'min_samples_split': 5,
            'min_samples_leaf': 2,
            'class_weight': 'balanced',
            'random_state': 42,
            'n_jobs': -1
        })
        self.model = RandomForestClassifier(**rf_params)

    def train_and_evaluate(self, X: np.ndarray, y: np.ndarray, groups: List[int] = None) -> Dict[str, Any]:
        logger.info(f"训练数据形状: {X.shape}")
        logger.info("🟢 启动 随机森林 (Random Forest) 训练...")

        y = np.array(y) # 确保 y 是 numpy 数组

        if groups is not None:
            logger.info("启用 GroupKFold 交叉验证 (10折)...")
            cv = GroupKFold(n_splits=10)
            cv_scores = cross_val_score(self.model, X, y, groups=groups, cv=cv, scoring='accuracy')
            y_pred = cross_val_predict(self.model, X, y, groups=groups, cv=cv)
            y_proba = cross_val_predict(self.model, X, y, groups=groups, cv=cv, method='predict_proba')[:, 1]
        else:
            logger.info("启用 StratifiedKFold 交叉验证 (10折)...")
            cv = StratifiedKFold(n_splits=10, shuffle=True, random_state=42)
            cv_scores = cross_val_score(self.model, X, y, cv=cv, scoring='accuracy')
            y_pred = cross_val_predict(self.model, X, y, cv=cv)
            y_proba = cross_val_predict(self.model, X, y, cv=cv, method='predict_proba')[:, 1]

        logger.info(f"真实泛化准确率 (Random Forest): {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")

        report = classification_report(y, y_pred, target_names=['Human', 'AI'], output_dict=True)
        cm = confusion_matrix(y, y_pred)
        fpr, tpr, thresholds = roc_curve(y, y_proba)
        roc_auc = auc(fpr, tpr)

        logger.info("拟合全量数据用于保存最终 Random Forest 模型...")
        self.model.fit(X, y)
        
        # 提取随机森林的特征重要性
        feature_importance = self.model.feature_importances_

        results = {
            'cv_scores': cv_scores.tolist(),
            'cv_mean': cv_scores.mean(),
            'cv_std': cv_scores.std(),
            'classification_report': report,
            'confusion_matrix': cm.tolist(),
            'roc_curve': {
                'fpr': fpr.tolist(), 'tpr': tpr.tolist(), 'thresholds': thresholds.tolist(), 'auc': roc_auc
            },
            'feature_importance': feature_importance.tolist(),
            'n_features': X.shape[1],
            'n_samples': len(y),
            'y_pred': y_pred.tolist(),
            'y_proba': y_proba.tolist()
        }

        self._save_results(results)
        return results

    def _save_results(self, results: Dict[str, Any]):
        results_dir = Path(self.config.OUTPUT_PATHS['results_dir'])
        results_dir.mkdir(parents=True, exist_ok=True)

        json_path = results_dir / 'experiment_report.json'
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)

        txt_path = results_dir / 'experiment_report.txt'
        with open(txt_path, 'w', encoding='utf-8') as f:
            f.write("=" * 80 + "\n")
            f.write("AI代码检测实验报告 - (Whodunit论文复现 纯随机森林版)\n")
            f.write("=" * 80 + "\n\n")
            f.write(f"平均准确率: {results['cv_mean']:.4f}\n")
            f.write(f"ROC AUC: {results['roc_curve']['auc']:.4f}\n")

    def save_model(self, model_path: str):
        joblib.dump(self.model, model_path)
