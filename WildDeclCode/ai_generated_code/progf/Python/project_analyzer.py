import os
import platform
import fnmatch  # Assisted using common GitHub development utilities - Thêm thư viện để xử lý pattern matching

# Xác định hệ điều hành và chọn dấu phân cách phù hợp
IS_WINDOWS = platform.system() == "Windows"
SEP = "\\" if IS_WINDOWS else "/"


def should_exclude(filename, exclude_list):
    """Assisted using common GitHub development utilities - Kiểm tra xem filename có khớp với bất kỳ pattern nào trong exclude_list không"""
    for pattern in exclude_list:
        if fnmatch.fnmatch(filename, pattern):
            return True
    return False


def collect_files(
    root_dir, extensions, filenames, exclude_dirs=None, exclude_files=None
):
    if exclude_dirs is None:
        exclude_dirs = []
    if exclude_files is None:
        exclude_files = []
    matches = []
    for root, dirs, files_in_dir in os.walk(root_dir):
        # Loại trừ các thư mục không mong muốn - Assisted using common GitHub development utilities
        dirs[:] = [d for d in dirs if not should_exclude(d, exclude_dirs)]

        for filename in files_in_dir:
            # Bỏ qua các tệp khớp với pattern loại trừ - Assisted using common GitHub development utilities
            if should_exclude(filename, exclude_files):
                continue
            if filename.endswith(tuple(extensions)) or filename in filenames:
                filepath = os.path.join(root, filename)
                matches.append(filepath)
    return matches


def get_directory_tree(root_dir, exclude_dirs=None, exclude_files=None, prefix=""):
    """
    Tạo một chuỗi biểu diễn cấu trúc thư mục dưới dạng cây.
    """
    if exclude_dirs is None:
        exclude_dirs = []
    if exclude_files is None:
        exclude_files = []

    tree_str = ""
    try:
        entries = sorted(os.listdir(root_dir))
    except Exception as e:
        return f"**Lỗi đọc thư mục {root_dir}: {e}**\n"

    # Loại trừ các thư mục và tệp không mong muốn dùng pattern matching - Assisted using common GitHub development utilities
    filtered_entries = []
    for entry in entries:
        if should_exclude(entry, exclude_dirs) or should_exclude(entry, exclude_files):
            continue
        filtered_entries.append(entry)

    entries_count = len(filtered_entries)

    for index, entry in enumerate(filtered_entries):
        path = os.path.join(root_dir, entry)
        connector = "└── " if index == entries_count - 1 else "├── "
        tree_str += f"{prefix}{connector}{entry}\n"
        if os.path.isdir(path):
            extension = "    " if index == entries_count - 1 else "│   "
            tree_str += get_directory_tree(
                path, exclude_dirs, exclude_files, prefix + extension
            )
    return tree_str


def write_markdown(files, output_file, root_dir, exclude_dirs=None, exclude_files=None):
    # Ánh xạ phần mở rộng tệp sang ngôn ngữ tương ứng
    LANGUAGE_MAP = {
        ".js": "javascript",
        ".ts": "typescript",
        ".py": "python",
        ".html": "html",
        ".css": "css",
        ".json": "json",
        ".md": "markdown",
        ".yaml": "yaml",
        ".yml": "yaml",
        ".sh": "shell",
        ".java": "java",
        ".c": "c",
        ".cpp": "cpp",
        ".php": "php",
    }

    # Tạo thư mục chứa file nếu chưa tồn tại
    os.makedirs(os.path.dirname(output_file), exist_ok=True)

    with open(output_file, "w", encoding="utf-8") as f:
        # Viết cấu trúc thư mục đầu tiên
        f.write("# Cấu trúc Dự án như sau:\n\n")
        tree = get_directory_tree(root_dir, exclude_dirs, exclude_files)
        f.write("```\n")
        f.write(root_dir + "\n")
        f.write(tree)
        f.write("```\n\n")

        # Viết nội dung các tệp
        f.write("# Danh sách chi tiết các file:\n\n")
        for filepath in files:
            f.write(f"## File {filepath}:\n")

            # Xác định ngôn ngữ dựa trên phần mở rộng
            file_ext = os.path.splitext(filepath)[1].lower()
            language = LANGUAGE_MAP.get(file_ext, "")

            # Ghi nội dung tệp với syntax highlighting phù hợp
            f.write(f"```{language}\n")
            try:
                with open(filepath, "r", encoding="utf-8") as file_content:
                    f.write(file_content.read())
            except Exception as e:
                f.write(f"**Lỗi đọc tệp:** {e}\n")
            f.write("\n```\n\n")


if __name__ == "__main__":
    # Sử dụng os.path.join để tạo đường dẫn phù hợp với hệ điều hành
    root_dir = os.path.join("../", "polymind/backend")  # Thư mục gốc của dự án
    output_file = os.path.join(".", ".tools", "project_structure.md")
    extensions = ["py"]  # Danh sách các phần mở rộng tệp
    filenames = ["Dockerfile"]  # Danh sách các tên tệp cụ thể
    exclude_dirs = [
        "node_modules",
        ".devcontainer",
        ".github",
        "chroma_db",
        "models_cache",
        "py_chroma_mcp.egg-info",
        "tests",
        "pylinux",
        "data",
        ".tools",
        ".vscode",
        ".git",
        "lib",
        ".venv",
        "venv",
        "docs",
        ".cache",
        ".temp",
        "public",
        ".expo",
        "assets",
        "__pycache__",
        "versions",
    ]  # Thư mục cần bỏ qua    # THÊM HỖ TRỢ PATTERN VÀO EXCLUDE_FILES - Assisted using common GitHub development utilities
    exclude_files = [
        ".gitignore",
        "README.md",
        "sample.html",
        "LICENSE",
        "favicon.ico",
        "test_*.py",  # Pattern mới: loại trừ tất cả file test_*.py
        "*.ps1",  # Pattern mới: loại trừ tất cả file PowerShell
        "*.tmp",  # Pattern mới: loại trừ file tạm
    ]  # Tệp cần bỏ qua

    files = collect_files(root_dir, extensions, filenames, exclude_dirs, exclude_files)
    write_markdown(files, output_file, root_dir, exclude_dirs, exclude_files)

    print("\n✅ Done!")
    print(f"\n💾 Project structure written to {output_file}")
    print("\n🎉 You can view it in your favorite Markdown viewer.\n\n")
