import cv2
import numpy as np
from torch.utils.data import Dataset


class ShapeNetDataset(Dataset):
    def __init__(self, rootdir, split):
        self.rootdir = rootdir
        self.split = split

        filelist = np.genfromtxt("{}/filelist.txt".format(rootdir), dtype=str)
        filter_ = np.genfromtxt("{}/{}-middlesplit.txt".format(rootdir, split), dtype=str)
        length = len(filter_[0])
        filter_ = set(filter_)

        self.filelist = ["{}/{}".format(rootdir, f) for f in filelist if f[:length] in filter_]
        self.size = len(self.filelist)
        print("n{}:".format(split), self.size)

    def __len__(self):
        return self.size

    def __getitem__(self, idx):
        prefix = self.filelist[idx]
        image = cv2.imread("{}_imag.jpg".format(prefix), -1).astype(np.float32) / 255.0
        plane_mask = cv2.imread("{}_plan.jpng".format(prefix), -1)
        with np.load("{}_plan.npz".format(prefix)) as N:
            plane_normal = N["ws"]

        with np.load("{}_dpth.npz".format(prefix)) as N:
            depth = N["depth"]
        with np.load("{}_nrml.npz".format(prefix)) as N:
            normal = N["normal"]

        return {
            "image": image,
            "plane_mask": plane_mask,
            "plane_normal": plane_normal,
            "depth": depth,
            "normal": normal,
        }
