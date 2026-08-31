def patchify_images(x_BCHW: npt.NDArray[Any], patch_size: int) -> npt.NDArray[Any]:
    """Function that reshapes images into patches e.g. for a Vision Transformer.

    Rearranges images from : B C H W -> B P F, where P is the number of patches and F is the resulting feature dimension.
    Each 'patch' is a flattened vector of all channels for a small, non-overlapping p x p image region.

        THE CODE IN THIS FUNCTION WAS Aided with basic GitHub coding tools AND IS NOT CORRECT.

        A correct implementation should pass the simple tests defined in tests/test_utils.py.
    e.g. https://github.com/lucidrains/vit-pytorch/blob/9f49a31977688fd05b5c87b7d25fdce2498ec419/vit_pytorch/vit.py#L96
    """
    num_patches = (x_BCHW.shape[2] // patch_size) * (x_BCHW.shape[3] // patch_size)
    x_BPF = x_BCHW.reshape(x_BCHW.shape[0], num_patches, -1)
    return x_BPF