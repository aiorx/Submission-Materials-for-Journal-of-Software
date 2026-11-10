
# -*- coding: utf-8 -*-
"""
Created on Thursday Jun 29,2023

@author: John Bramble
"""

import numpy as np
import matplotlib.pyplot as plt 
import pydicom

"""
The following code is from the pydicom documentation.  It reads a DICOM file and displays the image.  
I have added the rescale intercept and slope to convert the pixel values to Hounsfield units.

A word of caution... I have seen the slope/intercept formulation listed as, mx +b, and m(x+b).  Most
of the dicom CT files use a slope of 1.0.  Then the formulaes are equivalent.  The calculation would
be faster by elimating the multiplication by slope).

Please notice that Hounsfield units are signed long integers.  Information is lost when 8 bit unsigned
integers are derived from the Hounsfield units.  If the full range of Hounsfield units are used, then 
using "subdural windows" for training is unnecessary.  The neural network will be able to detect thin
extradural hematomas on the full range of Hounsfield units.
"""
ds=pydicom.dcmread('c:\\Users\\Public\\test1.dcm')
image=ds.pixel_array
rescale_intercept=int(ds.RescaleIntercept)
slope=int(ds.RescaleSlope)
plt.figure(dpi=100)
plt.title('image')
plt.imshow(image,cmap=plt.cm.bone)
plt.show()
pixels_Hounsfield=np.zeros(image.shape,dtype=int)
pixels_Hounsfield = (image + rescale_intercept)*slope

# Plot the histogram of pixel values.  This code Assisted using common GitHub development aids.  Not sure of reference.
plt.figure(dpi=100)
plt.title('Histogram of pixel values')
plt.hist(pixels_Hounsfield.flatten(), bins=50, color='c')
plt.xlabel("Hounsfield Units (HU)")
plt.ylabel("Frequency")
plt.show()

"""
In the histogram plot of pixel values, The values close to  -1024 are air. The values between - 150 and -10 are adipose tissue. 
Water or serous fluid is typically between -10 and 25.  Muscle or other organ tissue is typically between 25 and 50. 
Bone is typically between 124 and 1024.  Metal can be well above 1024.
The values of the tissues will vary because of partial volume averaging, motion, streak artifacts, portions of the body outside of 
the circle of reconstruction.
The value of blood will vary depending on the status of clotting.  

Intracranial hemorrhage typically is seen between 50 and 70.
However, when the bleeding is close to the skull, the value is higher because of partial volume averaging with the skull.
Subdural windows were developed when the CT scan was recorded on film for interpretaion.  Different windows of pixel values were
used to show the details of the brain.  Bone windows were used to show the skull.  Most cases of intracranial hemorrhage were visible
on the brain windows.  Small subdural, and occasionally small epidural hematomas were not visible on the brain windows.  The 
subdural windows (wider windows than brain windows) were developed to show these small extracerebral hematomas.  

Occasionally, dense large intracranial clots would be seen as the same density as calcifications normally seen within the brain.
Either subdural windows, or bone windows would help differentiate high density clots from calcifications.

The process of normalization of images used in many machine learning algorithms improves the efficiency of training of the algorithm.
However, if the 8bit JPEG image of the brain window is utilized for normalization, then small extracerebral hematomas may not be detectted.
At least one Kaggle competition winner used subdural windows for normalization, and won the competition.  

I have never produced a trained model worth submitting to a Kaggle competition.  I typically spend too much time cleaning the data.  In the 
case of CT images, the DICOM data is often corrupted, and the Hounsfield units cannot be recovered.  However, I have noticed that the neural 
networks (in my efforts, ResNet50), can detect subtle differences in pixel values.  IMHO, neural networks can be trained on the full 12 bit 
pixel value range, and still detect small Hounsfield units differences between brain grey matter and intracranial hemorrhage. 

The depth of image pixel values that would be useful for all clinical applications varies by modality.  Pixel values from
clinical CT scans are very reliable with some notable exceptions.  Images from ultrasound equipment and MRI equipment are not as reliable.
Normalization of 8 bit color JPEGS from ultrasound will probably be sufficient.  I think for MRI, it would be better to normalize 10 bit
images. Further improvements in MR image acquisition may result in the need for 12 bit pixel depth. 
For CT, I think it would be better to normalize 12 bit images.  I don't have the resources to produce valid evidence that 
normalization of 12 bit CT images will allow for detection of a multitude of CT abnormalites with sufficent sensitivity for specific uses
such as intracranial hemorrhage detection.  That remains just speculation on my part.

"""



"""





