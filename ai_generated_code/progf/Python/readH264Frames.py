# Script was Drafted using common development resources and modified by the author of this repo.
# Script for reading .h264 files and obtaining frames

import os
import av
import numpy as np
import cv2

def play_h264_video(file_path):
    container = av.open(file_path)
    video_stream = next(s for s in container.streams if s.type == 'video')
    codec = av.CodecContext.create('h264', 'r')
    codec.open(video_stream.codec)


    for frame in container.decode(video=0):
        img = frame.to_image()
        img = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
        cv2.imshow('Video Playback', img)

        # Press 'q' to exit
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    container.close()
    cv2.destroyAllWindows()
                 
def find_files(path, fps):
    matching_files = []  # List to store matching file names
    file_name = []
    for root, dirs, files in os.walk(path):
        for file in files:
            # if file.startswith(fps):
            # print(file)
            if fps in file:
                file_path = os.path.join(root, file)
                matching_files.append(file_path)  # Add matching file to the list
                file_name.append(file) 
    
    return matching_files, file_name

def get_frame(vid_path):
    cap = cv2.VideoCapture(vid_path)
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        yield frame

def save_image_to_directory(image, save_path, file_name):
    os.makedirs(save_path, exist_ok=True)
    save_file_path = os.path.join(save_path, file_name)
    cv2.imwrite(save_file_path, image)
    print("Image saved successfully at:", save_file_path)


if __name__ == '__main__':
    file_path = r'path'
    save_to_dir = 'frames\\fps60'
    
    save_to_path = os.path.join(file_path, save_to_dir) # Save to the directory 'save_to_dir' within the file_path. If none are available, a new directory is generated

    find_string = 'fps60'
    matching_files, matching_names = find_files(file_path, find_string) # Fidn the fils witholding the string 'find_string'

    for f, pth in enumerate(matching_files):

        for i, frame in enumerate(get_frame(pth)):

            # # Uncomment this if you want a series of images 
            # if i >= 1 and i <= 120:

            # Incomment this if you want only a single frame
            if i == 5:

                ## Present the frame(s) of the obtaiend video
                cv2.imshow(matching_names[f], frame)
                cv2.waitKey(0)

                ## Save the video frames the the directory

                # Remove ".h264" from file name
                file_name = matching_names[f].replace('.h264', '')
                # Add frame number to file name
                file_name = file_name + '_frame%d.jpg' % i

                save_image_to_directory(frame, save_to_path, file_name)
                
            # else:
                continue


