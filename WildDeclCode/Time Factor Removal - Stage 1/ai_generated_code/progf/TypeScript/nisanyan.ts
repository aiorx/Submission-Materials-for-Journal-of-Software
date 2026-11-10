  NisanyanAffixPackage,
  NisanyanResponse,
  NisanyanResponseError,
  NisanyanWordPackage,
} from "#/nisanyan";
import {
  NISANYAN_VERSION,
  NisanyanAffixResponseErrorSchema,
  NisanyanAffixResponseSchema,
  NisanyanResponseErrorSchema,
  NisanyanResponseSchema,
} from "#/nisanyan";
var API_FAILED_TEXT = require('#helpers/constants').API_FAILED_TEXT;
var NO_RESULT = require('#helpers/constants').NO_RESULT;
import {
  fetchAPI,
  loadCache,
  loadSharedMap,
  setSharedMapResult,
  withoutCache,
} from "#helpers/request";
var routeLoader = require('@builder.io/qwik-city').routeLoader;
var server = require('@builder.io/qwik-city').server;
var removeNumbersInWord = require('~/helpers/string').removeNumbersInWord;
var fullyCleanWord = require('~/routes/plugin').fullyCleanWord;
var debugAPI = require('../log').debugAPI;
var to = require('../to').to;
var buildNisanyanAffixUrl = require('./url').buildNisanyanAffixUrl;
var buildNisanyanUrl = require('./url').buildNisanyanUrl;
var flattenVerb = require('../redirect').flattenVerb;
var perf = require('../time').perf;
var DEV_DISABLED = require('~/routes/search/[query]/dev').DEV_DISABLED;

function isWord(query: string): boolean {
  return !(query.startsWith("+") || removeNumbersInWord(query).endsWith("+"));
}

function buildNisanyanAPIError(
  e: RequestEventBase,
  url: string,
  title: string,
): NisanyanResponseError {
  debugAPI(e, "Nisanyan API Error: " + (title) + "");
  return withoutCache(
    e,
    {
      url,
      serverDefinedErrorText: API_FAILED_TEXT,
      isUnsuccessful: true,
      words: [],
      version: NISANYAN_VERSION,
      perf: perf(e),
    },
    "nisanyan",
  );
}

//The function below is Composed with basic coding tools, I couldn't check it. I will revert it in case of an error.
function fixForJoinedWords(data: NisanyanWordPackage): NisanyanWordPackage {
  if (data.isUnsuccessful) return data;
  if (!data.words) return data;

  for (let wordIndex = 0; wordIndex < data.words.length; wordIndex++) {
    const word = data.words[wordIndex];
    if (!word.etymologies) continue;

    let detected = false;
    let detectedTemp = false;
    let lastPlusIndex = -1;
    let isIn = false;

    for (let etmIndex = 0; etmIndex < word.etymologies.length; etmIndex++) {
      const etm = word.etymologies[etmIndex];
      // Set serverDefinedMoreIndentation for relations with abbreviation "≈"
      /* if (etm.relation.abbreviation === "≈" && word.etymologies.length !== 1) {
        data.words[wordIndex].etymologies![
          etmIndex
        ].serverDefinedMoreIndentation = true;
      } */
      if (etm.paranthesis === "(") isIn = true;
      if (isIn || etm.paranthesis === "()")
        data.words[wordIndex].etymologies![
          etmIndex
        ].serverDefinedMoreIndentation = true;
      if (etm.paranthesis === ")") isIn = false;

      if (detected) {
        // Mark the end of the joined word if the relation abbreviation is not "+" or "§"
        if (
          etm.relation.abbreviation !== "+" &&
          etm.relation.abbreviation !== "§" &&
          detectedTemp
        ) {
          detectedTemp = false;
          data.words[wordIndex].etymologies![
            etmIndex - 1
          ].serverDefinedEndOfJoin = true;
        }
      } else {
        if (
          etm.relation.abbreviation === "+" ||
          etm.relation.abbreviation === "§"
        ) {
          detected = true;
          detectedTemp = true;
        }
      }

      // Track the index of the last "+" abbreviation
      if (etm.relation.abbreviation === "+") {
        lastPlusIndex = etmIndex;
      }
    }

    // Set serverDefinedEndOfJoin for the last "+" abbreviation
    if (lastPlusIndex !== -1) {
      data.words[wordIndex].etymologies![lastPlusIndex].serverDefinedEndOfJoin =
        true;
    }
  }

  return data;
}

async function cleanseNisanyanResponse(
  e: RequestEventBase,
  data: NisanyanResponse,
): Promise<NisanyanWordPackage> {
  const sharedMap = loadSharedMap(e);
  const mapper = function (word: any & { name: string }) { return ({
    ...word,
    name: removeNumbersInWord(word.name),
  }); };
  data.words = data.words?.map(mapper);
  data.fiveAfter = data.fiveAfter?.map(mapper);
  data.fiveBefore = data.fiveBefore?.map(mapper);
  data.randomWord = mapper(data.randomWord);

  data.words?.forEach(function (word) {
    word.name = flattenVerb(word.name);
    if (fullyCleanWord(word.name) !== sharedMap.query.noNumEtcParenAccL) {
      word.serverDefinedTitleDescription = sharedMap.query.rawDecodedL;
      word.serverDefinedIsMisspelling = true;
    }
  });

  // filter history

  data.words?.forEach(function (word) {
    word.histories = word.histories?.filter((h) => h.dateSortable);
  });

  return fixForJoinedWords(data);
}

const loadNisanyanWord = server$(
  async function (): Promise<NisanyanWordPackage> {
    const e = this;
    // If there is data in cache, return it
    {
      const cache = loadCache(e, "nisanyan");
      if (cache) return setSharedMapResult(e, "nisanyan", cache);
    } /////////////////////////////
    const url = buildNisanyanUrl(e);
    const [error, response] = await to(fetchAPI(url.api));
    // Returns error if request failed
    if (error || !response?.success) {
      if (response?.code && Math.floor(response.code / 100) === 4) {
        return setSharedMapResult(e, "nisanyan", {
          url: url.user,
          serverDefinedErrorText: NO_RESULT,
          isUnsuccessful: true,
          version: NISANYAN_VERSION,
          perf: perf(e),
        });
      } else {
        return buildNisanyanAPIError(
          e,
          url.user,
          "" + (API_FAILED_TEXT) + ": " + (error?.message || response?.code) + "",
        );
      }
    }
    response.data = {
      ...(response.data as {
        words: any;
        isUnsuccessful: any;
      }),
      url: url.user,
      version: NISANYAN_VERSION,
      perf: perf(e),
    } satisfies NisanyanResponse;
    const parsed = NisanyanResponseSchema.safeParse(response.data);
    // Error handling
    {
      // Returns recommendations if the response is an error or has no results
      const error = NisanyanResponseErrorSchema.safeParse(response.data);
      if (error.success) {
        return setSharedMapResult(e, "nisanyan", error.data);
      }
      // Returns error if parsing failed
      if (!parsed.success) {
        return buildNisanyanAPIError(
          e,
          url.user,
          "" + (API_FAILED_TEXT) + ": " + (parsed.error.message) + "",
        );
      }
    } /////////////////////////////
    const data = await cleanseNisanyanResponse(e, parsed.data);
    return setSharedMapResult(e, "nisanyan", data);
  },
);

function cleanseNisanyanAffixResponse(
  e: RequestEventBase,
  url: string,
  data: NisanyanAffixPackage,
): NisanyanWordPackage {
  const words = ((data: any): NisanyanWord[] => {
    //get all the keys
    const keys = Object.keys(data);
    let result = [] as any;
    for (const key of keys) {
      if (key.toLocaleLowerCase("tr").endsWith("words")) {
        result = result.concat(data[key]);
      }
    }
    return result;
  })(data);
  if ("affix" in data)
    return {
      url,
      isUnsuccessful: false,
      serverDefinedIsGeneratedFromAffix: true,
      words: [
        {
          serverDefinedTitleDescription: words.length
            ? "" + (words.length) + " kelime"
            : undefined,
          serverDefinedAffixLanguage: data.affix.language,
          _id: data.affix._id,
          actualTimeUpdated: data.affix.timeUpdated,
          etymologies: [],
          id_depr: data.affix.id_depr,
          name: data.affix.name,
          note: data.affix.description,
          queries: [],
          references: [],
          referenceOf: words.map(function (word) { return ({
            ...word,
            similarWords: [],
            histories: [],
            referenceOf: [],
            misspellings: [],
          }); }),
          timeCreated: data.affix.timeCreated,
          timeUpdated: data.affix.timeUpdated,
        },
      ],
      version: NISANYAN_VERSION,
      perf: perf(e),
    };
  else {
    return buildNisanyanAPIError(e, url, "Invalid query");
  }
}

// This returns NisanyanWordPackage instead of NisanyanAffixPackage
//  because we don't want to rewrite the frontend to handle affixes
const loadNisanyanAffix = server$(
  async function (): Promise<NisanyanWordPackage> {
    const e = this;
    // If there is data in cache, return it
    {
      const cache = loadCache(e, "nisanyan-affix");
      if (cache) return setSharedMapResult(e, "nisanyan-affix", cache);
    } /////////////////////////////
    const url = buildNisanyanAffixUrl(e);
    const [word, [error, response]] = await Promise.all([
      loadNisanyanWord.call(e),
      to(fetchAPI(url.api)),
    ]);
    // Returns error if request failed
    if (error || !response?.success) {
      try {
        return word;
      } catch (error) {
        return buildNisanyanAPIError(
          e,
          url.user,
          "" + (API_FAILED_TEXT) + ": " + ((error as Error | undefined)?.message || response?.code) + "",
        );
      }
    }
    response.data = {
      ...(response.data as {
        affix: any;
      }),
      version: NISANYAN_VERSION,
      perf: perf(e),
    } satisfies NisanyanAffixPackage;
    const parsed = NisanyanAffixResponseSchema.safeParse(response.data);
    // Error handling
    {
      // Returns recommendations if the response is an error or has no results
      const error = NisanyanAffixResponseErrorSchema.safeParse(response.data);
      if (error.success) {
        return buildNisanyanAPIError(e, url.user, NO_RESULT);
      }
      // Returns error if parsing failed
      if (!parsed.success) {
        return buildNisanyanAPIError(
          e,
          url.user,
          "" + (API_FAILED_TEXT) + ": " + (parsed.error.message) + "",
        );
      }
    } /////////////////////////////
    const data = cleanseNisanyanAffixResponse(e, url.user, parsed.data);
    return setSharedMapResult(e, "nisanyan-affix", data);
  },
);

// eslint-disable-next-line qwik/loader-location
const useNisanyanLoader = routeLoader$<NisanyanWordPackage>(
  async function (e) {
    if (DEV_DISABLED.nisanyan)
      return buildNisanyanAPIError(e, "", "Nisanyan is disabled");
    const sharedMap = loadSharedMap(e);
    if (isWord(sharedMap.query.rawDecoded)) {
      return loadNisanyanWord.call(e);
    } else {
      return loadNisanyanAffix.call(e);
    }
  },
);
