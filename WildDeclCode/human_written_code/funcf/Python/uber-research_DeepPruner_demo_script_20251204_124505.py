```python
def main():
    
    base_dir = args.base_dir
    for file1, file2 in zip(sorted(os.listdir(base_dir+'/image_1')), sorted(os.listdir(base_dir+'/image_2'))):

        image_1_image_path = base_dir + '/image_1/' + file1
        image_2_image_path = base_dir + '/image_2/' + file2

        image_1 = np.asarray(Image.open(image_1_image_path).convert('RGB'))
        image_2 = np.asarray(Image.open(image_2_image_path).convert('RGB'))
        
        image_1 = transforms.ToTensor()(image_1).unsqueeze(0).cuda().float()
        image_2 = transforms.ToTensor()(image_2).unsqueeze(0).cuda().float()

        reconstruction = model(image_1, image_2)

        plt.imsave(os.path.join(args.save_dir, image_1_image_path.split('/')[-1]),
                np.asarray(reconstruction[0].permute(1,2,0).data.cpu()*256).astype('uint16'))
```