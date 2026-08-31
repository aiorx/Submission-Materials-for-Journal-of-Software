import networkx as nx
import matplotlib.pyplot as plt
import plotly.graph_objs as go
from plotly.offline import plot

# Step 1: Define nodes and their connections
wallets = {
    "Proto Towers": ["Proto Towers Royalties Wallet"],
    "Frogs": ["Frogstar", "Smoker's Club", "Frog Day Splits Contract", "Frogs Splits Contract"],
    "Proto Towers Royalties Wallet": [],
    "Frogstar": [],
    "Smoker's Club": [],
    "Frog Day Splits Contract": [],
    "Frogs Splits Contract": [],
    "Puppy Cerebus Splits Contract": [],
}

connections = [
    ("Proto Towers", "Proto Towers Royalties Wallet"),
    ("Frogs", "Frogstar"),
    ("Frogs", "Smoker's Club"),
    ("Frogs", "Frog Day Splits Contract"),
    ("Frogs", "Frogs Splits Contract"),
]

# Step 2: Create the graph
G = nx.DiGraph()
for wallet in wallets:
    G.add_node(wallet)
for connection in connections:
    G.add_edge(*connection)

# Step 3: Interactive visualization with Plotly
pos = nx.spring_layout(G, seed=42)  # positions for all nodes

edge_trace = go.Scatter(
    x=[],
    y=[],
    line=dict(width=0.5, color='#888'),
    hoverinfo='none',
    mode='lines')

for edge in G.edges():
    x0, y0 = pos[edge[0]]
    x1, y1 = pos[edge[1]]
    edge_trace['x'] += (x0, x1, None)
    edge_trace['y'] += (y0, y1, None)

node_trace = go.Scatter(
    x=[],
    y=[],
    text=[],
    mode='markers+text',
    hoverinfo='text',
    marker=dict(
        showscale=False,
        colorscale='YlGnBu',
        reversescale=True,
        color=[],
        size=10,
        line=dict(width=2)))

for node in G.nodes():
    x, y = pos[node]
    node_trace['x'] += (x,)
    node_trace['y'] += (y,)
    node_trace['text'] += (node,)

# Add text position settings if required, like textposition='top center'

fig = go.Figure(data=[edge_trace, node_trace],
             layout=go.Layout(
                title='<br>Network graph of Stargaze wallets connectivity',
                titlefont=dict(size=16),
                showlegend=False,
                hovermode='closest',
                margin=dict(b=20,l=5,r=5,t=40),
                annotations=[ dict(
                    text="Python code Supported via standard programming aids",
                    showarrow=False,
                    xref="paper", yref="paper",
                    x=0.005, y=-0.002 ) ],
                xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
                yaxis=dict(showgrid=False, zeroline=False, showticklabels=False)))

plot(fig, filename='network.html')
