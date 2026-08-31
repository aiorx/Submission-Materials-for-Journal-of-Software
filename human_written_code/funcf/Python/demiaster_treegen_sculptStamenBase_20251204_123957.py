```python
def sculptStamenBase(scriptargs):
    sopnode = scriptargs['node']
    viewer = toolutils.sceneViewer()

    sculpt = sopnode.node("stamenbase_sculpt")

    sculpt.setCurrent(True, True)
    sculpt.setRenderFlag(True)
    sculpt.setDisplayFlag(True)
    viewer.enterCurrentNodeState()
```