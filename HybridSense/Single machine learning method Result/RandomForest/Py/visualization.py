#!/usr/bin/env python3
"""
科研级结果可视化模块 (随机森林版)
"""

import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np
import logging
from pathlib import Path
import warnings
from sklearn.metrics import roc_curve, confusion_matrix
from sklearn.model_selection import learning_curve

warnings.filterwarnings('ignore')
logger = logging.getLogger(__name__)

plt.rcParams.update({'font.size': 12, 'font.family': 'sans-serif', 'figure.facecolor': 'white'})


class ResultVisualizer:
    def __init__(self, config):
        self.config = config
        self.output_dir = f"{config.OUTPUT_PATHS['results_dir']}/figures"
        Path(self.output_dir).mkdir(parents=True, exist_ok=True)

    def generate_all_visualizations(self, results_dict: dict, model, X: np.ndarray, y: np.ndarray, feature_names: list):
        self.model = model
        self.X = X
        self.y = np.array(y)
        self.feature_names = feature_names

        logger.info("开始生成科研级可视化图表...")
        self.plot_confusion_matrix(results_dict)
        self.plot_roc_curve(results_dict)
        self.plot_feature_importance()
        self.plot_learning_curves()
        self.plot_cv_results(results_dict)

    def plot_confusion_matrix(self, results_dict):
        cm = np.array(results_dict.get('confusion_matrix', [[0, 0], [0, 0]]))
        plt.figure(figsize=(6, 5))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=['Human', 'AI'], yticklabels=['Human', 'AI'])
        plt.title('Confusion Matrix')
        plt.ylabel('True Label')
        plt.xlabel('Predicted Label')
        plt.tight_layout()
        plt.savefig(f'{self.output_dir}/confusion_matrix.png', dpi=300)
        plt.close()

    def plot_roc_curve(self, results_dict):
        roc = results_dict.get('roc_curve', {})
        if not roc: return
        plt.figure(figsize=(7, 6))
        plt.plot(roc['fpr'], roc['tpr'], color='darkorange', lw=2, label=f"AUC = {roc['auc']:.4f}")
        plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
        plt.title('Receiver Operating Characteristic (ROC)')
        plt.xlabel('False Positive Rate')
        plt.ylabel('True Positive Rate')
        plt.legend(loc="lower right")
        plt.tight_layout()
        plt.savefig(f'{self.output_dir}/roc_curve.png', dpi=300)
        plt.close()

    def plot_feature_importance(self, top_n=20):
        if hasattr(self.model, 'feature_importances_'):
            importances = self.model.feature_importances_
        else:
            return

        if len(importances) != len(self.feature_names): return

        indices = np.argsort(importances)[::-1][:top_n]
        top_features = [self.feature_names[i] for i in indices]
        top_importances = importances[indices]

        plt.figure(figsize=(10, 8))
        sns.barplot(x=top_importances, y=top_features, palette='viridis')
        plt.title(f'Top {top_n} Feature Importances')
        plt.tight_layout()
        plt.savefig(f'{self.output_dir}/feature_importance.png', dpi=300)
        plt.close()

    def plot_learning_curves(self):
        try:
            train_sizes, train_scores, val_scores = learning_curve(
                self.model, self.X, self.y, train_sizes=np.linspace(0.1, 1.0, 5), cv=3, scoring='accuracy', n_jobs=-1
            )
            train_mean = np.mean(train_scores, axis=1)
            train_std = np.std(train_scores, axis=1)
            val_mean = np.mean(val_scores, axis=1)
            val_std = np.std(val_scores, axis=1)

            plt.figure(figsize=(8, 6))
            plt.plot(train_sizes, train_mean, 'o-', color='blue', label='Training Score')
            plt.fill_between(train_sizes, train_mean - train_std, train_mean + train_std, alpha=0.2, color='blue')
            plt.plot(train_sizes, val_mean, 'o-', color='red', label='Cross-validation Score')
            plt.fill_between(train_sizes, val_mean - val_std, val_mean + val_std, alpha=0.2, color='red')
            plt.title('Learning Curves')
            plt.xlabel('Training Set Size')
            plt.ylabel('Accuracy')
            plt.legend(loc='best')
            plt.grid(True)
            plt.tight_layout()
            plt.savefig(f'{self.output_dir}/learning_curves.png', dpi=300)
            plt.close()
        except Exception as e:
            logger.warning(f"学习曲线跳过: {e}")

    def plot_cv_results(self, results_dict):
        cv_scores = results_dict.get('cv_scores', [])
        if not cv_scores: return
        plt.figure(figsize=(5, 6))
        sns.boxplot(y=cv_scores, color='lightblue')
        plt.title('Cross-Validation Scores')
        plt.ylabel('Accuracy')
        plt.tight_layout()
        plt.savefig(f'{self.output_dir}/cv_scores_boxplot.png', dpi=300)
        plt.close()
