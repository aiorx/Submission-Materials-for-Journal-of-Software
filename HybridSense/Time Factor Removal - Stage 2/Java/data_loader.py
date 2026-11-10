#!/usr/bin/env python3
"""
数据加载器 - Java 并发安全版 (整文件读取 File-Level 版)
附带保存源文件名功能，用于特征核验。
"""

import logging
from pathlib import Path
from typing import List, Tuple, Dict
import multiprocessing
import concurrent.futures

logger = logging.getLogger(__name__)


class DataLoader:
    def __init__(self, config):
        self.config = config
        self.human_dir = Path(config.DATA_PATHS['human_code_dir'])
        self.ai_dir = Path(config.DATA_PATHS['ai_code_dir'])

    def load_data(self) -> Tuple[List[str], List[int], List[int], List[Dict]]:
        logger.info(f"从 {self.human_dir} 加载人类 Java 代码 (整文件模式)...")
        h_funcs, h_groups, h_files = self._load_directory_safe(self.human_dir, label=0, group_offset=0)

        logger.info(f"从 {self.ai_dir} 加载 AI Java 代码 (整文件模式)...")
        a_funcs, a_groups, a_files = self._load_directory_safe(self.ai_dir, label=1,
                                                               group_offset=len(set(h_groups)) + 1)

        functions = h_funcs + a_funcs
        labels = [0] * len(h_funcs) + [1] * len(a_funcs)
        groups = h_groups + a_groups
        all_files = h_files + a_files

        # 🚨 将文件名封装入 metadata 列表，与 functions 严格对齐
        metadata = [{'file': f} for f in all_files]

        logger.info(f"✅ 加载完成！共读取 {len(functions)} 个完整文件样本")
        return functions, labels, groups, metadata

    def _load_directory_safe(self, dir_path: Path, label: int, group_offset: int) -> Tuple[
        List[str], List[int], List[str]]:
        functions = []
        groups = []
        file_names = []  # 新增保存文件名的列表

        if not dir_path.exists():
            logger.warning(f"目录不存在: {dir_path}")
            return functions, groups, file_names

        all_files = list(dir_path.rglob('*.java'))
        total_files = len(all_files)
        logger.info(f"发现 {total_files} 个 Java 文件，准备并发处理...")

        core_count = multiprocessing.cpu_count()
        max_workers = min(10, max(1, core_count - 1))
        logger.info(f"🟢 启用并发机制，分配工作线程数: {max_workers}")

        processed = 0
        skipped = 0

        with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_file = {}
            for idx, file_path in enumerate(all_files, 1):
                try:
                    if file_path.stat().st_size / 1024 / 1024 > 5.0:
                        skipped += 1
                        continue
                except:
                    continue

                future = executor.submit(self._process_file_safe, file_path)
                future_to_file[future] = (idx, file_path)

            for idx_completed, future in enumerate(concurrent.futures.as_completed(future_to_file), 1):
                original_idx, file_path = future_to_file[future]

                if idx_completed % max(1, total_files // 10) == 0 or idx_completed == total_files:
                    valid_total = max(1, total_files - skipped)
                    logger.info(f"  进度: {idx_completed}/{valid_total} ({idx_completed * 100 / valid_total:.1f}%)")

                try:
                    snippets = future.result()
                    if snippets:
                        functions.extend(snippets)
                        groups.extend([group_offset + original_idx] * len(snippets))
                        # 记录提取出的代码对应的实际文件名
                        file_names.extend([file_path.name] * len(snippets))
                        processed += 1
                except Exception as e:
                    logger.error(f"  异步处理出错 {file_path.name}: {e}")

        logger.info(f"  处理完成: 成功读取 {processed} 个文件, 提前跳过超大文件 {skipped} 个")
        return functions, groups, file_names

    def _process_file_safe(self, file_path: Path) -> List[str]:
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()

            if len(content) > 1024 * 1024:
                content = content[:1024 * 1024]

            if not content.strip():
                return []

            return [content]
        except Exception as e:
            logger.error(f"  读取文件异常 {file_path.name}: {e}")
            return []