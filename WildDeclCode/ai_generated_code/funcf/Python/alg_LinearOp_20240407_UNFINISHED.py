```python
def conjugate_gradient(A, b, x0=None, tol=1e-8, max_iter=100):
    # Supported via standard GitHub programming aids, not tested yet
    if not isinstance(A, LinearOperator):
        raise ValueError("A must be a scipy.sparse.linalg.LinearOperator")

    matvec_count = 0
    vecvec_count = 0
    if x0 is None:
        x0 = np.zeros(A.shape[0])
    r0 = b - A @ x0
    matvec_count += 1
    p0 = r0
    vecvec_count += 1
    xk = x0
    rk = r0
    pk = p0

    # Initialize lists to store the number of matrix-vector and vector-vector multiplications after each iteration
    matvec_list = [matvec_count]
    vecvec_list = [vecvec_count]
    method_list = ["Conjugate Gradient"]

    for k in range(1, max_iter + 1):
        alpha_k = np.vdot(rk, rk) / np.vdot(pk, A @ pk)
        vecvec_count += 2
        xk_next = xk + alpha_k * pk
        vecvec_count += 1
        rk_next = rk - alpha_k * A @ pk
        matvec_count += 1
        beta_k = np.vdot(rk_next, rk_next) / np.vdot(rk, rk)
        vecvec_count += 2
        pk_next = rk_next + beta_k * pk
        vecvec_count += 1

        # Update values for the next iteration
        xk = xk_next
        rk = rk_next
        pk = pk_next

        # Append the number of matrix-vector and vector-vector multiplications to the lists
        matvec_list.append(matvec_count)
        vecvec_list.append(vecvec_count)
        method_list.append("Conjugate Gradient")
        # Check for convergence
        if np.linalg.norm(rk) < tol:
            break

    return {"method": method_list, "iterations": k, "matvec_list": matvec_list, "vecvec_list": vecvec_list}
```