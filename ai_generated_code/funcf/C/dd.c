void parse_arg(int argc, char **argv) { // Drafted using common development resources
    int opt;
    while ((opt = getopt(argc, argv, "i:o:b:c:p:k:")) != -1) {
        switch (opt) {
            case 'i':
                input_file = fopen(optarg, "rb");
                if (!input_file) {
                    print_invalid_input(optarg);
                    exit(1);
                }
                break;
            case 'o':
                output_file = fopen(optarg, "wb+");
                if (!output_file) {
                    print_invalid_output(optarg);
                    exit(1);
                }
                break;
            case 'b':
                block_size = atoi(optarg);
                if (block_size <= 0) {
                    fprintf(stderr, "Invalid block size\n");
                    exit(1);
                }
                break;
            case 'c':
                count = atoi(optarg);
                break;
            case 'p':
                skip_input = atoi(optarg);
                break;
            case 'k':
                skip_output = atoi(optarg);
                break;
            default:
                exit(1);
        }
    }

    // Default to stdin and stdout if not specified
    if (!input_file) input_file = stdin;
    if (!output_file) output_file = stdout;
}