```python
def install_coco_api():
    repo_url = "https://github.com/cocodataset/cocoapi"
    os.system("git clone " + repo_url)
    os.system("cd cocoapi/PythonAPI/ && python setup.py install")
    shutil.rmtree('cocoapi')
    try:
        import pycocotools
    except Exception:
        print("Installing COCO API failed, please install it manually %s"%(repo_url))
```