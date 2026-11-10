
import sys
import base64
import binascii
import random
import struct
from datetime import datetime, timedelta

# disable warning
import urllib3
from urllib3.exceptions import InsecureRequestWarning
urllib3.disable_warnings(InsecureRequestWarning)

# custom ntlm
# overwrite certificate_hash to check if EPA is enabled
# If EPA is enabled, auth should fail bacause of this overwrite
import requests
import secrets
from requests_ntlm import HttpNtlmAuth
from requests.packages.urllib3.response import HTTPResponse
from cryptography import x509
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes
from ntlm_auth import ntlm
from termcolor import colored

def ntlm_auth(url, auth):
    session = requests.Session()

    session.auth = auth
    response = session.get(url, verify=False)

    status_code = str(response.status_code)
    if status_code == "200":
        print(colored("[+] status_code: " + status_code, "green"))
    else:
        print(colored("[-] status_code: " + status_code, "red"))

    for header, value in response.request.headers.items():
        if header.startswith("Authorization"):
            type3 = value.split()[1]
            print("[+] Type3: " + type3)
            type3_info(type3)

class CustomHttpNtlmAuth(HttpNtlmAuth):
    def __init__(self, username, password, session=None, send_cbt=True):
        if ntlm is None:
            raise Exception("NTLM libraries unavailable")

        try:
            self.domain, self.username = username.split('\\', 1)
        except ValueError:
            self.username = username
            self.domain = ''

        if self.domain:
            self.domain = self.domain.upper()
        self.password = password
        self.send_cbt = send_cbt
        self.session_security = None

    def _get_server_cert(self, response: requests.Response):
        if self.send_cbt:
            certificate_hash = None
            raw_response = response.raw

            if isinstance(raw_response, HTTPResponse):
                if sys.version_info > (3, 0):
                    socket = raw_response._fp.fp.raw._sock
                else:
                    socket = raw_response._fp.fp._sock

                try:
                    server_certificate = socket.getpeercert(True)
                except AttributeError:
                    pass
                else:
                    certificate_hash = _get_certificate_hash(server_certificate)
            else:
                warnings.warn(
                    "Requests is running with a non urllib3 backend, cannot retrieve server certificate for CBT",
                    NoCertificateRetrievedWarning)

            print("[+] certificate_hash (original): " + binascii.hexlify(certificate_hash).decode().upper())
            certificate_hash = secrets.token_bytes(len(certificate_hash))
            print("[+] certificate_hash (modified): " + binascii.hexlify(certificate_hash).decode().upper())
            return certificate_hash
        else:
            return None

def _get_certificate_hash(certificate_der):
    # https://tools.ietf.org/html/rfc5929#section-4.1
    cert = x509.load_der_x509_certificate(certificate_der, default_backend())

    try:
        hash_algorithm = cert.signature_hash_algorithm
    except UnsupportedAlgorithm as ex:
        warnings.warn("Failed to get signature algorithm from certificate, "
                      "unable to pass channel bindings: %s" % str(ex), UnknownSignatureAlgorithmOID)
        return None

    # if the cert signature algorithm is either md5 or sha1 then use sha256
    # otherwise use the signature algorithm
    if hash_algorithm.name in ['md5', 'sha1']:
        digest = hashes.Hash(hashes.SHA256(), default_backend())
    else:
        digest = hashes.Hash(hash_algorithm, default_backend())

    digest.update(certificate_der)
    certificate_hash_bytes = digest.finalize()

    return certificate_hash_bytes

# parser
# This parser is Assisted with basic coding tools
def parse_security_buffer(data: bytes, offset: int):
    """
    Parse a security buffer from an NTLM message.
    A security buffer is 8 bytes:
      - Length (2 bytes)
      - Allocated space (2 bytes)
      - Offset (4 bytes)
    Returns a tuple: (length, allocated, offset)
    """
    length = struct.unpack("<H", data[offset:offset+2])[0]
    allocated = struct.unpack("<H", data[offset+2:offset+4])[0]
    off = struct.unpack("<I", data[offset+4:offset+8])[0]
    return length, allocated, off

def parse_type3(token: bytes):
    """
    Parse an NTLM Type3 (Authenticate) token from raw bytes.
    Returns a dictionary with the following keys:
      - MessageType: integer (should be 3)
      - LMResponse: raw bytes
      - NTLMResponse: raw bytes
      - DomainName: string (UTF-16LE decoded)
      - UserName: string (UTF-16LE decoded)
      - Workstation: string (UTF-16LE decoded)
      - NegotiateFlags: integer
      - NTLMv2_HMAC: first 16 bytes of NTLMResponse (if NTLMv2)
      - NTLMv2_Blob: parsed blob dictionary (if NTLMv2; see parse_ntlmv2_blob)
    """
    if len(token) < 64 or not token.startswith(b"NTLMSSP\x00"):
        raise ValueError("Invalid or too short NTLM message.")
    msg_type = struct.unpack("<I", token[8:12])[0]
    if msg_type != 3:
        raise ValueError(f"Not a Type3 message (found MessageType={msg_type}).")
    
    # Parse security buffers
    lm_length, lm_alloc, lm_off = parse_security_buffer(token, 12)
    ntlm_length, ntlm_alloc, ntlm_off = parse_security_buffer(token, 20)
    domain_length, domain_alloc, domain_off = parse_security_buffer(token, 28)
    user_length, user_alloc, user_off = parse_security_buffer(token, 36)
    workstation_length, workstation_alloc, workstation_off = parse_security_buffer(token, 44)
    negotiate_flags = struct.unpack("<I", token[60:64])[0]
    
    lm_response = token[lm_off: lm_off + lm_length]
    ntlm_response = token[ntlm_off: ntlm_off + ntlm_length]
    domain_bytes = token[domain_off: domain_off + domain_length]
    user_bytes = token[user_off: user_off + user_length]
    workstation_bytes = token[workstation_off: workstation_off + workstation_length]
    
    try:
        domain_str = domain_bytes.decode("utf-16-le")
    except UnicodeDecodeError:
        domain_str = domain_bytes.decode("ascii", errors="replace")
    try:
        user_str = user_bytes.decode("utf-16-le")
    except UnicodeDecodeError:
        user_str = user_bytes.decode("ascii", errors="replace")
    try:
        workstation_str = workstation_bytes.decode("utf-16-le")
    except UnicodeDecodeError:
        workstation_str = workstation_bytes.decode("ascii", errors="replace")
    
    result = {
        "MessageType": msg_type,
        "LMResponse": lm_response,
        "NTLMResponse": ntlm_response,
        "DomainName": domain_str,
        "UserName": user_str,
        "Workstation": workstation_str,
        "NegotiateFlags": negotiate_flags,
    }
    
    # Check if NTLMResponse length indicates NTLMv2 (16-byte HMAC + blob)
    if ntlm_length > 16:
        hmac = ntlm_response[:16]
        blob = ntlm_response[16:]
        blob_info = parse_ntlmv2_blob(blob)
        result["NTLMv2_HMAC"] = hmac
        result["NTLMv2_Blob"] = blob_info
    else:
        result["NTLMv2_HMAC"] = None
        result["NTLMv2_Blob"] = None

    return result

def parse_ntlmv2_blob(blob: bytes):
    """
    Parse the NTLMv2 response blob from the NTLM Response.
    Expected structure:
      - 4 bytes: RespType (usually 0x0101)
      - 4 bytes: HiRespType (usually 0x0000)
      - 8 bytes: Timestamp (Windows FILETIME)
      - 8 bytes: Client Challenge
      - 4 bytes: Unknown (usually 0)
      - Variable: AV Pair list (terminated by AvID=0x0000)
    Returns a dictionary with:
      - RespType, HiRespType, Timestamp (as datetime), ClientChallenge, Unknown, AVPairs (list)
    """
    if len(blob) < 28:
        raise ValueError("NTLMv2 blob too short.")
    resp_type = struct.unpack("<I", blob[0:4])[0]
    hi_resp_type = struct.unpack("<I", blob[4:8])[0]
    timestamp_val = struct.unpack("<Q", blob[8:16])[0]
    client_challenge = blob[16:24]
    unknown = struct.unpack("<I", blob[24:28])[0]
    av_pairs_data = blob[28:]
    av_pairs = parse_av_pairs_type3(av_pairs_data)
    return {
        "RespType": resp_type,
        "HiRespType": hi_resp_type,
        "Timestamp": filetime_to_datetime(timestamp_val),
        "ClientChallenge": client_challenge,
        "Unknown": unknown,
        "AVPairs": av_pairs,
    }

def parse_av_pairs_type3(data: bytes):
    """
    Parse the AV pairs from the NTLMv2 blob in a Type3 message.
    Each AV pair consists of:
      - AvID (2 bytes, little-endian)
      - AvLen (2 bytes, little-endian)
      - Value (AvLen bytes)
    The list is terminated when AvID == 0 (MsvAvEOL).

    Special formatting:
      - For AvID 0x0007 (MsvAvTimestamp): convert FILETIME to a human-readable datetime string.
      - For AvID 0x000A (Channel Bindings): format the value as grouped hex (e.g., "AB CD EF ...").
    
    Returns a list of tuples: (av_id, value_str)
    """
    idx = 0
    pairs = []
    while idx + 4 <= len(data):
        av_id = struct.unpack("<H", data[idx:idx+2])[0]
        av_len = struct.unpack("<H", data[idx+2:idx+4])[0]
        idx += 4
        val_bytes = data[idx:idx+av_len]
        idx += av_len
        if av_id == 0:
            break  # End of AV pair list
        if av_id == 0x0007 and av_len == 8:
            # MsvAvTimestamp
            filetime_val = struct.unpack("<Q", val_bytes)[0]
            value_str = filetime_to_datetime(filetime_val).isoformat(" ")
        elif av_id == 0x000A:
            # Channel Bindings - format as grouped hex bytes
            # Group each byte as two-digit hex separated by a space.
            value_str = " ".join(f"{b:02X}" for b in val_bytes)
        else:
            try:
                value_str = val_bytes.decode("utf-16-le")
            except UnicodeDecodeError:
                value_str = val_bytes.hex().upper()
        pairs.append((av_id, value_str))
    return pairs

def filetime_to_datetime(filetime: int) -> datetime:
    """
    Convert Windows FILETIME (64-bit, in 100-nanosecond intervals since 1601-01-01 UTC)
    to a Python datetime object.
    """
    microseconds = filetime // 10
    epoch = datetime(1601, 1, 1)
    return epoch + timedelta(microseconds=microseconds)

def format_negotiate_flags(flags: int):
    """
    Return a list of flag names that are set in the given negotiate flags integer.
    """
    enabled = []
    for bitmask, name in NTLM_NEGOTIATE_FLAGS:
        if flags & bitmask:
            enabled.append(name)
    return enabled

def type3_info(ntlm_b64):
    try:
        token = base64.b64decode(ntlm_b64)
    except Exception as e:
        print("Error decoding Base64 token:", e)
        sys.exit(1)
    
    try:
        info = parse_type3(token)
    except Exception as e:
        print("Error parsing NTLM Type3 token:", e)
        sys.exit(1)
    
    # print("=== NTLM Type3 (Authenticate) Analysis ===")
    # print(f"MessageType: {info['MessageType']}")
    # print(f"DomainName: '{info['DomainName']}'")
    # print(f"UserName: '{info['UserName']}'")
    # print(f"Workstation: '{info['Workstation']}'")
    # print(f"NegotiateFlags: 0x{info['NegotiateFlags']:08X}")
    # print("\nLM Response (hex):", info["LMResponse"].hex().upper())
    # print("NTLM Response (hex):", info["NTLMResponse"].hex().upper())
    
    if info["NTLMv2_HMAC"] is not None:
        # print("\n-- NTLMv2 Response --")
        # print("HMAC (first 16 bytes):", info["NTLMv2_HMAC"].hex().upper())
        blob = info["NTLMv2_Blob"]
        # print(f"RespType: 0x{blob['RespType']:08X}")
        # print(f"HiRespType: 0x{blob['HiRespType']:08X}")
        # print("Timestamp:", blob["Timestamp"])
        # print("Client Challenge (hex):", blob["ClientChallenge"].hex().upper())
        # print(f"Unknown field: 0x{blob['Unknown']:08X}")
        print("\n-- AV Pairs (from NTLMv2 Blob) --")
        channel_binding_found = False
        for av_id, value in blob["AVPairs"]:
            # For Channel Bindings, value is already nicely formatted.
            print(f"AvID = 0x{av_id:04X}, Value = '{value}'")
            if av_id == 0x000A:
                channel_binding_found = True
        if channel_binding_found:
            print(f"\nChannel Bindings (AvID=0x000A) are present.")
            print()
        else:
            print(f"\nChannel Bindings (AvID=0x000A) are NOT present.")
            print()
    else:
        print("\nNo NTLMv2 blob found in NTLM Response.")
