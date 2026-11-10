```python
def stylize_folder_single(style_path, content_folder, save_folder):
    """
    Reads frames/pictures as follows:

    content_folder
        pic1.ext
        pic2.ext
        pic3.ext
        ...

    and saves as the styled images in save_folder as follow:

    save_folder
        pic1.ext
        pic2.ext
        pic3.ext
        ...
    """
    # Device
    device = ("cuda" if torch.cuda.is_available() else "cpu")

    # Load Transformer Network
    net = transformer.TransformerNetwork()
    net.load_state_dict(torch.load(style_path))
    net = net.to(device)

    # Stylize every frame
    images = [img for img in os.listdir(content_folder) if img.endswith(".jpg")]
    with torch.no_grad():
        for image_name in images:
            # Free-up unneeded cuda memory
            torch.cuda.empty_cache()
            
            # Load content image
            content_image = utils.load_image(content_folder + image_name)
            content_tensor = utils.itot(content_image).to(device)

            # Generate image
            generated_tensor = net(content_tensor)
            generated_image = utils.ttoi(generated_tensor.detach())
            if (PRESERVE_COLOR):
                generated_image = utils.transfer_color(content_image, generated_image)
            # Save image
            utils.saveimg(generated_image, save_folder + image_name)
```