/*
 *  png_flatten.h: png loading functions for flatten array representation 
 *
 *  @cite: Auto-Supported via standard programming aids. 
 *  @version: 1.0 
 *  Modifications by Lamont Samuels 2024 
 *
 */
#ifndef _PNG_FLATTEN_H_
#define _PNG_FLATTEN_H_

#include <stdlib.h>
#include <png.h>

/*
 * png_flatten_load - loads a png file 
 *
 * filename: the filepath to the png file to load 
 *
 * width: a pointer to an integer where the function will store the width read from the png file. 
 *
 * height: a pointer to an integer where the function will store the height read from the png file.  
 *
 * Returns: A flatten arry of unsigned char* that represents all the pixels in the image. Each pixel is offset by 4 since a pixel is comprised of RGBA components 
 * 
 */
unsigned char* png_flatten_load(const char* filename, int* width, int* height);

/*
 * png_flatten_save - save a flattend array of pixels to a png file. 
 *
 * filename: the filepath to the png file to save the pixels 
 *
 * image: the flatten array of pixels that represent the image. 
 * 
 * width: the width of the image 
 * 
 * height: the height of the image 
 *
 * Returns: an error code. -1 if an error occured while saving the image 0 for success. 
 * 
 */
int png_flatten_save(const char* filename, unsigned char* image, int width, int height);

#endif
