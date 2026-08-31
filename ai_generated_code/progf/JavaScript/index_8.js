
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const filePath = path.join(__dirname, 'data.json');

const data = {
  osuPath: '',
}

const localData = {
  mapsetId: 0,
  mapsetName: '',
  mapsetPath: '',
  mapsetFiles: [],
  mapsetBackground: '',
};

let backupId = Date.now() + Math.floor(Math.random() * 1000);

if (!fs.existsSync('backup')) {
  fs.mkdirSync('backup');
}

async function saveBackup() {
  fs.writeFileSync(path.join('backup', `backup-${backupId}.json`), JSON.stringify(localData));
}

// load data
if (fs.existsSync(filePath)) {
  const fileData = fs.readFileSync(filePath);
  Object.assign(data, JSON.parse(fileData));
}


if(data.osuPath === '') {
  rl.question('Enter your osu! path: ', (answer) => {
    data.osuPath = answer;
    fs.writeFileSync(filePath, JSON.stringify(data));
    console.log('osu! path saved');
  });
} else {
  rl.question("Load backup? Press enter if no, or enter the backup ID (excluding `backup-`, just the number.): ", (answer) => {
    if (answer !== "") {
      const backupFile = fs.readFileSync(path.join('backup', `backup-${answer}.json`));
      backupId = answer;
      Object.assign(localData, JSON.parse(backupFile));
      console.log('Backup loaded');
      loop();
    } else {
      loop();
    }
  });
}

async function loop() {

  if (localData.mapsetName === '') { // shouldn't be this if we loaded a backup!!
    rl.question("Choose a mapset name: ", (answer) => {
      localData.mapsetName = answer;
      localData.mapsetPath = path.join(data.osuPath, 'Songs', answer);
      saveBackup();
      newBeatmap();
    });
  } else {
    if (localData.mapsetFiles.length !== 0) {
      rl.question("You have loaded a backup. Do you want to add more beatmaps or build the map and exit? (y/n) ", (answer) => {
        if (answer === 'y') {
          newBeatmap();
          saveBackup();
        } else {
          console.log(`Completed adding beatmaps to ${localData.mapsetName}! Now creating the mapset folder.`);
          saveBackup();
          createMapset();
          rl.close();
        }
      });
    } else {
      newBeatmap();
    }
  }

  function newBeatmap() {
    rl.question("Enter the beatmapset ID: (can be anything in your osu! songs folder: its the number at the start of the folder name - example: 93523 Tatsh - IMAGE -MATERIAL- Version 0) ", (answer) => {
      // beatmap-638553600109047587-… The sun, the moon, the stars
      
      let id = parseInt(answer);
      if (answer.startsWith('beatmap-')) {
        id = `beatmap-${answer.split('-')[1]}`;
      }

      // console.log(id);
      // console.log(data.osuPath + "\\Songs");
      const folder = fs.readdirSync(data.osuPath + "\\Songs").find((file) => file.startsWith(`${id}`));

      console.log(folder);
      
      if (!folder) {
        console.log('Beatmapset not found');
        return newBeatmap();
      }

      rl.question("Enter the beatmap diff: (must be inside the beatmapset folder you specified, and valid.) ", (answer) => {
        const mapsetFiles = fs.readdirSync(path.join(data.osuPath, 'Songs', folder));

        // console.log(mapsetFiles);
        const diff = mapsetFiles.find((file) => file.endsWith(`[${answer}].osu`));
        const diffName = diff.split('[').pop().split(']').shift();

        if (!diff) {
          console.log('Beatmap diff not found');
          return newBeatmap();
        }

        rl.question("Enter the new diff name: ", (answer) => {
          const newDiff = answer;

          localData.mapsetFiles.push({
            id,
            folder,
            diff,
            diffName,
            newDiff
          });
          saveBackup();
          rl.question("Added beatmap. Add another? (y/n) ", (answer) => {
            if (answer === 'y') {
              newBeatmap();
            } else {
              console.log(`Completed adding beatmaps to ${localData.mapsetName}! Now creating the mapset folder.`);
              saveBackup();
              createMapset();
              rl.close();
            }
          });
        });
      });
    });
  }
}

async function createMapset() {

  localData.mapsetId = Date.now() + Math.floor(Math.random() * 1000);
  // console.log(`Mapset ID: ${localData.mapsetId} ${localData.mapsetName}`);

  if (!fs.existsSync(`${data.osuPath}\\Songs\\${localData.mapsetId} ${localData.mapsetName}`)) {
    fs.mkdirSync(`${data.osuPath}\\Songs\\${localData.mapsetId} ${localData.mapsetName}`);
  }


  // console.log(localData.mapsetFiles);
  fs.copyFileSync("audio5.mp3", path.join(`${data.osuPath}\\Songs\\${localData.mapsetId} ${localData.mapsetName}`, `audio5.mp3`));
  fs.copyFileSync("aa10.jpg", path.join(`${data.osuPath}\\Songs\\${localData.mapsetId} ${localData.mapsetName}`, `aa10.jpg`));
  
  
  fs.writeFileSync(path.join(`${data.osuPath}\\Songs\\${localData.mapsetId} ${localData.mapsetName}`, `Various Artists - lmaooaoo (osu!) [extradiff].osu`), `
osu file format v14

[General]
AudioFilename: audio5.mp3
AudioLeadIn: 0
PreviewTime: 7321
Countdown: 0
SampleSet: Soft
StackLeniency: 0.7
Mode: 0
LetterboxInBreaks: 0
WidescreenStoryboard: 0
[Editor]
DistanceSpacing: 0.7
BeatDivisor: 4
GridSize: 32
TimelineZoom: 1.5
[Metadata]
Title:Map Pack (${localData.mapsetName})
TitleUnicode:Map Pack (${localData.mapsetName})
Artist:Various Artists
ArtistUnicode:Various Artists
Creator:osu!
Version:diff4title
Source:Map Pack (${localData.mapsetName})
Tags:tag1 tag2 tag3
BeatmapID:-1
BeatmapSetID:-1
[Difficulty]
HPDrainRate:1
CircleSize:5
OverallDifficulty:10
ApproachRate:10
SliderMultiplier:2.39999990463257
SliderTickRate:1

[Events]
//Background and Video events
0,0,"aa10.jpg",0,0
//Break Periods
//Storyboard Layer 0 (Background)
//Storyboard Layer 1 (Fail)
//Storyboard Layer 2 (Pass)
//Storyboard Layer 3 (Foreground)
//Storyboard Layer 4 (Overlay)
//Storyboard Sound Samples

[TimingPoints]
3685,454.545454545455,4,2,0,60,1,0
7321,-50,4,2,0,60,0,1
34594,-100,4,2,0,60,0,0
56412,-50,4,2,0,60,0,0
58230,-66.6666666666667,4,2,0,60,0,0
60048,-50,4,2,0,60,0,0
61866,-66.6666666666667,4,2,0,60,0,0
63685,-50,4,2,0,60,0,0
65503,-66.6666666666667,4,2,0,60,0,0
70957,-50,4,2,0,60,0,1
98230,-100,4,2,0,60,0,0
120048,-50,4,2,0,60,0,0
121866,-66.6666666666667,4,2,0,60,0,0
123685,-50,4,2,0,60,0,0
125503,-66.6666666666667,4,2,0,60,0,0
127321,-50,4,2,0,60,0,0
129139,-66.6666666666667,4,2,0,60,0,0
134594,-50,4,2,0,60,0,1
163685,-100,4,2,0,60,0,0


[Colours]
Combo1 : 225,174,211
Combo2 : 191,224,227
Combo3 : 64,147,208
Combo4 : 163,142,196

[HitObjects]
256,192,3685,1,0,0:0:0:0:
    
    `.replace(/^ {4}/gm, '')
  );

  const mapsetFiles = localData.mapsetFiles.map((file) => {
    const fileData = fs.readFileSync(path.join(data.osuPath, 'Songs', `${file.folder}`, file.diff));

    const parsedData = parseOsuFile(fileData.toString());

    // get the audio and copy it to the mapset folder with a random name
    // and set the audio filename to the new file
    const audioFile = parsedData.General.AudioFilename;
    const audioExt = audioFile.split('.').pop();
    const audioNewName = `${Date.now() + Math.floor(Math.random() * 1000)}.${audioExt}`;
    fs.copyFileSync(path.join(data.osuPath, 'Songs', `${file.folder}`, audioFile), path.join(`${data.osuPath}\\Songs\\${localData.mapsetId} ${localData.mapsetName}`, audioNewName));
    parsedData.General.AudioFilename = audioNewName;

    parsedData.Metadata.Version = file.newDiff;
    parsedData.Metadata.BeatmapSetID = -1;

    // copy the background image to the mapset folder with a random name
    // and set the background image to the new file and keep the extension
    // 0,0,"aa10.jpg",0,0

    let bgFile = '';
    // if(parsedData.Events.includes("") >= 0) {
    //   bgFile = parsedData.Events[0].split(',')[2].replace(/"/g, '');
    // }

    for (let i = 0; i < parsedData.Events.length; i++) {
      if (parsedData.Events[i].includes(".jpg") || parsedData.Events[i].includes(".png")) {
        bgFile = parsedData.Events[i].split(',')[2].replace(/"/g, '');
        break;
      }
    }

    if(bgFile != "") {
      const bgExt = bgFile.split('.').pop();
      const bgNewName = `${Date.now() + Math.floor(Math.random() * 1000)}.${bgExt}`;
      fs.copyFileSync(path.join(data.osuPath, 'Songs', `${file.folder}`, bgFile), path.join(`${data.osuPath}\\Songs\\${localData.mapsetId} ${localData.mapsetName}`, bgNewName));
      parsedData.Events[0] = `0,0,"${bgNewName}",0,0`;
    }

    // videos
// [Events]
// //Background and Video events
// Video,0,"shoulder bouilder bg.mp4"

    for (let i = 0; i < parsedData.Events.length; i++) {
      if (parsedData.Events[i].includes("Video")) {
        const videoFile = parsedData.Events[i].split(',')[2].replace(/"/g, '');
        const videoExt = videoFile.split('.').pop();
        const videoNewName = `${Date.now() + Math.floor(Math.random() * 1000)}.${videoExt}`;
        fs.copyFileSync(path.join(data.osuPath, 'Songs', `${file.folder}`, videoFile), path.join(`${data.osuPath}\\Songs\\${localData.mapsetId} ${localData.mapsetName}`, videoNewName));
        parsedData.Events[i] = `Video,0,"${videoNewName}"`;
      }
    }


    fs.writeFileSync(path.join(`${data.osuPath}\\Songs\\${localData.mapsetId} ${localData.mapsetName}`, file.diff.replace(`[${file.diffName}]`, `[${file.newDiff}]`),), `
osu file format v14

[General]
AudioFilename: ${audioNewName}
AudioLeadIn: ${parsedData.General.AudioLeadIn}
PreviewTime: ${parsedData.General.PreviewTime}
Countdown: ${parsedData.General.Countdown}
SampleSet: ${parsedData.General.SampleSet}
StackLeniency: ${parsedData.General.StackLeniency}
Mode: ${parsedData.General.Mode}
LetterboxInBreaks: ${parsedData.General.LetterboxInBreaks}
WidescreenStoryboard: ${parsedData.General.WidescreenStoryboard}

[Editor]
DistanceSpacing: ${parsedData.Editor.DistanceSpacing}
BeatDivisor: ${parsedData.Editor.BeatDivisor}
GridSize: ${parsedData.Editor.GridSize}
TimelineZoom: ${parsedData.Editor.TimelineZoom}

[Metadata]
Title:Map Pack (${localData.mapsetName})
TitleUnicode:Map Pack (${localData.mapsetName})
Artist:Various Artists
ArtistUnicode:Various Artists
Creator:${parsedData.Metadata.Creator}
Version:${parsedData.Metadata.Version}
Source:Map Pack (${localData.mapsetName})
Tags:${parsedData.Metadata.Tags}
BeatmapID:${parsedData.Metadata.BeatmapID}
BeatmapSetID:${parsedData.Metadata.BeatmapSetID}

[Difficulty]
HPDrainRate:${parsedData.Difficulty.HPDrainRate}
CircleSize:${parsedData.Difficulty.CircleSize}
OverallDifficulty:${parsedData.Difficulty.OverallDifficulty}
ApproachRate:${parsedData.Difficulty.ApproachRate}
SliderMultiplier:${parsedData.Difficulty.SliderMultiplier}
SliderTickRate:${parsedData.Difficulty.SliderTickRate}

[Events]
${parsedData.Events.join('\n')}


[TimingPoints]
${parsedData.TimingPoints.join('\n')}

[HitObjects]
${parsedData.HitObjects.join('\n')}
`.replace(/^ {4}/gm, '')
    );
    return file;
  });

  console.log('Beatmaps copied to mapset folder');
}

// thanks chatgpt (i was too lazy to code the map parsing myself)

function parseOsuFile(fileContent) {
  const parsedData = {
    General: {},
    Editor: {},
    Metadata: {},
    Difficulty: {},
    Events: [],
    TimingPoints: [],
    HitObjects: []
  };

  let currentSection = null;

  const lines = fileContent.split('\n');
  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('//')) {
      continue;
    }

    if (line.startsWith('[') && line.endsWith(']')) {
      currentSection = line.slice(1, -1);
    } else if (currentSection) {
      if (['General', 'Editor', 'Metadata', 'Difficulty'].includes(currentSection)) {
        const [key, value] = line.split(':', 2);
        parsedData[currentSection][key.trim()] = value.trim();
      } else if (currentSection === 'Events') {
        parsedData.Events.push(line);
      } else if (currentSection === 'TimingPoints') {
        parsedData.TimingPoints.push(line);
      } else if (currentSection === 'HitObjects') {
        parsedData.HitObjects.push(line);
      }
    }
  }

  return parsedData;
}