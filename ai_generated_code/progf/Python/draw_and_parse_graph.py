#This file contains methods for parsing graphs in the graphml format and drawing them.
#It was mostly Penned via standard programming aids.
from collections import defaultdict

import xml.etree.ElementTree as ET
import networkx as nx
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches

def parse_graph(file_path):
    """Parse a Pigale-specific GraphML file and extract graph + positions."""
    # Parse the GraphML file
    tree = ET.parse(file_path)
    root = tree.getroot()

    # Namespace for GraphML
    namespace = {"graphml": "http://graphml.graphdrawing.org/xmlns"}
    
    # Initialize NetworkX graph and position dictionary
    G = nx.Graph()
    pos = {}
    
    # Iterate over nodes
    for node in root.findall(".//graphml:node", namespace):
        node_id = node.get("id")
        G.add_node(node_id)
        
        # Extract positional data
        for data in node.findall(".//graphml:data", namespace):
            if data.get("key") == "Pigale/V/":
                coords = data.text.split(",")
                if len(coords) == 2:  # Ensure valid format
                    x, y = map(float, coords)
                    pos[node_id] = (x, y)

    # Iterate over edges
    for edge in root.findall(".//graphml:edge", namespace):
        source = edge.get("source")
        target = edge.get("target")
        G.add_edge(source, target)
    
    return G, pos

class graph_drawer(object):
    #attributes are edges and nodes, both nx objects. Edges need to be sorted (n1,n2), where n1<n2 are strings.
    #and vertex_color_choices, edge_color_choices, a list of colors to paint the edges/vertices. 
    #and Theseus, a hero.
    #and marked_nodes, a list of nodes to color specially for whatever reason.

    def __init__(self,Theseus):
        #Assume G is a graph, pos is a dictionary from G to R^2 that give the positions of the nodes.

        self.G= Theseus.K.M.G
        self.Theseus = Theseus
        self.marked_nodes= []
        vertex_color_dict,edge_color_dict = self.get_graph_colors()
        self.edge_color_choices = ["pink", "green","red"]
        self.vertex_color_choices = ["skyblue","red","blue","darkblue", "black"]
        # Draw graph using positions
        fig = plt.figure(figsize=(12, 12))
        ax = fig.add_subplot(111)
        x_values, y_values = zip(*self.Theseus.K.M.pos.values())  # Unpack all x and y coordinates
        ax.set_xlim(min(x_values) - 50, max(x_values) + 50)  # Add padding
        ax.set_ylim(min(y_values) - 50, max(y_values) + 50)

        # Draw nodes
        colors = [self.vertex_color_choices[vertex_color_dict[node]] for node in self.G.nodes]
        self.nodes = nx.draw_networkx_nodes(self.G, Theseus.K.M.pos, node_color=colors, node_size=100)
        
        # Draw edges
        edge_colors = [self.edge_color_choices[edge_color_dict[tuple(sorted(edge))]] for edge in self.G.edges]
        self.edges = nx.draw_networkx_edges(self.G, Theseus.K.M.pos, edge_color=edge_colors)
        
        #Draw hero
        self.hero_location, = ax.plot([self.Theseus.coordinates()[0]], [self.Theseus.coordinates()[1]], 'ro')
        # Write labels
        nx.draw_networkx_labels(self.G, Theseus.K.M.pos, font_size=12)
        fig.canvas.draw()

        plt.ion()  # Interactive mode for dynamic updates
        plt.axis("off")  # Hide axis
        plt.show(block=False)
        plt.pause(0.1)

    def get_graph_colors(self):
        #returns two default dictionaries, vertex_color_dict and edge_color_dict that assign integers that represent colors.
        #K is a subgraph of G that we will color
        vertex_color_dict = defaultdict(int)
        edge_color_dict = defaultdict(int)
        for s in self.Theseus.K.M.S.edges:
            e = tuple(sorted(s))
            edge_color_dict[e] = 1

        for v in self.Theseus.K.explored.nodes:
            vertex_color_dict[v]=2

        for v in self.marked_nodes:
            vertex_color_dict[v]=3

        vertex_color_dict[self.Theseus.K.M.exit]=4
        if isinstance(self.Theseus.location,str):
            if self.Theseus.location[0] == 'n':
                vertex_color_dict[self.Theseus.location]=1
            else: #Theseus is at a dead end.
                edge_color_dict[tuple(sorted(self.Theseus.K.M.edgeD[self.Theseus.location]))] = 2
        elif isinstance(self.Theseus.location, tuple):
            edge = tuple(sorted((self.Theseus.location[0],self.Theseus.location[1])))
            edge_color_dict[edge]=2
        return vertex_color_dict, edge_color_dict
    
    def recolor_graph(self,vertex_color_dict,edge_color_dict):
        #called after draw_graph to update it with new colors.
        edge_colors = [self.edge_color_choices[edge_color_dict[tuple(sorted(edge))]] for edge in self.G.edges]
        self.edges.set_color(edge_colors)
        colors = [self.vertex_color_choices[vertex_color_dict[node]] for node in self.G.nodes]
        self.nodes.set_color(colors)

    def update_graph(self,update_time):
        plt.pause(update_time)
        vertex_color_dict,edge_color_dict = self.get_graph_colors()
        self.recolor_graph(vertex_color_dict,edge_color_dict)
        self.hero_location.set_data([self.Theseus.coordinates()[0]+10],[self.Theseus.coordinates()[1]+10])
# Example usage
#file_path = "maze3.graphml"  # Replace with your file path
#visualize_graph_with_curved_edges(file_path)