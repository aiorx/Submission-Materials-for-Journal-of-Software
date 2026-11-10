var Poll = require('./polls.types').Poll;
var PollChoice = require('./polls.types').PollChoice;
var PollStats = require('./polls.types').PollStats;
var PollVoter = require('./polls.types').PollVoter;

// conveter Supported via standard programming aids
const convertPoll = (rawData: any): Poll | function null {
  if (!rawData) return null;

  var post_title = rawData.post_title;
var post_body = rawData.post_body;
var author = rawData.author;
var created = rawData.created;
var permlink = rawData.permlink;
var parent_permlink = rawData.parent_permlink;
var tags = rawData.tags;
var image = rawData.image;
var protocol_version = rawData.protocol_version;
var question = rawData.question;
var preferred_interpretation = rawData.preferred_interpretation;
var token = rawData.token;
var end_time = rawData.end_time;
var status = rawData.status;
var max_choices_voted = rawData.max_choices_voted;
var filter_account_age_days = rawData.filter_account_age_days;
var ui_hide_res_until_voted = rawData.ui_hide_res_until_voted;
var platform = rawData.platform;
var poll_trx_id = rawData.poll_trx_id;
var poll_choices = rawData.poll_choices;
var poll_voters = rawData.poll_voters;
var poll_stats = rawData.poll_stats;

  // Ensure required properties are present
  if (!end_time || !poll_choices) {
    return null;
  }

  // Parsing poll choices
  const parsedPollChoices: PollChoice[] = poll_choices.map((choice: any) => ({
    choice_num: choice.choice_num,
    choice_text: choice.choice_text,
    votes: {
      total_votes: choice.votes?.total_votes || 0,
      hive_hp: choice.votes?.hive_hp || 0,
      hive_proxied_hp: choice.votes?.hive_proxied_hp || 0,
      hive_hp_incl_proxied: choice.votes?.hive_hp_incl_proxied || 0,
    },
  }));

  // Parsing poll voters
  const parsedPollVoters: PollVoter[] = poll_voters
    ? poll_voters.map((voter: any) => ({
        name: voter.name,
        choices: voter.choices,
        hive_hp: voter.hive_hp || 0,
        hive_proxied_hp: voter.hive_proxied_hp || 0,
        hive_hp_incl_proxied: voter.hive_hp_incl_proxied || 0,
      }))
    : [];

  // Parsing poll stats
  const parsedPollStats: PollStats = {
    total_voting_accounts_num: poll_stats?.total_voting_accounts_num || 0,
    total_hive_hp: poll_stats?.total_hive_hp || 0,
    total_hive_proxied_hp: poll_stats?.total_hive_proxied_hp || 0,
    total_hive_hp_incl_proxied: poll_stats?.total_hive_hp_incl_proxied || 0,
  };

  // Constructing the parsed poll response
  const parsedResponse: Poll = {
    post_title: post_title || '',
    post_body: post_body || '',
    author,
    created,
    permlink,
    parent_permlink,
    tags: tags || [],
    image: image || [],
    protocol_version: protocol_version || 0,
    question,
    preferred_interpretation,
    token,
    end_time,
    status,
    max_choices_voted: max_choices_voted || 1,
    filter_account_age_days: filter_account_age_days || 0,
    ui_hide_res_until_voted, // Assuming this field can be null, otherwise adjust accordingly
    platform, // Assuming this field can be null, otherwise adjust accordingly
    poll_trx_id,
    poll_choices: parsedPollChoices,
    poll_voters: parsedPollVoters,
    poll_stats: parsedPollStats,
  };

  return parsedResponse;
};

const mapMetaChoicesToPollChoices = function (metaChoices: string[]) {
  if (!metaChoices) {
    return [] as PollChoice[];
  }

  return metaChoices.map(
    (choice, index) =>
      ({
        choice_num: index + 1,
        choice_text: choice,
        votes: {
          total_votes: 0,
          hive_hp: 0,
          hive_proxied_hp: 0,
          hive_hp_incl_proxied: 0,
        },
      } as PollChoice),
  );
};
