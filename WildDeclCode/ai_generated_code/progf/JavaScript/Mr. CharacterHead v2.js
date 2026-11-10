// Caleb Luh
// 4/2/2025
// Updated to current JS standards using GitHub Copilot

let h = 0, e = 0, n = 0, m = 0;
let hChose = "", eChose = ":", nChose = "-", mChose = ")";
document.write(`
    <form name="theForm">
        <center>
            <input type="text" size="20" name="face">
            <br><input type="button" value="Hair" onclick="changeHair()">
            <br><input type="button" value="Eyes" onclick="changeEyes()">
            <br><input type="button" value="Nose" onclick="changeNose()">
            <br><input type="button" value="Mouth" onclick="changeMouth()">
            &nbsp;&nbsp;<input type="button" value="View" onclick="viewIt()">
        </center>
    </form>
`);
document.theForm.face.value = `${hChose} ${eChose} ${nChose}${mChose}`;

const hair = ["", "[[[", "2", "3", "(", "\\/\\/", "~"];
const eyes = [":", "B", ">:","<:", ";", ":`"];
const nose = ["-", "^", "o", "~", "\\"];
const mouth = ["P", "0", "}", "]", ")==="];

function changeHair() {
    if (h === hair.length - 1) {
        h = 0;
    } else {
        h++;
    }
    hChose = hair[h];
    document.theForm.face.value = `${hChose} ${eChose} ${nChose}${mChose}`;
}

function changeEyes() {
    if (e === eyes.length - 1) {
        e = 0;
    } else {
        e++;
    }
    eChose = eyes[e];
    document.theForm.face.value = `${hChose} ${eChose} ${nChose}${mChose}`;
}

function changeNose() {
    if (n === nose.length - 1) {
        n = 0;
    } else {
        n++;
    }
    nChose = nose[n];
    document.theForm.face.value = `${hChose} ${eChose} ${nChose}${mChose}`;
}

function changeMouth() {
    if (m === mouth.length - 1) {
        m = 0;
    } else {
        m++;
    }
    mChose = mouth[m];
    document.theForm.face.value = `${hChose} ${eChose} ${nChose}${mChose}`;
}

function viewIt() {
    let mth = mChose.slice(1);
    const see = window.open('', '', 'width=200,height=175,toolbar=no,status=no,scrollbars=no');
    see.document.write(`
        <html>
            <head><title>Mr. CharacterHead</title></head>
            <body>
                <center>
                    <font size="7"><b>${hChose} <font color="blue">${eChose}</font> ${nChose} <font color="red">${mChose.charAt(0)}</font>${mth}</b></font>
                    <br><br>
                    <font size="2"><i>Mr. CharacterHead!</i></font>
                    <br>
                    <font size="1"><a href="javascript:this.close();">close</a></font>
                </center>
            </body>
        </html>
    `);
    see.document.close();
}
// Coded by Caleb Luh