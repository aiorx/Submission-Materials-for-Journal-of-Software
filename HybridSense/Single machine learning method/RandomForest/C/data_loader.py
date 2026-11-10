#!/usr/bin/env python3
"""
数据加载器 - 完全Windows兼容版 (整文件读取 File-Level 版)
使用multiprocessing替代signal实现超时机制
"""

import logging
from pathlib import Path
import re
from typing import List, Tuple, Dict
import pandas as pd
import sys
import psutil  # 需要安装：pip install psutil
import concurrent.futures
import multiprocessing

# Windows兼容：使用multiprocessing实现超时
from multiprocessing import Process, Queue
import queue
import time

logger = logging.getLogger(__name__)


class WindowsTimeoutWrapper:
    """Windows兼容的超时包装器"""

    @staticmethod
    def _target_func(file_path, q):
        """在子进程中执行的函数"""
        try:
            # 读取文件
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()

            # 🚨 物理截断：防止极其变态的超大文件(>1MB)在后续 AST 解析时撑爆内存
            if len(content) > 1024 * 1024:
                content = content[:1024 * 1024]

            # 提取片段（这里改为将整个文件作为一个片段返回，完全保留你的骨架）
            if not content.strip():
                q.put(('success', file_path, [], None))
            else:
                q.put(('success', file_path, [content], None))

        except Exception as e:
            q.put(('error', file_path, [], str(e)))

    @staticmethod
    def process_with_timeout(file_path: Path, timeout_seconds: int = 30):
        """
        使用子进程处理文件，带超时保护
        返回: (success: bool, snippets: list, error_msg: str)
        """
        q = Queue()
        process = Process(
            target=WindowsTimeoutWrapper._target_func,
            args=(str(file_path), q)
        )

        process.start()

        # 🚨 核心修复：直接用 q.get 阻塞带超时，而不是 process.join!
        # 彻底解决 Windows 管道死锁问题！
        try:
            status, path, snippets, error = q.get(timeout=timeout_seconds)
            process.join(timeout=1)

            if status == 'success':
                return True, snippets, None
            else:
                return False, [], error
        except queue.Empty:
            # 发生超时，强杀子进程
            process.terminate()
            process.join(timeout=5)  # 等待最多5秒

            # 强制杀死（如果还存在）
            if process.is_alive():
                try:
                    parent = psutil.Process(process.pid)
                    for child in parent.children(recursive=True):
                        child.kill()
                    parent.kill()
                except:
                    pass
            return False, [], f"超时 (> {timeout_seconds}s)"
        except Exception as e:
            if process.is_alive():
                process.terminate()
                process.join()
            return False, [], f"内部错误: {str(e)}"


class DataLoader:
    """数据加载器 - 完全Windows兼容"""

    def __init__(self, config):
        self.config = config
        self.human_dir = Path(config.DATA_PATHS['human_code_dir'])
        self.ai_dir = Path(config.DATA_PATHS['ai_code_dir'])

        # 检测操作系统
        self.is_windows = sys.platform.startswith('win')
        logger.info(f"检测到操作系统: {'Windows' if self.is_windows else 'Unix/Linux'}")

        if self.is_windows:
            self.timeout_wrapper = WindowsTimeoutWrapper()

    def load_data(self) -> Tuple[List[str], List[int], List[int], Dict]:
        """
        加载所有C++代码数据（完全Windows兼容，并返回防泄露的 groups 组别信息）
        """
        logger.info(f"从 {self.human_dir} 加载人类代码...")
        # 新增了 group_offset=0，并接收 human_groups
        human_functions, human_groups = self._load_directory_safe(self.human_dir, label=0, group_offset=0)

        logger.info(f"从 {self.ai_dir} 加载AI代码...")
        # 新增了 group_offset，确保 AI 的组别 ID 接着人类的 ID 往后排，不冲突
        ai_functions, ai_groups = self._load_directory_safe(self.ai_dir, label=1,
                                                            group_offset=len(set(human_groups)) + 1)

        functions = human_functions + ai_functions
        labels = [0] * len(human_functions) + [1] * len(ai_functions)
        groups = human_groups + ai_groups  # 合并组别信息

        metadata = {
            'total_functions': len(functions),
            'human_functions': len(human_functions),
            'ai_functions': len(ai_functions),
            'total_files': len(set(groups))
        }

        logger.info(f"加载完成！共 {len(functions)} 个代码片段，来自 {metadata['total_files']} 个文件")
        return functions, labels, groups, metadata

    def _load_directory_safe(self, dir_path: Path, label: int, group_offset: int) -> Tuple[List[str], List[int]]:
        """安全且并发加载目录（修复超时瓶颈并支持防泄露 GroupID）"""
        functions = []
        groups = []
        if not dir_path.exists():
            logger.warning(f"目录不存在: {dir_path}")
            return functions, groups

        all_files = []
        for ext in ['*.c', '*.h', '*.ino']:
            all_files.extend(list(dir_path.glob(ext)))

        total_files = len(all_files)
        logger.info(f"发现 {total_files} 个C文件，准备并发处理...")

        # ==========================================================
        # 🚨 核心修复：严控进程并发数，彻底防止电脑死机！
        # ==========================================================
        core_count = multiprocessing.cpu_count()
        max_workers = min(10, max(1, core_count - 2))
        logger.info(f"🟢 启用防死机安全并发机制，分配工作进程数: {max_workers}")

        # === 修复点：在这里补上变量的初始化 ===
        processed = 0
        skipped = 0

        # 使用线程池并发分发多进程任务
        with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_file = {}
            for idx, file_path in enumerate(all_files, 1):
                # 提前过滤：大于 5MB 的文件直接跳过，防止后续 AST 内存爆炸
                try:
                    if file_path.stat().st_size / 1024 / 1024 > 5.0:
                        skipped += 1
                        continue
                except:
                    continue

                # 提交给线程池
                future = executor.submit(self._process_file_safe, file_path)
                future_to_file[future] = (idx, file_path)

            # 收集结果
            for idx_completed, future in enumerate(concurrent.futures.as_completed(future_to_file), 1):
                original_idx, file_path = future_to_file[future]

                if idx_completed % 20 == 0:
                    # 注意：如果 skipped 过大，这里可能会出现除以 0 的情况，做了安全保护
                    valid_total = max(1, total_files - skipped)
                    logger.info(f"  进度: {idx_completed}/{valid_total} ({idx_completed * 100 / valid_total:.1f}%)")

                try:
                    snippets = future.result()
                    if snippets:
                        functions.extend(snippets)
                        # 为该文件生成的所有片段分配同一个 Group ID
                        groups.extend([group_offset + original_idx] * len(snippets))
                        processed += 1
                except Exception as e:
                    logger.error(f"  异步处理出错 {file_path.name}: {e}")

        logger.info(f"  处理完成: 成功 {processed} 个, 提前跳过超大文件 {skipped} 个")
        return functions, groups

    def _process_file_safe(self, file_path: Path) -> List[str]:
        """安全处理单个文件"""
        try:
            if self.is_windows:
                # Windows: 使用multiprocessing实现超时
                success, snippets, error = self.timeout_wrapper.process_with_timeout(file_path, timeout_seconds=30)

                if not success:
                    logger.warning(f"  处理失败 {file_path.name}: {error}")
                    return []
                return snippets
            else:
                # Unix/Linux: 使用传统方式（可保留signal方案）
                return self._process_file_unix(file_path)

        except Exception as e:
            logger.error(f"  意外错误 {file_path.name}: {e}")
            return []

    def _process_file_unix(self, file_path: Path) -> List[str]:
        """Unix/Linux下的文件处理（整文件提取）"""
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()

        if len(content) > 1024 * 1024:
            content = content[:1024 * 1024]

        return [content] if content.strip() else []


# 兼容性接口
class DataLoaderLegacy(DataLoader):
    pass