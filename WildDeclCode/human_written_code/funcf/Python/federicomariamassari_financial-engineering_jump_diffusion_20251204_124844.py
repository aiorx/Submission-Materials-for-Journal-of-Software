```python
def jump_diffusion(S=1, X=0.5, T=1, mu=0.12, sigma=0.3, Lambda=0.25,
                   a=0.2, b=0.2, Nsteps=252, Nsim=100, alpha=0.05, seed=None):
    '''
    Monte Carlo simulation [1] of Merton's Jump Diffusion Model [2].
    The model is specified through the stochastic differential equation (SDE):

                        dS(t)
                        ----- = mu*dt + sigma*dW(t) + dJ(t)
                        S(t-)

    with:

    mu, sigma: constants, the drift and volatility coefficients of the stock
               price process;
    W: a standard one-dimensional Brownian motion;
    J: a jump process, independent of W, with piecewise constant sample paths.
       It is defined as the sum of multiplicative jumps Y(j).

    Input
    ---------------------------------------------------------------------------
    S: float. The current asset price.
    X: float. The strike price, i.e. the price at which the asset may be bought
       (call) or sold (put) in an option contract [3].
    T: int or float. The maturity of the option contract, i.e. the final
       monitoring date.
    mu, sigma: float. Respectively, the drift and volatility coefficients of
               the asset price process.
    Lambda: float. The intensity of the Poisson process in the jump diffusion
            model ('lambda' is a protected keyword in Python).
    a, b: float. Parameters required to calculate, respectively, the mean and
          variance of a standard lognormal distribution, log(x) ~ N(a, b**2).
          (see code).
    Nsteps: int. The number of monitoring dates, i.e. the time steps.
    Nsim: int. The number of Monte Carlo simulations (at least 10,000 required
          to generate stable results).
    alpha: float. The confidence interval significance level, in [0, 1].
    seed: int. Set random seed, for reproducibility of the results. Default
          value is None (the best seed available is used, but outcome will vary
          in each experiment).

    References
    ---------------------------------------------------------------------------
    [1] Glasserman, P. (2003): 'Monte Carlo Methods in Financial Engineering',
        Springer Applications of Mathematics, Vol. 53
    [2] Merton, R.C. (1976): 'Option Pricing when Underlying Stock Returns are
        Discontinuous', Journal of Financial Economics, 3:125-144.
    [3] Hull, J.C. (2017): 'Options, Futures, and Other Derivatives', 10th
        Edition, Pearson.
    '''

    # Import required libraries
    import time
    import numpy as np
    from scipy import stats
    import matplotlib.pyplot as plt
    import seaborn as sns

    # Set random seed
    np.random.seed(seed)

    '''
    Time the whole path-generating process, using a tic-toc method familiar
    to MATLAB users
    '''
    tic = time.time()

    # Calculate the length of the time step
    Delta_t = T/Nsteps

    '''
    Compute mean and variance of a standard lognormal distribution from user
    defined parameters a and b. The latter are useful to simulate the jump
    component in Monte Carlo.
    a and b are chosen such that log(Y(j)) ~ N(a, b**2). This implies that the
    mean and variance of the multiplicative jumps will be:

     * mean_Y = np.exp(a + 0.5*(b**2))
     * variance_Y = np.exp(2*a + b**2) * (np.exp(b**2)-1)

    '''
    mean_Y = np.exp(a + 0.5*(b**2))
    variance_Y = np.exp(2*a + b**2) * (np.exp(b**2)-1)

    '''
    Calculate the theoretical drift (M) and volatility (V) of the stock price
    process under Merton's jump diffusion model. These values can be used to
    monitor the rate of convergence of Monte Carlo estimates as the number of
    simulated experiments increases, and can help spot errors, if any, in
    implementing the model.
    '''
    M = S * np.exp(mu*T + Lambda*T*(mean_Y-1))
    V = S**2 * (np.exp((2*mu + sigma**2)*T \
        + Lambda*T*(variance_Y + mean_Y**2 - 1)) \
        - np.exp(2*mu*T + 2*Lambda*T*(mean_Y - 1)))

    '''
    Generate an Nsim x (Nsteps+1) array of standard normal random variables.
    These will be used to simulate the Brownian motion component of the stock
    price process.
    '''
    Z = np.random.normal(0, 1, size=(Nsim, Nsteps))

    '''
    Generate an Nsim x (Nsteps+1) array of Poisson random variables with
    parameter Lambda*Delta_t. These will be used to simulate the jump component
    of the stock price process.
    '''
    P = np.random.poisson(Lambda*Delta_t, size=(Nsim, Nsteps))

    '''
    Generate an Nsim x (Nsteps+1) array of lognormal random variables with
    parameters a and b. These will be used to simulate the jump sizes.
    '''
    Y = np.random.lognormal(mean=a, sigma=b, size=(Nsim, Nsteps))

    # Initialize the stock price paths array
    S_paths = np.zeros((Nsim, Nsteps+1))
    S_paths[:, 0] = S

    # Simulate the paths
    for t in range(1, Nsteps+1):
        # Calculate the jump multiplier for each simulation
        jump_multiplier = np.prod(Y[:, :t] ** P[:, :t], axis=1)
        # Calculate the diffusion component
        diffusion = np.exp((mu - 0.5*sigma**2)*Delta_t + sigma*np.sqrt(Delta_t)*Z[:, t-1])
        # Update the stock price
        S_paths[:, t] = S_paths[:, t-1] * diffusion * jump_multiplier

    # Calculate the option payoff at maturity
    payoff = np.maximum(S_paths[:, -1] - X, 0)

    # Calculate the discounted expected payoff
    price = np.exp(-mu*T) * np.mean(payoff)

    # Calculate confidence interval
    std_error = np.std(payoff) / np.sqrt(Nsim)
    conf_int = stats.norm.interval(1-alpha, loc=price, scale=std_error)

    # Time elapsed
    toc = time.time() - tic

    # Return results as dictionary
    return {
        'price': price,
        'conf_int': conf_int,
        'mean': M,
        'variance': V,
        'time_elapsed': toc,
        'paths': S_paths
    }
```