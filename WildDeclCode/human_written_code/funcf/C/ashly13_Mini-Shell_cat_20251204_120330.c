```c
void display_file_content(int fd) {
    char buffer[1024];
    int nbytes;	
    while (1) {
        // Read from file descriptor
        nbytes = read(fd, buffer, 1024);
        if (nbytes < 0) {	// Error
            perror("\nminsh");
            break;
        }
        else if (nbytes == 0) {	// End of file
            write(1, "\n", 1);
            break;
        }

        // Write to output
        if (write(1, buffer, nbytes) < 0) {	// Error
            perror("\nminsh");
            break;
        }
    }
}
```