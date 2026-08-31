import os
import shutil
from pathlib import Path


def batch_rename_and_copy(source_dirs, target_dir):
    """
    将多个目录中的文件重命名后复制到目标文件夹

    参数:
        source_dirs: 源目录路径列表
        target_dir: 目标目录路径
    """
    # 创建目标目录（如果不存在）
    target_path = Path(target_dir)
    target_path.mkdir(parents=True, exist_ok=True)

    # 获取目标目录中已存在的 exp_ 文件，确定起始编号
    existing_files = list(target_path.glob("exp_*"))
    if existing_files:
        # 提取已有文件的最大编号
        max_num = 0
        for f in existing_files:
            try:
                num = int(f.stem.split('_')[1])
                max_num = max(max_num, num)
            except (IndexError, ValueError):
                continue
        counter = max_num + 1
    else:
        counter = 1

    # 记录处理结果
    copied_files = []
    skipped_items = []

    # 遍历所有源目录
    for source_dir in source_dirs:
        source_path = Path(source_dir)

        if not source_path.exists():
            print(f"警告: 源目录不存在 - {source_dir}")
            continue

        if not source_path.is_dir():
            print(f"警告: 路径不是目录 - {source_dir}")
            continue

        # 遍历目录中的文件
        for item in source_path.iterdir():
            # 只处理文件，跳过子目录
            if item.is_file():
                # 生成新的文件名
                while True:
                    new_name = f"exp_{counter}"
                    new_file = target_path / new_name

                    # 如果文件名已存在，增加计数器
                    if new_file.exists():
                        counter += 1
                        continue

                    # 复制文件（保留原扩展名）
                    dest_file = new_file.with_suffix(item.suffix)
                    try:
                        shutil.copy2(item, dest_file)
                        copied_files.append({
                            'original': str(item),
                            'new': str(dest_file)
                        })
                        print(f"已复制: {item.name} -> {dest_file.name}")
                        counter += 1
                        break
                    except Exception as e:
                        print(f"复制失败 {item} -> {dest_file}: {e}")
                        skipped_items.append(str(item))
                        break
            else:
                skipped_items.append(f"跳过目录: {item}")

    # 打印总结
    print("\n" + "=" * 50)
    print(f"处理完成！共复制 {len(copied_files)} 个文件")
    print(f"目标目录: {target_dir}")
    if skipped_items:
        print(f"跳过的项目: {len(skipped_items)} 个")

    return copied_files


# 使用示例
if __name__ == "__main__":
    # 在这里填写你的路径
    SOURCE_DIRECTORIES = [
        "D:/pgm/新建文件夹/exp_1/11.16-/exp_data_max/human code/program/Typescript/0-999_Typescript",
        "D:/pgm/新建文件夹/exp_1/11.16-/exp_data_max/human code/program/Typescript/1000-9999_Typescript",
        "D:/pgm/新建文件夹/exp_1/11.16-/exp_data_max/human code/program/Typescript/ov9999_Typescript",
    ]

    TARGET_DIRECTORY = "./progf/Typescript"

    # 执行批量复制
    batch_rename_and_copy(SOURCE_DIRECTORIES, TARGET_DIRECTORY)