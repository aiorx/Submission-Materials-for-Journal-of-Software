# NOTE: Certain parts of the code in this file are generated with the help of github copilot.
# It is only used for plotting and printing information, it's also very messy.

from utils import get_figure_size
import os
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# \printlength{\columnwidth} from the latex document
# Convert points to inches: 1 inch = 72.27 points
LATEX_COLUMN_WIDTH_PT = 452.9679
LATEX_COLUMN_WIDTH_INCHES = LATEX_COLUMN_WIDTH_PT / 72.27

plt.rcParams.update({
    'text.usetex': True,
    'font.family': 'serif',
    'font.serif': ['Computer Modern Roman'],

    # Set font sizes
    'font.size': 10,
    'axes.labelsize': 10,
    'axes.titlesize': 12,
    'xtick.labelsize': 9,
    'ytick.labelsize': 9,
    'legend.fontsize': 9,

    # Set figure properties based on LaTeX column width
    'figure.figsize': [LATEX_COLUMN_WIDTH_INCHES, LATEX_COLUMN_WIDTH_INCHES],
    'figure.dpi': 100,
    'savefig.dpi': 300,
    'savefig.format': 'pdf',
    'savefig.bbox': 'tight',
    'savefig.pad_inches': 0.1,

    # Set line and marker properties
    'lines.linewidth': 1.2,
    'lines.markersize': 4,

    # Set axes properties
    'axes.linewidth': 0.8,
    'axes.spines.left': True,
    'axes.spines.bottom': True,
    'axes.spines.top': False,
    'axes.spines.right': False,
    'axes.grid': True,

    # Set tick properties
    'xtick.direction': 'in',
    'ytick.direction': 'in',
    'xtick.major.size': 3,
    'xtick.minor.size': 1.5,
    'ytick.major.size': 3,
    'ytick.minor.size': 1.5,

    # Set legend properties
    'legend.frameon': True,
    'legend.framealpha': 0.9,
    'legend.fancybox': True,
})


def get_figure_size(aspect_ratio=0.618, width_fraction=1.0):
    # Calculate figure size based on Latex column width.
    width = LATEX_COLUMN_WIDTH_INCHES * width_fraction
    height = width * aspect_ratio
    return (width, height)


def plot_metrics(train_losses=None, val_losses=None, val_accuracies=None, train_accuracies=None,
                 best_val_acc=None, learning_rates=None, cm=None, class_names=None,
                 cm_title=None, loss_title=None, val_acc_title=None, lr_title=None,
                 tva_title=None, save_dir='report/plots', run_name=None):

    os.makedirs("{}/loss_plots".format(save_dir), exist_ok=True)
    os.makedirs("{}/accuracy_plots".format(save_dir), exist_ok=True)
    os.makedirs("{}/lr_plots".format(save_dir), exist_ok=True)
    os.makedirs("{}/confusion_matrices".format(save_dir), exist_ok=True)
    os.makedirs("{}/tva_plots".format(save_dir), exist_ok=True)

    colors = {
        'train': '#fc745c',
        'val': '#ffbc84',
        'best_acc': '#6c757d',
        'lr': '#1cbcbc'
    }

    # TRAIN AND VALIDATION LOSS PLOT
    if train_losses is not None and val_losses is not None:
        fig, ax = plt.subplots(figsize=get_figure_size(
            aspect_ratio=0.85, width_fraction=0.48))
        title = loss_title
        ax.set_title(title, wrap=True)  # Enable title wrapping
        ax.plot(train_losses, linestyle='-', color=colors['train'],
                label='Training Loss', alpha=0.8)
        ax.plot(val_losses, linestyle='-', color=colors['val'],
                label='Validation Loss', alpha=0.8)
        ax.set_xlabel('Epoch')
        ax.set_ylabel('Loss')
        ax.legend(loc='lower left')
        ax.grid(True, alpha=0.3, linestyle=':')
        plt.tight_layout()
        plt.savefig(
            '{}/loss_plots/{}.pdf'.format(save_dir, title.lower().replace(" ", "_").replace("/", "") if title else run_name))
        plt.close()

    # VALIDATION ACCURACY WITH LINE OF BEST ACCURACY
    if val_accuracies is not None and best_val_acc is not None:
        fig, ax = plt.subplots(figsize=get_figure_size(
            aspect_ratio=0.85, width_fraction=0.48))
        title = val_acc_title
        ax.set_title(title)
        ax.plot(val_accuracies, marker='s', label='Validation Accuracy',
                color=colors['val'], alpha=1, markersize=3, markerfacecolor='none', linewidth=1.2)
        ax.axhline(y=best_val_acc, linestyle='--', color=colors['best_acc'],
                   label="Best Accuracy: {:.2f}%".format(best_val_acc)', alpha=.8, linewidth=0.5)
        ax.set_xlabel('Epoch')
        ax.set_ylabel('Accuracy (\%)')
        ax.legend()
        ax.grid(True, alpha=0.3, linestyle=':')
        plt.tight_layout()
        plt.savefig(
            '{}/accuracy_plots/{}.pdf'.format(save_dir, title.lower().replace(" ", "_").replace("/", "") if title else run_name))
        plt.close()

    # LEARNING RATE PLOT
    if learning_rates is not None:
        fig, ax = plt.subplots(figsize=get_figure_size(
            aspect_ratio=0.6, width_fraction=0.7))
        title = lr_title
        ax.set_title(title)
        ax.plot(learning_rates, label='Learning Rate',
                color=colors['lr'], linewidth=1.5)
        ax.set_xlabel('Epoch')
        ax.set_ylabel('Learning Rate')
        ax.legend()
        ax.grid(True, alpha=0.3, linestyle=':')
        ax.ticklabel_format(style='scientific', axis='y',
                            scilimits=(0, 0))  # Si notation
        plt.tight_layout()
        plt.savefig(
            '{}/lr_plots/{}.pdf'.format(save_dir, title.lower().replace(" ", "_").replace("/", "")))
        plt.close()

    # VALIDATION VS TRAINING ACCURACY PLOT
    if val_accuracies is not None and train_accuracies is not None and tva_title is not None:
        # Compute difference between train and val, and find epoch where val peaks
        diff = np.array(train_accuracies) - np.array(val_accuracies)
        overfit_epoch = int(np.argmax(val_accuracies))

        fig, ax = plt.subplots(figsize=get_figure_size(
            aspect_ratio=1.0, width_fraction=0.5))

        # Plot raw accuracy curves with reduced opacity but no label
        ax.plot(
            train_accuracies,
            color=colors['train'],
            linewidth=1,
            zorder=2,
            alpha=0.3
        )
        ax.plot(
            val_accuracies,
            color=colors['val'],
            linewidth=1,
            zorder=2,
            alpha=0.3
        )

        # Add smoothed lines if enough epochs
        window_size = 5
        n_epochs = len(train_accuracies)
        if n_epochs >= window_size:
            # Use padding to start smoothed line from beginning
            padded_train = np.pad(
                train_accuracies, (window_size//2, window_size//2), mode='edge')
            padded_val = np.pad(val_accuracies, (window_size //
                                2, window_size//2), mode='edge')

            train_smooth = np.convolve(padded_train, np.ones(
                window_size)/window_size, mode='valid')
            val_smooth = np.convolve(padded_val, np.ones(
                window_size)/window_size, mode='valid')

            # Only show the smoothed portion that aligns with our original data
            # Now with labels for legend
            ax.plot(
                range(n_epochs),
                train_smooth[:n_epochs],
                label='Training Accuracy',
                color=colors['train'],
                linewidth=1,
                zorder=3
            )
            ax.plot(
                range(n_epochs),
                val_smooth[:n_epochs],
                label='Validation Accuracy',
                color=colors['val'],
                linewidth=1,
                zorder=3
            )
        else:
            # If not enough epochs for smoothing, use raw data for legend
            ax.plot(
                [],
                [],
                label='Training Accuracy',
                color=colors['train'],
                linewidth=1
            )
            ax.plot(
                [],
                [],
                label='Validation Accuracy',
                color=colors['val'],
                linewidth=1
            )

        # Vertical marker for the epoch where validation peaked
        ax.axvline(x=overfit_epoch, color='gray', linestyle='--', alpha=0.5)

        # Shade the region where training > validation after overfit_epoch
        mask = (np.arange(n_epochs) > overfit_epoch) & (diff > 0)
        if mask.any():
            ax.fill_between(
                range(n_epochs),
                train_accuracies,
                val_accuracies,
                where=mask,
                color='orange',
                alpha=0.3,
                label='Overfitting Region'
            )

        # Axis labels and limits
        ax.set_xlabel('Epoch')
        ax.set_ylabel('Accuracy (\%)')
        min_acc = min(min(train_accuracies), min(val_accuracies))
        max_acc = max(max(train_accuracies), max(val_accuracies))
        padding = (max_acc - min_acc) * 0.05
        ax.set_ylim(min_acc - padding, max_acc + padding)

        # Center the title
        fig.suptitle(tva_title, y=0.96)

        # Legend and grid
        ax.legend(loc="lower right")
        ax.grid(True, alpha=0.3, linestyle=':')

        plt.tight_layout()
        out_path = '{}/tva_plots/{}.pdf'.format(save_dir, tva_title.lower().replace(" ", "_").replace("/", ""))
        plt.savefig(out_path)
        plt.close(fig)

    # CONFUSION MATRIX
    if cm is not None and class_names is not None:
        fig, ax = plt.subplots(figsize=get_figure_size(
            aspect_ratio=1.0, width_fraction=0.8))
        title = cm_title if cm_title else 'Confusion Matrix'
        ax.set_title(title)
        sns.heatmap(cm, annot=True, fmt='d', square=True,
                    xticklabels=class_names, yticklabels=class_names,
                    cbar_kws={'shrink': 0.66})
        ax.set_xlabel('Predicted Labels')
        ax.set_ylabel('True Labels')
        ax.tick_params(axis='x')
        ax.tick_params(axis='y')
        plt.xticks(rotation=0)
        plt.yticks(rotation=0)
        ax.grid(False)
        plt.tight_layout()
        plt.savefig(
            '{}/confusion_matrices/{}.pdf'.format(save_dir, title.lower().replace(" ", "_").replace("/", "")))
        plt.close()


def print_model_info(model, device, num_epochs, train_loader, val_loader, test_loader, optimizer, criterion, scheduler=None, patience=5, improvement_threshold=1e-8):
    if hasattr(model, 'transformer_blocks'):
        print_transformer_info(model, device, num_epochs, train_loader, val_loader,
                               test_loader, optimizer, criterion, scheduler, patience, improvement_threshold)
        return
    # Training configuration
    training_config = [
        "{:<20} {}".format('Model:', model.__class__.__name__)",
        "{:<20} {}".format('Device:', device)",
        "{:<20} {}".format('Epochs:', num_epochs)",
        "{:<20} {}".format('Batch size:', train_loader.batch_size)",
        "{:<20} {:.2e}".format('Learning rate:', optimizer.param_groups[0]['lr'])}",
        "{:<20} {}".format('Loss function:', criterion.__class__.__name__)",
        "{:<20} {}".format('Optimizer:', optimizer.__class__.__name__)",
        "{:<20} {:,}".format('Parameters:', sum(p.numel() for p in model.parameters()))}",
        "{:<20} {:,}".format('Training samples:', len(train_loader.dataset))}",
        "{:<20} {:,}".format('Validation samples:', len(val_loader.dataset))}",
        "{:<20} {:,}".format('Test samples:', len(test_loader.dataset))}",
        "{:<20} {}".format('Patience:', patience)",
        "{:<20} {:.2e}".format('Improvement', improvement_threshold)}",
        "{:<20} {}".format('Scheduler:', scheduler.__class__.__name__ if scheduler else 'None')"
    ]

    # Model architecture
    model_arch = [
        "{:<20} (3, 128, 128)".format('Input shape:')",
        "{:<20} {}".format('Batch norm:', getattr(model, 'use_batch_norm', 'N/A'))",
        "{:<20} {}".format('Residual connections:', getattr(model, 'use_residuals', 'N/A'))",
        "",
        "Layer Information:"
    ]

    # Add layer information
    for name, layer in model.named_children():
        if list(layer.children()):
            for subname, sublayer in layer.named_children():
                # Use consistent column width for nested layer names
                layer_name = "{}.{}".format(name, subname)
                model_arch.append("{:<30} {}".format(layer_name, sublayer)")
        else:
            model_arch.append("{:<30} {}".format(name, layer)")

    # Pad lists to equal length
    max_len = max(len(training_config), len(model_arch))
    training_config.extend([""] * (max_len - len(training_config)))
    model_arch.extend([""] * (max_len - len(model_arch)))

    # Print formatted output
    print("{:<45} | {:<60}".format('Training Configuration', 'Model Architecture')}")
    print("-" * 46 + "+" + "-" * 60)
    for left, right in zip(training_config, model_arch):
        print("{:<45} | {:<60}".format(left, right)}")


def print_transformer_info(model, device, num_epochs, train_loader, val_loader, test_loader, optimizer, criterion, scheduler=None, patience=5, improvement_threshold=1e-8):
    # Training configuration
    training_config = [
        "{:<20} {}".format('Model:', model.__class__.__name__)",
        "{:<20} {}".format('Device:', device)",
        "{:<20} {}".format('Epochs:', num_epochs)",
        "{:<20} {}".format('Batch size:', train_loader.batch_size)",
        "{:<20} {:.2e}".format('Learning rate:', optimizer.param_groups[0]['lr'])}",
        "{:<20} {}".format('Loss function:', criterion.__class__.__name__)",
        "{:<20} {}".format('Optimizer:', optimizer.__class__.__name__)",
        "{:<20} {:,}".format('Parameters:', sum(p.numel() for p in model.parameters()))}",
        "{:<20} {:,}".format('Training samples:', len(train_loader.dataset))}",
        "{:<20} {:,}".format('Validation samples:', len(val_loader.dataset))}",
        "{:<20} {:,}".format('Test samples:', len(test_loader.dataset))}",
        "{:<20} {}".format('Patience:', patience)",
        "{:<20} {:.2e}".format('Improvement', improvement_threshold)}",
        "{:<20} {}".format('Scheduler:', scheduler.__class__.__name__ if scheduler else 'None')"
    ]

    # Model architecture
    model_arch = [
        "{:<20} (3, 128, 128)".format('Input shape:')",
        "{:<20} {}".format('Transformer blocks:', len(model.blocks))",
        "{:<20} {}".format('Attention heads:', model.blocks[0].attn.num_heads)",
        "{:<20} {}".format('Embedding dim:', model.blocks[0].attn.qkv.in_features)",
        "{:<20} {:.1f}".format('MLP ratio:', model.blocks[0].mlp.fc1.out_features / model.blocks[0].attn.qkv.in_features)}",
        "{:<20} {}".format('Position embed:', 'Enabled' if model.use_pos_embed else 'Disabled')",
        "{:<20} {:.1f}".format('Dropout rate:', model.blocks[0].attn.proj_drop.p)}",
        "{:<20} {}".format('Num classes:', model.head.out_features)",
        "",
        "Layer Information:"
    ]

    # Add layer information
    for name, layer in model.named_children():
        if list(layer.children()):
            for subname, sublayer in layer.named_children():
                # Use consistent column width for nested layer names
                layer_name = "{}.{}".format(name, subname)
                model_arch.append("{:<30} {}".format(layer_name, sublayer)")
        else:
            model_arch.append("{:<30} {}".format(name, layer)")

    # Pad lists to equal length
    max_len = max(len(training_config), len(model_arch))
    training_config.extend([""] * (max_len - len(training_config)))
    model_arch.extend([""] * (max_len - len(model_arch)))

    # Print formatted output
    print("{:<45} | {:<60}".format('Training Configuration', 'Model Architecture')}")
    print("-" * 46 + "+" + "-" * 60)
    for left, right in zip(training_config, model_arch):
        print("{:<45} | {:<60}".format(left, right)}")


def plot_test_metrics_vs_depth(test_accuracies, test_f1_scores, val_accuracies, save_dir='report'):
    os.makedirs("{}/depth_analysis".format(save_dir), exist_ok=True)

    depths = sorted(test_accuracies.keys())
    acc_values = [test_accuracies[d] for d in depths]
    f1_values = [test_f1_scores[d] for d in depths]
    val_values = [val_accuracies[d] for d in depths]
    colors = {
        'train': '#fc745c',
        'val': '#ffbc84',
        'best_acc': '#6c757d',
        'lr': '#1cbcbc'
    }

    fig, ax = plt.subplots(figsize=get_figure_size(
        aspect_ratio=0.55, width_fraction=0.8))

    # Plot all metrics
    ax.plot(depths, acc_values, label='Test Accuracy',
            color=colors['train'], marker='o', linewidth=1.5, alpha=0.8)
    ax.plot(depths, f1_values, label='Test F1 Score (macro)',
            color=colors['lr'], marker='o', linewidth=1.5, alpha=0.8)
    ax.plot(depths, val_values, label='Validation Accuracy',
            color=colors['val'], marker='o', linewidth=1.5, alpha=0.8)

    ax.set_xlabel('Model Depth (Blocks)')
    ax.set_ylabel('Score')
    ax.set_title('Model Performance Metrics vs. Depth')
    ax.grid(True, alpha=0.3, linestyle=':')
    ax.legend(loc='lower right', title='Metric')

    # Set y-axis limits with padding
    all_scores = acc_values + f1_values + val_values
    min_score, max_score = min(all_scores), max(all_scores)
    padding = (max_score - min_score) * 0.05
    ax.set_ylim(min_score - padding, max_score + padding)

    plt.tight_layout()
    plt.savefig("{}/depth_analysis/test_accuracy_f1_vs_depth.pdf".format(save_dir))
    plt.close()


test_accuracies = {
    2: 66.62,
    3: 77.51,
    4: 80.17,
    5: 78.21,
    6: 75.84,
    7: 74.86,
}

test_f1_scores = {
    2: 60.24,
    3: 71.44,
    4: 75.74,
    5: 74.01,
    6: 70.03,
    7: 71.18,
}

val_accuracies = {
    2: 62.32,
    3: 74.93,
    4: 77.87,
    5: 74.51,
    6: 72.69,
    7: 74.09,
}

plot_test_metrics_vs_depth(test_accuracies, test_f1_scores, val_accuracies)


def plot_metrics_vs_attention_heads(train_accuracies, val_accuracies, test_accuracies, test_f1_scores, save_dir='report'):
    os.makedirs("{}/attention_head_analysis".format(save_dir), exist_ok=True)

    heads = sorted(test_accuracies.keys())
    train_values = [train_accuracies[h] for h in heads]
    val_values = [val_accuracies[h] for h in heads]
    test_values = [test_accuracies[h] for h in heads]
    f1_values = [test_f1_scores[h] for h in heads]

    colors = {
        'train': '#fc745c',
        'val': '#ffbc84',
        'test': '#6c757d',
        'f1': '#1cbcbc'
    }

    fig, ax = plt.subplots(figsize=get_figure_size(
        aspect_ratio=0.55, width_fraction=0.8))

    ax.plot(heads, train_values, label='Training Accuracy',
            color=colors['train'], marker='o', linewidth=1.5)
    ax.plot(heads, val_values, label='Validation Accuracy',
            color=colors['val'], marker='o', linewidth=1.5)
    ax.plot(heads, test_values, label='Test Accuracy',
            color=colors['test'], marker='o', linewidth=1.5)
    ax.plot(heads, f1_values, label='Test F1 Score',
            color=colors['f1'], marker='o', linewidth=1.5)

    ax.set_xlabel('Number of Attention Heads')
    ax.set_ylabel('Score (\%)')
    ax.set_title('Performance Metrics vs. Attention Heads')
    ax.grid(True, alpha=0.3, linestyle=':')
    ax.legend(loc='upper right')

    all_scores = train_values + val_values + test_values + f1_values
    min_score, max_score = min(all_scores), max(all_scores)
    padding = (max_score - min_score) * 0.05
    ax.set_ylim(min_score - padding, max_score + padding)

    plt.tight_layout()
    plt.savefig("{}/attention_head_analysis/metrics_vs_heads.pdf".format(save_dir))
    plt.close()


train_accuracies = {
    3: 56.58,
    4: 59.05,
    5: 62.41,
    6: 65.47,
}

val_accuracies = {
    3: 38.10,
    4: 42.44,
    5: 43.42,
    6: 41.74,
}

test_accuracies = {
    3: 41.76,
    4: 42.04,
    5: 42.60,
    6: 41.62,
}

test_f1_scores = {
    3: 34.74,
    4: 37.40,
    5: 35.93,
    6: 33.45,
}

plot_metrics_vs_attention_heads(
    train_accuracies, val_accuracies, test_accuracies, test_f1_scores)
