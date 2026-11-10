// @flow
'use strict';
var meow = require('meow');
var chalk /*: any */ = require('chalk');
var repoGrowth = require('./');

/*::
*/

var cli = meow({
  help: "
    $ repo-growth <...flags> [-- <...cloc flags>]

    Flags
      --match, -m <file regex>  Match files/dirs using regex
      --start, -s <date>        Start Date
      --end, -e <date>          End Date
      --freq, -f <days>         Frequency (in days)
      --json                    Output JSON
      --branch, -b <branch>     Select the branch used

    Examples
      $ repo-growth
      $ repo-growth -s 2017-01 -e 2018-01 -f 365
      $ repo-growth --branch production
      $ repo-growth --match 'packages/.*/src/.*'

    Dates
      Dates should be formatted YYYY-MM
  ",
  flags: {
    match: {
      type: 'string',
      alias: 'm'
    },
    start: {
      type: 'string',
      alias: 's'
    },
    end: {
      type: 'string',
      alias: 'e',
    },
    freq: {
      type: 'number',
      alias: 'f'
    },
    branch: {
      type: 'string',
      alias: 'b'
    },
    '--': true
  },
});

var VALI_DATE = /^([0-9]{4})-([0-9]{2})$/;

function toDate(dateStr) {
  var match = dateStr.match(VALI_DATE);

  if (!match) {
    console.error(chalk.red('Invalid date format: "' + (dateStr) + '" (must be YYYY-MM)'));
    throw process.exit(1);
  }

  var year = parseInt(match[1], 10);
  var month = parseInt(match[2], 10) - 1;
  var day = 1;

  return new Date(year, month, day);
}

var opts /*: Opts */ = {};
opts.cwd = process.cwd();
if (cli.flags.match) opts.match = cli.flags.match;
if (cli.flags.start) opts.start = toDate(cli.flags.start);
if (cli.flags.end) opts.end = toDate(cli.flags.end);
if (cli.flags.freq) opts.freq = cli.flags.freq;
if (cli.flags.branch) opts.branch = cli.flags.branch;
if (cli.flags['--']) opts.clocArgs = cli.flags['--'];

repoGrowth(opts).then(function () {
  process.exit(0);
}).catch(function err {
  console.error(err);
  process.exit(1);
});
