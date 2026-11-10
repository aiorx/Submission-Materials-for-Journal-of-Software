package leetcode;

import assist.BaseSolution;
import run.MetricsMemory;
import run.MetricsRuntime;

import java.util.*;

/**
 * source: https://leetcode.com/problems/concatenated-words/
 *
 * Q472. Concatenated Words.
 * Given a list of words (without duplicates), please write a program that returns all concatenated words in the given list of words.
 * A concatenated word is defined as a string that is comprised entirely of at least two shorter words in the given array.
 * Constraints:
 *  1 <= words.length <= 10^4
 *  0 <= words[i].length <= 1000
 *  0 <= words[i].length <= 1000
 *  All strings consist of lowercase English letters only.
 *
 *  <p />
 *  Example 1:
 *  <pre>
 *  Input: ["cat","cats","catsdogcats","dog","dogcatsdog","hippopotamuses","rat","ratcatdogcat"]
 *  Output: ["catsdogcats","dogcatsdog","ratcatdogcat"]
 *  Explanation: "catsdogcats" can be concatenated by "cats", "dog" and "cats";
 *  "dogcatsdog" can be concatenated by "dog", "cats" and "dog";
 *  "ratcatdogcat" can be concatenated by "rat", "cat", "dog" and "cat".
 *  </pre>
 *
 *  <p />
 *  Example 2:
 *  <pre>
 *      Input: ["cat","dog","catdog"]
 *      Output: ["catdog"]
 *      Explanation: "catdog" can be concatenated by "cat" and "dog".
 *  </pre>
 *
 */
public class Q0472_Concatenated_Words extends BaseSolution<List<String>> {
	@Override
	protected int getNumberOfVersionsImplemented() {
		return 6;
	}

    public List<String> findAllConcatenatedWordsInADict(String[] words) {
		if (versionToRun == 1) {
			return processV1_Timeout_Fixed_With_DP_Cache(words);
		} else if (versionToRun == 2) {
			return processV2(words);
		} else if (versionToRun == 3) {
			return processV3_preProcess(words);
		} else if (versionToRun == 4) {
			return processV4(words);
		} else if (versionToRun == 5) {
			return processV5_DP(words);
		} else if (versionToRun == 6) {
			return processV6_DP(words);
		} else {
			throw new RuntimeException("No such version: " + versionToRun);
		}
	}

	public List<String> processV3_preProcess(String[] words) {
		WordInfo[] wordInfos = new WordInfo[words.length];
		Map<Character, List<WordInfo>> charToWords = new HashMap<>(26);
		for (int i = 0; i < words.length; i++) {
			wordInfos[i] = new WordInfo(words[i]);
			for (CharInfo ci: wordInfos[i].charInfos) {
				List<WordInfo> list = charToWords.get(ci.c);
				if (list == null) {
					list = new ArrayList<>(16);
					charToWords.put(ci.c, list);
				}
				list.add(wordInfos[i]);
			}
		}
		List<String> ret = new ArrayList<>(16);
//		int cnt = 0;
		for (int i = 0; i < words.length; i++) {
			if (isConcatenated_V3(wordInfos[i], charToWords)) {
				System.out.print(".");
//				cnt++;
				ret.add(words[i]);
//				if (cnt % 50 == 0) {
//					System.out.println();
//				}
			}
		}
//		System.out.println();
//		System.out.println("FOUND: " + cnt + " words are concatenated.");
		return ret;
	}

	private boolean isConcatenated_V3(WordInfo wordInfo, Map<Character, List<WordInfo>> charToWords) {
		int len = wordInfo.len;
		if (len == 0) {
			return false;
		}
		return doV3(wordInfo, charToWords, 0, len - 1);
	}

	private boolean doV3(WordInfo wordInfo, Map<Character, List<WordInfo>> charToWords, int from, int to) {
		if (from > to) {
			return true;
		}
		for (CharInfo ci: wordInfo.charInfos) {
			int[] indexes = ci.indexes;
			for (int i = 0; i < indexes.length; i++) {
				int idx = indexes[i];
				if (idx < from || idx > to) {
					continue;
				}
				List<WordInfo> parts = charToWords.get(ci.c);
				for (WordInfo part: parts) {
					if (part == wordInfo || part.len > to - from + 1) {
						continue;
					}
					// possible candidate to be concatenated to form the word
					int candidateCheckSum = part.getCheckSum();
					int[] candidateIndexes = part.getIndexOfChar(ci.c);
					if (candidateIndexes.length == 0) {
						continue;
					}
					for (int j = 0; j < candidateIndexes.length; j++) {
						int candidateIdx = candidateIndexes[j];
						int candidateFrom = idx - candidateIdx;
						int candidateTo = idx + part.len - candidateIdx - 1;
						if (candidateFrom < from || candidateTo > to
								|| candidateCheckSum != wordInfo.getCheckSum(candidateFrom, candidateTo)) {
							// not in the range or in-range, but check-sum doesn't match
							continue;
						}
						if (!isMatched_V3(wordInfo, part, candidateFrom, candidateTo)) {
							continue;
						}
						if (doV3(wordInfo, charToWords, candidateTo + 1, to)
								&& doV3(wordInfo, charToWords, from, candidateFrom - 1)) {
							return true;
						}
					}
				}
				return false;		// must match at least one part
			}
		}
		return false;
	}

	private boolean isMatched_V3(WordInfo wordInfo, WordInfo part, int candidateFrom, int candidateTo) {
		for (int i = candidateFrom; i <= candidateTo; i++) {
			if (wordInfo.chars[i] != part.chars[i - candidateFrom]) {
				return false;
			}
		}
		return true;
	}

	private static class CharInfo {
		final char c;
		final int[] indexes;
		CharInfo(char c, int[] idx) {
			this.c = c;
			this.indexes = idx;
		}
	}

	private static class WordInfo {
		final String word;
		final char[] chars;
		final int len;
		final int[] preSums;
		final List<CharInfo> charInfos;		// sorted by the number of indexes
		WordInfo(String w) {
			word = w;
			len = w.length();
			chars = w.toCharArray();
			preSums = new int[len + 1];
			List<Integer>[] indexes = new List[26];
			int uniqCharCount = 0;
			for (int i = 0; i < len; i++) {
				char c = chars[i];
				int idx = c - 'a';
				preSums[i + 1] = preSums[i] + idx;
				List<Integer> list = indexes[idx];
				if (list == null) {
					uniqCharCount++;
					list = new ArrayList<>(16);
					indexes[idx] = list;
				}
				list.add(i);
			}
			charInfos = new ArrayList<>(uniqCharCount);
			for (int i = 0; i < 26; i++) {
				List<Integer> list = indexes[i];
				if (list != null) {
					charInfos.add(new CharInfo((char)('a' + i), list.stream().mapToInt(Integer::intValue).toArray()));
				}
			}
			charInfos.sort((c1, c2) -> c1.indexes.length - c2.indexes.length);
		}

		int[] getIndexOfChar(char c) {
			for (CharInfo ci: charInfos) {
				if (ci.c == c) {
					return ci.indexes;
				}
			}
			return new int[0];
		}

		int getCheckSum() {
			return preSums[len];
		}

		int getCheckSum(int from, int to) {
			return preSums[to + 1] - preSums[from];
		}
	}


	public List<String> processV2(String[] words) {
		Map<Character, Map<Integer, List<String>>> byFirstLetterThenLen = new HashMap<>();
		for (String w: words) {
			Character firstLetter = w.charAt(0);
			Map<Integer, List<String>> byLen = byFirstLetterThenLen.getOrDefault(w.charAt(0), new HashMap<>(16));
			int len = w.length();
			List<String> list = byLen.getOrDefault(len, new ArrayList<>(16));
			list.add(w);
			byLen.put(len, list);
			byFirstLetterThenLen.put(firstLetter, byLen);
		}
		List<String> ret = new ArrayList<>(16);
		for (String w: words) {
			if (isConcatenated_V2(w, byFirstLetterThenLen, true)) {
				ret.add(w);
			}
		}
		return ret;
	}

	private boolean isConcatenated_V2(String w, Map<Character, Map<Integer, List<String>>> map, boolean isRoot) {
		if (w.length() == 0) {
			return !isRoot;
		}
		char c = w.charAt(0);
		Map<Integer, List<String>> byLen = map.get(c);
		if (byLen == null || byLen.isEmpty()) {
			return false;
		}
		int len = w.length();
		if (isRoot) {			// concatenated word must have at least 2 words
			len = len - 1;
		}
		for (int i = len; i > 0; i--) {
			List<String> list = byLen.get(i);
			if (list == null || list.isEmpty()) {
				continue;
			}
			for (String s: list) {
				if (w.startsWith(s)) {
					if (isConcatenated_V2(w.substring(i), map, false)) {
						return true;
					}
				}
			}
		}
		return false;
	}

	@MetricsRuntime(ms = 368, beats = 5.10)
	@MetricsMemory(mb = 46.56, beats = 99.75)
	public List<String> processV1_Timeout_Fixed_With_DP_Cache(String[] words) {
		Comparator<String> sortingWordByLenDesc = (s1, s2) -> s2.length() - s1.length();
//		Set<String> set = new HashSet<>();
//		for (String w: words) {
//			set.add(w);
//		}
		List[] byFirstLetters = new List[26];
		for (String w: words) {
			int idx = (int)(w.charAt(0) - 'a');
			List<String> myList = byFirstLetters[idx];
			if (myList == null) {
				myList = new ArrayList<String>(32);
				byFirstLetters[idx] = myList;
			}
			myList.add(w);
		}
		for (int i = 0; i < byFirstLetters.length; i++) {
			if (byFirstLetters[i] == null) {
				byFirstLetters[i] = Collections.emptyList();
			} else {
				byFirstLetters[i].sort(sortingWordByLenDesc);
			}
		}
		List<String> ret = new ArrayList<>(16);
		for (String w: words) {
			if (isConcatenatedWords_V1_Timeout_Fixed_With_DP_Cache(w, byFirstLetters)) {
				ret.add(w);
			}
		}
        return ret;
    }

	// time out
	private boolean isConcatenatedWords_V1_Timeout_Fixed_With_DP_Cache(String word, List[] byFirstLetters) {
		int idx = (int)(word.charAt(0) - 'a');
		List<String> startings = (List<String>) byFirstLetters[idx];
		// descending order
		if (startings.isEmpty() || startings.get(startings.size() - 1).length() >= word.length()) {
			return false;
		}
		Set<String> failedRests = new HashSet<>();		// ok will exit, no need to cache
		for (int i = 0; i < startings.size(); i++) {
			String start = startings.get(i);
			if (start.length() >= word.length()) {
				continue;
			}
			if (word.startsWith(start)) {
				if (containsAtLeastOne_V1_Timeout_Fixed_With_DP_Cache(word.substring(start.length()), byFirstLetters, failedRests)) {
					return true;
				}
			}
		}
		return false;
	}

	private boolean containsAtLeastOne_V1_Timeout_Fixed_With_DP_Cache(String rest, List[] byFirstLetters, Set<String> failedCaches) {
		if (failedCaches.contains(rest)) {
			return false;
		}
		int restLen = rest.length();
		if (restLen == 0) {
			return true;
		}
		int idx = (int)(rest.charAt(0) - 'a');
		List<String> startings = (List<String>) byFirstLetters[idx];
		for (int i = 0; i < startings.size(); i++) {
			String start = startings.get(i);
			int startLen = start.length();
			if (startLen > restLen) {
				continue;
			}
			if (rest.charAt(startLen - 1) == start.charAt(startLen -1 ) && rest.startsWith(start)) {
				if (containsAtLeastOne_V1_Timeout_Fixed_With_DP_Cache(rest.substring(startLen), byFirstLetters, failedCaches)) {
					return true;
				}
			}
		}
		failedCaches.add(rest);
		return false;
	}

	// Supported via standard GitHub programming aids
	@MetricsRuntime(ms = 63, beats = 63.95)
	@MetricsMemory(mb = 49.28, beats = 62.12)
	public List<String> processV5_DP(String[] words) {
		Set<String> set = new HashSet<>(Arrays.asList(words));
		List<String> ret = new ArrayList<>(16);
		for (String w: words) {
			set.remove(w);
			if (isConcatenatedWords_V5_DP(w, set)) {
				ret.add(w);
			}
			set.add(w);
		}
		return ret;
	}

	private boolean isConcatenatedWords_V5_DP(String w, Set<String> set) {
		int len = w.length();
		if (len == 0) {
			return false;
		}
		boolean[] dp = new boolean[len + 1];
		dp[0] = true;
		for (int i = 1; i <= len; i++) {
			for (int j = 0; j < i; j++) {
				if (dp[j] && set.contains(w.substring(j, i))) {
					dp[i] = true;
					break;
				}
			}
		}
		return dp[len];
	}

	@MetricsRuntime(ms = 55, beats = 77.21)
	@MetricsMemory(mb = 48.99, beats = 70.58)
	public List<String> processV6_DP(String[] words) {
		Set<String> set = new HashSet<>(Arrays.asList(words));
		List<String> ret = new ArrayList<>(16);
		for (String w: words) {
			if (isConcatenatedWords_V6_DP(w, set)) {
				ret.add(w);
			}
		}
		return ret;
	}

	private boolean isConcatenatedWords_V6_DP(String w, Set<String> set) {
		int len = w.length();
		if (len == 0) {
			return false;
		}
		boolean[] dp = new boolean[len + 1];
		dp[0] = true;
		for (int i = 1; i <= len; i++) {
			for (int j = 0; j < i; j++) {
				if (i == len && j == 0) {
					continue;
				}
				if (dp[j] && set.contains(w.substring(j, i))) {
					dp[i] = true;
					break;
				}
			}
		}
		return dp[len];
	}

	public List<String> processV4(String[] words) {
		int len = words.length;
		char[][] charArrays = new char[len][];
		int[][] preSums = new int[len][];
		List<Integer>[] byFirstLetterIndexes = new List[26];
		for (int i = 0; i < len; i++) {
			charArrays[i] = words[i].toCharArray();
			preSums[i] = new int[charArrays[i].length + 1];
			int idx = (int)(charArrays[i][0] - 'a');
			if (byFirstLetterIndexes[idx] == null) {
				byFirstLetterIndexes[idx] = new ArrayList<Integer>(16);
			}
			for (int j = 0; j < charArrays[i].length; j++) {
				preSums[i][j + 1] = preSums[i][j] + (int)(charArrays[i][j] - 'a');
			}
			byFirstLetterIndexes[idx].add(i);
		}
		List<String> ret = new ArrayList<>(16);
		for (int i = 0; i < len; i++) {
			if (isConcatenatedWords_V4(i, charArrays, byFirstLetterIndexes, preSums)) {
				ret.add(words[i]);
			}
		}
		return ret;
	}

	private boolean isConcatenatedWords_V4(int idx, char[][] charArrays, List<Integer>[] byFirstLetterIndexes, int[][] preSums) {
		char[] chars = charArrays[idx];
		int len = chars.length;
		if (len == 0) {
			return false;
		}
		int[] preSum = preSums[idx];
		return doV4(idx, chars, charArrays, byFirstLetterIndexes, preSums, 0, len - 1);
	}

	private boolean doV4(int idx, char[] chars, char[][] charArrays, List<Integer>[] byFirstLetterIndexes, int[][] preSums, int from, int to) {
		if (from > to) {
			return true;
		}
		int firstLetterIdx = (int)(chars[from] - 'a');
		List<Integer> indexes = byFirstLetterIndexes[firstLetterIdx];
		if (indexes == null || indexes.isEmpty()) {
			return false;
		}
		int[] myPreSum = preSums[idx];
		List<char[]> startsWith = new ArrayList<>(16);
		for (int candidateIdx: indexes) {
			if (candidateIdx == idx) {
				continue;
			}
			char[] candidateChars = charArrays[candidateIdx];
			int candidateLen = candidateChars.length;
			if (candidateLen > to - from + 1) {
				continue;
			}
			int candidatePreSum = preSums[candidateIdx][candidateLen];
			int myCheckSum = myPreSum[from + candidateLen] - myPreSum[from];
			if (myCheckSum != candidatePreSum) {
				continue;
			}
			boolean matched = true;
			for (int j = 0; j < candidateLen; j++) {
				if (chars[from + j] != candidateChars[j]) {
					matched = false;
					break;
				}
			}
			if (matched) {
				startsWith.add(candidateChars);
			}
		}
		if (startsWith.isEmpty()) {
			return false;
		} else if (startsWith.size() == 1) {
			if (doV4(idx, chars, charArrays, byFirstLetterIndexes,
					preSums, from + startsWith.iterator().next().length, to)) {
				return true;
			}
		} else {
			startsWith.sort((c1, c2) -> c2.length - c1.length);
			for (char[] start: startsWith) {
				if (doV4(idx, chars, charArrays, byFirstLetterIndexes,
						preSums, from + start.length, to)) {
					return true;
				}
			}
		}
		return false;
	}

}
