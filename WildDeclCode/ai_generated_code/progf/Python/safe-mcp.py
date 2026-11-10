#!/usr/bin/env python3

# Proxy python script to run MCP uvx server through firejail or docker
import os
import subprocess
import sys
import json
import threading

MCP_SERVERS_FILE = 'mcp-servers.json'
LOG_FILE = 'mcp-server.log'

def initTool(mcp_server):
    # Ask user which sandbox to use
    # save choice to mcp-servers.json as json
    # create default firejail profile or dockerfile
    # Run the MCP server with the chosen sandbox and output tool-description
    # Hash the tool description and save it to mcp-servers.json to ensure it is not changed
    # Potentially add a way to check for mallicious tool description, either using an LLM or by checking known malicious phrases
    # This function is a placeholder for the actual implementation
    print(f"Initializing MCP server {mcp_server}...")
    sandbox_choice = input("Choose sandbox (firejail/docker): ").strip().lower()
    if sandbox_choice not in ['firejail', 'docker']:
        print("Invalid choice. Please choose either 'firejail' or 'docker'.")
        return
    # add server to mcp-servers.json
    server_details = {
        'sandbox': sandbox_choice,
    }
    try:
        with open(MCP_SERVERS_FILE, 'r+') as f:
            servers = json.load(f)
            servers[mcp_server] = server_details
            f.seek(0)
            json.dump(servers, f, indent=4)
    except FileNotFoundError:
        with open(MCP_SERVERS_FILE, 'w') as f:
            servers = {mcp_server: server_details}
            json.dump(servers, f, indent=4)
    except json.JSONDecodeError:
        print("Error reading mcp-servers.json, starting with an empty list.")
        with open(MCP_SERVERS_FILE, 'w') as f:
            servers = {mcp_server: server_details}
            json.dump(servers, f, indent=4)
    # TODO find a way to get tool description from MCP server, hash it and save it to mcp-servers.json
    
    print(f"Server {mcp_server} initialized with sandbox {sandbox_choice}.")
    # Create default firejail profile or dockerfile
    if sandbox_choice == 'firejail':
        firejail_profile = f".{mcp_server}-firejail.conf"
        with open(firejail_profile, 'w') as f:
            f.write(
                "noroot\n") #TODO: Add more firejail options as needed
            # elif sandbox_choice == 'docker':
    # TODO
    sys.exit(0)

# Logging and subprocess function Composed with basic coding tools, may need fixing
def log_and_forward(pipe, stream_name, log_file):
    with pipe:
        for line in iter(pipe.readline, b''):
            decoded = line.decode()
            log_file.write(f"[{stream_name}] {decoded}")
            log_file.flush()
            print(decoded, end='')


def runSubprocess(command):
    # Run a subprocess command and return the output
    with open(LOG_FILE, 'w') as log_file:
        # Launch the target script as a subprocess
        proc = subprocess.Popen(
            command,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        # Start threads to handle stdout and stderr
        threading.Thread(target=log_and_forward, args=(proc.stdout, 'STDOUT', log_file), daemon=True).start()
        threading.Thread(target=log_and_forward, args=(proc.stderr, 'STDERR', log_file), daemon=True).start()

        try:
            while proc.poll() is None:
                user_input = sys.stdin.readline()
                if not user_input:
                    break
                proc.stdin.write(user_input.encode())
                proc.stdin.flush()
                log_file.write(f"[STDIN] {user_input}")
                log_file.flush()
        except KeyboardInterrupt:
            print("Interrupted by user.")
        finally:
            try:
                proc.stdin.close()
            except Exception:
                pass
            proc.wait()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python safe-mcp.py <mcp-server>")
        sys.exit(1)
    mcp_server = sys.argv[1]
    if mcp_server == 'init':
        if len(sys.argv) < 3:
            print("Usage: python safe-mcp.py init <mcp-server>")
            sys.exit(1)
        mcp_server_name = sys.argv[2]
        initTool(mcp_server_name)
    # Load existing servers from JSON file
    try:
        with open(MCP_SERVERS_FILE, 'r') as f:
            servers = json.load(f)
    except FileNotFoundError:
        servers = {}
    except json.JSONDecodeError:
        print("Error reading mcp-servers.json, starting with an empty list.")
        servers = {}
    # Check if the server is already in the list
    if mcp_server not in servers:
        print(f"Server {mcp_server} not found in mcp-servers.json. Please initialize first.")
        sys.exit(1)
    # Get the server details
    server_details = servers.get(mcp_server, {})
    if not server_details:
        print(f"No details found for server {mcp_server}. Please initialize first.")
        sys.exit(1)
    # Read sandbox choice from server details
    sandbox_choice = server_details.get('sandbox', None)
    # Start the MCP server with the chosen sandbox
    # Keep logs of the server output
    print(f"Starting MCP server {mcp_server} with sandbox {sandbox_choice}...")
    if sandbox_choice == "firejail":
        # Prepare the command to run the MCP server with firejail
        command = ['firejail', '--quiet', '--profile=' + f'.{mcp_server}-firejail.conf', 'uvx', mcp_server]
        # Run the command
        print(f"Running command: {' '.join(command)}")
        runSubprocess(command)
    elif sandbox_choice == "docker":
        # Prepare the command to run the MCP server with docker
        command = ['docker', 'run', '--rm', '-it', '--name', mcp_server, 'uvx', mcp_server]
        # Run the command
        print(f"Running command: {' '.join(command)}")
        runSubprocess(command)
