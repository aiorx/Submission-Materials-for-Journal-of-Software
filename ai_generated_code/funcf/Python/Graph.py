```python
def on_line(point_a, point_b, check_point):
    # Calculate the cross product and dot product
    cross_product = (check_point[1] - point_a[1]) * (point_b[0] - point_a[0]) - (point_b[1] - point_a[1]) * (check_point[0] - point_a[0])
    dot_product = (check_point[0] - point_a[0]) * (point_b[0] - point_a[0]) + (check_point[1] - point_a[1]) * (point_b[1] - point_a[1])

    # Check if the points are collinear and if check_point is between point_a and point_b
    if abs(cross_product) < 0.001 and dot_product >= 0 and dot_product <= (point_b[0] - point_a[0]) * (point_b[0] - point_a[0]) + (point_b[1] - point_a[1]) * (point_b[1] - point_a[1]):
        return True

    return False
def doesent_touch_placed_pieces(current_coordinate):
    for piece in self.pieces_placed:
        for coordinate in piece.coordinates:
            if coordinate == current_coordinate:
                return False
    return True
def doesent_touch_map_corner(current_coordinate):
    for coordinate in [[int(x),int(y)] for x,y in tuple(self.map.shapely_map.exterior.coords)]:
        if current_coordinate == coordinate:
            
            return False
    return True
def find_highest_coord(coordinates):
    if not coordinates: return None
    highest_coord_idx = 0
    for i in range(len(coordinates)):
        if coordinates[i][1] > coordinates[highest_coord_idx][1]:
            highest_coord_idx = i
    return coordinates[highest_coord_idx]
def iterate_to_next_point(current_coord, destination_coord):
    if destination_coord[0] < current_coord[0]:
        current_coord[0] -= .1
    elif destination_coord[0] > current_coord[0]:
        current_coord[0] += .1
    else:
        pass
    if destination_coord[1] < current_coord[1]:
        current_coord[1] -= .1
    elif destination_coord[1] > current_coord[1]:
        current_coord[1] += .1
    else:
        pass
    return list(map(lambda x: round(x, 1), current_coord))
def find_next_coord():
    """
    Traverse the edge of the map until a new point is found that does not touch 
    another piece(The point usually lies on the corner of a piece)
    """
    #grab coordinates of map corners
    map_coords = [list(coord) for coord in self.map.shapely_map.exterior.coords[::-1]]
    current_coord = [map_coords[0][0], map_coords[0][1]]
    for i in range(1, len(map_coords)-1):
        #while current coord not equal the next coord
        while current_coord != map_coords[i]:
            #I should probably do something about this
            if current_coord == map_coords[i]:
                break
            does_touch_piece = False
            current_GeoSeries_coord = gpd.GeoSeries(Point(current_coord))
            current_GeoSeries_coord.plot(ax = self.ax, color = 'orange')
            for piece in self.GeoSeries_pieces_placed:
                if piece.touches(current_GeoSeries_coord).bool():
                    does_touch_piece = True
            if does_touch_piece:
                current_coord = iterate_to_next_point(current_coord, map_coords[i])
                self.ax.collections[-1].remove()
                continue
            else:
                self.ax.collections[-1].remove()
                return list(map(int, current_coord))
    self.ax.collections[-1].remove()
    current_coord = [int(elem) for elem in current_coord]
    return current_coord
```