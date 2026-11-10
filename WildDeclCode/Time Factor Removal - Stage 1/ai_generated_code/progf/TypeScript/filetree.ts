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

type FileFormatChecker = function (file: FileSystemFileHandle) { return boolean; };

interface FileHandleWithParentDirectory {
  fileHandle: FileSystemFileHandle;
  directoryName: string;
}

export async function getDirectoryFilesRecursively(
  directoryName: string,
  directoryHandle: FileSystemDirectoryHandle,
  isValidFileFormat: FileFormatChecker
): Promise<FileHandleWithParentDirectory[]> {
  var files: FileHandleWithParentDirectory[] = [];
  for await (var entry of directoryHandle.values()) {
    if (entry.kind === "directory") {
      var subDirectoryFiles = await getDirectoryFilesRecursively(
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
  var tree: DirectoryNode = {
    name: directoryHandle.name,
    type: "directory",
    children: [],
  };

  for await (var entryHandle of directoryHandle.values()) {
    if (entryHandle.kind === "file") {
      var file = await entryHandle.getFile();
      var fileNode: FileNode = {
        name: file.name,
        type: "file",
        size: file.size,
        mimeType: file.type,
      };
      tree.children.push(fileNode);
    } else if (entryHandle.kind === "directory") {
      var subtree = await getDirectoryTree(entryHandle);
      tree.children.push(subtree);
    }
  }

  return tree;
}

function generateAsciiTree(
  treeNode: TreeNode,
  level: number = 0,
  prefix: string = "",
  nextLevelPrefix: string = ""
): string {
  var output = prefix + treeNode.name + "\n";

  if (treeNode.type === "directory") {
    var directoryNode = treeNode as DirectoryNode;
    var childrenCount = directoryNode.children.length;

    directoryNode.children.forEach(function (childNode, index) {
      var isLastChild = index === childrenCount - 1;
      var childPrefix = prefix + (isLastChild ? "└── " : "├── ");
      var updatedNextLevelPrefix =
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

function asciiTreeToHtml(asciiTree: string): string {
  // Replace ASCII characters with HTML elements
  var htmlTree = asciiTree
    .replace(/─/g, '<span class="ascii-horizontal">─</span>')
    .replace(/│/g, '<span class="ascii-vertical">│</span>')
    .replace(/├/g, '<span class="ascii-branch">├</span>')
    .replace(/└/g, '<span class="ascii-last-branch">└</span>');

  // Wrap the tree in a container element with line breaks
  var wrappedHtmlTree =
    '<pre class="ascii-tree-container">' + htmlTree + "</pre>";

  return wrappedHtmlTree;
}

function renderNode(node: TreeNode, depth: number = 0): string {
  if (node.type === "file") {
    var fileNode = node as FileNode;
    return '<li class="file" style="margin-left: ' + (20 * depth) + 'px">' + (
      fileNode.name
    ) + "</li>";
  } else {
    var directoryNode = node as DirectoryNode;
    var html = '<li class="directory" style="margin-left: ' + (20 * depth) + 'px">' + (
      directoryNode.name
    ) + "</li><ul>";

    var directories = directoryNode.children.filter(
      function (child) { return child.type === "directory"; });
    var files = directoryNode.children.filter(
      function (child) { return child.type === "file"; });

    var directoryElements = directories
      .map(function (child) { return renderNode(child, depth + 1); })
      .join("");
    html += directoryElements;

    var fileElements = files
      .slice(0, 5)
      .map(function (child) { return renderNode(child, depth + 1); })
      .join("");
    html += fileElements;

    if (files.length > 5) {
      html += '<li class="more-items" style="margin-left: ' + (
        20 * (depth + 1)
      ) + 'px"><strong>' + (files.length - 5) + " more items</strong></li>";
    }
    html += "</ul>";
    return html;
  }
}

function renderTree(root: DirectoryNode): string {
  return "<ul>" + (renderNode(root)) + "</ul>";
}
