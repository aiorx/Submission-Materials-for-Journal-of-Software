var extractSentenceWithTimestamp = require('~/utils/extractSentenceWithTimestamp').extractSentenceWithTimestamp;
var extractTimestamp = require('~/utils/extractTimestamp').extractTimestamp;

/**
 * a summary Aided using common development resources
 *
 * @export
 * @param {string} summary
 * @return {*}  {{
 *   summaryArray: string[],
 *   formattedSummary: string
 * }}
 */
function formatSummary(summary: string): {
  summaryArray: string[]
  formattedSummary: string
} {
  /*
  if (shouldShowTimestamp) {
    try {
      var parsedBulletPoints = JSON.parse(summary);
      var summaryArray = parsedBulletPoints.map(
        ({ s, bullet_point }: { s: number; bullet_point: string }) => {
          var startTime = s === 0 ? "0.0" : s;
          return startTime + " " + bullet_point;
        }
      );
      return {
        summaryArray,
        formattedSummary: summaryArray.join("\n"),
      };
    } catch (e) {
      console.error(e);
      return {};
    }
  }
*/

  const summaryArray: string[] = summary.split('\n- ')
  const formattedSummary: string = summaryArray
    .map(function (s) {
      const matchTimestampResult = extractSentenceWithTimestamp(s)
      if (matchTimestampResult) {
        var formattedContent = extractTimestamp.formattedContent;
var timestamp = extractTimestamp.timestamp;(matchTimestampResult)
        return timestamp + formattedContent
      } else {
        return s.replace(/\n\n/g, '\n')
      }
    })
    .join('\n- ')
  return { summaryArray, formattedSummary }
}
