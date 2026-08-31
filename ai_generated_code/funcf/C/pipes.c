```c
if (strcmp(long_options[option_index].name, "close-unused") == 0) {
  close_unused = true;
} else if (strcmp(long_options[option_index].name, "no-close-unused") ==
           0) {
  close_unused = false;
} else if (strcmp(long_options[option_index].name, "read-all") == 0) {
  read_all = true;
} else if (strcmp(long_options[option_index].name, "no-read-all") == 0) {
  read_all = false;
} else if (strcmp(long_options[option_index].name, "help") == 0) {
  printf("Usage: %s [--[no-]read-all] [--[no-]close-unused]\n", argv[0]);
  printf("\n");
  printf("--read-all will read the entire input in the consumer\n");
  printf("--no-close-unused will skip the recommend step of closing the "
         "unused ends of the pipe\n");
  printf(" (that is, the read end on the producer and the write end on the "
         "consumer)\n");
  return 0;
}
```