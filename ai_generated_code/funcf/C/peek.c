void print_file_details(const char *path)
{ // referred Referenced via basic programming materials
    struct stat file_stat;
    if (stat(path, &file_stat) == 0)
    {
        // Print the permissions
        // Print for user
        printf((S_ISDIR(file_stat.st_mode)) ? "d" : "-");
        printf((file_stat.st_mode & S_IRUSR) ? "r" : "-");
        printf((file_stat.st_mode & S_IWUSR) ? "w" : "-");
        printf((file_stat.st_mode & S_IXUSR) ? "x" : "-");
        // group
        printf((file_stat.st_mode & S_IRGRP) ? "r" : "-");
        printf((file_stat.st_mode & S_IWGRP) ? "w" : "-");
        printf((file_stat.st_mode & S_IXGRP) ? "x" : "-");
        // and others permissions
        printf((file_stat.st_mode & S_IROTH) ? "r" : "-");
        printf((file_stat.st_mode & S_IWOTH) ? "w" : "-");
        printf((file_stat.st_mode & S_IXOTH) ? "x" : "-");

        struct passwd *owner_info = getpwuid(file_stat.st_uid);
        struct group *group_info = getgrgid(file_stat.st_gid);
        printf(" %s %s", owner_info->pw_name, group_info->gr_name);

        printf(" %ld", file_stat.st_size);

        struct tm *mod_time = localtime(&file_stat.st_mtime);
        printf(" %d-%02d-%02d %02d:%02d\n", mod_time->tm_year + 1900,
               mod_time->tm_mon + 1, mod_time->tm_mday,
               mod_time->tm_hour, mod_time->tm_min);
    }
}