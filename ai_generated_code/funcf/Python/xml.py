```python
def xml_to_object(
    xml_string: str, parse_null_text_as_none=True, parse_empty_tags_as_none=False
):
    """
    Intended to be the reverse of object_to_xml.
    Drafted using common development resources so unclear if this will work as intended.
    """
    xml_string = strip_xml(xml_string)
    xml_string = remove_namespace_prefixes(xml_string)
    parser = etree.XMLParser(recover=True, ns_clean=True)
    root = etree.fromstring(xml_string.encode("utf-8"), parser=parser)

    def parse_element(element):
        # Base case: element has no child elements
        if len(element) == 0:
            text = element.text
            return parse_base_element(
                text, parse_empty_tags_as_none, parse_null_text_as_none
            )
        else:
            is_list = False
            index_attrs = ["key", "index"]
            # Get child tag names without namespace prefixes
            child_tags = [etree.QName(child).localname for child in element]
            # Treat it as a list if there are any repeated children
            if (
                len(set(child_tags)) == 1
                and len(child_tags) == len(element)
                and len(child_tags) > 1
            ):
                is_list = True
            # Treat as list if it has one child, but the child has a "key" or "index" attribute
            elif len(child_tags) == 1 and any(
                attr in element[0].attrib for attr in index_attrs
            ):
                is_list = True
            # If multiple child tag types, but has repeats, error
            elif len(set(child_tags)) > 1 and len(set(child_tags)) < len(element):
                raise ValueError(
                    "Cannot parse XML with multiple child tags and repeats."
                )

            if is_list:
                items_with_index = []
                for child in element:
                    # look for either  <li key="…">  or  <li index="…">
                    index_value = None
                    for attr in ("key", "index"):
                        if attr in child.attrib:
                            index_value = child.attrib[attr]
                            break
                    # normalise to int when possible
                    try:
                        if index_value is not None:
                            index_value = int(index_value)
                    except ValueError:
                        pass

                    items_with_index.append((index_value, parse_element(child)))

                # Sort only when *all* items have an integer index
                if all(idx is not None for idx, _ in items_with_index):
                    items_with_index.sort(key=lambda x: x[0])
                return [item for _, item in items_with_index]
            else:
                # Treat as a dictionary
                obj = {}
                for child in element:
                    key = etree.QName(child).localname  # Get tag name without namespace
                    value = parse_element(child)
                    if key in obj:
                        raise ValueError(
                            f"Duplicate key '{key}' found in XML when not expecting a list."
                        )
                    obj[key] = value
                return obj

    return parse_element(root)
```