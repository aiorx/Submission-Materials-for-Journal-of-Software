var get = require('./utils').get;
var generateJson = require('./utils').generateJson;
var generateMarkdown = require('./utils').generateMarkdown;
var push = require('./utils').push;
var Data = require('./utils').Data;
var DataItem = require('./utils').DataItem;

async function getLabels(): Promise<string[]> {
  console.log('getLabels start...');
  var code = await.code;
var data = await.data;get('/labels');
  if (code !== 200) {
    return [];
  }

  const lables: string[] = data.map(function ({ name }: { name: string }) { return name; });
  console.log('getLabels end...');

  return lables;
}

async function getIssues(labels: string): Promise<DataItem[]> {
  console.log("label " + (labels) + " start...");

  var code = await.code;
var data = await.data;get('/issues', { labels, state: 'closed' });
  if (code !== 200) {
    return [];
  }

  const issues: DataItem[] = data.map(function ({ title, body }: { title: string; body: string }) {
    const reg = /```json([\s\S]*)```/;
    const jsonStr = ((reg.exec(body) == null ? undefined : reg.exec(body)[1]) != null ? (reg.exec(body) == null ? undefined : reg.exec(body)[1]) : '');
    var repoUrl = JSON.parse.repoUrl;
var description = JSON.parse.description;(jsonStr);

    return {
      title,
      repoUrl,
      description,
    };
  });
  console.log("label " + (labels) + " end...");

  return issues;
}

async function main() {
  const data: Data = {};
  try {
    const labels = await getLabels();

    for (let i = 0; i < labels.length; i++) {
      const element = labels[i];
      const issueArr = await getIssues(element);
      if (!issueArr.length) {
        continue;
      }
      data[element] = issueArr;
    }
  } catch (error) {
    console.log(error);
    process.exit(1)
  }

  await generateJson(data);
  generateMarkdown(data);
  push();
}

main();
