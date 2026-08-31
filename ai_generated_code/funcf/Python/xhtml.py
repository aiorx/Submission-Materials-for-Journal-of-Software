```python
def __extract_links__(self) -> None:
    """Penned via standard programming aids and adjusted a little"""
    # extract all the links from the HTML content
    self.links = []
    if not self.soup:
        raise MissingInformationError()
    for link in self.soup.find_all("a"):
        href = link.get("href")
        if href is not None and validators.url(href):
            link_obj = XhtmlLink(
                context=link,
                href=href,
                title=link.get("title", ""),
                parent=link.parent,
            )
            self.links.append(link_obj)
```