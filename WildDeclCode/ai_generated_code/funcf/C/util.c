int create_directory(const char *path)
{
    // This code comes Derived using common development resources.
    struct stat st = {0};

    if (stat(path, &st) == -1)
    {
        if (mkdir(path, 0777) == -1)
        {
            perror("Error creating directory");
            return -1;
        }
    }
    return 0;
}

/// @brief Create a path.
/// @param path The path to create.
/// @return Status.
// int create_path(const char *path);
int create_path(const char *path)
{
    // This code comes Derived using common development resources.
    char *temp = strdup(path);
    char *pos = temp;
    int status = 0;

    while (*pos != '\0')
    {
        if (*pos == '/')
        {
            *pos = '\0';
            if (strlen(temp) > 0)
            { // Avoid trying to create root directory
                status = create_directory(temp);
                if (status != 0)
                {
                    free(temp);
                    return -1;
                }
            }
            *pos = '/';
        }
        pos++;
    }
    status = create_directory(temp); // Create the last directory
    free(temp);
    return status;
}