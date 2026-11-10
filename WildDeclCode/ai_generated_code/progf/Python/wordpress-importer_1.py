#!/usr/bin/env python3
# AI-generated code note: this code was basically entirely Supported via standard programming aids and Claude Sonnet 3.7
# V4 - Updated to extract published and last modified dates

import uuid
import os
import re
import html
import datetime
import xml.etree.ElementTree as ET
import hashlib
import requests
from urllib.parse import urlparse
import base64
import json
from html2text import html2text
import nbformat
from nbformat import v4 as nbf
import argparse
import urllib

def create_name(text):
    """
    Create a safe name for the notebook based on the text.
    """
    name = text.lower().replace(" ", "-")
    return re.sub(r"[^a-z0-9-]", "", name).lower()

def transform_latex(text):
    """
    Transform LaTeX tags:
      - [latex display="true"]...[/latex] -> newline, $$...$$, newline
      - [latex]...[/latex] -> inline $...$
    """
    # Transform display mode
    text = re.sub(
        r'\[latex\s+display="?true"?\](.*?)\[/latex\]',
        r"\n$$\1$$\n",
        text,
        flags=re.DOTALL,
    )
    # Transform inline mode
    text = re.sub(r"\[latex\](.*?)\[/latex\]", r"$\1$", text, flags=re.DOTALL)
    # Transform other tags (e.g. [java] ... [/java]) into code blocks
    pattern = re.compile(r'\[([a-zA-Z0-9]+)\](.*?)\[/\1\]', flags=re.DOTALL)
    def repl(match):
        lang = match.group(1)
        code = match.group(2).strip()  # Remove extra whitespace
        return f'```{lang}\n{code}\n```'
    text = pattern.sub(repl, text)
    return text


def replace_image_urls_with_attachments(markdown):
    """
    Find image markdown patterns, download the images, embed them as attachments,
    and replace the URLs with Jupyter attachment links.
    """
    attachments = {}
    def repl(match):
        alt_text = match.group(1)
        url = match.group(2)
        try:
            # Example: skip Wikimedia images
            if 'upload.wikimedia.org' in url:
                raise Exception('Skipping Wikimedia image')
            print(f"Downloading image: {url}")
            response = requests.get(url, verify=False)
            if response.status_code != 200:
                print(f"Failed to download image: {url}")
                return match.group(0)
            content = response.content
            hash_hex = hashlib.sha256(content).hexdigest()
            parsed = urlparse(url)
            ext = os.path.splitext(parsed.path)[1] or ".jpg"
            filename = f"{hash_hex}{ext}"
            b64_content = base64.b64encode(content).decode("utf-8")
            mime_type = "image/png" if ext.lower() == ".png" else "image/jpeg"
            attachments[filename] = {mime_type: b64_content}
            return f"![{alt_text}](attachment:{filename})"
        except Exception as e:
            print(f"Error downloading image {url}: {e}")
            return match.group(0)
    new_markdown = re.sub(r"!\[([^\]]*)\]\((.*?)\)", repl, markdown)
    return new_markdown, attachments


def split_markdown_summary(markdown):
    """
    Split markdown into a summary (first up-to-3 non-empty lines) and the remainder.
    """
    lines = markdown.splitlines()
    summary_lines = []
    detail_lines = []
    count = 0
    for line in lines:
        if line.strip() and count < 3:
            summary_lines.append(line)
            count += 1
        else:
            detail_lines.append(line)
    summary = "\n".join(summary_lines)
    detail = "\n".join(detail_lines)
    return summary, detail


def extract_first_heading(markdown):
    """
    Extract the first markdown heading (e.g. '# Heading') and remove it from the content.
    Returns a tuple (subtitle, updated_markdown). If no heading is found, returns (None, markdown).
    """
    pattern = r"^\s*(#{1,6})\s+(.*?)\s*$"
    match = re.search(pattern, markdown, flags=re.MULTILINE)
    if match:
        heading_text = match.group(2).strip()
        updated_markdown = re.sub(pattern, "", markdown, count=1, flags=re.MULTILINE)
        return heading_text, updated_markdown.strip()
    else:
        return None, markdown


def create_notebook(json_frontmatter, summary, detail, attachments, notebook_path):
    """
    Create a Jupyter notebook with three cells:
      1. A raw cell with JSON frontmatter
      2. A markdown cell that duplicates the JSON frontmatter then the summary
      3. A markdown cell with the detail (which here is summary + newline + detail)
    """
    nb = nbf.new_notebook()
    
    # Cell 1: Raw cell with JSON frontmatter
    raw_cell = nbf.new_raw_cell(json_frontmatter)
    raw_cell["format"] = "json"
    nb.cells.append(raw_cell)
    
    # Cell 2: Markdown cell with the summary (you can duplicate the frontmatter if desired)
    summary_cell = nbf.new_markdown_cell(summary)
    summary_cell["attachments"] = attachments.copy() if attachments else {}
    nb.cells.append(summary_cell)
    
    # Cell 3: Markdown cell with the remaining detail (here we combine summary and detail)
    detail_cell = nbf.new_markdown_cell(summary + "\n" + detail)
    detail_cell["attachments"] = attachments.copy() if attachments else {}
    nb.cells.append(detail_cell)
    
    with open(notebook_path, "w", encoding="utf-8") as f:
        nbformat.write(nb, f)
    print(f"Created notebook: {notebook_path}")


def extract_post_metadata(item, namespaces):
    """
    Extract basic metadata from a WordPress XML item, including published and modified dates.
    """
    metadata = {}
    metadata["post_type"] = item.find(".//{{{0}}}post_type".format(namespaces["wp"])).text
    metadata["title"] = item.find("title").text or "Untitled"
    metadata["post_date"] = item.find(".//{{{0}}}post_date".format(namespaces["wp"])).text
    metadata["post_name"] = item.find(".//{{{0}}}post_name".format(namespaces["wp"])).text
    metadata["status"] = item.find(".//{{{0}}}status".format(namespaces["wp"])).text
    # Check for post_modified; if missing, fall back to post_date.
    modified_elem = item.find(".//{{{0}}}post_modified".format(namespaces["wp"]))
    metadata["post_modified"] = modified_elem.text if modified_elem is not None else metadata["post_date"]
    creator_elem = item.find(".//{{{0}}}creator".format(namespaces["dc"]))
    metadata["author"] = creator_elem.text if creator_elem is not None else ""
    return metadata

def extract_categories_tags(item):
    """
    Extract categories and tags from a WordPress XML item.
    """
    categories = []
    tags = []
    for cat in item.findall("category"):
        domain = cat.get("domain")
        cat_name = cat.text
        if domain == "category":
            categories.append(cat_name)
        elif domain == "post_tag":
            tags.append(cat_name)
    return categories, tags


def convert_post_content(item, namespaces):
    """
    Convert the post content from HTML to Markdown, transform LaTeX,
    and embed images as attachments.
    """
    content_elem = item.find(".//{{{0}}}encoded".format(namespaces["content"]))
    content = content_elem.text if content_elem is not None else ""
    if content:
        content = html.unescape(content)
        markdown_content = html2text(content)
    else:
        markdown_content = ""
    markdown_content = transform_latex(markdown_content)
    markdown_content, attachments = replace_image_urls_with_attachments(markdown_content)
    return markdown_content, attachments


def create_json_frontmatter(root, metadata, categories, tags, published_date, modified_date, subtitle):
    """
    Create JSON frontmatter in the PageInfo format.
    
    PageInfo type:
      root: string (default provided by the user)
      name: string (from post_name)
      page: number (default 1 or updated per page)
      title: string (from title)
      subtitle: string (from first heading if available, otherwise title)
      isPublished: boolean (true if status is 'publish')
      author: string (from dc:creator)
      lastModifiedOn: string (formatted modified date)
      publishedOn: string (formatted published date)
      [entry: string]: unknown  (additional metadata e.g. categories, tags)
    """

    def find_first(items):
        for item in items:
            if item:
                return item
        return uuid.uuid4().hex

    info = {
        "root": root,
        'name': create_name(find_first([
            metadata['post_name'],
            metadata['title'],
            create_name(published_date + '-untitled')
        ])),
        "page": metadata.get("page", 1),
        "title": metadata["title"],
        "subtitle": subtitle if subtitle is not None else metadata["title"],
        "isPublished": True if metadata["status"].lower() == "publish" else False,
        "author": metadata.get("author", ""),
        "lastModifiedOn": modified_date,
        "publishedOn": published_date,
    }
    if categories:
        info["categories"] = categories
    if tags:
        info["tags"] = tags
    return json.dumps(info, indent=2)


def generate_notebook_filename(metadata, post_date_obj, output_dir):
    """
    Generate a safe filename for the notebook based on the post date and name.
    If pagination is used, include the page number in the filename.
    """
    filename_base = f"{post_date_obj.strftime('%Y-%m-%d')}-{metadata['post_name']}"
    filename_base = re.sub(r"[^\w\-\.]", "_", filename_base)
    notebook_filename = filename_base + ".ipynb"
    notebook_path = os.path.join(
        output_dir, metadata["post_type"] + "s", notebook_filename
    )
    os.makedirs(os.path.dirname(notebook_path), exist_ok=True)
    return notebook_path


def process_item(item, namespaces, output_dir, root):
    """
    Process a single WordPress XML item:
      - Extract metadata and taxonomies.
      - Convert content to Markdown (with LaTeX transformations and embedded images).
      - Support pagination by splitting content on <!--nextpage-->.
      - For each page:
           * Extract the first heading as the subtitle and remove it from the content.
           * Split the content into a summary (first 3 lines) and detail.
           * Create JSON frontmatter (duplicated in the second cell) and generate a Jupyter notebook.
    """
    metadata = extract_post_metadata(item, namespaces)
    if metadata["post_type"] not in ["post", "page"]:
        return

    # Parse published and modified dates
    published_date_obj = datetime.datetime.strptime(metadata["post_date"], "%Y-%m-%d %H:%M:%S")
    published_date_str = published_date_obj.isoformat()
    try:
        modified_date_obj = datetime.datetime.strptime(metadata["post_modified"], "%Y-%m-%d %H:%M:%S")
    except Exception:
        modified_date_obj = published_date_obj
    modified_date_str = modified_date_obj.isoformat()

    categories, tags = extract_categories_tags(item)
    full_markdown, attachments = convert_post_content(item, namespaces)
    # Split content on the pagination marker
    pages = full_markdown.split("<!--nextpage-->")
    if not pages:
        pages = [full_markdown]

    for i, page_content in enumerate(pages, start=1):
        # Update metadata for this page
        page_metadata = dict(metadata)
        page_metadata["page"] = i
        if i > 1:
            page_metadata["post_name"] = f"{metadata['post_name']}-page{i if i else ''}"

        # Extract first heading as subtitle and remove it from content
        subtitle, page_content = extract_first_heading(page_content)
        if not subtitle:
            subtitle = metadata["title"]

        summary, detail = split_markdown_summary(page_content)
        json_frontmatter = create_json_frontmatter(
            root, page_metadata, categories, tags, published_date_str, modified_date_str, subtitle
        )
        notebook_path = generate_notebook_filename(page_metadata, published_date_obj, output_dir)
        create_notebook(json_frontmatter, summary, detail, attachments, notebook_path)
        print(f"Processed: {metadata['title']} (page {i}) -> {notebook_path}")


def wp_export_to_markdown(xml_file, output_dir="./output", rootName="imported"):
    """
    Convert a WordPress export XML to Jupyter notebooks.
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    namespaces = {
        "content": "http://purl.org/rss/1.0/modules/content/",
        "wp": "http://wordpress.org/export/1.2/",
        "excerpt": "http://wordpress.org/export/1.2/excerpt/",
        "dc": "http://purl.org/dc/elements/1.1/",
    }

    tree = ET.parse(xml_file)
    root_xml = tree.getroot()
    channel = root_xml.find("channel")
    for item in channel.findall("item"):
        process_item(item, namespaces, output_dir, rootName)


def main():
    parser = argparse.ArgumentParser(
        description="Convert a WordPress export to Jupyter notebooks using a specified root."
    )
    parser.add_argument("url", help="URL (or local path) of the WordPress export XML file")
    parser.add_argument("--output", help="Output directory for the notebooks", default="./notebooks/imported")
    parser.add_argument(
        "--root",
        default="imported",
        help="Root path to use for the articles (default: 'imported')",
    )

    args = parser.parse_args()

    print("WordPress Export URL:", args.url)
    print("Article Root:", args.root)

    wp_export_to_markdown(args.url, output_dir=args.output, rootName=args.root)


if __name__ == "__main__":
    main()

