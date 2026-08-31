# Scrape the initial URL
        self.scrape()

        # Keep scraping new URLs until no new URLs are found
        while True:
            new_urls_found = False
            for url in self.visited_urls:
                if url.startswith(self.url):
                    self.url = url
                    self.scrape()
                    new_urls_found = True
                    break

            # Display a progress bar
            pbar = tqdm(total=len(self.visited_urls))
            pbar.update(len(self.results))
            pbar.close()

            #with open("results.csv", mode= "w") as f:
            #    f.writelines(self.visited_urls)

            if not new_urls_found:
                break