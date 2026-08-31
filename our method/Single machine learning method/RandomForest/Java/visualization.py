#!/usr/bin/env python3
"""
科研级结果可视化模块 (接口适配流水线版)
"""

import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np
import shap
import logging
from pathlib import Path
import warnings
from sklearn.metrics import roc_curve, precision_recall_curve, confusion_matrix
from sklearn.model_selection import learning_curve

warnings.filterwarnings('ignore')
logger = logging.getLogger(__name__)

# 设置科研级绘图风格
plt.rcParams.update({
    'font.size': 12,
    'font.family': 'serif',
    'font.serif': ['Times New Roman'],
    'axes.labelsize': 14,
    'axes.titlesize': 16,
    'xtick.labelsize': 12,
    'ytick.labelsize': 12,
    'legend.fontsize': 12,
    'figure.titlesize': 18,
    'axes.grid': True,
    'grid.alpha': 0.3,
    'axes.spines.top': False,
    'axes.spines.right': False,
    'figure.facecolor': 'white'
})


class ResultVisualizer:
    """科研级结果可视化"""

    def __init__(self, config):
        """直接通过主程序的 config 初始化"""
        self.config = config
        self.results_dir = Path(config.OUTPUT_PATHS['results_dir'])
        self.output_dir = self.results_dir / 'figures'
        self.output_dir.mkdir(parents=True, exist_ok=True)

        # 预留存放流水线传递过来数据的属性
        self.model = None
        self.X_test = None
        self.y_test = None
        self.y_pred = None
        self.y_pred_proba = None
        self.feature_names = []

    def generate_all_visualizations(self, results, model, X, y, feature_names):
        """主入口：流水线训练完毕后，直接将内存中的数据传入生成图表"""
        logger.info("=" * 60)
        logger.info("开始生成科研级可视化图表...")

        self.model = model
        self.X_test = X
        self.y_test = y
        self.feature_names = feature_names

        # 基于全量数据生成预测，用于画图 (也可以用交叉验证的折外预测，这里为作图平滑选择拟合全量数据)
        self.y_pred = self.model.predict(self.X_test)
        self.y_pred_proba = self.model.predict_proba(self.X_test)[:, 1]

        try:
            logger.info("  1. 生成混淆矩阵...")
            self.plot_confusion_matrix()

            logger.info("  2. 生成ROC曲线...")
            self.plot_roc_curve()

            logger.info("  3. 生成精确率-召回率曲线...")
            self.plot_precision_recall_curve()

            logger.info("  4. 生成特征重要性图...")
            self.plot_feature_importance(top_n=20)

            logger.info("  5. 生成SHAP分析图...")
            self.plot_shap_summary(sample_size=100)

            logger.info("  6. 生成学习曲线...")
            self.plot_learning_curves()

            if results and 'cv_scores' in results:
                logger.info("  7. 生成交叉验证结果...")
                self.plot_cv_results(results)

            logger.info(f"✓ 所有科研级图表已成功保存至 {self.output_dir}")

        except Exception as e:
            logger.error(f"生成可视化图表时出现异常: {e}")
            import traceback
            traceback.print_exc()

    def plot_confusion_matrix(self):
        """混淆矩阵 - 热力图"""
        cm = confusion_matrix(self.y_test, self.y_pred)
        plt.figure(figsize=(8, 6))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                    xticklabels=['Human', 'AI'], yticklabels=['Human', 'AI'],
                    cbar_kws={'label': 'Sample Count'})
        plt.title('Confusion Matrix', fontweight='bold')
        plt.xlabel('Predicted Label', fontweight='bold')
        plt.ylabel('True Label', fontweight='bold')
        plt.tight_layout()
        plt.savefig(f'{self.output_dir}/confusion_matrix.png', dpi=300, bbox_inches='tight')
        plt.close()

    def plot_roc_curve(self):
        """ROC曲线 - AUC"""
        fpr, tpr, _ = roc_curve(self.y_test, self.y_pred_proba)
        auc_score = np.trapz(tpr, fpr)

        plt.figure(figsize=(8, 6))
        plt.plot(fpr, tpr, color='darkorange', lw=2,
                 label=f'ROC curve (AUC = {auc_score:.3f})')
        plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
        plt.xlim([0.0, 1.0])
        plt.ylim([0.0, 1.05])
        plt.xlabel('False Positive Rate', fontweight='bold')
        plt.ylabel('True Positive Rate', fontweight='bold')
        plt.title('Receiver Operating Characteristic (ROC) Curve', fontweight='bold')
        plt.legend(loc="lower right")
        plt.tight_layout()
        plt.savefig(f'{self.output_dir}/roc_curve.png', dpi=300, bbox_inches='tight')
        plt.close()

    def plot_precision_recall_curve(self):
        """精确率-召回率曲线"""
        precision, recall, _ = precision_recall_curve(self.y_test, self.y_pred_proba)
        plt.figure(figsize=(8, 6))
        plt.plot(recall, precision, color='purple', lw=2)
        plt.xlabel('Recall', fontweight='bold')
        plt.ylabel('Precision', fontweight='bold')
        plt.title('Precision-Recall Curve', fontweight='bold')
        plt.xlim([0.0, 1.0])
        plt.ylim([0.0, 1.05])
        plt.tight_layout()
        plt.savefig(f'{self.output_dir}/precision_recall_curve.png', dpi=300, bbox_inches='tight')
        plt.close()

    def plot_learning_curves(self):
        """学习曲线 - 偏差/方差分析"""
        try:
            model_to_eval = self.model

            train_sizes, train_scores, val_scores = learning_curve(
                model_to_eval, self.X_test, self.y_test,
                train_sizes=np.linspace(0.1, 1.0, 5),  # 采样点设为5加快速度
                cv=3, scoring='accuracy', n_jobs=-1
            )
            train_mean = np.mean(train_scores, axis=1)
            train_std = np.std(train_scores, axis=1)
            val_mean = np.mean(val_scores, axis=1)
            val_std = np.std(val_scores, axis=1)

            plt.figure(figsize=(10, 6))
            plt.plot(train_sizes, train_mean, label='Training Score', color='blue', lw=2)
            plt.fill_between(train_sizes, train_mean - train_std, train_mean + train_std, alpha=0.2, color='blue')
            plt.plot(train_sizes, val_mean, label='Cross-validation Score', color='red', lw=2)
            plt.fill_between(train_sizes, val_mean - val_std, val_mean + val_std, alpha=0.2, color='red')

            plt.xlabel('Training Set Size', fontweight='bold')
            plt.ylabel('Accuracy', fontweight='bold')
            plt.title('Learning Curves', fontweight='bold')
            plt.legend(loc='best')
            plt.tight_layout()
            plt.savefig(f'{self.output_dir}/learning_curves.png', dpi=300, bbox_inches='tight')
            plt.close()
        except Exception as e:
            logger.warning(f"学习曲线生成失败被跳过，不影响整体结果: {e}")

    def plot_feature_importance(self, top_n: int = 20):
        """特征重要性 - 水平柱状图"""
        if hasattr(self.model, 'feature_importances_'):
            importances = self.model.feature_importances_
        else:
            importances = np.zeros(len(self.feature_names))
        if len(self.feature_names) != len(importances):
            logger.warning("特征名称数量与模型特征数不匹配，跳过特征重要性绘制。")
            return

        importance_df = pd.DataFrame({
            'feature': self.feature_names,
            'importance': importances
        }).sort_values('importance', ascending=True).tail(top_n)

        plt.figure(figsize=(10, 12))
        plt.barh(importance_df['feature'], importance_df['importance'], color='steelblue')
        plt.xlabel('Feature Importance', fontweight='bold')
        plt.title(f'Top {top_n} Feature Importances', fontweight='bold')
        plt.tight_layout()
        plt.savefig(f'{self.output_dir}/feature_importance.png', dpi=300, bbox_inches='tight')
        plt.close()

    def plot_shap_summary(self, sample_size: int = 100):
        """SHAP值分析 - 依赖 TreeExplainer"""
        try:
            # 随机采样以加快解释计算速度
            sample_idx = np.random.choice(len(self.X_test), min(sample_size, len(self.X_test)), replace=False)
            X_sample = self.X_test[sample_idx]

            explainer = shap.TreeExplainer(self.model)
            shap_values = explainer.shap_values(X_sample)

            if isinstance(shap_values, list):
                shap_values = shap_values[1] if len(shap_values) > 1 else shap_values[0]

            if shap_values.ndim == 3:
                if shap_values.shape[2] == 1:
                    shap_values = shap_values.reshape(shap_values.shape[0], shap_values.shape[1])
                else:
                    shap_values = np.max(np.abs(shap_values), axis=2)

            plt.figure(figsize=(12, 10))
            shap.summary_plot(
                shap_values,
                X_sample,
                feature_names=self.feature_names,
                show=False
            )
            plt.title('SHAP Value Summary', fontweight='bold', pad=20)
            plt.tight_layout()
            plt.savefig(f'{self.output_dir}/shap_summary.png', dpi=300, bbox_inches='tight')
            plt.close()

        except Exception as e:
            logger.warning(f"SHAP分析图生成被跳过: {e}")

    def plot_cv_results(self, results_dict: dict):
        """交叉验证分数箱线图"""
        cv_scores = results_dict.get('cv_scores', [])
        if not cv_scores:
            return

        plt.figure(figsize=(6, 8))
        sns.boxplot(y=cv_scores, color='lightblue', width=0.4)
        sns.swarmplot(y=cv_scores, color='darkblue', size=8)

        plt.title('Cross-Validation Accuracy Distribution', fontweight='bold')
        plt.ylabel('Accuracy', fontweight='bold')
        plt.xticks([])
        plt.tight_layout()
        plt.savefig(f'{self.output_dir}/cv_results.png', dpi=300, bbox_inches='tight')
        plt.close()