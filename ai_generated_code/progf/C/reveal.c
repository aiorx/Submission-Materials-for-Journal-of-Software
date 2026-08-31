# include "reveal.h"
# define MAX_SIZE 4096
# define MAX_ENTRIES 4096
int hidden = 0; // a is for hidden files
int completed = 0; // l is for complete description
int other = 0; // causes the program to produce error
int check_prev = 0;
# define BLUE 1 
# define GREEN 2
# define RED 3

typedef struct {
    char name[MAX_SIZE];
} Entry;

// comparision logic has been Supported via standard programming aids 
int compare_entries(const void *a, const void *b) {
    return strcmp(((Entry *)a)->name, ((Entry *)b)->name);
}     

char *print_mode(char * path, mode_t mode) {
    char buf[12]; // Increased size to accommodate the type character
    const char chars[] = "rwxrwxrwx";

    // Determine the file type
    if (S_ISDIR(mode)) {
        buf[0] = 'd'; // Directory
    } else if (S_ISLNK(mode)) {
        buf[0] = 'l'; // Symbolic link
    } else if (S_ISCHR(mode)) {
        buf[0] = 'c'; // Character device
    } else if (S_ISBLK(mode)) {
        buf[0] = 'b'; // Block device
    } else if (S_ISFIFO(mode)) {
        buf[0] = 'p'; // FIFO
    } else if (S_ISSOCK(mode)) {
        buf[0] = 's'; // Socket
    } else {
        buf[0] = '-'; // Regular file
    }

    // MAC vs linux issue : for extended attributes
   //  ssize_t xattr_size = listxattr(path, NULL, 0);
    // if (xattr_size > 0) {
    //     buf[10] = '@'; // Indicate extended attributes
    // } else {
    //     buf[10] = ' '; // No extended attributes
    // }

    for (int i = 0; i < 9; i++) {
        buf[i + 1] = (mode & (1 << (8 - i))) ? chars[i] : '-';
    }

    buf[10] = ' '; 
    buf[11] = '\0'; // Null-terminate the string
    return strdup(buf);
}


void print(DIR * dp, char * path, int hide)
{
    struct dirent *entry;
    struct stat fileStat;
    Entry *entries = malloc(MAX_ENTRIES * sizeof(Entry)); // data strucutues used to store entries for sorintg
    int count = 0;
    char temp[MAX_SIZE]; 

    while ((entry = readdir(dp)) != NULL) {
        
        // Skip hidden files (starting with '.')
        if (entry->d_name[0] == '.' && hide == 0) {
            continue;
        }
        if (count >= MAX_ENTRIES) {
            fprintf(stderr, "Error: Too many entries. Increase MAX_ENTRIES.\n");
            break;
        }

        if (strlen(entry->d_name) >= MAX_SIZE) {
            fprintf(stderr, "Warning: Entry name too long: %s\n", entry->d_name);
            continue;
        }

        strncpy(entries[count].name, entry->d_name, MAX_SIZE - 1); // cpy the actual entry from dirent in entrees
        entries[count].name[MAX_SIZE - 1] = '\0';  // Ensure null-termination
        count++; // getting all the entries
    }

    qsort(entries, count, sizeof(Entry), compare_entries); // sort the entries

    for (int i = 0; i < count; i++) {
        snprintf(temp, sizeof(temp) + 1 , "%s/%s", path, entries[i].name);
        if (stat(temp, &fileStat) == -1) {

            perror("stat");
            continue;
        }
        //printf("Checking file: %s, mode: %o\n", entry->d_name, fileStat.st_mode); // Debug print
        if (S_ISDIR(fileStat.st_mode)) {
            show(entries[i].name, BLUE);
        } else if (S_ISREG(fileStat.st_mode)) {
            if (fileStat.st_mode & S_IXUSR) {
                show(entries[i].name, GREEN);
            } else {
                show(entries[i].name, 0);
            }
        } else {
            show(entries[i].name, RED);
        }
    }
   free(entries);
}

char *  format_modification_time(time_t mtime, char * buffer, int bufferSize) {
    struct tm *tm_info;

    // Convert time_t to struct tm
    tm_info = localtime(&mtime);

    // Format the time into a string
    // Format: Mon DD HH:MM
    strftime(buffer, bufferSize , "%b %d %H:%M", tm_info);

    // Print the formatted string
    return buffer;
}

void print_complete(DIR * dp, char * path, int hide)
{
    struct dirent *entry;
    struct stat fileStat;
    Entry *entries = malloc(MAX_ENTRIES * sizeof(Entry));
    int count = 0;
    char temp[MAX_SIZE]; 
    
    while ((entry = readdir(dp)) != NULL) 
    {
        
        // Skip hidden files (starting with '.')
        if (entry->d_name[0] == '.' && hide == 0) {
            continue;
        }
        if (count >= MAX_ENTRIES) {
            fprintf(stderr, "Error: Too many entries. Increase MAX_ENTRIES.\n");
            break;
        }

        if (strlen(entry->d_name) >= MAX_SIZE) {
            fprintf(stderr, "Warning: Entry name too long: %s\n", entry->d_name);
            continue;
        }
        strncpy(entries[count].name, entry->d_name, MAX_SIZE - 1);
        entries[count].name[MAX_SIZE - 1] = '\0';  // Ensure null-termination
        count++; // getting all the entries
    }

    qsort(entries, count, sizeof(Entry), compare_entries);
    int total_blocks = 0;
    for (int i = 0; i < count; i++) 
    {
        snprintf(temp, sizeof(temp) + 1, "%s/%s", path, entries[i].name);
        if (stat(temp, &fileStat) == -1) {
            perror("stat");
            continue;
        }
        //printf("Checking file: %s, mode: %o\n", entry->d_name, fileStat.st_mode); // Debug print
        char temp_to_print[MAX_SIZE] = "\0"; // string that we ultimately want to print
        char nlink[20];
        sprintf(nlink, "%lu", fileStat.st_nlink);
        uid_t uid = fileStat.st_uid; // user id
        gid_t gid = fileStat.st_gid; // groupid
        struct passwd *ownerName = getpwuid(uid);
        struct group *groupName = getgrgid(gid);
        char size[20];
        sprintf(size, "%ld", fileStat.st_size); // getting size
        char date[100];
        format_modification_time(fileStat.st_mtime, date, sizeof(date));
        
// abbreviated month, day-of-month file was last modified,
     //hour file last modified, minute file last modified, and the pathname
        snprintf(temp_to_print, MAX_SIZE + 1,
             "%-*s %-*s %-*s %-*s %-*s %-*s %-*s", 
            10, print_mode(path,fileStat.st_mode), 5, nlink, 15, ownerName->pw_name, 5 ,groupName->gr_name, 5,size, 20, date,  20, entries[i].name);    
        // value is between are for spacing
       
        if (S_ISDIR(fileStat.st_mode)) {
            show(temp_to_print, BLUE);
        } else if (S_ISREG(fileStat.st_mode)) {
            total_blocks += fileStat.st_blocks;
            if (fileStat.st_mode & S_IXUSR) {
                show(temp_to_print, GREEN);
            } else {
                show(temp_to_print, 0);
            }
        } else {
            show(temp_to_print, RED);
        }
    }
    printf("Total :%d\n", total_blocks);
   free(entries);
}

// Takes the path provided by all the other functions and executes it 
int reveal_generic(char * path)
{
    DIR *dp;
    dp = opendir(path);  // opening the directory
    if (dp == NULL) {

        perror("ERROR : ");
        return -1;
    }

    //call appropriate function based upon the flags
    if(hidden == 1 && completed == 1)
        print_complete(dp, path, 1); // 1 here is for hidden , print_complete() means the l flag is invoked
    else if(hidden == 1)
        print(dp, path, 1);
    else if(completed == 1)
        print_complete(dp, path, 0); 
    else{
        print(dp, path, 0);
    } 
    closedir(dp);
    return 0;
}

int reveal_parameter(char ** str, int i)
{
    if(str[i][0] == '/')
    {
        return reveal_generic(str[i]);
    }
    else 
    {
        char temp[MAX_SIZE] = "\0";
        strcat(temp, current_working_directory);
        strcat(temp, "/");
        strcat(temp, str[i]);
        return reveal_generic(temp);
    }
}

int flag_handler(char ** str, int index)
{
    int i = index;
    while (str[i] != NULL)
    {
        if(str[i][0] == '-')
        {
            // so we have encountered a flag
            if(strlen(str[i]) == 1 ) // so it was a - symbol and at the last
            {
                if(str[i + 1 ] == NULL)
                {
                    check_prev = 1;
                    break;
                }
                else {
                    other = 1; 
                    break;
                }
            }
            
            for (int j = 1; j < strlen(str[i]); j++)
            {
                if(str[i][j] == 'a')
                    hidden = 1;
                else if(str[i][j] =='l')
                    completed = 1;
                else other = 1;
            }
            i++;
        }
        else break;
    }
    return i;
}
int reveal_handler(char ** str, int index){
    
    int i = index;
    hidden = 0;
    completed = 0; 
    other = 0; 
    i = flag_handler(str, i);

    if(other == 1)
    {
        printf("reveal : invalid option \n");
        return -1;
    }
    else if(check_prev == 1)
    {
        reveal_generic(prev_directory);
        check_prev = 0;
    }
    else if(str[i] == NULL) // reveal 
    {
        reveal_generic(current_working_directory);
        return 0;
    }
    else if(str[i + 1] == NULL)
    {
        // so we are just expecting one more parameter
        if(strcmp(str[i], "~") == 0)  // just plain reveal ~ command
        {
            reveal_generic(home_directory);
            return 0;
        }
       else if(str[i][0] == '~')
        {
            char cwd[MAX_SIZE];
            getcwd(cwd, sizeof(cwd)); 
            char temp[MAX_SIZE] = "\0";
            strcat(temp, cwd);
            strcat(temp, str[i] + 1);
            reveal_generic(temp);
        }
        else if(strcmp(str[i], "-") == 0) // reveal - 
        {
            reveal_generic(prev_directory);
            return 0;
        }
        else {
            reveal_parameter(str, i);
            return i + 1; // the path will have no spaces : assumption
        }
    }
    else
    {
        printf("Arguement not correctly passed\n");
        return -1;
    }
}