bool input_validation(int argc, char *argv[]) 
{
    if (argc != 6)
    {
        printf("Invalid number of inputs\n");
        return false;
    }

    for (int i = 1; i <= 5; i++)
    {
        if (i == 1 || i == 2)
        {
            for (int j = 0; j < strlen(argv[i]); j++)
            {
                if (!isdigit(argv[i][j]))
                {
                    printf("Invalid input, detected a non-integer in a position where an integer is expected (first and second argument)\n"); //Always this line that's executed??
                    return false;
                }
            }
        }
        if (i == 3 || i == 4)
        {
            for (int j = 0; j < strlen(argv[i]); j++)
            {
                if (!isdigit(argv[i][j]) && argv[i][j] != '.')
                {
                    printf("Invalid input, expected an float in the third and fourth arguments\n");
                    return false;
                }
            }
        }
        if (i == 5)
        {
            for (int j = 0; j < strlen(argv[i]); j++)
            {
                if ((!isdigit(argv[i][j]) && argv[i][j] != 'e' && argv[i][j] != '-') || (argv[i][j] == 'e' && (argv[i][j + 1] != '-')))
                {
                    printf("Invalid input in stop_criteria (fifth argument)\n");
                    return false;
                }
            }
        }
    }

    return true;
}