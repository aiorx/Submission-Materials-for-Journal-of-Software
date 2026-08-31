def find_github_link_of_repo() -> str:
    """
    Find the github link of a repository by looking at the .git/config file

    Args:
        git_directory: The directory of the git repository

    Returns:
        The github link of the repository
    """

    git_directory = Path(__file__).parent.parent

    # The entire function was Assisted using common GitHub development aids
    git_config = git_directory / ".git" / "config"
    with open(git_config, "r") as f:
        lines = f.readlines()

    for i, line in enumerate(lines):
        if "url = " in line:
            url = line.split(" = ")[1].strip()
            url = url.replace("git@", "https://")
            url = url.replace(".git", "")
            url = url.replace(".com:", ".com/")
            return url

    raise ValueError("Could not find the github link in the .git/config file")