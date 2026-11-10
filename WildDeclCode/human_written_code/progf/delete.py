# -*- coding: utf-8 -*-
"""
批量删除日志中标记为“文件过短跳过”的文件
功能：从指定日志文本提取待删除文件名，批量删除目标文件夹中对应文件
特点：跨平台兼容、自动去重、详细进度反馈、错误处理、操作不可逆提示
"""
import re
from pathlib import Path
from typing import List, Tuple


def extract_skipped_filenames(log_text: str) -> Tuple[List[str], int]:
    """
    从日志文本中提取所有“文件过短跳过”的文件名（去重）
    :param log_text: 原始日志文本
    :return: (去重后的待删除文件名列表, 原始匹配数量)
    """
    # 正则表达式：匹配“文件过短跳过: ”后的文件名（支持带后缀的文件名，不含空格）
    pattern = r'文件过短跳过: (\S+)'
    # 提取所有匹配结果
    all_matches = re.findall(pattern, log_text, re.MULTILINE)
    # 去重（避免日志中重复记录导致重复删除）
    unique_filenames = list(set(all_matches))
    # 排序（按文件名自然排序，方便查看）
    unique_filenames.sort()
    print(f"📊 日志解析完成：")
    print(f"  - 原始匹配到的文件数（含重复）：{len(all_matches)}")
    print(f"  - 去重后待删除文件数：{len(unique_filenames)}")
    return unique_filenames, len(all_matches)


def validate_target_folder(folder_path: Path) -> bool:
    """
    验证目标文件夹是否有效
    :param folder_path: 文件夹Path对象
    :return: 有效返回True，无效返回False
    """
    if not folder_path.exists():
        print(f"❌ 错误：目标文件夹不存在 -> {folder_path.absolute()}")
        return False
    if not folder_path.is_dir():
        print(f"❌ 错误：指定路径不是文件夹 -> {folder_path.absolute()}")
        return False
    # 检查文件夹是否可写（避免权限问题）
    try:
        test_file = folder_path / ".delete_test_temp"
        test_file.touch(exist_ok=False)
        test_file.unlink()
    except PermissionError:
        print(f"❌ 错误：没有目标文件夹的写入权限 -> {folder_path.absolute()}")
        return False
    except Exception as e:
        print(f"❌ 错误：文件夹验证失败 -> {str(e)}")
        return False
    return True


def batch_delete_files(target_folder: str, filenames: List[str]) -> None:
    """
    批量删除目标文件夹中的指定文件
    :param target_folder: 目标文件夹路径（绝对/相对路径均可）
    :param filenames: 待删除文件名列表
    """
    # 转换为Path对象，跨平台兼容
    folder_path = Path(target_folder).resolve()

    # 步骤1：验证目标文件夹
    if not validate_target_folder(folder_path):
        return

    # 初始化统计变量
    success_count = 0
    fail_count = 0
    non_exist_count = 0
    delete_log = []  # 记录删除日志，方便后续核对

    print(f"\n📂 开始执行批量删除操作")
    print(f"  目标文件夹：{folder_path}")
    print(f"  待删除文件总数：{len(filenames)}")
    print("-" * 60)

    # 步骤2：遍历并删除文件
    for idx, filename in enumerate(filenames, 1):
        file_path = folder_path / filename
        try:
            if file_path.exists():
                # 确认是文件（不是文件夹）再删除
                if file_path.is_file():
                    file_path.unlink()  # 永久删除文件
                    msg = f"✅ [{idx}/{len(filenames)}] 已删除：{filename}"
                    success_count += 1
                    delete_log.append(f"已删除：{filename}")
                else:
                    msg = f"⚠️ [{idx}/{len(filenames)}] 跳过（不是文件）：{filename}"
                    fail_count += 1
            else:
                msg = f"⚠️ [{idx}/{len(filenames)}] 跳过（文件不存在）：{filename}"
                non_exist_count += 1
            print(msg)
        except Exception as e:
            msg = f"❌ [{idx}/{len(filenames)}] 删除失败：{filename} -> 错误：{str(e)}"
            print(msg)
            fail_count += 1
            delete_log.append(f"删除失败：{filename}（错误：{str(e)}）")

    # 步骤3：输出最终统计结果
    print("-" * 60)
    print(f"\n📊 批量删除任务完成！")
    print(f"  总处理文件数：{len(filenames)}")
    print(f"  成功删除：{success_count} 个")
    print(f"  文件不存在：{non_exist_count} 个")
    print(f"  删除失败：{fail_count} 个")

    # 可选：保存删除日志到文件
    if delete_log:
        log_file = Path("./delete_operation_log.txt")
        with log_file.open("w", encoding="utf-8") as f:
            f.write(f"批量删除日志 - 执行时间：{Path.cwd().stat().st_ctime_ns}（时间戳）\n")
            f.write(f"目标文件夹：{folder_path}\n")
            f.write(f"总待删除文件数：{len(filenames)}\n")
            f.write("-" * 50 + "\n")
            for line in delete_log:
                f.write(line + "\n")
        print(f"\n📝 删除日志已保存到：{log_file.absolute()}")


if __name__ == "__main__":
    # ====================== 用户配置区域（必须修改以下2项）======================
    # 1. 原始日志文本（已包含用户提供的完整日志，无需修改）
    LOG_TEXT = """
处理进度:  49%|████▉     | 1273/2595 [00:10<00:09, 133.44文件/s]文件过短跳过: exp_1.py
处理进度:  51%|█████     | 1314/2595 [00:10<00:09, 139.27文件/s]文件过短跳过: exp_104.py
处理进度:  54%|█████▍    | 1400/2595 [00:10<00:06, 190.01文件/s]文件过短跳过: exp_112.py
处理进度:  55%|█████▍    | 1420/2595 [00:10<00:09, 125.52文件/s]文件过短跳过: exp_113.py
处理进度:  55%|█████▌    | 1436/2595 [00:11<00:13, 89.11文件/s] 文件过短跳过: exp_115.py
处理进度:  57%|█████▋    | 1468/2595 [00:12<00:19, 56.44文件/s]文件过短跳过: exp_117.py
处理进度:  57%|█████▋    | 1485/2595 [00:12<00:20, 54.60文件/s]文件过短跳过: exp_119.py
处理进度:  58%|█████▊    | 1499/2595 [00:12<00:21, 50.56文件/s]文件过短跳过: exp_120.py
处理进度:  58%|█████▊    | 1518/2595 [00:13<00:21, 50.44文件/s]文件过短跳过: exp_122.py
处理进度:  59%|█████▉    | 1531/2595 [00:13<00:22, 47.62文件/s]文件过短跳过: exp_123.py
处理进度:  60%|█████▉    | 1554/2595 [00:13<00:22, 47.06文件/s]文件过短跳过: exp_125.py
处理进度:  63%|██████▎   | 1628/2595 [00:16<00:27, 34.80文件/s]文件过短跳过: exp_137.py
文件过短跳过: exp_138.py
文件过短跳过: exp_140.py
文件过短跳过: exp_146.py
文件过短跳过: exp_16.py
文件过短跳过: exp_168.py
文件过短跳过: exp_170.py
处理进度:  66%|██████▌   | 1700/2595 [00:16<00:06, 140.44文件/s]文件过短跳过: exp_21.py
处理进度:  67%|██████▋   | 1749/2595 [00:16<00:05, 167.53文件/s]文件过短跳过: exp_24.py
处理进度:  68%|██████▊   | 1769/2595 [00:16<00:04, 172.83文件/s]文件过短跳过: exp_27.py
处理进度:  69%|██████▉   | 1795/2595 [00:17<00:04, 194.17文件/s]文件过短跳过: exp_29.py
文件过短跳过: exp_30.py
处理进度:  73%|███████▎  | 1895/2595 [00:17<00:03, 226.75文件/s]文件过短跳过: exp_37.py
文件过短跳过: exp_39.py
处理进度:  74%|███████▍  | 1919/2595 [00:17<00:03, 191.59文件/s]文件过短跳过: exp_4.py
处理进度:  77%|███████▋  | 1989/2595 [00:17<00:02, 204.40文件/s]文件过短跳过: exp_46.py
处理进度:  79%|███████▉  | 2046/2595 [00:18<00:02, 233.57文件/s]文件过短跳过: exp_50.py
处理进度:  83%|████████▎ | 2157/2595 [00:18<00:01, 243.57文件/s]文件过短跳过: exp_61.py
文件过短跳过: exp_62.py
处理进度:  85%|████████▍ | 2204/2595 [00:18<00:01, 198.66文件/s]文件过短跳过: exp_65.py
处理进度:  88%|████████▊ | 2294/2595 [00:19<00:01, 196.39文件/s]文件过短跳过: exp_75.py
处理进度:  90%|████████▉ | 2323/2595 [00:19<00:01, 217.80文件/s]文件过短跳过: exp_76.py
文件过短跳过: exp_77.py
处理进度:  92%|█████████▏| 2376/2595 [00:19<00:00, 232.24文件/s]文件过短跳过: exp_81.py
处理进度:  98%|█████████▊| 2544/2595 [00:20<00:00, 225.02文件/s]文件过短跳过: exp_96.py
处理进度: 100%|██████████| 2595/2595 [00:20<00:00, 125.24文件/s]
    """

    # 2. 目标文件夹路径（【必须修改】为你的实际文件夹路径）
    # 示例：
    # Windows：r"C:\Users\你的用户名\代码文件夹\target_files"
    # Linux/Mac："/home/你的用户名/代码文件夹/target_files"
    # 相对路径："./target_files"（脚本所在目录下的target_files文件夹）
    TARGET_FOLDER = "./Python"  # <--- 在这里修改为实际路径！

    # ====================== 执行流程（无需修改）======================
    print("=" * 60)
    print("📌 批量删除“文件过短跳过”文件脚本")
    print("⚠️  警告：删除操作不可逆！请务必先备份目标文件夹中的重要文件！")
    print("=" * 60)

    # 步骤1：提取待删除文件名
    skipped_filenames, raw_count = extract_skipped_filenames(LOG_TEXT)

    # 步骤2：确认是否继续
    if not skipped_filenames:
        print("\nℹ️  未从日志中提取到任何待删除文件，程序退出。")
        exit(0)

    # 提示用户确认
    confirm = input(f"\n❓ 即将删除 {len(skipped_filenames)} 个文件，是否继续？（输入 y 确认，其他键取消）：")
    if confirm.lower() != "y":
        print("ℹ️  用户取消操作，程序退出。")
        exit(0)

    # 步骤3：执行批量删除
    batch_delete_files(TARGET_FOLDER, skipped_filenames)

    print("\n" + "=" * 60)
    print("🎯 程序执行完毕！")
    print("=" * 60)