#!/usr/bin/env python3
"""
可视化模块
"""

import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import logging
from pathlib import Path
import warnings

warnings.filterwarnings('ignore', 'invalid value encountered in divide')

logger = logging.getLogger(__name__)


def setup_chinese_font():
    """配置matplotlib字体"""
    import matplotlib
    chinese_fonts = ['SimHei', 'Microsoft YaHei', 'SimSun', 'STSong', 'DejaVu Sans']
    available_fonts = set(matplotlib.font_manager.get_font_names())

    chosen_font = next((font for font in chinese_fonts if font.lower() in [f.lower() for f in available_fonts]),
                       'DejaVu Sans')

    plt.rcParams['font.sans-serif'] = [chosen_font, 'DejaVu Sans']
    plt.rcParams['axes.unicode_minus'] = False
    return chosen_font != 'DejaVu Sans'


class ResultVisualizer:
    """结果可视化器（C++增强版）"""

    def __init__(self, config):
        self.config = config
        self.results_dir = Path(config.OUTPUT_PATHS['results_dir'])
        self.figures_dir = self.results_dir / 'figures'
        self.figures_dir.mkdir(parents=True, exist_ok=True)

        sns.set_style("whitegrid")
        plt.style.use('seaborn-v0_8')
        self.has_chinese_font = setup_chinese_font()
        self.labels = self._get_labels()

    def _get_labels(self):
        labels = {
            'human': 'Human C++ Code', 'ai': 'AI C++ Code',
            'human_short': 'Human', 'ai_short': 'AI',
            'title_feature_importance': 'C++ Feature Importance',
            'title_confusion_matrix': 'Confusion Matrix',
            'title_roc': 'ROC Curve',
            'title_cv': 'fetCvCross - Validation Accuracy',
        'title_distributions': 'C++ Feature Distributions',
        'title_report': 'Classification Report',
        'title_cpp_analysis': 'C++ Specific Feature Analysis',
        'importance': 'Importance',
        'precision': 'Precision', 'recall': 'Recall',
        'f1_score': 'F1-Score', 'density': 'Density',
        'accuracy': 'Accuracy',
        }

        if self.has_chinese_font:
            labels.update({
                'human': '人类C++代码', 'ai': 'AI C++代码',
                'title_feature_importance': 'C++特征重要性',
                'title_confusion_matrix': '混淆矩阵',
                'title_roc': 'ROC曲线',
                'title_cv': '交叉验证准确率',
                'title_distributions': 'C++特征分布对比',
                'title_report': '分类报告热力图',
                'title_cpp_analysis': 'C++特有特征分析',
                'precision': '精确率', 'recall': '召回率',
                'f1_score': 'F1分数', 'density': '密度',
                'accuracy': '准确率',
            })
        return labels

    def generate_all_visualizations(self, results, model, X, y, feature_names):
        """生成所有可视化图表"""
        logger.info("=" * 60)
        logger.info("生成C++可视化图表...")

        try:
            # 1. 特征重要性（区分C++特有特征）
            self.plot_feature_importance(results['feature_importance'], feature_names, top_n=30)

            # 2. 混淆矩阵
            self.plot_confusion_matrix(results['confusion_matrix'])

            # 3. ROC曲线
            self.plot_roc_curve(results['roc_curve'])

            # 4. 交叉验证
            self.plot_cv_scores(results['cv_scores'])

            # 5. 特征分布（重点分析C++特征）
            self.plot_cpp_feature_distributions(X, y, feature_names, top_n=15)

            # 6. 分类报告
            self.plot_classification_report(results['classification_report'])

            # 7. C++特有特征重要性子图
            self.plot_cpp_specific_importance(results['feature_importance'], feature_names)

            logger.info(f"✓ 所有C++图表已保存至 {self.figures_dir}")

        except Exception as e:
            logger.error(f"生成C++可视化时出错: {e}")
            import traceback
            traceback.print_exc()

    def plot_feature_importance(self, importance, feature_names, top_n=30):
        """特征重要性图（标记C++特有特征）"""
        try:
            # 识别C++特有特征
            cpp_feature_indices = []
            cpp_feature_names = []
            for i, name in enumerate(feature_names):
                if any(keyword in name.lower() for keyword in
                       ['cpp', 'class', 'template', 'stl', 'lambda', 'smart', 'virtual']):
                    cpp_feature_indices.append(i)
                    cpp_feature_names.append(name)

            # 获取top_n重要特征
            indices = np.argsort(importance)[::-1][:top_n]
            top_importance = [importance[i] for i in indices]
            top_names = [feature_names[i] for i in indices]

            # 标记C++特征
            colors = ['darkorange' if i in cpp_feature_indices else 'steelblue' for i in indices]

            plt.figure(figsize=(14, 10))
            bars = plt.barh(range(len(top_importance)), top_importance[::-1], color=colors[::-1])
            plt.yticks(range(len(top_names)), top_names[::-1], fontsize=8)
            plt.xlabel(self.labels['importance'], fontsize=12)
            plt.title(self.labels['title_feature_importance'], fontsize=14, fontweight='bold')

            # 添加图例
            from matplotlib.patches import Patch
            legend_elements = [
                Patch(facecolor='darkorange', label='C++ Specific Feature'),
                Patch(facecolor='steelblue', label='General Feature')
            ]
            plt.legend(handles=legend_elements, loc='lower right')

            for i, bar in enumerate(bars):
                width = bar.get_width()
                plt.text(width, bar.get_y() + bar.get_height() / 2, f'{width:.3f}',
                         ha='left', va='center', fontsize=7)

            plt.tight_layout()
            self._save_figure('feature_importance.png')
            plt.close()
        except Exception as e:
            logger.error(f"生成特征重要性图失败: {e}")

    def plot_cpp_specific_importance(self, importance, feature_names):
        """C++特有特征重要性子图"""
        try:
            # 筛选C++特有特征
            cpp_features = []
            cpp_importance = []
            for i, name in enumerate(feature_names):
                if any(keyword in name.lower() for keyword in
                       ['cpp', 'class', 'template', 'stl', 'lambda', 'smart', 'virtual',
                        'inheritance', 'exception', 'namespace', 'operator', 'constexpr']):
                    cpp_features.append(name)
                    cpp_importance.append(importance[i])

            if not cpp_features:
                logger.warning("未找到C++特有特征")
                return

            # 取前20个
            if len(cpp_importance) > 20:
                indices = np.argsort(cpp_importance)[-20:]
                cpp_importance = [cpp_importance[i] for i in indices]
                cpp_features = [cpp_features[i] for i in indices]

            plt.figure(figsize=(12, 8))
            bars = plt.barh(range(len(cpp_importance)), cpp_importance[::-1], color='darkorange')
            plt.yticks(range(len(cpp_features)), cpp_features[::-1], fontsize=9)
            plt.xlabel(self.labels['importance'], fontsize=12)
            plt.title('C++ Specific Feature Importance (Subset)', fontsize=14, fontweight='bold')

            for i, bar in enumerate(bars):
                width = bar.get_width()
                plt.text(width, bar.get_y() + bar.get_height() / 2, f'{width:.3f}',
                         ha='left', va='center')

            plt.tight_layout()
            self._save_figure('cpp_feature_importance.png')
            plt.close()
        except Exception as e:
            logger.error(f"生成C++特征重要性子图失败: {e}")

    def plot_cpp_feature_distributions(self, X, y, feature_names, top_n=15):
        """C++特征分布对比图"""
        try:
            # 优先选择C++特有特征
            cpp_indices = []
            for i, name in enumerate(feature_names):
                if any(keyword in name.lower() for keyword in
                       ['cpp', 'class', 'template', 'stl', 'lambda', 'smart', 'virtual']):
                    cpp_indices.append(i)

            # 如果C++特征不足，补充通用特征
            selected_indices = cpp_indices[:top_n]
            if len(selected_indices) < top_n:
                remaining = top_n - len(selected_indices)
                # 选择重要性较高的其他特征
                other_indices = [i for i in range(len(feature_names)) if i not in selected_indices]
                selected_indices.extend(other_indices[:remaining])

            n_features = len(selected_indices)
            fig, axes = plt.subplots(n_features, 1, figsize=(12, 3 * n_features))

            if n_features == 1:
                axes = [axes]

            for idx, feature_idx in enumerate(selected_indices):
                ax = axes[idx]

                human_values = X[y == 0, feature_idx]
                ai_values = X[y == 1, feature_idx]

                # 改进数据有效性检查
                has_human = len(human_values) > 0 and not np.allclose(human_values, 0)
                has_ai = len(ai_values) > 0 and not np.allclose(ai_values, 0)

                if not has_human and not has_ai:
                    logger.info(f"特征 {feature_idx} 全为0，跳过绘制")
                    ax.text(0.5, 0.5, f'{feature_names[feature_idx]}\nAll zeros',
                            ha='center', va='center', fontsize=8)
                    ax.set_xticks([])
                    ax.set_yticks([])
                    continue

                # 绘制直方图
                try:
                    if has_human:
                        ax.hist(human_values, bins=30, alpha=0.7,
                                label=self.labels['human'], density=True, color='steelblue')
                    if has_ai:
                        ax.hist(ai_values, bins=30, alpha=0.7,
                                label=self.labels['ai'], density=True, color='darkorange')
                except Exception:
                    if has_human:
                        ax.hist(human_values, bins=30, alpha=0.7,
                                label=self.labels['human'], color='steelblue')
                    if has_ai:
                        ax.hist(ai_values, bins=30, alpha=0.7,
                                label=self.labels['ai'], color='darkorange')

                ax.set_xlabel(f'{feature_names[feature_idx]}', fontsize=10)
                ax.set_ylabel(self.labels['density'], fontsize=10)
                ax.legend()
                ax.grid(True, alpha=0.3)

            plt.suptitle(self.labels['title_distributions'], fontsize=14, fontweight='bold')
            plt.tight_layout()
            self._save_figure('feature_distributions.png')
            plt.close()
        except Exception as e:
            logger.error(f"生成C++特征分布图失败: {e}")

    def plot_confusion_matrix(self, cm):
        """混淆矩阵图"""
        try:
            plt.figure(figsize=(8, 6))
            sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                        xticklabels=[self.labels['human_short'], self.labels['ai_short']],
                        yticklabels=[self.labels['human_short'], self.labels['ai_short']])
            plt.xlabel('Predicted', fontsize=12)
            plt.ylabel('True', fontsize=12)
            plt.title(self.labels['title_confusion_matrix'], fontsize=14, fontweight='bold')
            plt.tight_layout()
            self._save_figure('confusion_matrix.png')
            plt.close()
        except Exception as e:
            logger.error(f"生成混淆矩阵失败: {e}")

    def plot_roc_curve(self, roc_data):
        """ROC曲线图"""
        try:
            plt.figure(figsize=(8, 6))
            plt.plot(roc_data['fpr'], roc_data['tpr'],
                     label=f"ROC (AUC = {roc_data['auc']:.3f})", linewidth=2, color='darkorange')
            plt.plot([0, 1], [0, 1], 'k--', alpha=0.5)
            plt.xlim([0.0, 1.0])
            plt.ylim([0.0, 1.05])
            plt.xlabel('False Positive Rate', fontsize=12)
            plt.ylabel('True Positive Rate', fontsize=12)
            plt.title(self.labels['title_roc'], fontsize=14, fontweight='bold')
            plt.legend(loc="lower right")
            plt.grid(True, alpha=0.3)
            plt.tight_layout()
            self._save_figure('roc_curve.png')
            plt.close()
        except Exception as e:
            logger.error(f"生成ROC曲线失败: {e}")

    def plot_cv_scores(self, cv_scores):
        """交叉验证分数图"""
        try:
            plt.figure(figsize=(8, 6))
            plt.plot(range(1, len(cv_scores) + 1), cv_scores,
                     marker='o', linewidth=2, markersize=8, color='steelblue')
            plt.axhline(y=np.mean(cv_scores), color='r', linestyle='--',
                        label=f'Mean: {np.mean(cv_scores):.3f}')
            plt.xlabel('Fold', fontsize=12)
            plt.ylabel(self.labels['accuracy'], fontsize=12)
            plt.title(self.labels['title_cv'], fontsize=14, fontweight='bold')
            plt.legend()
            plt.grid(True, alpha=0.3)
            plt.xticks(range(1, len(cv_scores) + 1))
            plt.tight_layout()
            self._save_figure('cv_scores.png')
            plt.close()
        except Exception as e:
            logger.error(f"生成交叉验证图失败: {e}")

    def plot_classification_report(self, report):
        """分类报告热力图"""
        try:
            metrics = ['precision', 'recall', 'f1-score']
            classes = [self.labels['human_short'], self.labels['ai_short']]

            data = np.zeros((len(classes), len(metrics)))
            for i, cls in enumerate(['Human', 'AI']):
                for j, metric in enumerate(metrics):
                    data[i, j] = report[cls][metric]

            plt.figure(figsize=(8, 4))
            sns.heatmap(data, annot=True, fmt='.3f', cmap='viridis',
                        xticklabels=metrics, yticklabels=classes)
            plt.xlabel('Metrics', fontsize=12)
            plt.ylabel('Class', fontsize=12)
            plt.title(self.labels['title_report'], fontsize=14, fontweight='bold')
            plt.tight_layout()
            self._save_figure('classification_report.png')
            plt.close()
        except Exception as e:
            logger.error(f"生成分类报告热力图失败: {e}")

    def _save_figure(self, filename):
        """保存图表"""
        filepath = self.figures_dir / filename
        plt.savefig(filepath, dpi=self.config.VISUALIZATION['dpi'], bbox_inches='tight')

        if self.config.VISUALIZATION['show_plots']:
            plt.show()
        plt.close()