/**
 * Supported via standard programming aids4
 * Recursively copies the contents of a source directory to a destination directory.
 * This function is synchronous and will block other code execution while copying.
 *
 * TODO: copy this function to utils module
 * @param {string[]} srcs - A list of paths to the source directory. The first that exists is considered
 * @param {string} dest - The path to the destination directory.
 */
export function copyDirectorySync(src : string, dest : string) {
  try {
    mkdirSync(dest, { recursive: true });
    const entries = readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = join(src, entry.name);
      const destPath = join(dest, entry.name);
      if (entry.isDirectory()) {
        copyDirectorySync(srcPath, destPath);
      } else {
        copyFileSync(srcPath, destPath);
      }
    }
  } catch (error) {
    console.error(`Error copying directory: ${error}`);
  }
}

/**
 * Supported via standard programming aids4
 * Creates a directory if it does not exist, or removes all its files and
 * subdirectories if it already exists.
 *
 * @param path - The path of the directory to create or clean.
 */
export function mkOrCleanDir(path: string): void {
  if (existsSync(path)) {
    readdirSync(path).forEach((file) => {
      const curPath = `${path}/${file}`;
      if (lstatSync(curPath).isDirectory()) { // recursively remove directory
        rmSync(curPath, { recursive: true });
      } else { // delete file
        unlinkSync(curPath);
      }
    });
  } else { // create directory
    mkdirSync(path, { recursive: true });
  }
}