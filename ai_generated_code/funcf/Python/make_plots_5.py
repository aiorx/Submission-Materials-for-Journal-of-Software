```python
def make_plot(df: pd.DataFrame, out_dir: Path) -> None:
    # thanks chatgpt: https://chat.openai.com/share/3e9b1957-7941-4121-a40c-2fa9f6a9b371

    # Rename task_id to use descriptive names
    names_to_replace = {
        i: f"{i}_{DESCRIPTIVE_TASK_NAMES[i]}" for i in DESCRIPTIVE_TASK_NAMES
    }
    df["task_id"] = df["task_id"].replace(names_to_replace)

    # Group by task_id and solver
    grouped = df.groupby(["task_id", "solver"])

    # Calculate the fraction of attempts with score 1 for each group
    fractions = grouped["score"].mean().reset_index()

    # Pivot the data for plotting
    pivot = fractions.pivot(index="task_id", columns="solver", values="score")

    # Plot the data
    ax = pivot.plot(kind="bar", figsize=(10, 5))

    # Set the labels and title
    ax.set_ylabel("Fraction of Attempts Successful")
    ax.set_xlabel("Task")
    ax.set_title("Fraction of Successful Attempts for Each Task and Solver")

    ax.set_xticks(ax.get_xticks())
    ax.set_xticklabels(ax.get_xticklabels(), rotation=-45, ha="left")

    # Show the legend
    labels = [
        "strong/gpt-3.5\n-turbo-16k-0613",
        "strong/gpt-4\n-32k-0613",
    ]
    ax.legend(
        labels=labels, title="Solver Type", loc="center left", bbox_to_anchor=(1, 0.5)
    )

    out_dir.mkdir(parents=True)
    plt.tight_layout()
    plt.savefig(out_dir / "fraction-successful-attempts.png")
```