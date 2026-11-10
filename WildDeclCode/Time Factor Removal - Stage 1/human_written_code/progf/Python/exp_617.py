import argparse
import shutil
import threading
from pathlib import Path
from queue import Queue
from typing import List
from traceback import print_exc
from tqdm import tqdm


def sizeof_fmt(num, suffix='B'):
    for unit in ['', 'K', 'M', 'G']:
        if abs(num) < 1000.0:
            return "{{:3.1f}}{{:s}}{{:s}}".format(num, unit, suffix)
        num /= 1000.0
    return "{{:.1f}}{{:s}}{{:s}}".format(num, 'T', suffix)


class FastCopy:
    file_queue = Queue()
    totalFiles = 0
    copy_count = 0
    _lock = threading.Lock()
    progress_bar = None

    def __init__(self, src_dir, dest_dir, delete = False, sync = False, replace = False, size_limit=0, thread_num=16, ignore_symlinks=False):
        self.replace = replace
        self.delete = delete
        self.sync = sync
        self.size_limit = size_limit
        self.thread_num = thread_num
        self.ignore_symlinks = ignore_symlinks
        self.src_dir = Path(src_dir).absolute()
        self.size = 0
        if not self.src_dir.exists():
            raise ValueError(
                'Error: source directory {} does not exist.'.format(self.src_dir))
        self.dest_dir = Path(dest_dir).absolute()
        if self.src_dir == self.dest_dir:
            raise ValueError("Error: same source and destination directory.")
        self.dest_dir.mkdir(exist_ok=True)
        file_list = []
        folders = [self.src_dir]
        ignore_count = 0
        i, n = 0, 1
        while i < n:
            folder = folders[i]
            for path in folder.iterdir():
                if path.is_symlink():
                    if not ignore_symlinks:
                        file_list.append(path)
                elif path.is_dir():
                    folders.append(path)
                    (self.dest_dir / path.relative_to(self.src_dir)).mkdir(exist_ok=True)
                    n += 1
                elif path.is_file():
                    if self.size_limit and path.stat().st_size > self.size_limit:
                        ignore_count += 1
                    else:
                        self.size += path.stat().st_size
                        file_list.append(path)
            i += 1
        if ignore_count:
            print(
                "Ignoring {} file(s), larger than {}".format(ignore_count, sizeof_fmt(size_limit)))
        print("{} file(s) to copy from {} to {} with a size of {}".format(len(file_list), self.src_dir, self.dest_dir, sizeof_fmt(self.size)))
        if sync:
            dir_delete_count = 0
            delete_count = 0
            exist_count = 0
            print("Syncing files...")
            file_set = {file.relative_to(self.src_dir) for file in file_list}
            folder_set = {path.relative_to(self.src_dir) for path in folders}
            dest_folders = [self.dest_dir]
            while dest_folders:
                folder = dest_folders.pop()
                for path in folder.iterdir():
                    if path.is_file() or path.is_symlink():
                        rel_path = path.relative_to(self.dest_dir)
                        if rel_path not in file_set:
                            path.unlink()
                            delete_count += 1
                        elif not replace:
                            exist_count += 1
                            file_set.remove(rel_path)
                    elif path.is_dir():
                        if path.relative_to(self.dest_dir) not in folder_set:
                            dir_delete_count += 1
                            shutil.rmtree(path)
                            continue
                        dest_folders.append(path)
            if exist_count:
                print("{} file(s) already exist".format(exist_count))
            if dir_delete_count:
                print(
                    "{} folder(s) didn't match with the source directory, deleted with it's contents".format(dir_delete_count))
            if delete_count:
                print(
                    "{} file(s) didn't match with the source directory, deleted".format(delete_count))
            if not replace:
                file_list = [file for file in file_list if file.relative_to(
                    self.src_dir) in file_set]

        self.total_files = len(file_list)
        if len(file_list) == 0:
            print('no file to copy')
            return
        self.dispatch_workers(file_list)

    def single_copy(self):
        while True:
            file = self.file_queue.get()
            dest_path = self.dest_dir / file.relative_to(self.src_dir)
            if self.replace:
                dest_path.unlink(missing_ok=True)
            if not dest_path.exists():
                try:
                    shutil.copy2(file, str(dest_path.parent), follow_symlinks=False)
                except:
                    print(f'Couldn\'t copy "{file}"')
                    print_exc()
            if self.delete:
                file.unlink()
            self.file_queue.task_done()
            with self._lock:
                self.progress_bar.update(1)

    def dispatch_workers(self,
                         file_list):
        n_threads = self.thread_num
        for i in range(n_threads):
            t = threading.Thread(target=self.single_copy)
            t.daemon = True
            t.start()
        print('{} copy daemons started'.format(n_threads))
        self.progress_bar = tqdm(total=self.total_files)
        for file_name in file_list:
            self.file_queue.put(file_name)
        self.file_queue.join()
        self.progress_bar.close()
        print('{}/{} files copied successfully.'.format(len(file_list),
                                                        self.total_files))
        if self.delete:
            shutil.rmtree(self.src_dir)


if __name__ == '__main__':
    # FastCopy('venv', 'denv', sync=True)
    # exit(0)
    parser = argparse.ArgumentParser(description='Fast multi-threaded copy.')
    parser.add_argument('src_dir',
                        help='Path of the source directory (location to be copy from)')
    parser.add_argument('dest_dir',
                        help='Path of the destination directory (location to copy to)')
    parser.add_argument(
        '-d', '--delete', help='Delete the source directory', action='store_true')
    parser.add_argument(
        '-s', '--sync', help='Remove files from destination folder if they don\'t exist in source directory', action='store_true')
    parser.add_argument(
        '-r', '--replace', help='Replace files if they exist', action='store_true')
    parser.add_argument(
        '-t', '--thread', help='Set number of threads (default 16)', default=16, type=int)
    parser.add_argument(
        '-l', '--size-limit', help='Ignore files larger than the given size (default is MB)', default='0.0', type=str)
    parser.add_argument('-S', '--symlink',
                        help='Copy symlinks', action='store_true')
    args = parser.parse_args()
    assert args.thread > 0, "Thread number cannot be less than 1."
    size = args.size_limit.lower()
    if size.endswith('kb'):
        size = float(size[:-2]) * 1000
    elif size.endswith('mb'):
        size = float(size[:-2]) * 1_000_000
    elif size.endswith('gb'):
        size = float(size[:-2]) * 1_000_000_000
    elif size.endswith('b'):
        size = float(size[:-1])
    else:
        try:
            size = float(size) * 1_000_000
        except ValueError:
            raise ValueError("Error: unknown size format {}".format(args.size_limit))
    FastCopy(src_dir=args.src_dir,
             dest_dir=args.dest_dir,
             delete=args.delete,
             sync=args.sync,
             replace=args.replace,
             ignore_symlinks=not args.symlink,
             size_limit=size,
             thread_num=args.thread)
