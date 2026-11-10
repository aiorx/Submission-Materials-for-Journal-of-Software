"""This code was partly Aided using common development resources using the following prompt:
please write me some code in python that can fetch asynchronously a reference_id from the following endpoint based on a list like this ids=["id1", "id2"]:
http://18.217.22.248/v2/statistics/reference/{reference_id}
"""
import asyncio
from typing import Any, Dict, List, Optional, Set
from urllib.parse import quote

import aiohttp
import requests

from src.models.api.job.article_job import ArticleJob
from src.models.base import WariBaseModel
from src.models.exceptions import MissingInformationError


class AllHandler(WariBaseModel):
    compilation = None
    data = None
    # We use a set to avoid duplicates
    dois = None
    doi_details = None
    pass
    references = None
    url_details = None
    error = False
    extract_dois_done = False
    reference_ids = None

    @property
    def number_of_references(self) :
        if self.data and "references" in self.data:
            return len(self.data["references"])
        else:
            return 0

    @property
    def number_of_dois(self) :
        self.__extract_dois__()
        if self.dois:
            return len(self.dois)
        else:
            return 0

    @staticmethod
    async def fetch_data(session, url):
        async with session.get(url) as response:
            return await response.json()

    async def get_reference_details(self, ids):
        async with aiohttp.ClientSession() as session:
            tasks = []
            for reference_id in ids:
                url = "http://18.217.22.248/v2/statistics/reference/{}".format(reference_id)
                tasks.append(asyncio.ensure_future(self.fetch_data(session, url)))

            results = await asyncio.gather(*tasks)
            return results

    @staticmethod
    def __quote__(string):
        """Return a urlencoded string with no safe characters"""
        return quote(string, safe="")

    async def check_urls(self, urls):
        async with aiohttp.ClientSession() as session:
            tasks = []
            for url in urls:
                url = "http://18.217.22.248/v2/check-url?url={}".format(self.__quote__(url))
                tasks.append(asyncio.ensure_future(self.fetch_data(session, url)))

            results = await asyncio.gather(*tasks)
            return results

    async def check_dois(self, dois):
        async with aiohttp.ClientSession() as session:
            tasks = []
            for doi in dois:
                url = "http://18.217.22.248/v2/check-doi?doi={}".format(self.__quote__(doi))
                tasks.append(asyncio.ensure_future(self.fetch_data(session, url)))

            results = await asyncio.gather(*tasks)
            return results

    def fetch_and_compile(self):
        from src import app

        if not self.job:
            raise MissingInformationError()
        self.__fetch_article__()
        self.__fetch_references__()
        self.__extract_dois__()
        app.logger.info("Found {} DOIs".format(self.number_of_dois))
        self.__fetch_url_details__()
        self.__fetch_doi_details__()
        self.__compile_everything__()

    def __fetch_references__(self):
        from src import app

        # Only proceed if no error and it has references and we have not fetched already
        if not self.error and not self.references and self.number_of_references:
            self.__extract_reference_ids__()
            app.logger.debug("__fetch_references__: running")
            # this code from chatgpt does not work via flask
            # loop = asyncio.get_event_loop()
            # solution from https://techoverflow.net/2020/10/01/how-to-fix-python-asyncio-runtimeerror-there-is-no-current-event-loop-in-thread/
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            self.references = loop.run_until_complete(
                self.get_reference_details(self.reference_ids)
            )

    def __fetch_url_details__(self):
        from src import app

        if not self.error:
            app.logger.debug("__fetch_url_details__: running")
            # this code from chatgpt does not work via flask
            # loop = asyncio.get_event_loop()
            # solution from https://techoverflow.net/2020/10/01/how-to-fix-python-asyncio-runtimeerror-there-is-no-current-event-loop-in-thread/
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            # we use a set here to avoid duplicates
            urls = set(self.data["urls"])
            app.logger.info("Checking {} URLs".format(len(urls)))
            self.url_details = loop.run_until_complete(self.check_urls(urls))

    def __fetch_doi_details__(self):
        from src import app

        if not self.error:
            app.logger.debug("__fetch_doi_details__: running")
            # this code from chatgpt does not work via flask
            # loop = asyncio.get_event_loop()
            # solution from https://techoverflow.net/2020/10/01/how-to-fix-python-asyncio-runtimeerror-there-is-no-current-event-loop-in-thread/
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            self.__extract_dois__()
            if self.dois:
                app.logger.info("Checking {} DOIs".format(len(self.dois)))
                self.doi_details = loop.run_until_complete(self.check_dois(self.dois))
            else:
                app.logger.info("Not checking DOIs because none were found")

    def __fetch_article__(self):
        from src import app

        app.logger.debug("__fetch_article__: running")
        url = "http://18.217.22.248/v2/statistics/article?url={}&regex={}&refresh={}".format(self.__quote__(self.job.url), self.__quote__(self.job.regex), self.job.refresh)
        app.logger.debug("using url: {}".format(url))
        response = requests.get(url)
        if response.status_code == 200:
            self.data = response.json()
            app.logger.info(
                "got article data with {} references".format(self.number_of_references)
            )
        else:
            app.logger.error(
                "Got status code {} when fetching from the article endpoint".format(response.status_code)
            )
            self.error = True

    def __compile_everything__(self):
        """Here we put the big json object together"""
        if not self.error:
            self.compilation = self.data
            self.compilation["doi_details"] = self.doi_details
            self.compilation["reference_details"] = self.references
            self.compilation["url_details"] = self.url_details

    def __extract_dois__(self):
        """Extract the DOIs which are hiding in the templates"""
        self.dois = set()
        if self.references and not self.extract_dois_done:
            for reference in self.references:
                # app.logger.debug(f"working on this reference: {reference}")
                if "templates" in reference:
                    for template in reference["templates"]:
                        # app.logger.debug(f"working on this template: {template}")
                        if "doi" in template["parameters"]:
                            self.dois.add(template["parameters"]["doi"])
        self.extract_dois_done = True

    def __extract_reference_ids__(self) :
        self.reference_ids = []
        if self.number_of_references and self.data:
            for reference in self.data["dehydrated_references"]:
                if "id" not in reference:
                    raise MissingInformationError()
                self.reference_ids.append(reference["id"])
