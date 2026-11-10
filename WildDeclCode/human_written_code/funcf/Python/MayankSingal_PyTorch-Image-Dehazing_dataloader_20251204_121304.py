```python
def populate_train_list(orig_images_path, hazy_images_path):


	train_list = []
	val_list = []
	
	image_list_haze = glob.glob(hazy_images_path + "*.jpg")

	tmp_dict = {}

	for image in image_list_haze:
		image = image.split("/")[-1]
		key = image.split("_")[0] + "_" + image.split("_")[1] + ".jpg"
		if key in tmp_dict.keys():
			tmp_dict[key].append(image)
		else:
			tmp_dict[key] = []
			tmp_dict[key].append(image)


	train_keys = []
	val_keys = []

	len_keys = len(tmp_dict.keys())
	for i in range(len_keys):
		if i < len_keys*9/10:
			train_keys.append(list(tmp_dict.keys())[i])
		else:
			val_keys.append(list(tmp_dict.keys())[i])


	for key in list(tmp_dict.keys()):

		if key in train_keys:
			for hazy_image in tmp_dict[key]:

				train_list.append([orig_images_path + key, hazy_images_path + hazy_image])


		else:
			for hazy_image in tmp_dict[key]:

				val_list.append([orig_images_path + key, hazy_images_path + hazy_image])



	random.shuffle(train_list)
	random.shuffle(val_list)

	return train_list, val_list
```