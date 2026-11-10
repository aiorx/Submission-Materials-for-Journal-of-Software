//Testing header file for Vec3 class- Drafted using common development resources
#include <iostream>
#include "vec3.h"
using namespace std;

int main() {
    float x, y, z, eta;

    cout << "Enter vector A (x y z): ";
    cin >> x >> y >> z;
    Vec3 A(x, y, z);

    cout << "Enter vector B (x y z): ";
    cin >> x >> y >> z;
    Vec3 B(x, y, z);

    cout << "Enter normal N (x y z): ";
    cin >> x >> y >> z;
    Vec3 N(x, y, z);

    cout << "Enter refractive index (e.g., 4/3 = 1.333): ";
    cin >> eta;
    cout << "\nVector A: " << A.x() << " " << A.y() << " " << A.z() << endl;
    cout << "Vector B: " << B.x() << " " << B.y() << " " << B.z() << endl;
    cout << "Normal N: " << N.x() << " " << N.y() << " " << N.z() << endl;
    cout << "Refractive Index (eta): " << eta << endl;

    Vec3 AplusB = A + B;
    Vec3 AminusB = A - B;
    float AdotB = A.dot(B);
    Vec3 AcrossB = A.cross(B);
    float Alen = A.length();
    Vec3 Aunit = A.unit();
    Vec3 Areflect = A.reflect(N);
    Vec3 Arefract = A.unit().refract(N, eta);

    cout << "\nA + B = " << AplusB.x() << " " << AplusB.y() << " " << AplusB.z() << endl;
    cout << "A - B = " << AminusB.x() << " " << AminusB.y() << " " << AminusB.z() << endl;
    cout << "A dot B = " << AdotB << endl;
    cout << "A cross B = " << AcrossB.x() << " " << AcrossB.y() << " " << AcrossB.z() << endl;
    cout << "Length of A = " << Alen << endl;
    cout << "Unit vector of A = " << Aunit.x() << " " << Aunit.y() << " " << Aunit.z() << endl;
    cout << "Reflect A about N = " << Areflect.x() << " " << Areflect.y() << " " << Areflect.z() << endl;
    cout << "Refract unit(A) through N = " << Arefract.x() << " " << Arefract.y() << " " << Arefract.z() << endl;

    return 0;
}