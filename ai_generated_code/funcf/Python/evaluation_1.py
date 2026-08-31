```python
    def compute_confusion_matrix(self, P, G):
        """
        Compute the confusion matrix for each class.
        """
        classes = set()
        for g_list in G:
            for g in g_list:
                classes.add(g.name.lower())
        for p_list in P:
            for p in p_list:
                classes.add(p.name.lower())
        
        class_to_index = {cls: i for i, cls in enumerate(classes)}
        
        cm = np.zeros((len(classes), len(classes)), dtype=int)
        
        for p_list, g_list in zip(P, G):
            p_indices = [class_to_index[p.name.lower()] for p in p_list]
            g_indices = [class_to_index[g.name.lower()] for g in g_list]
            
            for p_idx in p_indices:
                for g_idx in g_indices:
                    cm[g_idx][p_idx] += 1
        
        return cm, list(classes)
    
    def expand_confusion_matrix(self, cm, classes, all_classes):
        """
        Expand the confusion matrix to include all classes, setting missing classes to zero.
        """
        expanded_cm = np.zeros((len(all_classes), len(all_classes)), dtype=int)
        class_to_index = {cls: i for i, cls in enumerate(all_classes)}
        
        for i, cls1 in enumerate(classes):
            for j, cls2 in enumerate(classes):
                expanded_cm[class_to_index[cls1]][class_to_index[cls2]] = cm[i][j]
        
        return expanded_cm

    def plot_combined_confusion_matrices_models_per_technique(self):
        """
        Plot combined confusion matrices for all models per technique.
        """
        all_classes = sorted({cls for model_metrics in self.confusion_matrices.values() for cm_data in model_metrics.values() for cls in cm_data['classes']})

        for prompting_technique in self.prompting_techniques:
            technique_name = prompting_technique("Filler", "Filler", "Filler").name
            combined_cm = np.zeros((len(all_classes), len(all_classes)), dtype=float)
            model_count = 0

            for model_name, model_metrics in self.confusion_matrices.items():
                if technique_name in model_metrics:
                    cm_data = model_metrics[technique_name]
                    cm = self.expand_confusion_matrix(cm_data['matrix'], cm_data['classes'], all_classes)
                    combined_cm += cm
                    model_count += 1

            if model_count > 0:
                combined_cm = combined_cm / model_count  # Normalize by the number of models

            fig, ax = plt.subplots(figsize=(25, 15))
            sns.heatmap(combined_cm, annot=True, fmt='.2f', cmap='Blues', xticklabels=all_classes, yticklabels=all_classes, ax=ax)
            ax.set_title(f'Combined Confusion Matrix for {technique_name} (Averaged over Models)')
            ax.set_xlabel('Predicted')
            ax.set_ylabel('True')

            plt.tight_layout()
            plt.savefig(f"data/confusion_matrices/combined_confusion_matrix_models_{technique_name}.png", dpi=300)
            # plt.show()

    def plot_combined_confusion_matrices_all(self):
        """
        Plot combined confusion matrices for all models and techniques.
        """
        all_classes = sorted({cls for model_metrics in self.confusion_matrices.values() for cm_data in model_metrics.values() for cls in cm_data['classes']})

        combined_cm = np.zeros((len(all_classes), len(all_classes)), dtype=float)
        model_count = 0

        for model_name, model_metrics in self.confusion_matrices.items():
            for technique_name, cm_data in model_metrics.items():
                cm = self.expand_confusion_matrix(cm_data['matrix'], cm_data['classes'], all_classes)
                combined_cm += cm
                model_count += 1

        if model_count > 0:
            combined_cm = combined_cm / model_count

        fig, ax = plt.subplots(figsize=(25, 15))
        sns.heatmap(combined_cm, annot=True, fmt='.2f', cmap='Blues', xticklabels=all_classes, yticklabels=all_classes, ax=ax)
        ax.set_title('Combined Confusion Matrix for All Models and Techniques (Averaged)')
        ax.set_xlabel('Predicted')
        ax.set_ylabel('True')

        plt.tight_layout()
        plt.savefig("data/confusion_matrices/combined_confusion_matrix_all.png", dpi=300)
        # plt.show()
```