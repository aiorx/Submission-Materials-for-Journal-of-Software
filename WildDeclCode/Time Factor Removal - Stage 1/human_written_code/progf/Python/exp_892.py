import os
import sys
import re
import subprocess
import qrcode
import colorama

import constants

def get_platform() :
    """
    Returns the name of the platform where the application is currently running
    """
    platforms = {
        'linux': constants.LINUX,
        'linux1': constants.LINUX,
        'linux2': constants.LINUX,
        'darwin': constants.MAC,
        'win32': constants.WINDOWS
    }

    if not sys.platform in platforms:
        return sys.platform

    return platforms[sys.platform]

def get_profiles() :
    """
    Gets a list of names from saved wifi networks in the current platform
    """
    profiles = []

    platform = get_platform()

    try:
        if platform == constants.MAC:
            # Command found here : https://coderwall.com/p/ghl-cg/list-known-wlans
            profiles = run_command(f"defaults read ~/Library/Logs/com.apple.wifi.syncable-networks.plist | grep \" SSID\" | sed 's/^.*= \(.*\);$/\\1/' | sed 's/^\"\\(.*\)\"$/\\1/'").split('\n')
        elif platform == constants.LINUX:
            if os.getuid() != 0:
                ssid = run_command("sudo ls /etc/NetworkManager/system-connections/ | grep .nmconnection").split('\n')
            else:
                ssid = run_command("ls /etc/NetworkManager/system-connections/ | grep .nmconnection").split('\n')
            
            for entry in ssid:
                profiles.append(entry.split('.nmconnection')[0])
        elif platform == constants.WINDOWS:
            # Reference: https://www.geeksforgeeks.org/getting-saved-wifi-passwords-using-python/
            # getting meta data
            meta_data = run_command('netsh wlan show profiles | findstr ":"')

            if meta_data != "":
                # splitting data line by line
                data = meta_data.split('\n')

                if len(data) > 0:
                    # skip the first element in data since it does not contain a valid profile returned by netsh command
                    profiles = [d.split(':')[1].strip(' .\r') for d in data[1:]]
    except Exception as ex:
        print("Error: {}".format(ex))

    return profiles

def generate_wifi_dict(profiles) :
    """
    Generates a dictionary with the wifi name as key and the password as it's value
    """
    wifi_dict = {}

    if profiles is None:
        print("List is not defined.")
        return

    if len(profiles) == 0:
        print("List is empty.")
        return

    for ssid in profiles:
        if get_platform() == constants.MAC and len(profiles) > 1:
            password = "*****"
        else:
            password = get_password(ssid)
        
        wifi_dict[ssid] = password

    return wifi_dict

def get_password(ssid) :
    """
    Gets the password for a given SSID
    """
    password = ""

    if ssid == "" or ssid is None:
        print("SSID is not defined")
        return password

    platform = get_platform()

    try:
        if platform == constants.MAC:
            password = run_command(f"security find-generic-password -l \"{ssid}\" -D 'AirPort network password' -w")
        elif platform == constants.LINUX:
            # Check if the user is running with super user privilages
            if os.getuid() != 0:
                password = run_command("sudo nmcli -s -g 802-11-wireless-security.psk connection show '{}'".format(ssid))
            else:
                password = run_command("nmcli -s -g 802-11-wireless-security.psk connection show '{}'".format(ssid))
        elif platform == constants.WINDOWS:
            password = run_command('chcp 437 | netsh wlan show profile name="{}" key=clear | findstr Key'.format(ssid))

            if password != "":
                password = re.findall(r"Key Content\s+:\s(.*)", password)

                if len(password) > 0:
                    password = password[0]
                else:
                    password = ""
    except Exception as ex:
        print("Error: {}".format(ex))

    return password

def run_command(command) :
    """
    Runs a given command using subprocess module
    """
    if command == "" or command is None:
        return ""
    
    env = os.environ.copy()
    env["LANG"] = "C"
    output, _ = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, shell=True, env=env).communicate()
    return output.decode("utf-8", errors="replace").rstrip("\r\n")

def print_dict(ssid) :
    """
    Prints the contents of the given dictionary that contains the wifi name and password
    """
    if ssid is None:
        print("Dictionary is not defined.")
        return

    if len(ssid) == 0:
        print("Dictionary is empty.")
        return

    print("----------------------------------------------")
    print("{:<30}| {:<}".format("SSID", "Password"))
    print("----------------------------------------------")

    for key, value in ssid.items():
        print("{:<30}| {:<}".format(key, value))

    print("----------------------------------------------")
    # If macOS and list 

    if get_platform() == constants.MAC and len(ssid) > 1:
        print("Use 'wifi-password -s <SSID>' to find a specific WIFI password")

def generate_qr_code(ssid, password, path, show_qr) :
    """
    Generates a QR code from a given ssid and password

    Source: https://git.io/JtLIv
    """
    if ssid == "" or ssid is None:
        print('SSID is not specified, cannot generate QR code.')
        return

    text = "WIFI:T:WPA;S:{};P:{};;".format(ssid, password)

    try:
        qr = qrcode.QRCode(version=1,
                        error_correction=qrcode.constants.ERROR_CORRECT_L,
                        box_size=10,
                        border=4)
        qr.add_data(text)

        if show_qr:
            print("---------- {} ----------".format(ssid))
            # This will emulate support for ANSI escape sequences, which is needed
            # in order to display the QR code on Windows
            colorama.init()
            qr.make()
            qr.print_tty()

        if path:
            file_name = ssid.replace(" ", "_") + ".png"

            if path == "STORE_LOCALLY":
                path = file_name

            try:
                img = qr.make_image()
                img.save(path)

                print("QR code has been saved to {}".format(path))
            except FileNotFoundError:
                print("No such file/directory: '{}'".format(path))
    except Exception as ex:
        print("QR Code Error: {}".format(ex))
