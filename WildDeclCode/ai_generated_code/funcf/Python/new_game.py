```python
def make_connect_n_closest(self, bus_repo: BusRepo, n_connections: int) -> list[dict[str, BusId]]:
    """
    Create a transmission topology that connects each bus to its n closest buses.
    :param bus_repo: BusRepo containing the buses to connect.
    :param n_connections: Number of connections per bus.
    :return: List of dictionaries containing bus connections.
    """
    # TODO: AutoSupported by standard GitHub tools, needs review
    connections = []
    for bus in bus_repo:
        distances = [
            (other_bus, np.linalg.norm(np.array([bus.x, bus.y]) - np.array([other_bus.x, other_bus.y])))
            for other_bus in bus_repo
            if other_bus.id != bus.id
        ]
        closest_buses = sorted(distances, key=lambda x: x[1])[:n_connections]
        for other_bus, _ in closest_buses:
            connections.append({'bus1': bus.id, 'bus2': other_bus.id})
    return connections
```