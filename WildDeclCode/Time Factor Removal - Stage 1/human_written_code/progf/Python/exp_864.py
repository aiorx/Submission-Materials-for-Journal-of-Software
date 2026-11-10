import telegram
import logging
import random
from lib.sslless_session import SSLlessSession
import yaml

class NullNotifier:
    def notify(self, properties):
        pass

class Notifier(NullNotifier):
    def __init__(self, config, disable_ssl):
        logging.info("Setting up bot with token {}".format(config['token']))
        self.config = config
        if disable_ssl:
            self.bot = telegram.Bot(token=self.config['token'], request=SSLlessSession())
        else:
            self.bot = telegram.Bot(token=self.config['token'])
        

    def notify(self, properties):
        logging.info("Notifying about {} properties".format(len(properties)))
        text = random.choice(self.config['messages'])
        self.bot.send_message(chat_id=self.config['chat_id'], text=text)

        for prop in properties:
            logging.info("Notifying about {}".format(prop['url']))
            self.bot.send_message(chat_id=self.config['chat_id'], 
                    text="[{}]({})".format(prop['title'], prop['url']),
                    parse_mode=telegram.ParseMode.MARKDOWN)

    def test(self, message):
        self.bot.send_message(chat_id=self.config['chat_id'], text=message)

    @staticmethod
    def get_instance(config, disable_ssl = False):
        if config['enabled']:
            return Notifier(config, disable_ssl)
        else:
            return NullNotifier()