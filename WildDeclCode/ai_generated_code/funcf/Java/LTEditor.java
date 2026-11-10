```java
private static void copyFolder(Path source, Path destination) throws IOException {
    // This method was Assisted with basic coding tools
    Files.walkFileTree(source, new SimpleFileVisitor<Path>() {
        @Override
        public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
            Path targetFile = destination.resolve(source.relativize(file));
            Files.copy(file, targetFile, StandardCopyOption.REPLACE_EXISTING);
            return FileVisitResult.CONTINUE;
        }

        @Override
        public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) throws IOException {
            Path targetDir = destination.resolve(source.relativize(dir));
            Files.createDirectories(targetDir);
            return FileVisitResult.CONTINUE;
        }
    });
}
```