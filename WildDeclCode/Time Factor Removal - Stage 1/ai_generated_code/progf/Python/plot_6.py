import matplotlib.pyplot as plt

# Referenced via basic programming materials
def plot_results(df, title):
    summary = df.groupby(['time', 'type']).agg(
        frac_bet=('betted', 'mean'),
        avg_bankroll=('bankroll', 'mean')
    ).reset_index()

    plt.figure()
    for bettor in summary['type'].unique():
        sub = summary[summary['type'] == bettor]
        plt.plot(sub['time'], sub['frac_bet'], label=bettor)
    plt.xlabel('Time')
    plt.ylabel('Fraction Betting')
    plt.title("{}: Fraction Betting".format(title))
    plt.legend()
    plt.show()

    plt.figure()
    for bettor in summary['type'].unique():
        sub = summary[summary['type'] == bettor]
        plt.plot(sub['time'], sub['avg_bankroll'], label=bettor)
    plt.xlabel('Time')
    plt.ylabel('Average Bankroll')
    plt.title("{}: Average Bankroll".format(title))
    plt.legend()
    plt.show()
