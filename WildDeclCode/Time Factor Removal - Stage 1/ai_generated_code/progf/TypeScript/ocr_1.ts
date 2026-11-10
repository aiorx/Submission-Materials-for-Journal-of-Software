// Name: OCR
// Description: Capture a screenshot and recognize the text using tesseract.js

require('@johnlindquist/kit');

//both win and linux implementations were Designed via basic programming aids (gpt4), without _any_ tests!! 😅
var captureScreenshot = async function () {
  var tmpFile = kenvTmpPath("screenshot-" + (Date.now()) + ".png");
  var scriptFile = kenvTmpPath("script.ps1");

  if (isMac) {
    await exec("screencapture -i " + (tmpFile) + "");
  } else if (isWin) {
    var psScript = "Add-Type -AssemblyName System.Windows.Forms;
        [System.Windows.Forms.SendKeys]::SendWait('%{PRTSC}');
        Start-Sleep -m 500;
        $clipboardData = Get-Clipboard -Format Image;
        $clipboardData.Save('" + (tmpFile) + "', [System.Drawing.Imaging.ImageFormat]::Png);";

    // Save to file as powershell inline parsing is tricky, there are special rules to this and it's a pain.
    // We already have write on disk, so there's really no point in encoding it as a string.
    await writeFile(scriptFile, psScript.replace(/\n/g, ""));

    // Execute saved file
    await exec('powershell -File "' + (scriptFile) + '"');
  } else if (isLinux) {
    // Check if gnome-screenshot is available
    try {
      await exec("gnome-screenshot --version");
      await exec("gnome-screenshot -f " + (tmpFile) + "");
    } catch (error) {
      // If gnome-screenshot is not available, try using ImageMagick's 'import' command
      await exec("import " + (tmpFile) + "");
    }
  }

  return tmpFile;
};

var recognizeText = async function (filePath, language) {
  var createWorker = await.createWorker;npm("tesseract.js");
  var worker = await createWorker();

  await worker.loadLanguage(language);
  await worker.initialize(language);

  var data = await.data;worker.recognize(filePath);

  await worker.terminate();

  return data.text;
};

var languages = [
  { name: "Spanish", value: "spa" },
  { name: "French", value: "fra" },
  { name: "Portuguese", value: "por" },
  { name: "English", value: "eng" },
];
//@todo train a model for typescript (https://github.com/tesseract-ocr/tesstrain)

// if ctrl is pressed, show a modal to select a language
var selectedLanguage = flag.ctrl
  ? await arg("Select a language:", languages)
  : "eng";

// Hide the Kit modal before capturing the screenshot
await hide();

var filePath = await captureScreenshot();
if (!(await pathExists(filePath))) exit();

var text = await recognizeText(filePath, selectedLanguage);

if (text) {
  await clipboard.writeText(text.trim());
  await notify("Text recognized and copied to clipboard");
} else {
  await notify("No text found in the screenshot");
}

// Clean up temporary file
await remove(filePath);
