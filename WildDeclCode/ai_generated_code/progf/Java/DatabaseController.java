package SQL;

import API.Coordinate;
import API.PostCodeHashMap;
import Routing.Point;
import Routing.Route.Route;

import java.sql.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

public class DatabaseController {
    private static final String url = "jdbc:mysql://transitor23-transitor23.f.aivencloud.com  :12420/";
    private static final String username = "avnadmin";
    private static final String password = <YOUR_API_KEY>;

    public static String getUrl() {
        return url;
    }

    public static String getUsername() {
        return username;
    }

    public static String getPassword() {
        return password;
    }

    public static void main(String[] args) {
        String startStopId = "2578366"; // Maastricht Bochstraat
        String endStopId = "2578378"; // Bankastraat

        String startPostCode = "6213GE";
        String endPostCode = "6211XZ";

        Coordinate startCoords = PostCodeHashMap.getCoordsFromPostCode(startPostCode);
        Coordinate endCoords = PostCodeHashMap.getCoordsFromPostCode(endPostCode);

        if (startCoords == null || endPostCode == null) {
            System.out.println("Postcode not found");
            return;
        }

        Trip bestTrip = getBestTrip(startCoords, endCoords, 14, 0, 0);

        System.out.println(bestTrip.getEndTime());

        for (TripNode tripNode : bestTrip.getTripNodesList()) {
            System.out.println(getStopFromID(tripNode.stopId()).getStop_name() + ", " + tripNode.tripId() + ", "
                    + tripNode.time() + ".");
        }
    }

    public static Trip getBestTrip(Point startCoords, Point endCoords, int hour, int min, int sec) {
        Time departureTime = Time.valueOf(LocalTime.of(hour, min, sec));

        StopsGraph stopsGraph = createGraph();

        System.out.println("Created graph");

        List<Trip> bestTrips = new ArrayList<>();

        for (Stop startStop : getClosestBusStops(startCoords)) {

            for (Stop endStop : getClosestBusStops(endCoords)) {

                Trip trip = getBestBusTripFromStops(startStop.getId(), endStop.getId(), departureTime, stopsGraph);
                System.out.println("Calculated possible trip");

                if (trip != null) {
                    bestTrips.add(trip);
                }
            }
        }

        try {
            if (!bestTrips.isEmpty()) {
                System.out.println("Sorting trips");
                bestTrips.sort((trip1, trip2) -> new TimeComparator(departureTime).compare(trip1.getEndTime(),
                        trip2.getEndTime()));
                System.out.println("Sorted trips");
                return bestTrips.get(0);
            } else {
                System.out.println("No best trips found.");
                return null;
            }
        } catch (Exception e) {
            System.out.println("No best trips found.");
            return null;
        }
    }

    public static Route getBestRoute(Point start, Point end, int hour, int min, int sec) {
        Trip bestTrip = getBestTrip(start, end, hour, min, sec);
        List<Point> points = new ArrayList<>();

        if (bestTrip != null) {
            for (TripNode tripNode : bestTrip.getTripNodesList()) {

                Coordinate coords = getCoordsFromStopId(tripNode.stopId());

                if (coords != null) {
                    points.add(new API.Coordinate(coords.getLon(), coords.getLat()));
                }
            }

            Route route = new Route(points,
                    LocalDateTime.of(LocalDate.now(), LocalTime.of(hour, min, sec)),
                    LocalDateTime.of(LocalDate.now(), bestTrip.getEndTime().toLocalTime()),
                    bestTrip);

            return route;
        }

        return null;
    }

    public static StopsGraph createGraph() {
        StopsGraph stopsGraph = new StopsGraph();

        addBaseVerticesAndEdges(stopsGraph);
        addWalkingTransferEdges(stopsGraph);

        return stopsGraph;
    }

    public static StopsGraph createGraphNoWalkingEdges() {
        StopsGraph stopsGraph = new StopsGraph();
        addBaseVerticesAndEdges(stopsGraph);
        return stopsGraph;
    }

    private static void addBaseVerticesAndEdges(StopsGraph stopsGraph) {
        try (Connection connection = DriverManager.getConnection(url, username, password)) {
            String sql = "SELECT trip_id, times.stop_id, departure_time, arrival_time, stop_lat, stop_lon " +
                    "FROM transitorgroup23.stop_times_maastricht AS times LEFT JOIN transitorgroup23.maastricht_stops AS stops ON times.stop_id = stops.stop_id  ORDER BY trip_id, stop_sequence";
            try (PreparedStatement statement = connection.prepareStatement(sql)) {

                ResultSet resultSet = statement.executeQuery();

                Integer previousStopTripId = null;
                String previousStopId = null;
                StopNode previousStop = null;
                Time previousDepartureTime = null;

                while (resultSet.next()) {

                    Integer currentTripId = resultSet.getInt("trip_id");
                    String currentStopId = resultSet.getString("stop_id");
                    Time departureTime = resultSet.getTime("departure_time");
                    Time arrivalTime = resultSet.getTime("arrival_time");
                    double lat = resultSet.getDouble("stop_lat");
                    double lon = resultSet.getDouble("stop_lon");

                    StopNode currentStop;
                    if (stopsGraph.hasNode(currentStopId)) {
                        currentStop = stopsGraph.getNode(currentStopId);
                    } else {
                        currentStop = new StopNode(currentStopId, lat, lon);
                    }

                    if (currentTripId.equals(previousStopTripId) || previousStopTripId == null) {

                        if (!(previousStopId == null)) {

                            if (!previousStop.hasEdgeTo(currentStopId)) {
                                previousStop.addEdgeTowards(currentStopId);
                            }
                            previousStop.getEdgeTo(currentStopId).addTimeSlot(previousStopTripId, previousDepartureTime,
                                    arrivalTime);

                            if (!stopsGraph.hasNode(previousStopId)) {
                                stopsGraph.addNode(previousStop);
                            } else {
                                StopNode stopNodeToOverwrite = stopsGraph.getNode(previousStopId);
                                stopNodeToOverwrite = previousStop;
                            }

                        }

                    }
                    previousStop = currentStop;
                    previousStopId = currentStopId;

                    previousStopTripId = currentTripId;
                    previousDepartureTime = departureTime;

                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private static void addWalkingTransferEdges(StopsGraph stopsGraph) {
        try (Connection connection = DriverManager.getConnection(url, username, password)) {
            String sql = "SELECT departure_stop_id, arrival_stop_id, departure_time, arrival_time " +
                    "FROM transitorgroup23.walking_transfer_trips_maastricht";
            try (PreparedStatement statement = connection.prepareStatement(sql)) {

                ResultSet resultSet = statement.executeQuery();

                Integer trip_id = 999999999; // special trip_id that identifies this as a walking trip/transfer between
                                             // two stops

                while (resultSet.next()) {

                    String departureStopId = resultSet.getString("departure_stop_id");
                    String arrivalStopId = resultSet.getString("arrival_stop_id");
                    Time departureTime = resultSet.getTime("departure_time");
                    Time arrivalTime = resultSet.getTime("arrival_time");

                    if (stopsGraph.hasNode(departureStopId) && stopsGraph.hasNode(arrivalStopId)) {
                        StopNode departureStop = stopsGraph.getNode(departureStopId);
                        departureStop.addEdgeTowards(arrivalStopId);
                        departureStop.getEdgeTo(arrivalStopId).addTimeSlot(trip_id, departureTime, arrivalTime);
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private static Stop getStopFromID(String stopID) {
        Stop stop = null;

        try (Connection connection = DriverManager.getConnection(url, username, password)) {
            String sql = "SELECT stop_lat, stop_lon, stop_name FROM transitorgroup23.stops " +
                    "WHERE stop_id = ?";
            try (PreparedStatement statement = connection.prepareStatement(sql)) {
                statement.setString(1, stopID);

                ResultSet resultSet = statement.executeQuery();

                if (resultSet.next()) {
                    stop = new Stop(stopID, resultSet.getDouble("stop_lat"), resultSet.getDouble("stop_lon"),
                            resultSet.getString("stop_name"));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return stop;
    }

    public static String getStopNameFromID(String stopID) {
        try (Connection connection = DriverManager.getConnection(url, username, password)) {
            String sql = "SELECT stop_lat, stop_lon, stop_name FROM transitorgroup23.stops " +
                    "WHERE stop_id = ?";
            try (PreparedStatement statement = connection.prepareStatement(sql)) {
                statement.setString(1, stopID);

                ResultSet resultSet = statement.executeQuery();

                if (resultSet.next()) {
                    return resultSet.getString("stop_name");
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return "";
    }

    private static List<Stop> getClosestBusStops(Point coord) {
        double lat = coord.getLat();
        double lon = coord.getLon();

        List<Stop> closestStopsList = new ArrayList<>();

        try (Connection connection = DriverManager.getConnection(url, username, password)) {
            String sql = "SELECT stop_id, stop_lat, stop_lon, stop_name, " +
                    "(6371 * acos(cos(radians(?)) * cos(radians(stop_lat)) * " +
                    "cos(radians(stop_lon) - radians(?)) + sin(radians(?)) * sin(radians(stop_lat)))) " +
                    "AS distance FROM transitorgroup23.stops " +
                    "ORDER BY distance LIMIT 3";
            try (PreparedStatement statement = connection.prepareStatement(sql)) {
                statement.setDouble(1, lat);
                statement.setDouble(2, lon);
                statement.setDouble(3, lat);

                ResultSet resultSet = statement.executeQuery();

                while (resultSet.next()) {
                    String stop_id = resultSet.getString("stop_id");
                    double stopLat = resultSet.getDouble("stop_lat");
                    double stopLon = resultSet.getDouble("stop_lon");
                    String stopName = resultSet.getString("stop_name");
                    double distanceFromSource = resultSet.getDouble("distance");
                    Stop stop = new Stop(stop_id, stopLat, stopLon, stopName);
                    stop.setDistanceFromPoint(distanceFromSource);
                    closestStopsList.add(stop);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return closestStopsList;
    }

    private static Trip getBestBusTripFromStops(String originStopId, String destinationStopId, Time departureTime,
            StopsGraph stopsGraph) {

        if (!stopsGraph.hasNode(originStopId) || !stopsGraph.hasNode(destinationStopId)) {
            // System.out.println("No trips with one or both of the input stops");
            return null;
        }

        StopNode startStopNode = stopsGraph.getNode(originStopId);
        StopNode destinationStopNode = stopsGraph.getNode(destinationStopId);

        HashSet<String> visitedStopsIds = new HashSet<>(); // Holds a boolean per each stopID, indicating whether it has
                                                           // been visited by the Dijkstra's algorithm
        HashMap<String, Time> earliestTimePerStopId = new HashMap<>();
        HashMap<String, TripNode> viaStopAndTripPerStopId = new HashMap<>(); // Holds the previous stop taken for each
                                                                             // stop in the graph. This way all the
                                                                             // stops in the
        // best path can be determined once the algorithm has finished
        Time finalArrivalTime = null;

        for (StopNode stopNode : stopsGraph.getNodesList()) {
            earliestTimePerStopId.put(stopNode.getStopId(), null);
            viaStopAndTripPerStopId.put(stopNode.getStopId(), null);
        }

        PriorityQueue<DijkstraNode> pq = new PriorityQueue<>(
                (node1, node2) -> new TimeComparator(departureTime).compare(node1.getTime(), node2.getTime()));

        pq.offer(new DijkstraNode(startStopNode, departureTime));
        earliestTimePerStopId.put(startStopNode.getStopId(), departureTime);

        outer: {
            while (!pq.isEmpty()) {

                DijkstraNode currentDijkstraNode = pq.poll();
                StopNode currentStopNode = currentDijkstraNode.getStopNode();

                Time currentTime = currentDijkstraNode.getTime();

                if (visitedStopsIds.contains(currentStopNode.getStopId())) {
                    continue;
                }

                visitedStopsIds.add(currentStopNode.getStopId());
                earliestTimePerStopId.put(currentStopNode.getStopId(), currentTime);

                if (currentStopNode.equals(destinationStopNode)) {
                    finalArrivalTime = currentTime;
                    break outer;
                }

                List<Edge> outgoingEdgesThisStop = currentStopNode.getOutgoingEdgesAsList();

                for (Edge edge : outgoingEdgesThisStop) {

                    String endStopId = edge.getDestinationStopId();
                    StopNode endStopNode = stopsGraph.getNode(endStopId);

                    if (endStopNode != null) {
                        if (!visitedStopsIds.contains(endStopId)) {
                            TimeSlot earliestTimeSlot = edge.getEarliestTimeSlot(currentTime);
                            if (!(earliestTimeSlot == null)) {
                                Time arrivalTimeThisStop = earliestTimeSlot.endTime();
                                viaStopAndTripPerStopId.put(endStopId, new TripNode(currentStopNode.getStopId(),
                                        earliestTimeSlot.tripId(), earliestTimeSlot.endTime()));
                                pq.offer(new DijkstraNode(endStopNode, arrivalTimeThisStop));
                            }
                        }
                    }

                }
            }
        }

        List<TripNode> tripNodesList = new ArrayList<>();
        tripNodesList.add(new TripNode(destinationStopNode.getStopId(), null,
                earliestTimePerStopId.get(destinationStopNode.getStopId())));

        TripNode currentTripNodeInBacktrack = viaStopAndTripPerStopId.get(destinationStopId);

        while (true) {

            if (currentTripNodeInBacktrack == null) {
                return null;
            }

            tripNodesList.add(0, currentTripNodeInBacktrack);
            if (currentTripNodeInBacktrack.stopId().equals(startStopNode.getStopId())) {
                break;
            }

            currentTripNodeInBacktrack = viaStopAndTripPerStopId.get(currentTripNodeInBacktrack.stopId());

        }

        Stop startStop = getStopFromID(startStopNode.getStopId());
        Stop endStop = getStopFromID(destinationStopNode.getStopId());

        Trip bestTrip = new Trip(startStop, endStop, departureTime, finalArrivalTime, 0);
        bestTrip.setTripNodesInTrip(tripNodesList);

        return bestTrip;
    }

    public static Coordinate getCoordsFromStopId(String stopId) {
        try (Connection connection = DriverManager.getConnection(url, username, password)) {
            String sql = "SELECT stop_lat, stop_lon FROM transitorgroup23.maastricht_stops WHERE stop_id = ?";
            try (PreparedStatement statement = connection.prepareStatement(sql)) {
                statement.setString(1, stopId);

                ResultSet resultSet = statement.executeQuery();

                if (resultSet.next()) {
                    return new Coordinate(resultSet.getDouble("stop_lon"), resultSet.getDouble("stop_lat"));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public static String getHeadSignFromTripId(int tripID) {
        Stop stop = null;

        try (Connection connection = DriverManager.getConnection(url, username, password)) {
            String sql = "SELECT trip_headsign FROM transitorgroup23.trips " +
                    "WHERE trip_id = ?";
            try (PreparedStatement statement = connection.prepareStatement(sql)) {
                statement.setInt(1, tripID);

                ResultSet resultSet = statement.executeQuery();

                if (resultSet.next()) {
                    return resultSet.getString("trip_headsign");
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;

    }
}

class TimeComparator implements Comparator<Time> {
    // CLASS ADAPTED Referenced via basic programming materials
    private final Time initialDepartureTime;

    public TimeComparator(Time initialDepartureTime) {
        this.initialDepartureTime = initialDepartureTime;
    }

    @Override
    public int compare(Time t1, Time t2) {

        long diff1 = t1.getTime() - initialDepartureTime.getTime();
        long diff2 = t2.getTime() - initialDepartureTime.getTime();

        if (diff1 < 0) { // these two if statements ensure that a time that is earlier than the initial
                         // departure time gets less priority even though it is earlier
            diff1 += 24 * 60 * 60 * 1000;
        }
        if (diff2 < 0) {
            diff2 += 24 * 60 * 60 * 1000;
        }

        return Long.compare(diff1, diff2);
    }
}
