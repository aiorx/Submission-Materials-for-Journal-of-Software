package controller;

//import model.charactersModel.Edge;
//import model.charactersModel.Polygon;
import model.FinalPanelModel;
import model.MyPolygon;
//import model.NonRigid;
import model.collision.Edge;

import java.awt.*;
import java.awt.geom.Line2D;
import java.awt.geom.Point2D;
import java.awt.geom.Rectangle2D;
import java.util.ArrayList;
import java.util.HashMap;

import static java.lang.Math.abs;
import static java.lang.Math.min;
import static model.geometry.GeometricToolBox.clockwiseSort;
import static model.geometry.GeometricToolBox.pointsToPolygon;

public class Utils {
    public static Point2D relativeLocation(Point2D point,Point2D anchor){
        return new Point2D.Double(point.getX()-anchor.getX(),point.getY()-anchor.getY());
    }
    public static Point2D multiplyVector(Point2D point,double scalar){
        return new Point2D.Double(point.getX()*scalar,point.getY()*scalar);
    }
    public static Point2D multiplyVectorXYComponent(Point2D point,double scalarX, double scalarY){
        return new Point2D.Double(point.getX()*scalarX, point.getY() * scalarY);
    }
    public static Point2D addVectors(Point2D point1,Point2D point2){
        return new Point2D.Double(point1.getX()+point2.getX(),point1.getY()+point2.getY());
    }
    public static Point2D weightedAddVectors(Point2D point1,Point2D point2,double weight1,double weight2){
        return multiplyVector(addVectors(multiplyVector(point1,weight1),multiplyVector(point2,weight2)),1/(weight1+weight2));
    }
    public static double dotVectors(Point2D point1, Point2D point2){
        return point1.getX() * point2.getX() + point1.getY() * point2.getY();
    }
    public static Point2D normalizeVector(Point2D point){
        double size = Math.hypot(point.getX(), point.getY());
        double x = point.getX() / size;
        double y = point.getY() / size;
        point.setLocation(x, y);
        return point;
    }

    public static Point2D normalizeTrigorathVector(Point2D point){
        double size = Math.hypot(point.getX(), point.getY());
        double x = point.getX() / size;
        double y = point.getY() / size;
        point.setLocation(x, y);
        return multiplyVector(point, 1.5);
    }
    public static Point2D perpendicularClockwise(Point2D vector)
    {
        return new Point2D.Double(vector.getY(), -vector.getX());
    }

    public static Point2D PerpendicularCounterClockwise(Point2D vector)
    {
        return new Point2D.Double(-vector.getY(), vector.getX());
    }

//    public static Point2D PerpendicularVector(Line2D line2D)
//    {
//        return new Point2D.Double(-vector.getY(), vector.getX());
//    }

//    public static Point2D getIntersectionPoint(Line2D line1, Line2D line2) {
//        if (!line1.intersectsLine(line2)) return null;
//
//        double px = line1.getX1(),
//                py = line1.getY1(),
//                rx = line1.getX2() - px,
//                ry = line1.getY2() - py;
//        double qx = line2.getX1(),
//                qy = line2.getY1(),
//                sx = line2.getX2() - qx,
//                sy = line2.getY2() - qy;
//
//        double det = rx * sy - ry * sx;
//        if (det == 0) {
//            return null;  // Lines are parallel
//        } else {
//            double t = ((qx - px) * sy - (qy - py) * sx) / det;
//            return new Point2D.Double(px + t * rx, py + t * ry);
//        }
//    }
    public static Point2D findMidPoint(Point2D point1, Point2D point2){
        return new Point2D.Double((point1.getX()+point2.getX())/2, (point1.getY()+point2.getY())/2);
    }
    public static double findDistance(Point2D point1, Point2D point2){
        double dx = point1.getX() - point2.getX();
        double dy = point1.getY() - point2.getY();
        double distance = dx*dx + dy*dy;
        return Math.sqrt(distance);
    }

    public static double calculateVectorMagnitude(Point2D point){
        double dx = point.getX();
        double dy = point.getY();
        double distance = dx*dx + dy*dy;
        return Math.sqrt(distance);
    }

    public static double findAngleBetweenTwoVectors(Point2D u, Point2D v){
        double dotValue = dotVectors(u, v);
        double angle =  dotValue/(calculateVectorMagnitude(u)*calculateVectorMagnitude(v));
        return Math.acos(angle);
    }

    public static Point2D closestPointOnPolygon(Point2D point, Point2D[] vertices){
        double minDistance = Double.MAX_VALUE;
        Point2D closest = null;
        for (int i=0;i<vertices.length;i++){

            Point2D temp = getClosestPointOnSegment(vertices[i],vertices[(i+1)%vertices.length],point);
            double distance = temp.distance(point);
            if (distance < minDistance) {
                minDistance = distance;
                closest = temp;
            }
        }
        return closest;
    }


    public static Point2D findClosestPointOnEdges(Point2D point, ArrayList<Line2D> edges) {
//        if (edges == null) return null;
        Point2D closestPoint = null;
        double minDistance = Double.MAX_VALUE;

        for (Line2D edge : edges) {
            Point2D closest = getClosestPointOnLine(edge, point);
            double distance = closest.distance(point);

            if (distance < minDistance) {
                minDistance = distance;
                closestPoint = closest;
            }
        }

        return closestPoint;
    }

    private static Point2D getClosestPointOnLine(Line2D line, Point2D point) {
        double x1 = line.getX1();
        double y1 = line.getY1();
        double x2 = line.getX2();
        double y2 = line.getY2();
        double px = point.getX();
        double py = point.getY();

        double dx = x2 - x1;
        double dy = y2 - y1;
        double t = ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy);

        if (t < 0) {
            t = 0;
        } else if (t > 1) {
            t = 1;
        }

        double closestX = x1 + t * dx;
        double closestY = y1 + t * dy;

        return new Point2D.Double(closestX, closestY);
    }


    public static int findPanelEdgeIndex(ArrayList<Point2D> vertices, Point2D intersection){
        double minDistance = Double.MAX_VALUE;
        int index = -1;
        for (int i=0; i < vertices.size(); i++){
            Point2D temp = getClosestPointOnSegment(vertices.get(i),vertices.get((i+1)%vertices.size()),intersection);
            double distance = temp.distance(intersection);
            if (distance < minDistance) {
                minDistance = distance;
                index = i;
            }
        }
        return index;
    }


    public static HashMap<Integer, Point2D> closestPointOnEdges(Point2D point, ArrayList<Line2D> edges){

//        System.out.println("dsdsdsdsdsdsdsd");

//        System.out.println(edges.get(0).head1);


        double minDistance = Double.MAX_VALUE;
        Point2D closest = null;
        int edgeIndex = -1;
        for (int i=0; i<edges.size(); i++){
            Point2D temp = getClosestPointOnSegment(edges.get(i).getP1(), edges.get(i).getP2(), point);
            double distance = temp.distance(point);
//            System.out.println(distance);
            if (distance < minDistance) {
//                System.out.println("+++++========++++++++++");
                edgeIndex = i;
                minDistance = distance;
                closest = temp;
            }
        }

        HashMap<Integer, Point2D> result = new HashMap<>(1);
        result.put(edgeIndex, closest);
        return result;
    }



//    public static Point2D closestPointOnEdgesOfAPolygon(Point2D point, Polygon polygon){
//        ArrayList<Edge> edges = polygon.getEdges();
//        double minDistance = Double.MAX_VALUE;
//        Point2D closest = null;
//        for (Edge edge : edges) {
//            Point2D head1 = edge.head1;
//            Point2D head2 = edge.head2;
//            Point2D temp = getClosestPointOnSegment(head1, head2, point);
//            double distance = temp.distance(point);
//            if (distance < minDistance) {
//                minDistance = distance;
//                closest = temp;
//            }
//        }
//        return closest;
//    }




    public static Point2D getClosestPointOnSegment(Point2D head1, Point2D head2, Point2D point) {
        double u =((point.getX()-head1.getX())*(head2.getX()-head1.getX())+(point.getY()-head1.getY())*(head2.getY()-head1.getY()))/head2.distanceSq(head1);
        if (u > 1.0) return (Point2D) head2.clone();
        else if (u <= 0.0) return (Point2D) head1.clone();
        else return new Point2D.Double(head2.getX()* u + head1.getX() * (1.0 - u) + 0.5,head2.getY() * u + head1.getY() * (1.0 - u) + 0.5);
    }


    public static Point2D rotateVector(Point2D vector, double theta){
        double x = vector.getX();
        double y = vector.getY();
        double length = Math.sqrt(x*x + y*y);
        double alpha = Math.atan(y/x);
        double alphaPrime = alpha-theta;
        return new Point2D.Double(length*Math.cos(alphaPrime), length*Math.sin(alphaPrime));
    }

    public static void AABB(Rectangle2D rect1, Rectangle2D rect2){

        boolean a = rect1.getMaxX() < rect2.getMinX();
        boolean b = rect1.getMinX() > rect2.getMaxX();

        boolean c = rect1.getMaxY() < rect2.getMinY();
        boolean d = rect1.getMinY() > rect2.getMaxY();

        if (!a && !b){
            double distance1 = abs(rect1.getMaxX() - rect2.getMinX());
            double distance2 = abs(rect2.getMaxX() - rect1.getMinX());
            double movementX = min(distance1, distance2);
        }

        if (!c && !d){
            double distance1 = abs(rect1.getMaxY() - rect2.getMinY());
            double distance2 = abs(rect2.getMaxY() - rect1.getMinY());
            double movementY = min(distance1, distance2);
        }

    }

    // I think this one is the correct AABB check!
    public static boolean doAABBsIntersect(Rectangle2D rect1, Rectangle2D rect2) {
        // Check overlap in X-axis
        boolean overlapX = rect1.getX() < rect2.getX() + rect2.getWidth() && rect1.getX() + rect1.getWidth() > rect2.getX();

        // Check overlap in Y-axis
        boolean overlapY = rect1.getY() < rect2.getY() + rect2.getHeight() && rect1.getY() + rect1.getHeight() > rect2.getY();

        // Return true if there is overlap in X or Y dimensions
        return overlapX && overlapY;
    }


    public static boolean isPointInPolygon(Point2D point, Point2D[] polygon) {
        boolean result = false;
        int n = polygon.length;
        for (int i = 0, j = n - 1; i < n; j = i++) {
            if ((polygon[i].getY() > point.getY()) != (polygon[j].getY() > point.getY()) &&
                    (point.getX() < (polygon[j].getX() - polygon[i].getX()) * (point.getY() - polygon[i].getY()) / (polygon[j].getY() - polygon[i].getY()) + polygon[i].getX())) {
                result = !result;
            }
        }
        return result;
    }

    private static boolean isIntersecting(Point2D point, Point2D vertex1, Point2D vertex2) {
        double px = point.getX();
        double py = point.getY();
        double v1x = vertex1.getX();
        double v1y = vertex1.getY();
        double v2x = vertex2.getX();
        double v2y = vertex2.getY();

        if (v1y > v2y) {
            Point2D temp = vertex1;
            vertex1 = vertex2;
            vertex2 = temp;
        }

        if (py == v1y || py == v2y) {
            py += 0.0001;
        }

        if ((py > v2y || py < v1y) || (px > Math.max(v1x, v2x))) {
            return false;
        }

        if (px < Math.min(v1x, v2x)) {
            return true;
        }

        double red = (px - v1x) * (v2y - v1y) - (py - v1y) * (v2x - v1x);
        if (red == 0) {
            return true;
        }

        return red < 0;
    }


    public static Point2D getIntersection(Point2D A, Point2D B, Point2D C, Point2D D) {
        double a1 = B.getY() - A.getY();
        double b1 = A.getX() - B.getX();
        double c1 = a1 * A.getX() + b1 * A.getY();

        double a2 = D.getY() - C.getY();
        double b2 = C.getX() - D.getX();
        double c2 = a2 * C.getX() + b2 * C.getY();

        double delta = a1 * b2 - a2 * b1;
        if (delta == 0) {
            return null; // Parallel lines
        }

        double x = (b2 * c1 - b1 * c2) / delta;
        double y = (a1 * c2 - a2 * c1) / delta;
        Point2D intersection = new Point2D.Double(x, y);

        if (isPointOnLineSegment(intersection, A, B) && isPointOnLineSegment(intersection, C, D)) {
            return intersection;
        }
        return null;
    }

    private static boolean isPointOnLineSegment(Point2D point, Point2D A, Point2D B) {
        return point.getX() >= Math.min(A.getX(), B.getX()) &&
                point.getX() <= Math.max(A.getX(), B.getX()) &&
                point.getY() >= Math.min(A.getY(), B.getY()) &&
                point.getY() <= Math.max(A.getY(), B.getY());
    }

    public static ArrayList<Point> convertPoint2DToPoint(ArrayList<Point2D> point2DList) {
        ArrayList<Point> pointList = new ArrayList<>();
        for (Point2D point2D : point2DList) {
            pointList.add(new Point((int) point2D.getX(), (int) point2D.getY()));
        }
        return pointList;
    }

    public static Point findWeightedAvg(ArrayList<? extends Point> points){
        int xAvg = 0;
        int yAvg = 0;

        for (Point p : points){
            xAvg += p.x;
            yAvg += p.y;
        }
        return new Point(xAvg, yAvg);
    }


    // todo edit this fucking ugly method
    public static Polygon combinePolygons(Polygon p1, Polygon p2){
        int xSum=0;
        int ySum=0;
        Point[] pVertices1  = new Point[p1.npoints];
        for (int i = 0; i < p1.npoints; i++) {
            pVertices1[i] = new Point(p1.xpoints[i], p1.ypoints[i]);
            xSum+=p1.xpoints[i];
            ySum+=p1.ypoints[i];
        }
        Point[] pVertices2  = new Point[p2.npoints];
        for (int i = 0; i < p2.npoints; i++) {
            pVertices2[i] = new Point(p2.xpoints[i], p2.ypoints[i]);

            xSum+=p2.xpoints[i];
            ySum+=p2.ypoints[i];
        }
        Point pivot = new Point(xSum, ySum);
        ArrayList<Point> vertices = new ArrayList<>();
        for (int i = 0; i < p1.npoints; i++) {
            Point vtx1 = new Point(p1.xpoints[i], p1.ypoints[i]);
            if (isPointInPolygon(vtx1, pVertices2)) vertices.add(vtx1);
        }
        for (int i = 0; i < p2.npoints; i++) {
            Point vtx2 = new Point(p2.xpoints[i], p2.ypoints[i]);
            if (isPointInPolygon(vtx2, pVertices1)) vertices.add(vtx2);
        }
        return pointsToPolygon(clockwiseSort(vertices, pivot));
    }


    public static Polygon createSinglePolygon(ArrayList<Polygon> polygons){
        if (polygons == null) return null;
        Polygon cur = polygons.get(0);
        for (int i = 1; i < polygons.size(); i++) {
            cur = combinePolygons(cur, polygons.get(i));
        }
        return cur;
    }


    public static boolean isPointInPolygon(Point point, Point[] polygon) {
        boolean result = false;
        int n = polygon.length;
        for (int i = 0, j = n - 1; i < n; j = i++) {
            if ((polygon[i].getY() > point.getY()) != (polygon[j].getY() > point.getY()) &&
                    (point.getX() < (polygon[j].getX() - polygon[i].getX()) * (point.getY() - polygon[i].getY()) / (polygon[j].getY() - polygon[i].getY()) + polygon[i].getX())) {
                result = !result;
            }
        }
        return result;
    }


    // Designed via basic programming aids:
    public static Point2D getIntersection(Line2D line1, Line2D line2) {
        double x1 = line1.getX1();
        double y1 = line1.getY1();
        double x2 = line1.getX2();
        double y2 = line1.getY2();

        double x3 = line2.getX1();
        double y3 = line2.getY1();
        double x4 = line2.getX2();
        double y4 = line2.getY2();

        double denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
        if (denominator == 0) {
            return null; // Lines are parallel
        }

        double ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
        double ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

        if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
            double x = x1 + ua * (x2 - x1);
            double y = y1 + ua * (y2 - y1);
            return new Point2D.Double(x, y);
        }

        return null; // Lines do not intersect within the line segments
    }


    // following method is only usable for panels (AABBs)
    public static ArrayList<Point2D> findIntersections(FinalPanelModel p1, FinalPanelModel p2){
        ArrayList<Line2D> edges1 = p1.getUnTrimmedEdges();
        ArrayList<Line2D> edges2 = p2.getUnTrimmedEdges();

        ArrayList<Point2D> intersections = new ArrayList<>();
        for (int i = 0; i < 4; i++) {
            for (int j = 0; j < 4; j++) {
                Point2D intersection = getIntersection(edges1.get(i), edges2.get(j));
                if (intersection != null) intersections.add(intersection);
            }
        }
        if (intersections.size() != 2) return null; // todo check if this line is useful or not!
        return intersections;
    }

    public static Line2D moveLine(Line2D line, Point2D movement){
        Point2D firstPoint = addVectors(line.getP1(), movement);
        Point2D secondPoint = addVectors(line.getP2(), movement);
        return new Line2D.Double(firstPoint, secondPoint);
    }

    public static Point2D adjustVectorMagnitude(Point2D vector, double magnitude){
        double currentMagnitude = Math.sqrt(vector.getX()*vector.getX() + vector.getY()*vector.getY());
        double xNormalized = vector.getX()/currentMagnitude;
        double yNormalized = vector.getY()/currentMagnitude;
        return new Point2D.Double(xNormalized*magnitude, yNormalized*magnitude);
    }

    public static MyPolygon rotateMyPolygon(MyPolygon polygon, double angle, Point2D center) {
        double[] xPoints = polygon.xpoints;
        double[] yPoints = polygon.ypoints;
        int nPoints = polygon.npoints;

        double radians = Math.toRadians(angle);
        double cosTheta = Math.cos(radians);
        double sinTheta = Math.sin(radians);

        double[] newXPoints = new double[nPoints];
        double[] newYPoints = new double[nPoints];

        for (int i = 0; i < nPoints; i++) {
            // Translate point to origin
            double x = xPoints[i] - center.getX();
            double y = yPoints[i] - center.getY();

            // Apply rotation
            double newX = x * cosTheta - y * sinTheta;
            double newY = x * sinTheta + y * cosTheta;

            // Translate point back
            newXPoints[i] = (newX + center.getX());
            newYPoints[i] = (newY + center.getY());
        }

        return new MyPolygon(newXPoints, newYPoints, nPoints);
    }


    public static ArrayList<Line2D> findEdges(MyPolygon myPolygon) {
        ArrayList<Line2D> edges = new ArrayList<>();
        int numVertices = myPolygon.npoints;

        for (int i = 0; i < numVertices; i++) {
            Point2D start = new Point2D.Double(myPolygon.xpoints[i], myPolygon.ypoints[i]);
            Point2D end = new Point2D.Double(myPolygon.xpoints[(i + 1) % numVertices], myPolygon.ypoints[(i + 1) % numVertices]);
            edges.add(new Line2D.Double(start, end));
        }

        return edges;
    }





}