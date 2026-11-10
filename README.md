# HybridSense · WildDeclCode

[简体中文](#简体中文) | [English](#english)

---

## 简体中文

**《软件学报》投稿配套材料**

《HybridSense：一种面向真实环境下的混合作者代码的检测框架》

[English](#english) · [数据与标签](#数据与标签) · [实验材料](#实验材料) · [主结果](#主结果) · [核验与复跑](#核验与复跑)

本仓库提供 WildDeclCode 代码语料、HybridSense 实验实现与已保存的结果，以及三类基线的评估输出。研究任务是在**文件级**判断开源代码是否含有 AI 贡献；正类文件可能同时包含人工编写和 AI 生成的内容。

| 论文报告的数据规模 | 时间因素处理后的评估语料 | HybridSense（LightGBM）主结果 |
| --- | --- | --- |
| WildDeclCode：11,258 个源文件，覆盖 6 种语言 | 7,062 个文件 | 六语言平均 AUC **96.88%**，平均 ACC **90.67%** |

### 数据与标签

WildDeclCode 的正类由开发者的 AI 自声明定位，并经双标注者核验。人工对照来自最后一次提交早于 2021 年 6 月的仓库，按语言和规模匹配。论文中的文件级子集 **ProgF** 包含 4,472 对文件（8,944 个文件）。实验前移除了 ProgF 的 AI 自声明，避免检测器直接利用声明文字。

| 仓库中的语料 | 内容与用途 |
| --- | --- |
| [WildDeclCode](WildDeclCode/) | 顶层的 [AI 贡献语料](WildDeclCode/ai_generated_code/)和[人工语料](WildDeclCode/human_written_code/)包含 `progf/` 和 `funcf/`。`ai_generated_code` 是正类的目录名，不表示整份文件均由 AI 编写。 |
| [Time Factor Removal - Stage 1](WildDeclCode/Time%20Factor%20Removal%20-%20Stage%201/) | 语法规范化快照：统一编码、行尾和文件头，并改写选定的较新语法。当前快照含 4,469 个正类文件和 4,380 个人工文件。 |
| [Time Factor Removal - Stage 2](WildDeclCode/Time%20Factor%20Removal%20-%20Stage%202/) | 在阶段一基础上，按论文表 7 所述规则移除命中依赖、语言特性或时间线索清单的文件。当前快照含 3,401 个正类文件和 3,661 个人工文件。 |

论文按研究定义统计评估样本，仓库文件数按实际目录统计。顶层语料、阶段一和阶段二是不同版本，不应合并计数。阶段一改写服务于静态特征分析，不保证改写前后的运行语义完全等价。

### 实验材料

HybridSense 融合 **LSF**（传统词法与句法特征）、**HML**（人类微观习惯与编程语言特定特征）和 **DSE**（基于 CodeBERTa 的深度语义特征）。论文比较了随机森林（RF）、LightGBM 和 HistGB，最终选择单一 LightGBM 分类器。

| 论文中的实验 | 对应材料 | 可查阅内容 |
| --- | --- | --- |
| RQ1 · 基线（表 2） | [传统特征](Traditional%20Feature-based/) · [预训练模型](Pre-trained%20Model-based/) · [困惑度](Perplexity/) | C 和 Python 的传统特征报告、GPTSniffer 的逐语言结果，以及按语言和代码模型组织的困惑度输出。 |
| RQ2 · HybridSense 主结果（表 3） | [Final Results](HybridSense/Final%20Results/) | 六种语言的归档报告、脚本、图表和误分类记录。 |
| RQ3 · 特征模块与分类器（表 4、表 5） | [阶段一结果](HybridSense/Time%20Factor%20Removal%20-%20Stage%201%20Result/) · [阶段二结果](HybridSense/Time%20Factor%20Removal%20-%20Stage%202%20Result/) · [单一分类器结果](HybridSense/Single%20machine%20learning%20method%20Result/) | 结果目录名中的 `LSF`、`HML`、`DSE` 标记所用模块；单一分类器结果按 HistGB、LightGBM 和 RandomForest 组织。 |
| 时间因素分析（表 7、表 8） | [语料快照](WildDeclCode/) · [阶段二结果](HybridSense/Time%20Factor%20Removal%20-%20Stage%202%20Result/) · [单一分类器结果](HybridSense/Single%20machine%20learning%20method%20Result/) | 对照处理后的输入与结果。阶段目录也保存了集成实验；即使模块组合相同，仍须按分类器区分结果。 |

### 主结果

下表为论文表 3 的结果，单位为百分比，各语言在平均值中等权。AUC 指 ROC 曲线下面积，ACC 取报告中的交叉验证平均准确率。最优基线按论文表 3 的逐语言口径列出。

| 语言 | HybridSense AUC | HybridSense ACC | 最优基线 AUC | 最优基线 ACC | 归档报告 |
| --- | ---: | ---: | ---: | ---: | --- |
| C | 95.88 | 89.02 | 89.26 | 79.90 | [C](HybridSense/Final%20Results/C/results_c/experiment_report.txt) |
| C++ | 96.40 | 89.15 | 84.40 | 75.96 | [C++](HybridSense/Final%20Results/CPP/results_cpp/experiment_report.txt) |
| Java | 97.43 | 91.67 | 96.01 | 89.53 | [Java](HybridSense/Final%20Results/Java/results_java/experiment_report.txt) |
| Python | 96.35 | 89.07 | 96.40 | 89.96 | [Python](HybridSense/Final%20Results/Py/results_python/experiment_report.txt) |
| JavaScript | 97.01 | 91.56 | 97.53 | 90.26 | [JavaScript](HybridSense/Final%20Results/Js/results_js/experiment_report.txt) |
| TypeScript | 98.22 | 93.55 | 98.82 | 96.02 | [TypeScript](HybridSense/Final%20Results/Ts/results_ts/experiment_report.txt) |
| **六语言平均** | **96.88** | **90.67** | **93.74** | **86.94** | — |

这些结果针对论文构建的 GitHub 语料及其评估协议。自声明采集不能覆盖从未声明 AI 使用的样本；跨平台、闭源项目及更新一代代码生成模型上的效果仍需验证。检测分数不能单独作为某个文件作者身份的证据。

### 核验与复跑

#### 核验已保存的结果

打开上表的报告，查看 `ROC AUC` 与“平均准确率”。部分实验还提供 JSON、误分类 CSV 和图表，可查看更高精度的数值或核对个例。以 C 为例，在仓库根目录运行：

~~~bash
python -c "import json; d=json.load(open('HybridSense/Final Results/C/results_c/experiment_report.json', encoding='utf-8')); print('AUC = %.2f%%; ACC = %.2f%%' % (100*d['roc_curve']['auc'], 100*d['cv_mean']))"
~~~

预期输出：`AUC = 95.88%; ACC = 89.02%`。这里使用 `cv_mean`，即各折平均准确率；分类报告另有整体准确率。

#### 复跑已有实验脚本

1. 在独立工作副本中选择语言和实验配置。以 C 为例，使用 [C 实验目录](HybridSense/Final%20Results/C/)下的 [`config.py`](HybridSense/Final%20Results/C/config.py) 与 [`main.py`](HybridSense/Final%20Results/C/main.py)。
2. 将 `DATA_PATHS` 中的 `ai_code_dir` 和 `human_code_dir` 改为对应语料快照中 `ai_generated_code/progf/<语言>` 和 `human_written_code/progf/<语言>` 的本地绝对路径。论文主结果使用阶段二语料。为本次运行配置独立的输出和缓存路径，避免覆盖归档结果。
3. 根据所选脚本准备 Python 环境。常用依赖包括 NumPy、pandas、scikit-learn、LightGBM、PyTorch、Transformers、Matplotlib 和 seaborn；解析器因语言而异，例如 C 使用 Tree-sitter 和 `tree-sitter-c`。启用 DSE 时需能加载 `huggingface/CodeBERTa-small-v1`。从该语言目录运行 `python main.py`，并记录依赖版本、输入快照、特征开关、分类器和划分方式。

论文报告的实验环境为两块 NVIDIA RTX 4090（每块 24 GB），并对需训练的方法描述了十折评估协议。仓库脚本保留了按输入分组的实现及无分组时的分层回退；仓库未提供锁定的统一依赖环境或可直接复用的论文逐折划分清单。部分脚本保留原实验配置，例如 [C++ 入口使用的训练器](HybridSense/Final%20Results/CPP/model_trainer_plus.py)仍含投票集成。复跑前应核对所用分类器和评估协议；核验归档报告并不能证明从头复跑能得到相同数值。

### 数据可用性与引用

本仓库是稿件配套材料的访问入口。引用时请注明论文题名及实际使用的 Git 提交；可从[本说明核对的数据与结果快照](https://github.com/aiorx/Submission-Materials-for-Journal-of-Software/tree/67041b1f7c1daad8ce1a1848c9382573db8dec3b)开始。正式出版信息以期刊记录为准。

仓库当前没有统一的顶层许可证。复用或再分发第三方源文件前，请核对其上游许可和声明。关联数据存缴、审稿访问链接和公开永久地址的要求见[《软件学报》论文关联数据存缴共享政策](https://www.jos.org.cn/jos/news/view/20250311111210001)。

---

## English

**Supplementary materials for a Journal of Software submission**

*HybridSense: A Detection Framework for Mixed-Authorship Code in Real-World Environments*

[简体中文](#简体中文) · [Data and labels](#data-and-labels) · [Experiment materials](#experiment-materials) · [Main results](#main-results) · [Verification and reruns](#verification-and-reruns)

This repository provides the WildDeclCode corpora, HybridSense experiment code and saved results, and evaluation outputs for three families of baselines. The task is to detect AI contributions to open-source code **at file level**. A positive file may contain both human-written and AI-generated code.

| Dataset size reported in the paper | Evaluation corpus after temporal filtering | Main results for HybridSense (LightGBM) |
| --- | --- | --- |
| WildDeclCode: 11,258 source files across six languages | 7,062 files after both stages | Mean AUC **96.88%** and mean ACC **90.67%** across six languages |

### Data and labels

Positive examples were identified through developers’ AI self-disclosures and independently checked by two annotators. Human controls came from repositories whose last commit predates June 2021 and were matched by language and size. The paper’s file-level subset, **ProgF**, contains 4,472 matched pairs (8,944 files). AI disclosure text was removed from ProgF before evaluation to prevent detectors from using those declarations directly.

| Corpus in this repository | Contents and purpose |
| --- | --- |
| [WildDeclCode](WildDeclCode/) | The top-level [AI-contributed corpus](WildDeclCode/ai_generated_code/) and [human-written corpus](WildDeclCode/human_written_code/) contain `progf/` and `funcf/`. The directory name `ai_generated_code` denotes the positive label; it does not imply that AI wrote every part of a file. |
| [Time Factor Removal - Stage 1](WildDeclCode/Time%20Factor%20Removal%20-%20Stage%201/) | Syntax normalization snapshot: encoding, line endings and file headers are standardized, and selected newer syntax is rewritten. This snapshot contains 4,469 positive and 4,380 human-written files. |
| [Time Factor Removal - Stage 2](WildDeclCode/Time%20Factor%20Removal%20-%20Stage%202/) | Filters the Stage 1 corpus using the dependencies, language features and temporal cues described in Table 7. This snapshot contains 3,401 positive and 3,661 human-written files. |

The paper counts evaluation samples according to its inclusion criteria; the snapshot counts above describe files in the repository. The top-level corpora and the two stages are separate versions and should not be counted together. Stage 1 rewrites support static feature analysis and do not guarantee identical runtime behavior.

### Experiment materials

HybridSense combines **LSF** (traditional lexical and syntactic features), **HML** (human micro-habits and programming language-specific features), and **DSE** (deep semantic features from CodeBERTa). The paper compares Random Forest (RF), LightGBM, and HistGB, selecting a single LightGBM classifier for the final method.

| Experiment in the paper | Repository materials | What to inspect |
| --- | --- | --- |
| RQ1 · Baselines (Table 2) | [Traditional features](Traditional%20Feature-based/) · [Pre-trained model](Pre-trained%20Model-based/) · [Perplexity](Perplexity/) | Traditional-feature reports for C and Python, per-language GPTSniffer results, and perplexity outputs organized by language and code model. |
| RQ2 · Main HybridSense results (Table 3) | [Final Results](HybridSense/Final%20Results/) | Saved reports, scripts, figures, and misclassification records for the six languages. |
| RQ3 · Feature modules and classifiers (Tables 4–5) | [Stage 1 results](HybridSense/Time%20Factor%20Removal%20-%20Stage%201%20Result/) · [Stage 2 results](HybridSense/Time%20Factor%20Removal%20-%20Stage%202%20Result/) · [Single-classifier results](HybridSense/Single%20machine%20learning%20method%20Result/) | Directory names identify the feature modules (`LSF`, `HML`, `DSE`); the single-classifier runs are organized under HistGB, LightGBM, and RandomForest. |
| Analysis of temporal factors (Tables 7–8) | [Corpus snapshots](WildDeclCode/) · [Stage 2 results](HybridSense/Time%20Factor%20Removal%20-%20Stage%202%20Result/) · [Single-classifier results](HybridSense/Single%20machine%20learning%20method%20Result/) | Inspect the processed inputs alongside the outputs. The stage directories also archive ensemble runs. Check the classifier even when the feature combination is identical. |

### Main results

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

### Verification and reruns

#### Verify saved results

Open the linked reports and find `ROC AUC` and `平均准确率` (mean accuracy). Some runs also provide JSON, misclassification CSV files and figures for inspecting finer precision or individual cases. To check the C result from the repository root:

~~~bash
python -c "import json; d=json.load(open('HybridSense/Final Results/C/results_c/experiment_report.json', encoding='utf-8')); print('AUC = %.2f%%; ACC = %.2f%%' % (100*d['roc_curve']['auc'], 100*d['cv_mean']))"
~~~

Expected output: `AUC = 95.88%; ACC = 89.02%`. This uses `cv_mean`, the mean across folds; the classification report separately includes pooled accuracy.

#### Rerun the archived scripts

1. Use a separate working copy and choose a language and experiment configuration. For C, start with [`config.py`](HybridSense/Final%20Results/C/config.py) and [`main.py`](HybridSense/Final%20Results/C/main.py) in the [C experiment directory](HybridSense/Final%20Results/C/).
2. Set `ai_code_dir` and `human_code_dir` in `DATA_PATHS` to local absolute paths under `ai_generated_code/progf/<language>` and `human_written_code/progf/<language>` in the selected snapshot. The main paper results use Stage 2 data. Set separate output and cache paths so reruns do not overwrite saved results.
3. Set up Python for the selected script. Common dependencies include NumPy, pandas, scikit-learn, LightGBM, PyTorch, Transformers, Matplotlib, and seaborn. Parsers vary by language; C uses Tree-sitter and `tree-sitter-c`. DSE requires access to `huggingface/CodeBERTa-small-v1`. Run `python main.py` from the language directory and record dependency versions, input snapshot, enabled features, classifier, and split strategy.

The paper reports experiments on two NVIDIA RTX 4090 GPUs (24 GB each) and describes ten-fold evaluation for methods that require training. The scripts implement grouped cross-validation when groups are supplied and stratified cross-validation as a fallback. This repository does not provide a common locked environment or the exact fold manifest for the paper. Some scripts retain experimental settings; for example, the [trainer used by the C++ entry point](HybridSense/Final%20Results/CPP/model_trainer_plus.py) still contains a voting ensemble. Check the classifier and evaluation protocol before rerunning. Verifying the saved reports does not establish that a fresh run will reproduce every value.

### Data availability and citation

This repository is the access point for the manuscript’s supplementary materials. Cite the paper title and the Git commit you used; the [data and results snapshot checked for this README](https://github.com/aiorx/Submission-Materials-for-Journal-of-Software/tree/67041b1f7c1daad8ce1a1848c9382573db8dec3b) is a starting point. Refer to the journal record for formal publication details.

The repository currently has no top-level license. Check upstream licenses and notices before reusing or redistributing third-party source files. See the [Journal of Software research data deposit and sharing policy](https://www.jos.org.cn/jos/news/view/20250311111210001) for requirements on deposit, reviewer access, and persistent public access.
