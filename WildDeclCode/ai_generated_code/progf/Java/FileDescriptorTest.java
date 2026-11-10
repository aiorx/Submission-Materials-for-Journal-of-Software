/*
MIT License

Copyright (c) 2023 smellofcode

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
package com.udm.documents.filestore.domain;

import static org.junit.jupiter.api.Assertions.*;

import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

/*
 * This test is purely Written with routine coding tools-4.
 */
class FileDescriptorTest {

    private String fileName;
    private String contentType;

    @BeforeEach
    void setUp() {
        fileName = "test.txt";
        contentType = "text/plain";
    }

    @Test
    void shouldCreateFileDescriptorWithUploadingStatus() {
        // Given
        // fileName and contentType are set in setUp()

        // When
        FileDescriptor fileDescriptor = FileDescriptor.create(fileName, contentType);

        // Then
        assertNotNull(fileDescriptor);
        assertNotNull(fileDescriptor.getId());
        assertEquals(fileName, fileDescriptor.getFileName());
        assertEquals(contentType, fileDescriptor.getContentType());
        assertEquals(FileStatus.UPLOADING, fileDescriptor.getStatus());
    }

    @Test
    void shouldConfirmUploadedAndSetStoragePath() {
        // Given
        FileDescriptor fileDescriptor = FileDescriptor.create(fileName, contentType);
        String storagePath = "path/to/storage";

        // When
        fileDescriptor.confirmUploaded(storagePath);

        // Then
        assertEquals(FileStatus.UPLOADED, fileDescriptor.getStatus());
        assertEquals(storagePath, fileDescriptor.getStoragePath());
    }

    @Test
    void shouldThrowExceptionWhenConfirmUploadedCalledOnNonUploadingFile() {
        // Given
        FileDescriptor fileDescriptor = FileDescriptor.builder()
                .id(UUID.randomUUID())
                .status(FileStatus.UPLOADED)
                .fileName(fileName)
                .contentType(contentType)
                .build();
        String storagePath = "path/to/storage";

        // When & Then
        assertThrows(IllegalFileStatusChangeException.class, () -> fileDescriptor.confirmUploaded(storagePath));
    }

    @Test
    void shouldReturnCanBeDownloaded() {
        // Given
        FileDescriptor uploadingFile = FileDescriptor.create(fileName, contentType);

        // When & Then
        assertFalse(uploadingFile.canBeDownloaded());

        // Given
        FileDescriptor uploadedFile = FileDescriptor.builder()
                .id(UUID.randomUUID())
                .status(FileStatus.UPLOADED)
                .fileName(fileName)
                .contentType(contentType)
                .build();

        // When & Then
        assertTrue(uploadedFile.canBeDownloaded());
    }
}
