# HybridSense · WildDeclCode

**Supplementary materials for a Journal of Software submission**

*HybridSense: A Detection Framework for Mixed-Authorship Code in Real-World Environments*

[简体中文](README.md) · [Data and labels](#data-and-labels) · [Experiment materials](#experiment-materials) · [Main results](#main-results) · [Verification and reruns](#verification-and-reruns)

This repository provides the WildDeclCode corpora, HybridSense experiment code and saved results, and evaluation outputs for three families of baselines. The task is to detect AI contributions to open-source code **at file level**. A positive file may contain both human-written and AI-generated code.

| Dataset size reported in the paper | Evaluation corpus after temporal filtering | Main results for HybridSense (LightGBM) |
| --- | --- | --- |
| WildDeclCode: 11,258 source files across six languages | 7,062 files after both stages | Mean AUC **96.88%** and mean ACC **90.67%** across six languages |

## Data and labels

Positive examples were identified through developers’ AI self-disclosures and independently checked by two annotators. Human controls came from repositories whose last commit predates June 2021 and were matched by language and size. The paper’s file-level subset, **ProgF**, contains 4,472 matched pairs (8,944 files). AI disclosure text was removed from ProgF before evaluation to prevent detectors from using those declarations directly.

| Corpus in this repository | Contents and purpose |
| --- | --- |
| [WildDeclCode](WildDeclCode/) | The top-level [AI-contributed corpus](WildDeclCode/ai_generated_code/) and [human-written corpus](WildDeclCode/human_written_code/) contain `progf/` and `funcf/`. The directory name `ai_generated_code` denotes the positive label; it does not imply that AI wrote every part of a file. |
| [Time Factor Removal - Stage 1](WildDeclCode/Time%20Factor%20Removal%20-%20Stage%201/) | Syntax normalization snapshot: encoding, line endings and file headers are standardized, and selected newer syntax is rewritten. This snapshot contains 4,469 positive and 4,380 human-written files. |
| [Time Factor Removal - Stage 2](WildDeclCode/Time%20Factor%20Removal%20-%20Stage%202/) | Filters the Stage 1 corpus using the dependencies, language features and temporal cues described in Table 7. This snapshot contains 3,401 positive and 3,661 human-written files. |

The paper counts evaluation samples according to its inclusion criteria; the snapshot counts above describe files in the repository. The top-level corpora and the two stages are separate versions and should not be counted together. Stage 1 rewrites support static feature analysis and do not guarantee identical runtime behavior.

## Experiment materials

HybridSense combines **LSF** (traditional lexical and syntactic features), **HML** (human micro-habits and programming language-specific features), and **DSE** (deep semantic features from CodeBERTa). The paper compares Random Forest (RF), LightGBM, and HistGB, selecting a single LightGBM classifier for the final method.

| Experiment in the paper | Repository materials | What to inspect |
| --- | --- | --- |
| RQ1 · Baselines (Table 2) | [Traditional features](Traditional%20Feature-based/) · [Pre-trained model](Pre-trained%20Model-based/) · [Perplexity](Perplexity/) | Traditional-feature reports for C and Python, per-language GPTSniffer results, and perplexity outputs organized by language and code model. |
| RQ2 · Main HybridSense results (Table 3) | [Final Results](HybridSense/Final%20Results/) | Saved reports, scripts, figures, and misclassification records for the six languages. |
| RQ3 · Feature modules and classifiers (Tables 4–5) | [Stage 1 results](HybridSense/Time%20Factor%20Removal%20-%20Stage%201%20Result/) · [Stage 2 results](HybridSense/Time%20Factor%20Removal%20-%20Stage%202%20Result/) · [Single-classifier results](HybridSense/Single%20machine%20learning%20method%20Result/) | Directory names identify the feature modules (`LSF`, `HML`, `DSE`); the single-classifier runs are organized under HistGB, LightGBM, and RandomForest. |
| Analysis of temporal factors (Tables 7–8) | [Corpus snapshots](WildDeclCode/) · [Stage 2 results](HybridSense/Time%20Factor%20Removal%20-%20Stage%202%20Result/) · [Single-classifier results](HybridSense/Single%20machine%20learning%20method%20Result/) | Inspect the processed inputs alongside the outputs. The stage directories also archive ensemble runs. Check the classifier even when the feature combination is identical. |

## Main results

The values below are from Table 3 of the paper and are reported as percentages, with equal weight given to each language in the mean. AUC is the area under the ROC curve. ACC is mean cross-validation accuracy. The best baseline is shown for each language as reported in Table 3.

| Language | HybridSense AUC | HybridSense ACC | Best baseline AUC | Best baseline ACC | Saved report |
| --- | ---: | ---: | ---: | ---: | --- |
| C | 95.88 | 89.02 | 89.26 | 79.90 | [C](HybridSense/Final%20Results/C/results_c/experiment_report.txt) |
| C++ | 96.40 | 89.15 | 84.40 | 75.96 | [C++](HybridSense/Final%20Results/CPP/results_cpp/experiment_report.txt) |
| Java | 97.43 | 91.67 | 96.01 | 89.53 | [Java](HybridSense/Final%20Results/Java/results_java/experiment_report.txt) |
| Python | 96.35 | 89.07 | 96.40 | 89.96 | [Python](HybridSense/Final%20Results/Py/results_python/experiment_report.txt) |
| JavaScript | 97.01 | 91.56 | 97.53 | 90.26 | [JavaScript](HybridSense/Final%20Results/Js/results_js/experiment_report.txt) |
| TypeScript | 98.22 | 93.55 | 98.82 | 96.02 | [TypeScript](HybridSense/Final%20Results/Ts/results_ts/experiment_report.txt) |
| **Six-language mean** | **96.88** | **90.67** | **93.74** | **86.94** | — |

These results apply to the GitHub corpus and evaluation protocol described in the paper. Collecting examples through self-disclosures misses undisclosed AI use. Performance on other platforms, closed-source projects, and newer code generation models remains to be validated. A detector score alone does not establish who authored a file.

## Verification and reruns

### Verify saved results

Open the linked reports and find `ROC AUC` and `平均准确率` (mean accuracy). Some runs also provide JSON, misclassification CSV files and figures for inspecting finer precision or individual cases. To check the C result from the repository root:

~~~bash
python -c "import json; d=json.load(open('HybridSense/Final Results/C/results_c/experiment_report.json', encoding='utf-8')); print('AUC = %.2f%%; ACC = %.2f%%' % (100*d['roc_curve']['auc'], 100*d['cv_mean']))"
~~~

Expected output: `AUC = 95.88%; ACC = 89.02%`. This uses `cv_mean`, the mean across folds; the classification report separately includes pooled accuracy.

### Rerun the archived scripts

1. Use a separate working copy and choose a language and experiment configuration. For C, start with [`config.py`](HybridSense/Final%20Results/C/config.py) and [`main.py`](HybridSense/Final%20Results/C/main.py) in the [C experiment directory](HybridSense/Final%20Results/C/).
2. Set `ai_code_dir` and `human_code_dir` in `DATA_PATHS` to local absolute paths under `ai_generated_code/progf/<language>` and `human_written_code/progf/<language>` in the selected snapshot. The main paper results use Stage 2 data. Set separate output and cache paths so reruns do not overwrite saved results.
3. Set up Python for the selected script. Common dependencies include NumPy, pandas, scikit-learn, LightGBM, PyTorch, Transformers, Matplotlib, and seaborn. Parsers vary by language; C uses Tree-sitter and `tree-sitter-c`. DSE requires access to `huggingface/CodeBERTa-small-v1`. Run `python main.py` from the language directory and record dependency versions, input snapshot, enabled features, classifier, and split strategy.

The paper reports experiments on two NVIDIA RTX 4090 GPUs (24 GB each) and describes ten-fold evaluation for methods that require training. The scripts implement grouped cross-validation when groups are supplied and stratified cross-validation as a fallback. This repository does not provide a common locked environment or the exact fold manifest for the paper. Some scripts retain experimental settings; for example, the [trainer used by the C++ entry point](HybridSense/Final%20Results/CPP/model_trainer_plus.py) still contains a voting ensemble. Check the classifier and evaluation protocol before rerunning. Verifying the saved reports does not establish that a fresh run will reproduce every value.

## Data availability and citation

This repository is the access point for the manuscript’s supplementary materials. Cite the paper title and the Git commit you used; the [data and results snapshot checked for this README](https://github.com/aiorx/Submission-Materials-for-Journal-of-Software/tree/67041b1f7c1daad8ce1a1848c9382573db8dec3b) is a starting point. Refer to the journal record for formal publication details.

The repository currently has no top-level license. Check upstream licenses and notices before reusing or redistributing third-party source files. See the [Journal of Software research data deposit and sharing policy](https://www.jos.org.cn/jos/news/view/20250311111210001) for requirements on deposit, reviewer access, and persistent public access.
