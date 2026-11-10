import re
import requests

# <These regular expressions were Developed via external programming aids's ChatGPT>
IP_REGEX = r'\b((?:(?:25[0-5]|2[0-4]\d|1\d{2}|0?\d{1,2})\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|0?\d{1,2}))(?=(?:/32\b)|(?:\b(?!/\d)))'
NETWORK_REGEX = r'\b(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)/(?:[0-2]?\d|3[01])\b'
DOMAIN_REGEX = r'\b(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}\b'
URL_REGEX = r'\b(?:https?|ftp):\/\/(?:www\.)?(?:[a-zA-Z0-9-]+\.[a-zA-Z]{2,}|(?:\d{1,3}\.){3}\d{1,3})(?::\d+)?(?:\/[^\s]*)?\b'
EMAIL_REGEX = r'\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b'
MAC_REGEX = r'\b(?:[0-9A-Fa-f]{2}(?:[-:])){5}[0-9A-Fa-f]{2}\b|\b(?:[0-9A-Fa-f]{4}\.){2}[0-9A-Fa-f]{4}\b'
NETID_REGEX = r'(?<=\s|\"|\:|\')[a-z]{2,3}\d+(?=\s|\"|\')'
SN_REGEX = r'(?:TASK|INC|RITM)\d{6,}'
# </These regular expressions were Developed via external programming aids's ChatGPT>

class MetadataParser:

    def __init__(self):
        url = 'https://data.iana.org/TLD/tlds-alpha-by-domain.txt'
        response = requests.get(url)
        self.tlds = [line.strip().lower() for line in response.text.splitlines()
            if line and not line.startswith("#")]

    def is_tld(self, tld):
        if tld in self.tlds:
            return True
        return False


    def match_domain(self, text):
        domains = []
        matches = re.findall(DOMAIN_REGEX, text)
        for match in matches:
            match_split = match.split('.')
            if self.is_tld(match_split[-1]):
                domains.append(match)
        return list(set(domains))


    @staticmethod
    def match_ip(text):
        match = re.findall(IP_REGEX, text)
        return list(set(match))


    @staticmethod
    def match_network(text):
        match = re.findall(NETWORK_REGEX, text)
        return list(set(match))


    @staticmethod
    def match_url(text):
        match = re.findall(URL_REGEX, text)
        return list(set(match))


    @staticmethod
    def match_email(text):
        match = re.findall(EMAIL_REGEX, text)
        return list(set(match))

    @staticmethod
    def match_netid(text):
        match = re.findall(NETID_REGEX, text)
        return list(set(match))


    @staticmethod
    def match_mac(text):
        match = re.findall(MAC_REGEX, text)
        return list(set(match))


    @staticmethod
    def match_sn(text):
        match = re.findall(SN_REGEX, text)
        return list(set(match))


    def find_metadata(self, text):
        metadata = {'ip_addresses': self.match_ip(text),
                    'networks': self.match_network(text),
                    'domains': self.match_domain(text),
                    'urls': self.match_url(text),
                    'email_addresses': self.match_email(text),
                    'mac_addresses': self.match_mac(text),
                    'netids': self.match_netid(text),
                    'sn_tickets': self.match_sn(text)}
        return metadata
