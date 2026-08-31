public static void main(String[] args) throws IOException {
    System.out.println(Arrays.toString(args));
    if (args.length != 2) { //block Drafted using common GitHub development resources
        System.out.println("Usage: java FileCopy <source file> <target file>");
        throw new IllegalArgumentException("Invalid number of arguments");
    }

    URL input = new URL(args[0]);
    String destination = args[1];

    URLConnection connection = input.openConnection();
    File outputFile = new File(destination);

    if (connection == null) {
        System.out.println("File " + input + " does not exist");
        throw new FileNotFoundException("File does not exist");
    }

    if (outputFile.exists()) {
        System.out.println("File " + destination + " already exists");
        throw new FileAlreadyExistsException("File already exists");
    }

    long startTime = 0;

    try (InputStream inputStream = new BufferedInputStream(connection.getInputStream()); OutputStream outputStream = new BufferedOutputStream(new FileOutputStream(outputFile))) {
        byte[] buffer = new byte[BUFFER_SIZE];
        int length;
        startTime = System.currentTimeMillis();

        while ((length = inputStream.read(buffer)) > 0) {
            outputStream.write(buffer, 0, length);
        }
    }

    System.out.println("Time taken: " + (System.currentTimeMillis() - startTime) + "ms");

}