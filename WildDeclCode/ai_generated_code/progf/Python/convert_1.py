#!/usr/bin/env python3
# Made by Aiden Johnson and Alden Harcourt
# SWCI, ELO, Massey, and USAU rankings with debug tools primarily Drafted using common development resources

import sys
import csv
from datetime import datetime
import numpy as np
from scipy.linalg import lstsq
import time


def generate_tables(input_file):
    teams = {}
    matches = []
    results = []
    fun_facts = []

    next_team_id = 1
    next_match_id = 1

    with open(input_file, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            team_one = row['teamOneName'].strip()
            team_two = row['teamTwoName'].strip()

            if team_one not in teams:
                teams[team_one] = next_team_id; next_team_id += 1
            if team_two not in teams:
                teams[team_two] = next_team_id; next_team_id += 1

            match_id = next_match_id; next_match_id += 1
            matches.append([match_id, row.get('tournament','').strip(), row['date'].strip()])

            t1 = teams[team_one]; t2 = teams[team_two]
            s1 = int(row['scoreOne']); s2 = int(row['scoreTwo'])
            results.append([match_id, t1, t2, s1, s2])
            results.append([match_id, t2, t1, s2, s1])

    # compute fun facts
    games_played = {tid:0 for tid in teams.values()}
    point_diff   = {tid:0 for tid in teams.values()}
    total_pts    = {tid:0 for tid in teams.values()}
    for mid, tid, oid, pf, pa in results:
        games_played[tid] += 1
        point_diff[tid]   += pf - pa
        total_pts[tid]    += pf

    fun_facts = [
        [1, max(games_played, key=games_played.get), "The team that played the most games"],
        [2, max(point_diff,   key=point_diff.get),   "The team with the largest point differential"],
        [3, min(point_diff,   key=point_diff.get),   "The team with the smallest point differential"],
        [4, max(total_pts,    key=total_pts.get),    "The team with the most points"]
    ]

    # write teams.csv (no header)
    with open('teams.csv','w',newline='',encoding='utf-8') as f:
        w = csv.writer(f)
        for name, tid in teams.items():
            w.writerow([tid, name])

    # write matches.csv
    with open('matches.csv','w',newline='',encoding='utf-8') as f:
        w = csv.writer(f)
        for match in matches:
            w.writerow(match)

    # write results.csv
    with open('results.csv','w',newline='',encoding='utf-8') as f:
        w = csv.writer(f)
        for r in results:
            w.writerow(r)

    # write fun_facts.csv
    with open('fun_facts.csv','w',newline='',encoding='utf-8') as f:
        w = csv.writer(f)
        for fact in fun_facts:
            w.writerow(fact)

    print("✅ Generated teams.csv, matches.csv, results.csv, and fun_facts.csv.")


def compute_usau_ratings(games, team_ids):
    ratings = {tid:1000.0 for tid in team_ids}
    season_start = min(g['date'] for g in games)
    season_end   = max(g['date'] for g in games)
    days = (season_end - season_start).days
    weeks = days//7 + 1
    week_factor = (2.0**(1.0/(weeks-1))) if weeks>1 else 1.0

    for it in range(1,1001):
        new_r = {tid:0.0 for tid in team_ids}
        wsum  = {tid:0.0 for tid in team_ids}
        for g in games:
            t1,t2 = g['team1_id'], g['team2_id']
            s1,s2 = g['score1'], g['score2']
            if s1==s2: continue
            if s1>s2: w,l,sw,sl = t1,t2,s1,s2
            else:      w,l,sw,sl = t2,t1,s2,s1
            if (ratings[w]-ratings[l]>600 and sw>2*sl+1):
                cnt = sum(1 for x in games if w in (x['team1_id'],x['team2_id'])) - 1
                if cnt>=5: continue
            if sw-sl==1:
                x = 125.0
            else:
                rp = sl/(sw-1)
                d  = min(1.0, (1.0-rp)/0.5)
                x  = 125 + 475*(np.sin(d*0.4*np.pi)/np.sin(0.4*np.pi))
            gr_w = ratings[l] + x
            gr_l = ratings[w] - x
            week = (g['date'] - season_start).days // 7
            dw   = 0.5 * (week_factor**week)
            if sw>=13 or (sw+sl)>=19:
                swt = 1.0
            else:
                swt = np.sqrt((sw + max(sl,(sw-1)/2.0)) / 19.0)
            wt = dw * swt
            new_r[w] += gr_w * wt; wsum[w] += wt
            new_r[l] += gr_l * wt; wsum[l] += wt
        converged = True
        for tid in team_ids:
            avg = new_r[tid]/wsum[tid] if wsum[tid]>0 else ratings[tid]
            if abs(avg - ratings[tid]) > 1e-3:
                converged = False
            ratings[tid] = avg
        if converged:
            print(f"[USAU DEBUG] Converged after {it} iterations")
            break
    else:
        print("[USAU DEBUG] Reached max iterations")
    return np.array([ratings[tid] for tid in team_ids])


def generate_rankings():
    # load team IDs
    team_ids = []
    with open('teams.csv', newline='', encoding='utf-8') as f:
        for r in csv.reader(f): team_ids.append(int(r[0]))
    team_ids.sort()
    id2i = {tid:i for i,tid in enumerate(team_ids)}
    i2id = {i:tid for tid,i in id2i.items()}
    n = len(team_ids)

    # load matches
    matches = {}
    with open('matches.csv', newline='', encoding='utf-8') as f:
        for r in csv.reader(f):
            mid = int(r[0])
            matches[mid] = {'tournament': r[1], 'date': datetime.strptime(r[2], '%Y-%m-%d')}

    # load results and build games
    rg = {}
    with open('results.csv', newline='', encoding='utf-8') as f:
        for r in csv.reader(f):
            mid = int(r[0])
            rg.setdefault(mid, []).append(r)
    games = []
    for mid, grp in rg.items():
        if len(grp) != 2: continue
        a, b = grp
        m = matches[mid]
        games.append({
            'tournament': m['tournament'],
            'date':       m['date'],
            'team1_id':   int(a[1]),
            'team2_id':   int(b[1]),
            'score1':     int(a[3]),
            'score2':     int(b[3])
        })
    games.sort(key=lambda x: x['date'])

    # SWCI
    sw_w = {'win_pct':0.45,'margin_pct':0.10,'sos':0.45}
    def update_swci(gl, wts):
        wins   = np.zeros(n); played = np.zeros(n); margin = np.zeros(n)
        for x in gl:
            i = id2i[x['team1_id']]; j = id2i[x['team2_id']]
            played[i]+=1; played[j]+=1
            margin[i]+=x['score1']-x['score2']; margin[j]+=x['score2']-x['score1']
            if x['score1']>x['score2']: wins[i]+=1
            elif x['score2']>x['score1']: wins[j]+=1
        wp = np.divide(wins, played, out=np.zeros_like(wins), where=played>0)
        mp = margin / max(margin.max(), 1)
        sos = np.zeros(n)
        for x in gl:
            i = id2i[x['team1_id']]; j = id2i[x['team2_id']]
            sos[i]+=wp[j]; sos[j]+=wp[i]
        sos = np.divide(sos, played, out=np.zeros_like(sos), where=played>0)
        return wts['win_pct']*wp + wts['margin_pct']*mp + wts['sos']*sos

    # ELO
    elo = np.full(n, 1500.0)
    K = 20
    def update_elo(ri, rj, si, sj):
        mf = np.log1p(abs(si-sj))
        e_i = 1/(1+10**((rj-ri)/400))
        score_i = 1 if si>sj else 0
        ke = K * mf
        return (ri + ke*(score_i - e_i), rj + ke*((1-score_i)-(1-e_i)))


    # record snapshots
    history = {tid: [] for tid in team_ids}
    def record_snapshot(algo, scores, date):
        order = np.argsort(-scores, kind='stable')
        ranks = np.empty_like(order)
        for rk, idx in enumerate(order, start=1):
            ranks[idx] = rk
        for idx, tid in i2id.items():
            history[tid].append({
                'algorithm': algo,
                'as_of_date': date,
                'rank': int(ranks[idx])
            })
        return {tid: ranks[id2i[tid]] for tid in team_ids}


    # process tournaments sequentially
    ends = {}
    for g in games:
        ends[g['tournament']] = max(ends.get(g['tournament'], g['date']), g['date'])

    for tour, end_date in sorted(ends.items(), key=lambda y: y[1]):
        subset = [g for g in games if g['date'] <= end_date]
        # ELO per-game update
        for g in filter(lambda z: z['tournament']==tour, subset):
            i = id2i[g['team1_id']]; j = id2i[g['team2_id']]
            elo[i], elo[j] = update_elo(elo[i], elo[j], g['score1'], g['score2'])
        # snapshots
        swci_scores = update_swci(subset, sw_w)
        prev_rank    = record_snapshot('SWCI', swci_scores, end_date)
        prev_rank    = record_snapshot('ELO', elo, end_date)
        # Massey
        A = np.zeros((n,n)); b = np.zeros(n)
        for g in subset:
            i = id2i[g['team1_id']]; j = id2i[g['team2_id']]
            m = g['score1'] - g['score2']
            A[i,i]+=1; A[j,j]+=1; A[i,j]-=1; A[j,i]-=1
            b[i]+=m; b[j]-=m
        A[-1,:] = 1; b[-1] = 0
        massey, *_ = lstsq(A, b)
        prev_rank = record_snapshot('Massey', massey, end_date)
        # USAU
        t0 = time.time()
        usau_scores = compute_usau_ratings(subset, team_ids)
        print(f"[DEBUG] USAU for '{tour}' up to {end_date.date()} took {time.time()-t0:.1f}s")
        prev_rank = record_snapshot('USAU', usau_scores, end_date)

    # write rankings.csv (no header)
    with open('rankings.csv', 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        for tid in team_ids:
            seen = set()
            for rec in history[tid]:
                key = (rec['as_of_date'], rec['algorithm'])
                if key in seen: continue
                w.writerow([tid, rec['algorithm'], rec['as_of_date'].strftime('%Y-%m-%d'), rec['rank']])
                seen.add(key)

    print("✅ rankings.csv generated.")

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} games.csv", file=sys.stderr)
        sys.exit(1)
    generate_tables(sys.argv[1])
    generate_rankings()
