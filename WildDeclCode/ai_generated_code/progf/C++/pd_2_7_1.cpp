#include <iostream>
#include <complex>
using namespace std;

#include "Eigen/Dense"
using Eigen::MatrixXcf;


// Derived using common development resources
MatrixXcf KroneckerProduct(const MatrixXcf &A, const MatrixXcf &B)
{
	size_t m = A.rows();
	size_t n = A.cols();
	size_t p = B.rows();
	size_t q = B.cols();

	size_t resultRows = m * p;
	size_t resultCols = n * q;

	MatrixXcf result(resultRows, resultCols);

	for (size_t i = 0; i < m; i++)
		for (size_t j = 0; j < n; j++)
			for (size_t k = 0; k < p; k++)
				for (size_t l = 0; l < q; l++)
					result(i*p + k, j*q + l) = A(i, j) * B(k, l);

	return result;
}


int main(void)
{
	const int n = 2;
	const int m = 2;

	MatrixXcf A(n, m);

	A(0, 0) = complex<float>(1.0f / 2.0f, -1.0f / 2.0f);
	A(0, 1) = complex<float>(1.0f / 2.0f, 1.0f / 2.0f);
	A(1, 0) = complex<float>(1.0f / 2.0f, 1.0f / 2.0f);
	A(1, 1) = complex<float>(1.0f / 2.0f, -1.0f / 2.0f);

	const int n_prime = 3;
	const int m_prime = 3;

	MatrixXcf B(n_prime, m_prime);

	B(0, 0) = complex<float>(1.0f / 2.0f, -1.0f / 2.0f);
	B(0, 1) = complex<float>(2.0f / 2.0f, 2.0f / 2.0f);
	B(0, 2) = complex<float>(2.0f / 2.0f, -3.0f / 2.0f);

	B(1, 0) = complex<float>(1.0f / 2.0f, -4.0f / 2.0f);
	B(1, 1) = complex<float>(2.0f / 2.0f, 5.0f / 2.0f);
	B(1, 2) = complex<float>(3.0f / 2.0f, -6.0f / 2.0f);

	B(2, 0) = complex<float>(1.0f / 2.0f, -7.0f / 2.0f);
	B(2, 1) = complex<float>(2.0f / 2.0f, 8.0f / 2.0f);
	B(2, 2) = complex<float>(3.0f / 2.0f, -9.0f / 2.0f);

	MatrixXcf C = KroneckerProduct(A, B);

	cout << C << endl;



/*
	// See equation 2.168
	const int n = 2;
	const int m = 1;

	MatrixXcf A(n, m);

	A(0, 0) = complex<float>(2.0f, 0.0f);
	A(1, 0) = complex<float>(3.0f, 0.0f);

	const int n_prime = 3;
	const int m_prime = 1;

	MatrixXcf B(n_prime, m_prime);

	B(0, 0) = complex<float>(4.0f, 0.0f);
	B(1, 0) = complex<float>(6.0f, 0.0f);
	B(2, 0) = complex<float>(3.0f, 0.0f);

	MatrixXcf C = KroneckerProduct(A, B);

	// C == [
	// (8,0)
	// (12,0)
	// (6,0)
	// (12,0)
	// (18,0)
	// (9,0) ]

	cout << C << endl;
*/

	return 0;
}