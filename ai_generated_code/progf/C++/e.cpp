// Following code Built using basic development resources o-1 preview

#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>
#include <cstdio>

using namespace std;

// Define a point structure
struct Point {
    long long x, y;

    // Constructor
    Point(long long _x = 0, long long _y = 0) : x(_x), y(_y) {}

    // Operator overloads for sorting and comparisons
    bool operator<(const Point& p) const {
        return x < p.x || (x == p.x && y < p.y);
    }

    bool operator==(const Point& p) const {
        return x == p.x && y == p.y;
    }
};

// Cross product of OA and OB vectors
long long cross(const Point& O, const Point& A, const Point& B) {
    return (A.x - O.x) * (B.y - O.y) - (A.y - O.y) * (B.x - O.x);
}

// Euclidean distance between two points
double distance(const Point& A, const Point& B) {
    long long dx = A.x - B.x;
    long long dy = A.y - B.y;
    return sqrt(dx * dx + dy * dy);
}

// Andrew's Monotone Chain Algorithm for Convex Hull
vector<Point> convexHull(vector<Point>& P) {
    int n = P.size(), k = 0;
    if (n == 1) return P;
    vector<Point> H(2 * n);

    // Sort points lexicographically
    sort(P.begin(), P.end());

    // Build lower hull
    for (int i = 0; i < n; ++i) {
        // Remove last point from H if it makes a non-left turn
        while (k >= 2 && cross(H[k - 2], H[k - 1], P[i]) <= 0) k--;
        H[k++] = P[i];
    }

    // Build upper hull
    for (int i = n - 2, t = k + 1; i >= 0; --i) {
        // Remove last point from H if it makes a non-left turn
        while (k >= t && cross(H[k - 2], H[k - 1], P[i]) <= 0) k--;
        H[k++] = P[i];
    }

    H.resize(k - 1); // Remove redundant last point
    return H;
}

int main() {
    int S;
    cin >> S;

    for (int s = 0; s < S; ++s) {
        int n;
        cin >> n;
        vector<Point> polyline1(n);
        for (int i = 0; i < n; ++i) {
            cin >> polyline1[i].x >> polyline1[i].y;
        }

        int m;
        cin >> m;
        vector<Point> polyline2(m);
        for (int i = 0; i < m; ++i) {
            cin >> polyline2[i].x >> polyline2[i].y;
        }

        // Compute convex hulls of both polylines
        vector<Point> hull1 = convexHull(polyline1);
        vector<Point> hull2 = convexHull(polyline2);

        // Find the maximum distance between any two points on the convex hulls
        double maxDist = 0.0;

        // Since n*m <= 1e5 per test case, it's acceptable to compute all pairwise distances
        for (const Point& p1 : hull1) {
            for (const Point& p2 : hull2) {
                double dist = distance(p1, p2);
                if (dist > maxDist) {
                    maxDist = dist;
                }
            }
        }

        // Output the result with high precision
        printf("%.15f\n", maxDist);
    }

    return 0;
}
