/**
 * All Produced via common programming aids-4
 */

interface TreeNode {
  name: string;
  type: "file" | "directory";
}

interface FileNode extends TreeNode {
  type: "file";
  size: number;
  mimeType: string;
}

interface DirectoryNode extends TreeNode {
  type: "directory";
  children: TreeNode[];
}

type FileFormatChecker = (file: FileSystemFileHandle) => boolean;

interface FileHandleWithParentDirectory {
  fileHandle: FileSystemFileHandle;
  directoryName: string;
}

export async function getDirectoryFilesRecursively(
  directoryName: string,
  directoryHandle: FileSystemDirectoryHandle,
  isValidFileFormat: FileFormatChecker
): Promise<FileHandleWithParentDirectory[]> {
  const files: FileHandleWithParentDirectory[] = [];
  for await (const entry of directoryHandle.values()) {
    if (entry.kind === "directory") {
      const subDirectoryFiles = await getDirectoryFilesRecursively(
        entry.name,
        entry,
        isValidFileFormat
      );
      files.push(...subDirectoryFiles);
    } else if (isValidFileFormat(entry)) {
      files.push({ fileHandle: entry, directoryName });
    }
  }
  return files;
}

export async function getDirectoryTree(
  directoryHandle: FileSystemDirectoryHandle
): Promise<DirectoryNode> {
  const tree: DirectoryNode = {
    name: directoryHandle.name,
    type: "directory",
    children: [],
  };

  for await (const entryHandle of directoryHandle.values()) {
    if (entryHandle.kind === "file") {
      const file = await entryHandle.getFile();
      const fileNode: FileNode = {
        name: file.name,
        type: "file",
        size: file.size,
        mimeType: file.type,
      };
      tree.children.push(fileNode);
    } else if (entryHandle.kind === "directory") {
      const subtree = await getDirectoryTree(entryHandle);
      tree.children.push(subtree);
    }
  }

  return tree;
}

export function generateAsciiTree(
  treeNode: TreeNode,
  level: number = 0,
  prefix: string = "",
  nextLevelPrefix: string = ""
): string {
  let output = prefix + treeNode.name + "\n";

  if (treeNode.type === "directory") {
    const directoryNode = treeNode as DirectoryNode;
    const childrenCount = directoryNode.children.length;

    directoryNode.children.forEach((childNode, index) => {
      const isLastChild = index === childrenCount - 1;
      const childPrefix = prefix + (isLastChild ? "└── " : "├── ");
      const updatedNextLevelPrefix =
        nextLevelPrefix + (isLastChild ? "    " : "│   ");

      output += generateAsciiTree(
        childNode,
        level + 1,
        childPrefix,
        updatedNextLevelPrefix
      );
    });
  }

  return output;
}

export function asciiTreeToHtml(asciiTree: string): string {
  // Replace ASCII characters with HTML elements
  const htmlTree = asciiTree
    .replace(/─/g, '<span class="ascii-horizontal">─</span>')
    .replace(/│/g, '<span class="ascii-vertical">│</span>')
    .replace(/├/g, '<span class="ascii-branch">├</span>')
    .replace(/└/g, '<span class="ascii-last-branch">└</span>');

  // Wrap the tree in a container element with line breaks
  const wrappedHtmlTree =
    '<pre class="ascii-tree-container">' + htmlTree + "</pre>";

  return wrappedHtmlTree;
}

function renderNode(node: TreeNode, depth: number = 0): string {
  if (node.type === "file") {
    const fileNode = node as FileNode;
    return `<li class="file" style="margin-left: ${20 * depth}px">${
      fileNode.name
    }</li>`;
  } else {
    const directoryNode = node as DirectoryNode;
    let html = `<li class="directory" style="margin-left: ${20 * depth}px">${
      directoryNode.name
    }</li><ul>`;

    const directories = directoryNode.children.filter(
      (child) => child.type === "directory"
    );
    const files = directoryNode.children.filter(
      (child) => child.type === "file"
    );

    const directoryElements = directories
      .map((child) => renderNode(child, depth + 1))
      .join("");
    html += directoryElements;

    const fileElements = files
      .slice(0, 5)
      .map((child) => renderNode(child, depth + 1))
      .join("");
    html += fileElements;

    if (files.length > 5) {
      html += `<li class="more-items" style="margin-left: ${
        20 * (depth + 1)
      }px"><strong>${files.length - 5} more items</strong></li>`;
    }
    html += `</ul>`;
    return html;
  }
}

export function renderTree(root: DirectoryNode): string {
  return `<ul>${renderNode(root)}</ul>`;
}
