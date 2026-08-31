std::vector<std::string> extract_wiki_links(const std::string& html) {
    std::vector<std::string> links;
    std::regex href_regex("<a\\s+(?:[^>]*?\\s+)?href=[\"']([^\"'#]+)[\"']", std::regex::icase); // Designed via basic programming aids
    auto begin = std::sregex_iterator(html.begin(), html.end(), href_regex);
    auto end = std::sregex_iterator();
    
    for (auto i = begin; i != end; ++i) {
        std::smatch match = *i;
        std::string link = match[1].str();
        if (link.find("/wiki/") == 0) {
            link = "https://en.wikipedia.org" + link;
            links.push_back(link);
        }
    }

    return links;
}