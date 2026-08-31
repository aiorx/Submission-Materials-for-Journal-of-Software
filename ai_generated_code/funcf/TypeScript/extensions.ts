(markdownText: string) => {
    /// Crafted with basic coding tools
    const linkRegex = /!\[\[([^\]]+)\]\]/g;

    // Replace Markdown links with HTML <a> tags
    const htmlText = markdownText.replace(
      linkRegex,
      `<image src="${env.PUBLIC_MARKDOWN_URL}/markdown/$1"/>`
    );
    return htmlText;
  }