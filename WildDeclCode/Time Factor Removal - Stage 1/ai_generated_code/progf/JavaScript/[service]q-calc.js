//@ts-nocheck
var q_get_number_regexp = /Position in queue: (\d+)/;//Built via standard programming aids
var firstmessage = [];

var Event = JsMacros.on("RecvMessage", JavaWrapper.methodToJava(function (recvedmessage) {
    var msg = recvedmessage.text.getString();

    //if not q notify
    if (msg.match(q_get_number_regexp) === null) return;

    //get first message
    if (firstmessage.length === 0) {
        firstmessage.push(new Date())
        firstmessage.push(msg.match(q_get_number_regexp)[1]);
    }

    //Chat.log(`firstmessage: ${firstmessage[0]},${firstmessage[1]}`)

    if (firstmessage[1] === msg.match(q_get_number_regexp)[1]) return;
    var qnumber = msg.match(q_get_number_regexp)[1];

    //Chat.log(`${new Date()},${qnumber}`);

    var timediff = new Date() - firstmessage[0];
    var qdiff = firstmessage[1] - qnumber;
    var q_p_person = timediff / qdiff
    var message = "ETA:" + (getdiff(q_p_person * qnumber)) + ",  Q-Per-Person:" + (getdiff(q_p_person)) + "";


    //Chat.log(`diff time:${new Date() - firstmessage[0]}, q:${firstmessage[1] - qnumber}`);
    Chat.log(message)
}))


event.stopListener = JavaWrapper.methodToJava(function () {
    JsMacros.off(Event);
    Chat.log("event has been stopped")
})

function getdiff(unixtime) {
    var hour = Math.floor(unixtime / 1000 / 60 / 60);
    var dec1 = unixtime - hour * 1000 * 60 * 60;
    var minitus = Math.floor(dec1 / 1000 / 60);
    var dec2 = dec1 - minitus * 1000 * 60;
    var seconds = Math.floor(dec2 / 1000)

    return "" + (hour) + "h," + (minitus) + "m," + (seconds) + "s"
}