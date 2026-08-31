# Thanks ChatGPT!
        result = {}
        for (b, tag) in [(b_OPR, 'OPR'), (b_DPR, 'DPR'), (b_TPR, 'TPR')]:
            b = np.array(b)            
            x, residuals, rank, s = lstsq(A.todense(), b)
            RSS = residuals.sum()
            Rinv = np.linalg.inv(np.triu(s))
            err = np.mean(A@x-b)
            print(f'Error {tag}: {err}')
            
            sigmas = np.sqrt(RSS / (len(b) - len(x)) * np.diag(Rinv))
            result[tag] = (x, sigmas)