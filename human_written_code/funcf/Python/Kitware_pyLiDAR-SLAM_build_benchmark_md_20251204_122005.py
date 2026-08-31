```python
def load_dataset(dataset: str) -> tuple:
    _datasets = ["kitti", "nhcd", "ford_campus", "nclt", "kitti_360", "ct_icp_kitti", "ct_icp_kitti_carla"]
    assert_debug(dataset in _datasets,
                 f"The dataset {dataset} is not supported")
    if dataset == "kitti":
        return "KITTI", [f"{i:02}" for i in range(11)]
    if dataset == "kitti_360":
        return "KITTI_360", ["0", "2", "3", "4", "5", "6", "7", "9", "10"]
    if dataset == "nhcd":
        return "Newer Handheld College Dataset", ["01_short_experiment", "02_long_experiment"]
    if dataset == "nclt":
        return "NCLT Long Pose Dataset", ["2012-01-08", "2012-01-15", "2012-01-22", "2013-01-10"]
    if dataset == "ford_campus":
        return "Ford Campus Dataset", ["dataset-1", "dataset-2"]
    if dataset == "ct_icp_kitti":
        return "KITTI_raw", [f"{i:02}" for i in range(11) if i != 3]
    if dataset == "ct_icp_kitti_carla":
        return "KITTI_CARLA", [f"Town{i + 1:02}" for i in range(7)]
```