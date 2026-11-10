#!/usr/bin/env python3
"""
模型训练模块 - Java 终极集成学习版 (Ensemble)
融合 LightGBM + Random Forest + HistGradientBoosting 冲刺极限 AUC
"""

import logging
from typing import Dict, Any, List
import numpy as np
import lightgbm as lgb
from sklearn.ensemble import RandomForestClassifier, HistGradientBoostingClassifier, VotingClassifier
from sklearn.model_selection import GroupKFold, StratifiedKFold, cross_val_score, cross_val_predict
from sklearn.metrics import classification_report, confusion_matrix, roc_curve, auc
import joblib
import json
from pathlib import Path

logger = logging.getLogger(__name__)


class AdvancedModelTrainer:
    """高阶集成模型训练器 (Voting Ensemble)"""

    def __init__(self, config):
        self.config = config

        clf1 = lgb.LGBMClassifier(**config.LIGHTGBM_PARAMS)

        clf2 = RandomForestClassifier(
            n_estimators=400,
            max_depth=12,
            min_samples_leaf=2,
            class_weight='balanced',
            random_state=42,
            n_jobs=-1
        )

        clf3 = HistGradientBoostingClassifier(
            max_iter=300,
            max_depth=8,
            learning_rate=0.05,
            l2_regularization=1.0,
            random_state=42
        )

        # 软投票：加权平均三大模型的概率
        self.model = VotingClassifier(
            estimators=[('lgbm', clf1), ('rf', clf2), ('hist', clf3)],
            voting='soft',
            weights=[2, 1, 1]
        )

    def train_and_evaluate(self, X: np.ndarray, y: np.ndarray, groups: List[int] = None) -> Dict[str, Any]:
        logger.info(f"训练数据形状: {X.shape}")
        logger.info("🟢 启动终极集成学习 (LightGBM + RF + HistGB)... 训练时间会略长，请耐心等待。")

        if groups is not None:
            logger.info("启用 GroupKFold 交叉验证 (防止同源文件数据泄露)...")
            cv = GroupKFold(n_splits=10)
            cv_scores = cross_val_score(self.model, X, y, groups=groups, cv=cv, scoring='accuracy')
            y_pred = cross_val_predict(self.model, X, y, groups=groups, cv=cv)
            y_proba = cross_val_predict(self.model, X, y, groups=groups, cv=cv, method='predict_proba')[:, 1]
        else:
            logger.warning("未提供 Group，退回 StratifiedKFold...")
            cv = StratifiedKFold(n_splits=10, shuffle=True, random_state=42)
            cv_scores = cross_val_score(self.model, X, y, cv=cv, scoring='accuracy')
            y_pred = cross_val_predict(self.model, X, y, cv=cv)
            y_proba = cross_val_predict(self.model, X, y, cv=cv, method='predict_proba')[:, 1]

        logger.info(f"真实泛化准确率 (Ensemble): {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")

        report = classification_report(y, y_pred, target_names=['Human', 'AI'], output_dict=True)
        cm = confusion_matrix(y, y_pred)
        fpr, tpr, thresholds = roc_curve(y, y_proba)
        roc_auc = auc(fpr, tpr)

        logger.info("拟合用于保存的最终 Ensemble 模型...")
        self.model.fit(X, y)

        # 强行剥离 lgbm 内部的 feature_importances_ 给画图代码使用
        try:
            fitted_lgbm = self.model.named_estimators_['lgbm']
            full_feature_importances = fitted_lgbm.feature_importances_
        except Exception as e:
            logger.warning("提取特征重要性失败，将返回零矩阵")
            full_feature_importances = np.zeros(X.shape[1])

        results = {
            'cv_scores': cv_scores.tolist(),
            'cv_mean': cv_scores.mean(),
            'cv_std': cv_scores.std(),
            'classification_report': report,
            'confusion_matrix': cm.tolist(),
            'roc_curve': {
                'fpr': fpr.tolist(), 'tpr': tpr.tolist(), 'thresholds': thresholds.tolist(), 'auc': roc_auc
            },
            'feature_importance': full_feature_importances.tolist(),
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
            f.write("AI代码检测实验报告 - Java (终极 Ensemble 集成版)\n")
            f.write("=" * 80 + "\n\n")
            f.write(f"样本总数: {results['n_samples']}\n")
            f.write(f"生效特征维度: {results['n_features']} (高价值优选特征)\n\n")
            f.write("交叉验证结果:\n")
            f.write(f"  平均准确率: {results['cv_mean']:.4f}\n")
            f.write(f"  标准差: {results['cv_std']:.4f}\n")
            f.write(f"  各折分数: {results['cv_scores']}\n\n")
            f.write("分类报告:\n")
            for class_name in ['Human', 'AI']:
                f.write(f"  {class_name}:\n")
                metrics = results['classification_report'][class_name]
                f.write(f"    精确率: {metrics['precision']:.4f}\n")
                f.write(f"    召回率: {metrics['recall']:.4f}\n")
                f.write(f"    F1分数: {metrics['f1-score']:.4f}\n")
            f.write(f"  整体准确率: {results['classification_report']['accuracy']:.4f}\n\n")
            f.write("混淆矩阵:\n")
            f.write(f"  真实\\预测  Human  AI\n")
            f.write(f"  Human    {results['confusion_matrix'][0][0]}    {results['confusion_matrix'][0][1]}\n")
            f.write(f"  AI       {results['confusion_matrix'][1][0]}    {results['confusion_matrix'][1][1]}\n\n")
            f.write(f"ROC AUC: {results['roc_curve']['auc']:.4f}\n")

    def save_model(self, model_path: str):
        joblib.dump(self.model, model_path)
