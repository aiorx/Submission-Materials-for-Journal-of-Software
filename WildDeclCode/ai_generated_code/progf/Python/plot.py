import matplotlib.pyplot as plt
"""
This script is used to plot the pass@k curves of the base models and the AZR counterparts.

Penned via standard programming aids.
"""
# Data
k_values = [1, 2, 4, 8, 16, 32, 64]

base_humaneval = [0.805, 0.866,0.927, 0.945, 0.951, 0.982, 0.982]
azr_humaneval = [0.835, 0.902, 0.939, 0.957, 0.97, 0.963, 0.976]

base_humaneval_plus = [0.744, 0.823, 0.878, 0.896, 0.902, 0.945, 0.939]
azr_humaneval_plus = [0.774, 0.854, 0.872, 0.902, 0.933, 0.927, 0.939]

# Create two subplots
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5), sharey=True)

# Left subplot: HumanEval
line1, = ax1.plot(k_values, base_humaneval, marker='^', color='teal', linestyle='--', label='Qwen-7b-Instruct-1M')
line2, = ax1.plot(k_values, azr_humaneval, marker='^', color='salmon', linestyle='--', label='Coder-R1-Zero-Qwen-2.5-7B')
ax1.set_xscale('log', base=2)
ax1.set_xticks(k_values)
ax1.set_xticklabels([str(k) for k in k_values])
ax1.set_xlabel('Number of Samples $k$', fontsize=12)
ax1.set_ylabel('Coverage (pass@$k$)', fontsize=12)
ax1.set_title('HumanEval', fontsize=14)
ax1.grid(True, linestyle='--', alpha=0.4)

# Right subplot: HumanEval+
ax2.plot(k_values, base_humaneval_plus, marker='^', color='teal', linestyle='--')
ax2.plot(k_values, azr_humaneval_plus, marker='^', color='salmon', linestyle='--')
ax2.set_xscale('log', base=2)
ax2.set_xticks(k_values)
ax2.set_xticklabels([str(k) for k in k_values])
ax2.set_xlabel('Number of Samples $k$', fontsize=12)
ax2.set_title('HumanEval+', fontsize=14)
ax2.grid(True, linestyle='--', alpha=0.4)

# Overall title
fig.suptitle('Pass@k curves of base models and AZR counterparts.', fontsize=15)

# Place legend at the bottom center of the figure
legend = fig.legend(
    handles=[line1, line2],
    labels=['Qwen2.5-Coder-7B', 'Absolute_Zero_Reasoner-Coder-7b'],
    loc='lower center',
    bbox_to_anchor=(0.5, -0.05),
    ncol=2,
    frameon=True,
    fontsize=11,
    fancybox=True,
    framealpha=1.0,
)

# Colored background blocks
legend.get_texts()[0].set_backgroundcolor('#d0ecff')   # Light blue background
legend.get_texts()[1].set_backgroundcolor('#ffe599')   # Light yellow background

# Auto layout with space for legend
plt.tight_layout(rect=[0, 0.05, 1, 0.95])

# Save the figure
plt.savefig('pass@k_curves.png', dpi=300, bbox_inches='tight')
# plt.show()