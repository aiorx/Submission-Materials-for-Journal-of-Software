#!/usr/bin/env python3
"""
数据加载器 - TypeScript 并发安全版 (整文件读取 File-Level)
彻底解决 Windows IPC 管道死锁，收集并映射文件名。
"""

import logging
from pathlib import Path
from typing import List, Tuple, Dict
import multiprocessing
import concurrent.futures
import sys
import psutil
from multiprocessing import Process, Queue
import queue

logger = logging.getLogger(__name__)

class WindowsTimeoutWrapper:
    @staticmethod
    def _target_func(file_path, q):
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            # 物理截断：防止极其变态的 JS/TS 压缩文件撑爆 AST
            if len(content) > 1024 * 1024:
                content = content[:1024 * 1024]
            if not content.strip():
                q.put(('success', file_path, [], None))
            else:
                q.put(('success', file_path, [content], None))
        except Exception as e:
            q.put(('error', file_path, [], str(e)))

    @staticmethod
    def process_with_timeout(file_path: Path, timeout_seconds: int = 30):
        q = Queue()
        process = Process(target=WindowsTimeoutWrapper._target_func, args=(str(file_path), q))
        process.start()
        try:
            status, path, snippets, error = q.get(timeout=timeout_seconds)
            process.join(timeout=1)
            if status == 'success':
                return True, snippets, None
            return False, [], error
        except queue.Empty:
            process.terminate()
            process.join(timeout=5)
            if process.is_alive():
                try:
                    parent = psutil.Process(process.pid)
                    for child in parent.children(recursive=True): child.kill()
                    parent.kill()
                except: pass
            return False, [], f"超时 (> {timeout_seconds}s)"
        except Exception as e:
            if process.is_alive():
                process.terminate()
                process.join()
            return False, [], f"内部错误: {str(e)}"

class DataLoader:
    def __init__(self, config):
        self.config = config
        self.human_dir = Path(config.DATA_PATHS['human_code_dir'])
        self.ai_dir = Path(config.DATA_PATHS['ai_code_dir'])
        self.is_windows = sys.platform.startswith('win')
        if self.is_windows:
            self.timeout_wrapper = WindowsTimeoutWrapper()

    def load_data(self) -> Tuple[List[str], List[int], List[int], List[Dict]]:
        logger.info(f"从 {self.human_dir.name} 加载人类 TS 代码 (整文件)...")
        h_funcs, h_groups, h_files = self._load_directory_safe(self.human_dir, label=0, group_offset=0)

        logger.info(f"从 {self.ai_dir.name} 加载 AI TS 代码 (整文件)...")
        a_funcs, a_groups, a_files = self._load_directory_safe(self.ai_dir, label=1, group_offset=len(set(h_groups)) + 1)

        functions = h_funcs + a_funcs
        labels = [0] * len(h_funcs) + [1] * len(a_funcs)
        groups = h_groups + a_groups
        all_files = h_files + a_files

        # 封装 metadata 供后续写入 CSV 文件名
        metadata = [{'file': f} for f in all_files]
        logger.info(f"✅ 加载完成！共读取 {len(functions)} 个完整文件样本")
        return functions, labels, groups, metadata

    def _load_directory_safe(self, dir_path: Path, label: int, group_offset: int) -> Tuple[List[str], List[int], List[str]]:
        functions, groups, file_names = [], [], []
        if not dir_path.exists():
            logger.warning(f"目录不存在: {dir_path}")
            return functions, groups, file_names

        all_files = []
        for ext in ['*.ts', '*.tsx', '*.js', '*.jsx']:
            all_files.extend(list(dir_path.rglob(ext)))

        total_files = len(all_files)
        logger.info(f"发现 {total_files} 个文件，准备并发处理...")

        max_workers = min(10, max(1, multiprocessing.cpu_count() - 1))
        processed = skipped = 0

        with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_file = {}
            for idx, file_path in enumerate(all_files, 1):
                try:
                    if file_path.stat().st_size / 1024 / 1024 > 5.0:
                        skipped += 1
                        continue
                except: continue
                future_to_file[executor.submit(self._process_file_safe, file_path)] = (idx, file_path)

            for idx_completed, future in enumerate(concurrent.futures.as_completed(future_to_file), 1):
                original_idx, file_path = future_to_file[future]
                if idx_completed % max(1, total_files // 10) == 0 or idx_completed == total_files:
                    logger.info(f"  进度: {idx_completed}/{max(1, total_files - skipped)} ({(idx_completed / max(1, total_files - skipped)) * 100:.1f}%)")
                try:
                    snippets = future.result()
                    if snippets:
                        functions.extend(snippets)
                        groups.extend([group_offset + original_idx] * len(snippets))
                        file_names.extend([file_path.name] * len(snippets))
                        processed += 1
                except Exception as e:
                    logger.error(f"  处理出错 {file_path.name}: {e}")

        return functions, groups, file_names

    def _process_file_safe(self, file_path: Path) -> List[str]:
        try:
            if self.is_windows:
                success, snippets, _ = self.timeout_wrapper.process_with_timeout(file_path, timeout_seconds=30)
                return snippets if success else []
            else:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                if len(content) > 1024 * 1024: content = content[:1024 * 1024]
                return [content] if content.strip() else []
        except: return []