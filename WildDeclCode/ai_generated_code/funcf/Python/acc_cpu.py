@staticmethod
    def backward(context, your_grad):
        x, x_norm, var, eps, gamma = context.safe
        g_beta = your_grad.sum(axis=0)
        g_gamma = (x_norm * your_grad).sum(axis=0)
        g_x_norm = your_grad * gamma
        # === Drafted using common development resources. Have no idea how it works. ===
        g_var = np.sum(-0.5 * g_x_norm * (x - x.mean(axis=0)) / ((var + eps) ** 1.5), axis=0)
        g_mu = np.sum(-g_x_norm / np.sqrt(var + eps), axis=0)
        g_x = g_x_norm / np.sqrt(var + eps) + 2.0 * (x - x.mean(axis=0)) * g_var / x.shape[0] + g_mu / x.shape[0]
        # === End. ===
        return g_x, g_gamma, g_beta