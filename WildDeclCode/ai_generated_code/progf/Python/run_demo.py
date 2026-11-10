## Aided using common development resources ##
import subprocess
from pathlib import Path
import shutil

REPO_URL = "https://github.com/psteiwer/PivotToJupyter.git"
CLONE_DIR = Path("Dependencies") / "PivotToJupyter"
DOCKERFILE_SRC = CLONE_DIR / "Dockerfile"
DOCKERFILE_DEST = Path("Dockerfile")
IMAGE_NAME = "demo-project"
COMPOSE_CMD = "docker compose up -d --build"

def run(cmd, cwd=None):
    result = subprocess.run(cmd, cwd=cwd, shell=True)
    if result.returncode != 0:
        raise RuntimeError(f"Command failed: {cmd}")

def ensure_repo():
    if not CLONE_DIR.exists():
        print(f"🔄 Cloning PivotToJupyter...")
        run(f"git clone {REPO_URL} {CLONE_DIR}")
    else:
        print(f"🔄 Updating PivotToJupyter...")
        run("git pull", cwd=CLONE_DIR)

def prepare_dockerfile():
    if not DOCKERFILE_SRC.exists():
        raise FileNotFoundError(f"❌ Dockerfile not found at {DOCKERFILE_SRC}")

    with open(DOCKERFILE_SRC, "r") as f:
        lines = f.readlines()

    # Filter out lines that copy module.xml
    filtered = []
    for line in lines:
        if "COPY module.xml" in line:
            print("⚠️  Skipping 'COPY module.xml' line in Dockerfile.")
            # Add custom COPY commands here since we know we are in correct section
            #filtered.append("COPY /src/UI/DemoUI.html /usr/irissys/csp/broker/DemoUI.html \n")
            #filtered.append("COPY /DemoVideos/NewIntroSlide.png /usr/irissys/csp/broker/NewIntroSlide.png \n")
            filtered.append("COPY /src/UI /usr/irissys/csp/broker \n")
            continue
        filtered.append(line)

    with open(DOCKERFILE_DEST, "w") as f:
        f.writelines(filtered)

def main():
    ensure_repo()
    prepare_dockerfile()
    print("🚀 Running Docker Compose...")
    run(COMPOSE_CMD)

if __name__ == "__main__":
    main()
