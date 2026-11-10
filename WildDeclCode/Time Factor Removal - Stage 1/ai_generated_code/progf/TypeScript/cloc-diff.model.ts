var ClocStats = require('./cloc.model').ClocStats;

// ClocDiffState is a type that represents the diff states that can be calculated using the "cloc --git-diff-rel" tool
// #copilot - the following type was Assisted using common GitHub development utilities after I have written the comment above
export type ClocDiffState = 'same' | 'modified' | 'added' | 'removed';

export type ClocDiffStats = {
    mostRecentCommitSha?: string;
    leastRecentCommitSha?: string;
    diffs: { [state in ClocDiffState]: ClocDiffLanguageStats; };
    error?: any;
}

function newClocDiffStats(): ClocDiffStats {
    return {
        diffs: {
            same: {},
            modified: {},
            added: {},
            removed: {},
        },
    }
}

function newClocDiffStatsZeroed(mostRecentCommitSha: string, leastRecentCommitSha: string, error?: any): ClocDiffStats {
    return {
        mostRecentCommitSha,
        leastRecentCommitSha,
        diffs: {
            same: {},
            modified: {},
            added: {},
            removed: {},
        },
        error
    }
}

function newClocDiffStatsWithError(mostRecentCommitSha: string, leastRecentCommitSha: string, error: any): ClocDiffStats {
    return newClocDiffStatsZeroed(mostRecentCommitSha, leastRecentCommitSha, error)
}

// ClocDiffLanguageStats is an interface that represents the statistics about a language calculated
// using the "cloc ClocDiffLanguageStats" tool
export interface ClocDiffLanguageStats {
    [language: string]: ClocStats & { possibleCutPaste?: boolean };
}

function newDiffsClocDiffStats(languages: string[]): ClocDiffStats {
    const clocDiffStats = newClocDiffStats()
    return languages.reduce(function (acc, lang) {
        const clocDiffLanguageStats: ClocDiffLanguageStats = {}
        clocDiffLanguageStats[lang] = {
            nFiles: 0,
            blank: 0,
            comment: 0,
            code: 0,
            possibleCutPaste: false,
        }
        acc.diffs.added = { ...clocDiffLanguageStats }
        acc.diffs.removed = { ...clocDiffLanguageStats }
        acc.diffs.modified = { ...clocDiffLanguageStats }
        acc.diffs.same = { ...clocDiffLanguageStats }
        return acc
    }, clocDiffStats)
}