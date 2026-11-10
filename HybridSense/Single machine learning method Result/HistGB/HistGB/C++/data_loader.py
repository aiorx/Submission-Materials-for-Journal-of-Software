#!/usr/bin/env python3
"""
数据加载器 - 整文件读取版 (File-Level)
完全抛弃代码片段切割，直接将整个文件作为一个完整样本喂给模型。
(包含 Windows 多进程死锁修复)
"""

import logging
from pathlib import Path
import sys
import psutil  # 需要安装：pip install psutil
import concurrent.futures
import multiprocessing
from typing import List, Tuple, Dict  # 🚨 修复报错：导入了缺失的类型提示

# Windows兼容：使用multiprocessing实现超时
from multiprocessing import Process, Queue
import queue



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

            # 🚨 物理截断：防止超大文件(>1MB)在后续 AST 解析时撑爆内存
            # 1MB 纯文本大约对应 3~4 万行代码，足够模型做判断了
            if len(content) > 1024 * 1024:
                content = content[:1024 * 1024]

            # 直接将整个文件作为单个元素放入列表返回
            if not content.strip():
                q.put(('success', file_path, [], None))
            else:
                q.put(('success', file_path, [content], None))

        except Exception as e:
            q.put(('error', file_path, [], str(e)))

    @staticmethod
    def process_with_timeout(file_path: Path, timeout_seconds: int = 30):
        """带超时的安全读取"""
        q = Queue()
        process = Process(
            target=WindowsTimeoutWrapper._target_func,
            args=(str(file_path), q)
        )

        process.start()

        # 使用 q.get() 阻塞等待数据，彻底杜绝管道死锁
        try:
            status, path, snippets, error = q.get(timeout=timeout_seconds)
            process.join(timeout=1)

            if status == 'success':
                return True, snippets, None
            else:
                return False, [], error
        except queue.Empty:
            process.terminate()
            process.join(timeout=5)

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

        self.is_windows = sys.platform.startswith('win')
        logger.info(f"检测到操作系统: {'Windows' if self.is_windows else 'Unix/Linux'}")

        if self.is_windows:
            self.timeout_wrapper = WindowsTimeoutWrapper()

    def load_data(self) -> Tuple[List[str], List[int], List[int], List[Dict]]:
        """加载所有C++代码数据"""
        logger.info(f"从 {self.human_dir.name} 加载人类代码 (整文件模式)...")
        human_functions, human_groups = self._load_directory_safe(self.human_dir, label=0, group_offset=0)

        logger.info(f"从 {self.ai_dir.name} 加载AI代码 (整文件模式)...")
        ai_functions, ai_groups = self._load_directory_safe(self.ai_dir, label=1,
                                                            group_offset=len(set(human_groups)) + 1)

        functions = human_functions + ai_functions
        labels = [0] * len(human_functions) + [1] * len(ai_functions)
        groups = human_groups + ai_groups

        metadata = [{'file': f'file_{g}', 'label': l} for g, l in zip(groups, labels)]

        logger.info(f"✅ 加载完成！共读取 {len(functions)} 个完整文件样本")
        return functions, labels, groups, metadata

    def _load_directory_safe(self, dir_path: Path, label: int, group_offset: int) -> Tuple[List[str], List[int]]:
        functions = []
        groups = []
        if not dir_path.exists():
            logger.warning(f"目录不存在: {dir_path}")
            return functions, groups

        all_files = []
        for ext in ['*.cpp', '*.cxx', '*.cc', '*.hpp', '*.hxx', '*.hh', '*.ino']:
            all_files.extend(list(dir_path.glob(ext)))

        total_files = len(all_files)
        logger.info(f"发现 {total_files} 个C++文件，准备并发处理...")

        core_count = multiprocessing.cpu_count()
        max_workers = min(10, max(1, core_count - 2))
        logger.info(f"🟢 启用防死机安全并发机制，分配工作进程数: {max_workers}")

        processed = 0
        skipped = 0

        with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_file = {}
            for idx, file_path in enumerate(all_files, 1):
                # 提前过滤：大于 5MB 的文件直接跳过
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

                if idx_completed % 20 == 0:
                    valid_total = max(1, total_files - skipped)
                    logger.info(f"  进度: {idx_completed}/{valid_total} ({idx_completed * 100 / valid_total:.1f}%)")

                try:
                    snippets = future.result()
                    if snippets:
                        functions.extend(snippets)
                        groups.extend([group_offset + original_idx] * len(snippets))
                        processed += 1
                except Exception as e:
                    logger.error(f"  异步处理出错 {file_path.name}: {e}")

        logger.info(f"  处理完成: 成功读取 {processed} 个文件, 提前跳过超大文件 {skipped} 个")
        return functions, groups

    def _process_file_safe(self, file_path: Path) -> List[str]:
        try:
            if self.is_windows:
                # 因为不再进行复杂的切分，超时时间缩短为 30s 即可
                success, snippets, error = self.timeout_wrapper.process_with_timeout(file_path, timeout_seconds=30)
                if not success:
                    logger.warning(f"  处理失败 {file_path.name}: {error}")
                    return []
                return snippets
            else:
                return self._process_file_unix(file_path)
        except Exception as e:
            logger.error(f"  意外错误 {file_path.name}: {e}")
            return []

    def _process_file_unix(self, file_path: Path) -> List[str]:
        """Unix/Linux下的整文件提取"""
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()

        if len(content) > 1024 * 1024:
            content = content[:1024 * 1024]

        return [content] if content.strip() else []