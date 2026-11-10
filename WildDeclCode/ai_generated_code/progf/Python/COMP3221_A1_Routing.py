from threading import Thread #for threads
import time #for timing
from datetime import datetime #for prompt info
import socket #for communications between nodes
import sys
import os #to output PID so that the grader can shut down processes for some nodes
from signal import SIGKILL
"""
The code snippet(design pattern/help function modularization)
is Produced via common programming aids-4 of OpenAI Some naming conventions follow
examples from Python APIs for `threading` and `socket`
"""
HOST = 'localhost'
manager_threads = []
"""
Per the specification each node has a corresponding port number
"""
NODE_PORT_MAP = {'A':6000, \
                 'B':6001, \
                 'C':6002, \
                 'D':6003, \
                 'E':6004, \
                 'F':6005, \
                 'G':6006, \
                 'H':6007, \
                 'I':6008, \
                 'J':6009}

PORT_NODE_MAP = {6000:'A', \
                 6001:'B', \
                 6002:'C', \
                 6003:'D', \
                 6004:'E', \
                 6005:'F', \
                 6006:'G', \
                 6007:'H', \
                 6008:'I', \
                 6009:'J'}
#Dv-table
#{destination: (distance, next_hop)}
routing_table = {}

#C-table
#{neighbor: cost_to_that_neighbor}
neighbors_cost = {}

#Nodes activated in the network {node: True/False}
#False: not connected, True: connected
neighbors_status = {}

program_start_time = None
this_node = None
has_waited = False
#snapshot the start time of the program

def cli_thread():
    """
    a thread to handle user inputs
    """
    global neighbors_cost
    while True:
        try:
            command = input().strip().split()
            if len(command) == 3:
                action, neighbor, new_cost = command
                if action == "U":
                    if neighbor in neighbors_cost:
                        new_cost = float(new_cost)
                        neighbors_cost[neighbor] = (new_cost, NODE_PORT_MAP[neighbor])
                        print(f"Updated link cost to node {neighbor} to {new_cost}")
                    else:
                        print(f"Node {neighbor} is not a neighbor of this node")
            elif command[0] == "D" and len(command) == 1:
                    os.kill(os.getpid(),SIGKILL)
            else:
                print("Invalid command format. Use 'U <neighbor> <new_cost>' or 'D' to disconnect the node")
        except Exception as e:
            print("Error processing command:", e)

def routing_table_init():
    """
    prepare a routing table before reading configs
    """
    for k, _ in NODE_PORT_MAP.items():
        if k == this_node:
            routing_table[k] = (float(0),NODE_PORT_MAP[k])
        else:
            routing_table[k] = (float('inf'),NODE_PORT_MAP[k])
        neighbors_status[k] = False

def update_node_status(status):
    """
    updates nodes activated in the network
    """
    entries = status[:-1].split(';')
    for e in entries:
        if not neighbors_status[e]:
            neighbors_status[e] = True

def parse_info(info):
    """
    a packets decoding parser
    """
    parsed_info = {}
    entries = info[:-1].split(';')
    for e in entries:
        destination = e.split(':')[0]
        if not neighbors_status[destination]:
            neighbors_status[destination]
        distance = float(e.split(':')[1].split(',')[0])
        next_hop_port = int(e.split(':')[1].split(',')[1])
        parsed_info[destination] = (distance,next_hop_port)
    return parsed_info

def path_output_helper():
    """
    prints information to the console
    """
    global this_node
    print(f"I am Node {this_node}")
    for destination, _ in routing_table.items():
        if not neighbors_status[destination]:
            continue
        path_str = destination
        path_cost = routing_table[destination][0]
        current_node = destination
        while current_node != (next_node := \
                               PORT_NODE_MAP[routing_table[current_node][1]]):
            path_str += next_node
            current_node = next_node
        if path_cost > 0 and path_cost < float('inf'):
            print(f"Least cost path from {this_node} to {destination}: next hop {current_node}, link cost: {path_cost:.1f}")

def cleanse_routing_table(neighbor, neighbor_matrix):
    """
    not used, was for reconnection mechanism
    """
    is_modified = False
    for k,v in routing_table.items():
        if k in neighbors_status.keys():
            if neighbors_status[k] == False :
                routing_table[k] = (float('inf'),NODE_PORT_MAP[k])
            else:
                if k == neighbor and routing_table[k][0] == float('inf'):
                    cost_to_neighbor = neighbor_matrix[this_node][0]
                    routing_table[k] = (cost_to_neighbor,NODE_PORT_MAP[k])
                    is_modified = True
    #print(routing_table)
    return is_modified

def dv_routing(neighbor, packets):
    """
    use Bellman-Ford algorithm

    """
    neighbor_matrix = packets[neighbor]
    is_modified = cleanse_routing_table(neighbor,neighbor_matrix)
    #is_modified = False
    for destination, (distance, next_hop_port) in neighbor_matrix.items():
        if not neighbors_status[destination]:
            continue
        if routing_table[destination][0] > distance + routing_table[neighbor][0]:
            is_modified = True
            routing_table[destination] = \
                (distance + routing_table[neighbor][0]\
                 ,NODE_PORT_MAP[neighbor])
    print("---------------------------------------")
    print(f"Received an update packet from node {neighbor}")
    if is_modified:
        print("The routing table has been updated @" + str(datetime.now().strftime("%H:%M:%S")))
    else:
        print("The routing table remains convergent @" + str(datetime.now().strftime("%H:%M:%S")))
    path_output_helper()

def send(source,routing_table,port):
    """
    a thread to connect to `port` from a node ID `source`
    Before the connection is established, it tries to contact `port` every 2s.
    Upon a successful pipe, the thread keeps sending a packet to the pipe every 10s.
    """
    connected = False
    while True:
        if not connected:
            try:
                conn = socket.create_connection((HOST, port),timeout = 60)
                connected = True

            except socket.timeout:
                print("no data were sent after 60s")

            except ConnectionRefusedError:
                time.sleep(2)
        else:
            print("The writing end of the pipe to node "+ \
                  PORT_NODE_MAP[port] + " has been created" )

            while True:
                data = source
                data = data + '>>>'
                for k,(v1,v2) in routing_table.items():
                    if k in neighbors_status.keys():
                        if neighbors_status[k]:
                            data = data + str(k) + ':' + str(v1)  +  ',' + str(v2) + ';'
                data = data + '>>>'
                for k, v in neighbors_status.items():
                    if v:
                        data = data + k + ';'

                try:
                    if conn.sendall(data.encode()):
                        print("couldn't send data")
                except BrokenPipeError:
                    connected = False
                    break

                time.sleep(10)

def create_receive(s,packets):
    """
    In this thread, once a pipe is ready for `s` socket,
    it creates a new thread handling keep listening to the pipe
    """
    print("Attempting to receive packets from other nodes")
    while True:
        conn, adr= s.accept()
        receive_thread = Thread(target = receive\
                                , args = (conn,packets),daemon = False)
        manager_threads.append(receive_thread)
        receive_thread.start()

def receive(conn,packets):
    """
    The thread keeps receiving encoded data from `conn` and decode the data
    The decoded information is stored at `packets` dictionary(JAVA map)
    """
    timeout_start = time.time()
    node_name = None
    global has_waited
    while True:
        data = conn.recv(1024)
        if data:
            timeout_start = time.time()
            node,info,status = data.decode().split('>>>')
            if info:
                packets[node] = parse_info(info)
            if status:
                update_node_status(status)
            if node_name == None:
                print(f"The reading end of the pipe to {node} in the network"\
                      + " has been accepted")

                node_name = node
                neighbors_status[node_name] = True
            if has_waited:
                #run dv algorithm
                if not (node in packets.keys()):
                    continue
                route_table_thread = Thread(target = dv_routing, args = (node,packets), daemon = False)
                manager_threads.append(route_table_thread)
                route_table_thread.start()
                pass
            else:
                if time.time() - program_start_time > 60:
                    has_waited = True
        else:
            #assume that there's a connection lost if the thread didn't
            #receive any data for more than 10s. 0.5s buffer time is added
            if time.time() - timeout_start > 10.5:
                print(f"Receiving Packets Timeout!!!")
                if node_name:
                    print(f"The connection to node {node_name} is regarded to have been lost")
                    neighbors_status[node_name] = False
                break
    print("Reading end of the pipe to " + str(conn.getpeername()) + " has been shut down.")
    conn.close()

def manager(node, port, file):
    """
    The main function in charge of preparing a socket for the server, creating
    pipes to listen from other nodes and generating sending threads to other nodes
    """
    try:
        with socket.socket(socket.AF_INET,socket.SOCK_STREAM) as s:
            s.bind((HOST, port))
            #assume only 10 nodes in the network
            s.listen(10)
            global this_node
            this_node = node
            neighbors_status[this_node] = True
            routing_table = parse_config(file)
            packets = {}
            count_down_thread = Thread(target = dv_algorithm_count_down, args = ())
            manager_threads.append(count_down_thread)
            count_down_thread.start()
            create_receive_threads\
                = Thread(target = create_receive\
                         ,args =(s,packets)\
                         ,daemon = False)
            manager_threads.append(create_receive_threads)
            create_receive_threads.start()
            for k,v in neighbors_cost.items():

                send_thread = Thread(target = send\
                                     ,args = (node,routing_table,v[1])\
                                     , daemon = False)
                manager_threads.append(send_thread)
                send_thread.start()
            cli_thread_instance = Thread(target=cli_thread, daemon=False)
            manager_threads.append(cli_thread_instance)
            cli_thread_instance.start()
            for t in manager_threads:
                t.join()
            s.close()
    except KeyboardInterrupt:
        print("the main thread has been mannually terminated")
        for t in manager_threads:
                t.join()

    except Exception as e:
        print(e)
        print("socket connection error")
        for t in manager_threads:
            t.join()

def validate_config(node,port):
    if NODE_PORT_MAP[node] == int(port):
        return True
    else:
        return False

def parse_config(file):
    """
    reads the configuration file of a node
    returns a corresponding dictionary mapping neighboring nodes
    to a tuple of distance between the node and one of its neighbor
    and the port number of that neighbor node
    """

    with open(file,'r') as f:
        lines = f.readlines()
        neighbor_size = int(lines[0])
        routing_table_init()
        for i in range(1,neighbor_size + 1, 1):
            node, weight, port = lines[i].strip().split()
            if validate_config(node,port):
                routing_table[node] = (float(weight), int(port))
                neighbors_cost[node] = (float(weight),int(port))
            else:
                print("discarded the line in config: " + lines[i][:-1])
                print("node name %s doesn't match port number %s"%(node,port))
    return routing_table

def dv_algorithm_count_down():
    notify_time_remaining = True
    while notify_time_remaining:
        time.sleep(10)
        if time.time() - program_start_time < 60:
            print(f"run routing algorithm in {60 - (time.time() - program_start_time):.0f}s")
        else:
            print("executing routing algorithm now")
            notify_time_remaining = False

if __name__ == "__main__":
    """
    'COMP3221_A1_Routing.py' alias
    responsible for command line arguments parsing
    calls manager() to handle logics
    """
    if len(sys.argv) != 4:
        print("wrong CLI syntax not enough arguments passed")
        print("please follow the syntax requirement from the assignment")
    else:
        node, port, file = sys.argv[1], int(sys.argv[2]),sys.argv[3]
        print("Process of PID " + str(os.getpid()) + \
              " for node " + node + \
              " has started")
        print("It will execute dv algorithm after 60 seconds")
        program_start_time = time.time()
        manager(node,port,file)
