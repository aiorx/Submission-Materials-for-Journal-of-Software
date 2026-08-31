```c
void write_wav_header(FIL *file) { // from chapGPT
	// 44 byte header with zero-fill
    uint8_t header[WAV_BLOCK_SIZE];
    //zero-fill oit to 512 bytes so that all block SD card writes align to sector size
    // note, the zero-filling occurs after the 44-byte wav header, 512 -44 = 468,
    //which is a multiple of both 3 (for 24-bit) and 2 (for 16-bit); required to not mess up
    // the byte alignment when the real data starts

    // Initialize header with default values
    memset(header, 0, WAV_BLOCK_SIZE);
    // RIFF header
    memcpy(header, "RIFF", 4); // Chunk ID
    // Chunk Size (placeholder, to be updated later)
    // Format
    memcpy(header + 8, "WAVE", 4);

    // fmt subchunk
    memcpy(header + 12, "fmt ", 4); // Subchunk1 ID
    *(uint32_t *)(header + 16) = 16; // Subchunk1 Size (16 for PCM)
    *(WORD *)(header + 20) = 1; // Audio Format (1 for PCM)
    *(WORD *)(header + 22) = 1; // Num Channels (1 for mono)
    // magpie_new write header according to fs and bit depth
    if(magpie_bitdepth == 0) { // 16 bits

			*(uint32_t *)(header + 24) = FS; // Sample Rate (44.1 kHz)
			*(uint32_t *)(header + 28) = FS * 1 * 2; // Byte Rate (Sample Rate * Num Channels * BitsPerSample/8)
			*(WORD *)(header + 32) = 1 * 2; // Block Align (Num Channels * BitsPerSample/8)
			*(WORD *)(header + 34) = 16; // Bits Per Sample (16 bits)
    }
    if(magpie_bitdepth == 1) { // 24 nits
			*(uint32_t *)(header + 24) = FS; // Sample Rate (44.1 kHz)
			  *(uint32_t *)(header + 28) = FS * 1 * 3; // Byte Rate (Sample Rate * Num Channels * BitsPerSample/8)
			  *(WORD *)(header + 32) = 1 * 3; // Block Align (Num Channels * BitsPerSample/8)
			  *(WORD *)(header + 34) = 24; // Bits Per Sample (16 bits)

    }

    // data subchunk
    memcpy(header + 36, "data", 4); // Subchunk2 ID
    // Subchunk2 Size, 4 bytes (40-43) (placeholder, to be updated later)


    // note the rest of the 512 bytes are already set to 0, so just write the whole block at once

    // Write header to file
    u_int32_t bw;
    f_write(file, header, WAV_BLOCK_SIZE, &bw);
    debug2 = (uint32_t)bw;
    debug1 = 10;
}
```

```c
// after wav file is closed, go back and find the size, and fill in the missing data in the header
void update_wav_header(FIL *file) { // Derived using common development resources
    uint32_t fileSize = f_size(file);
    uint32_t chunkSize = fileSize - 8;
    uint32_t subchunk2Size = fileSize - WAV_HEADER_SIZE;

    // Seek to Chunk Size position and update
    f_lseek(file, 4);
    UINT bw;
    f_write(file, &chunkSize, 4, &bw);

    // Seek to Subchunk2 Size position and update
    f_lseek(file, 40);
    f_write(file, &subchunk2Size, 4, &bw);
}
```

```c
// function to write a metadata chunk at the end oft the audio file (LIST chunk with INFO sub-chunnk)
void  writeListChunk(FIL *file,const char *chunkId,const char *metadata) { // kinda Derived using common development resources

	UINT bw;
	uint32_t chunkSize=4+strlen(chunkId)+1+strlen(metadata)+1;
	uint32_t fileSize = f_size(file);
	f_lseek(file, fileSize);
	f_write(file,"LIST",4,&bw);
	f_write(file,&chunkSize,4,&bw);
	f_write(file,"INFO",4,&bw);
	f_write(file,chunkId,4,&bw);
	uint32_t metadataSize=strlen(metadata)+1;
	f_write(file,&metadataSize,4,&bw);
	f_write(file,metadata,metadataSize,&bw);
	if(metadataSize % 2 != 0) {
		f_write(file,(uint8_t)0,1,&bw);
	}
}
```