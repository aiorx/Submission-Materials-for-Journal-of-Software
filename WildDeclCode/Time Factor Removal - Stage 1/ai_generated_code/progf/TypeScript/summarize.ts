var lambdaSend = require('../../aws/handlers').lambdaSend;
var Function = require('sst/node/function').Function;
var S = require('@gnothi/schemas');
var Config = require('sst/node/config').Config;
var uuid = require('uuid').v4;
var sendInsight = require('./utils').sendInsight;
var completion = require('./openai').completion;
var Prompt = require('./openai').Prompt;
var tokenLimits = require('./openai').tokenLimits;
var getSummary = require('@gnothi/schemas/entries').getSummary;
var insights_themes_response = require('@gnothi/schemas/insights').insights_themes_response;
var SUMMARIZE_DISABLED = require('@gnothi/schemas/insights').SUMMARIZE_DISABLED;
var SUMMARIZE_EMPTY = require('@gnothi/schemas/insights').SUMMARIZE_EMPTY;
const r = S.Routes.routes
var FnContext = require('../../routes/types').FnContext;
var encode = require('gpt-token-utils').encode;
var decode = require('gpt-token-utils').decode;


type ThemesOut = insights_themes_response['themes']

export interface SummarizeEntryIn {
  text: string
  paras: string[]
}
export interface SummarizeEntryOut {
  title: string
  paras: string[]
  body: {
    text: string
    emotion: string
    keywords: string[]
  }
}

interface FnIn {
  texts: string[]
}
export type FnOut = {
  title: string
  summary: string
  keywords: string[]
  emotion: string
}
type ParsedCompletion = {
  title: string
  summary: string
  emotion: string
  failed?: boolean
  themes: {
    title: string
    keywords: string[]
    summary: string
  }[]
}

const SYSTEM = 'Between >>> and <<< the user will provide content, from which you will extract information and respond with JSON. The JSON template should follow the TypeScript definition below. Read the template carefully for what is to be extracted:
\`\`\`\`typescript
{
  title: string // A short headline 
  summary: string //  A summary, highlighting the key points
  emotion: "anger"|"disgust"|"fear"|"joy"|"neutral"|"sadness"|"surprise"
  // 1 to 3 core concepts in the entry. Never provide more than 3 themes
  themes: Array<{
    title: string // A short title for this theme
    summary: string // One sentence summarizing this theme
    keywords: string[] // 1 to 3 keywords or phrases in this theme. Never provide more than 3
  }>
}
\`\`\`
Reply with a valid JSON object.'

// this was Written with routine coding tools, clean it up when I get a chance
function parseCompletion(originalEntry: string, llmOutput: string): ParsedCompletion {
  try {
    return JSON.parse(llmOutput)
  } catch (e) {
    console.error("LLM failed to output valid JSON", {originalEntry, llmOutput})
    return {
      // match up to the first punctuation or new-line
      title: originalEntry.match(/^(.*?)[\n\r,.!?]/)?.[1] || originalEntry,
      summary: originalEntry,
      emotion: "neutral",
      themes: []
    }
  }
}

function squashTexts(lines: string[]): string {
  // join all lines together, and regex replace all \n with space
  return lines.join('\n').replace(/[\n\r]+/g, ' ')
}

/**
 * I've had a hell of a time with huggingface summarizers. They lean too heavily on
 * the training data, and everything sounds like news. I've played with hyperparameters
 * till I'm blue in the face, and I'm giving up for now and using OpenAI TLDR instead.
 */
export async function summarizeOpenai({texts}: FnIn): Promise<ParsedCompletion> {
  // replace all \n with ' ' before master-prompting
  var squashed = squashTexts(texts)

  // Even with any of keywords,emotion,summary disabled; crafting our combinedPrompt over time makes this easier to
  // get right, and we can just remove the results before returning

  // Don't rely on truncateMessages from openai.ts, since we only want to truncate the journal(s)
  var model = "gpt-4o"
  var max_tokens = 1024
  var squashedTokens = encode(squashed).tokens
  var lengths = {
    journal: squashedTokens.length,
    max: tokenLimits[model],
    reserved: encode(SYSTEM + ">>> [ENTRY] <<<").tokens.length + max_tokens,
    used: 0
  }
  lengths.used = lengths.journal + lengths.reserved
  if (lengths.used > lengths.max) {
    var tokensToDiscard = lengths.journal - (lengths.max - lengths.reserved);
    squashed = decode(squashedTokens.slice(tokensToDiscard));
  }

  var messages: Prompt = [
    {role: "system", content: SYSTEM},
    {role: "user", content: ">>> " + (squashed) + " <<<"},
  ]
  var response = await completion({
    model,
    max_tokens,
    temperature: 0,
    response_format: {type: "json_object"},
    prompt: messages,
    skipTruncate: true,

    // Defaults, since everything's working in Playground, but not live.
    // I think it's because of JSON characters which are repeated, but penalized?
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  })

  return parseCompletion(squashed, response)
}

export async function summarizeLambda({texts}: FnIn): Promise<ParsedCompletion> {
  // replace all \n with ' ' before master-prompting
  var squashed = squashTexts(texts)
  var fnName = Config.FN_SUMMARIZE_NAME
  var res = await lambdaSend<LambdaOut>({texts: squashed}, fnName, "RequestResponse")
  var txt: string = res.Payload.data[0].generated_text
  txt = txt.replaceAll('---', '\n')
  debugger
  return parseCompletion(squashed, txt)
}

/**
 * Helper function for summarize on insights page
 */
interface SummarizeInsights {
  entries: S.Entries.Entry[]
  context: FnContext,
}
export async function summarizeInsights({context, entries}: SummarizeInsights) {
  async function sendInsights(parsed: ParsedCompletion): Promise<FnOut> {
    var themes: ThemesOut = parsed.themes
    var keywords = themes.map(t => t.keywords).flat()
    await Promise.all([
      sendInsight(
        r.insights_summarize_response,
        {...parsed, keywords},
        context
      ),
      sendInsight(
        r.insights_themes_response,
        parsed,
        context
      ),
    ])
  }

  if (entries.length === 0) {
    return sendInsights({
      title: "",
      summary: SUMMARIZE_EMPTY,
      failed: true,
      emotion: "neutral",
      themes: []
    })
  }
  var parsed = await summarizeOpenai({
    // summarize summaries, NOT full originals (to reduce token max)
    texts: entries.map(getSummary),
  })
  return sendInsights(parsed)
}

interface SuggestNextEntry {
  context: FnContext
  entries: S.Entries.Entry[]
  view: string
}
export async function suggestNextEntry({entries, context, view}: SuggestNextEntry) {
  if (!entries?.length) {return}
  var text = squashTexts(entries.map(getSummary))
  var response = await completion({
    model: "gpt-4o",
    max_tokens: 256,
    prompt: "Between >>> and <<< are my prior journal entries. What should I journal about next to encourage personal growth?\n>>> " + (text) + " <<<"
  })
  return sendInsight(
    r.insights_nextentry_response,
    {text: response},
    context
  )
}


export async function summarizeEntry({text, paras}: SummarizeEntryIn): Promise<SummarizeEntryOut> {
  // This shouldn't happen, but I haven't tested to ensure
  if (paras.length === 0) {
    throw "paras.length === 0, investigate"
  }

  var parsed = await summarizeOpenai({
    // summarize summaries, NOT full originals (to reduce token max)
    texts: paras,
  })

  return {
    title: parsed.title,
    paras: [parsed.summary],
    body: {
      text: parsed.summary,
      emotion: parsed.emotion,
      keywords: parsed.themes.map(t => t.keywords).flat(),
    }
  }
}
