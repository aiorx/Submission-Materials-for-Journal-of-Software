var EMPTY = require('rxjs').EMPTY;
var catchError = require('rxjs').catchError;
var from = require('rxjs').from;
var map = require('rxjs').map;
var mergeMap = require('rxjs').mergeMap;

var CommitCompact = require('../../../git-functions/commit.model').CommitCompact;
var repoCompact = require('../../../git-functions/repo').repoCompact;

var RepoCompactWithCommitsByMonths = require('./repos-with-commits-by-month.model').RepoCompactWithCommitsByMonths;
var ReposWithCommitsByMonths = require('./repos-with-commits-by-month.model').ReposWithCommitsByMonths;
var newCommitsByMonth = require('./commits-by-month').newCommitsByMonth;
var gitRepoPaths = require('../../../git-functions/repo-path').gitRepoPaths;

// reposCompactWithCommitsByMonthsInFolderObs returns an Observable that notifies the list of
// RepoCompactWithCommitsByMonths objects representing all the repos in a given folder
function reposCompactWithCommitsByMonthsInFolderObs(
    folderPath: string,
    fromDate = new Date(0),
    toDate = new Date(Date.now()),
    concurrency = 1,
) {
    const repoPaths = gitRepoPaths(folderPath);
    return from(repoPaths).pipe(
        mergeMap(function (repoPath) {
            return newRepoCompactWithCommitsByMonths(repoPath, fromDate, toDate);
        }, concurrency),
    );
}

// newRepoCompactWithCommitsByMonths returns an Observable that notifies a new RepoCompactWithCommitsByMonths
// filled with its commits sorted by date ascending
function newRepoCompactWithCommitsByMonths(
    repoPath: string,
    fromDate = new Date(0),
    toDate = new Date(Date.now()),
) {
    return repoCompact$(repoPath, fromDate, toDate).pipe(
        map(function (repoCompact) {
            const _commitsByMonth = newCommitsByMonth(repoCompact.commits);
            const repo: RepoCompactWithCommitsByMonths = { ...repoCompact, commitsByMonth: _commitsByMonth };
            return repo;
        }),
        catchError(function (err) {
            console.error(
                'Error: while reading the commits of repo "' + (repoPath) + '" - error:\n ' + (JSON.stringify(err, null, 2)) + "",
            );
            return EMPTY;
        }),
    );
}

// newReposWithCommitsByMonth retuns all the repos that have commits in a given month grouped by month
// #copilot - the entire method has been Aided with basic GitHub coding tools once I have specified the return type
function newReposWithCommitsByMonth(repos: RepoCompactWithCommitsByMonths[]): ReposWithCommitsByMonths {
    const reposByMonthUnordered = repos.reduce(function (acc, repo) {
        Object.keys(repo.commitsByMonth).forEach((yearMonth) => {
            if (!acc[yearMonth]) {
                acc[yearMonth] = [];
            }
            acc[yearMonth].push({
                repoPath: repo.path,
                commits: repo.commitsByMonth[yearMonth].commits,
                authors: Array.from(repo.commitsByMonth[yearMonth].authors),
            });
        });
        return acc;
    }, {} as ReposWithCommitsByMonths);

    const reposByMonthOrdered = Object.keys(reposByMonthUnordered)
        .sort()
        .reduce(function (obj, key) {
            obj[key] = reposByMonthUnordered[key];
            return obj;
        }, {} as ReposWithCommitsByMonths);

    const [firstYearMonth, lastYearMonth] = getMinMax(Object.keys(reposByMonthOrdered));
    fillMissingMonths(reposByMonthOrdered, firstYearMonth, lastYearMonth, []);
    return reposByMonthOrdered;
}

// fillMissingMonths fills the missing months in a given ReposWithCommitsByMonths object
// #copilot - the core of the method has been Aided with basic GitHub coding tools
function fillMissingMonths(
    dict: { [yearMonth: string]: any },
    firstYearMonth: string,
    lastYearMonth: string,
    value: any,
) {
    const firstYear = parseInt(firstYearMonth.split('-')[0]);
    const firstMonth = parseInt(firstYearMonth.split('-')[1]);
    const firstYearMonthAsNumber = yearMonthAsNumber(firstYear, firstMonth);

    const lastYear = parseInt(lastYearMonth.split('-')[0]);
    const lastMonth = parseInt(lastYearMonth.split('-')[1]);
    const lastYearMonthAsNumber = yearMonthAsNumber(lastYear, lastMonth);

    for (let year = firstYear; year <= lastYear; year++) {
        for (let month = 1; month <= 12; month++) {
            const yearMonth = "" + (year) + "-" + (month.toString().padStart(2, '0')) + "";
            if (!dict[yearMonth]) {
                if (yearMonthAsNumber(year, month) < firstYearMonthAsNumber) continue;
                if (yearMonthAsNumber(year, month) > lastYearMonthAsNumber) continue;
                dict[yearMonth] = value;
            }
        }
    }
}

function getMinMax(arr: string[]) {
    if (!arr || arr.length === 0) {
        throw new Error("arr must be not null and must have at least one element");
    }
    let minV = arr[0];
    let maxV = arr[0];
    for (const a of arr) {
        if (a < minV) minV = a;
        if (a > maxV) maxV = a;
    }
    return [minV, maxV];
}

function yearMonthAsNumber(year: number, month: number) {
    return year * 100 + month;
}

// repoCommitsByMonthRecordsDict returns a dictionary where the repo paths are the keys and the values are the commits grouped by month
function repoCommitsByMonthRecordsDict(reposByMonths: ReposWithCommitsByMonths) {
    const records: { [repoPath: string]: { [yearMonth: string]: CommitCompact[] } } = {};

    // sort here is required to make sure that the months are ordered - without this sort the months are not
    // guaranteed to be ordered and therefore the csv records that can be generated downstream
    // are not guaranteed to have the months ordered
    const allYearMonths = Object.keys(reposByMonths)
        .sort()
        .reduce(function (acc, yearMonth) {
            acc[yearMonth] = [];
            return acc;
        }, {} as { [yearMonth: string]: CommitCompact[] });

    const allReposPaths = Object.values(reposByMonths).reduce(function (acc, repos) {
        repos.forEach((repo) => {
            if (!acc.includes(repo.repoPath)) {
                acc.push(repo.repoPath);
            }
        });
        return acc;
    }, [] as string[]);

    allReposPaths.forEach(function (repoPath) {
        records[repoPath] = { ...allYearMonths };
    });

    Object.entries(reposByMonths).forEach(function ([yearMonth, repos]) {
        repos.forEach((repo) => {
            const rec = records[repo.repoPath];
            rec[yearMonth] = repo.commits;
        });
    });
    return records;
}

// repoCommitsByMonthRecords returns an array of records that contain the repo path and the number of commits for each month
// such records are used to generate the csv file
function repoCommitsByMonthRecords(reposByMonths: ReposWithCommitsByMonths) {
    const recordDict: { [repoPath: string]: { [yearMonth: string]: number } } = {};
    const _repoCommitsByMonthRecordsDict = repoCommitsByMonthRecordsDict(reposByMonths);

    Object.entries(_repoCommitsByMonthRecordsDict).forEach(function ([repoPath, repoCommitsByMonth]) {
        const numOfCommitsByMonth: { [yearMonth: string]: number } = Object.entries(repoCommitsByMonth).reduce(
            (acc, [yearMonth, commits]) => {
                acc[yearMonth] = commits.length;
                return acc;
            },
            {} as { [yearMonth: string]: number },
        );

        recordDict[repoPath] = { ...numOfCommitsByMonth };
    });

    const records = Object.entries(recordDict).map(function ([repoPath, commitsByMonth]) {
        return { repoPath, ...commitsByMonth };
    });

    return records;
}
