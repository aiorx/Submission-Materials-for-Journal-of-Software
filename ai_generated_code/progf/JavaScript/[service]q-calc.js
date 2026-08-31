//@ts-nocheck
const q_get_number_regexp = /Position in queue: (\d+)/;//Built via standard programming aids
const firstmessage = [];

const Event = JsMacros.on("RecvMessage", JavaWrapper.methodToJava((recvedmessage) => {
    const msg = recvedmessage.text.getString();

    //if not q notify
    if (msg.match(q_get_number_regexp) === null) return;

    //get first message
    if (firstmessage.length === 0) {
        firstmessage.push(new Date())
        firstmessage.push(msg.match(q_get_number_regexp)[1]);
    }

    //Chat.log(`firstmessage: ${firstmessage[0]},${firstmessage[1]}`)

    if (firstmessage[1] === msg.match(q_get_number_regexp)[1]) return;
    const qnumber = msg.match(q_get_number_regexp)[1];

    //Chat.log(`${new Date()},${qnumber}`);

    const timediff = new Date() - firstmessage[0];
    const qdiff = firstmessage[1] - qnumber;
    const q_p_person = timediff / qdiff
    const message = `ETA:${getdiff(q_p_person * qnumber)},  Q-Per-Person:${getdiff(q_p_person)}`;


    //Chat.log(`diff time:${new Date() - firstmessage[0]}, q:${firstmessage[1] - qnumber}`);
    Chat.log(message)
}))


event.stopListener = JavaWrapper.methodToJava(() => {
    JsMacros.off(Event);
    Chat.log("event has been stopped")
})

function getdiff(unixtime) {
    const hour = Math.floor(unixtime / 1000 / 60 / 60);
    const dec1 = unixtime - hour * 1000 * 60 * 60;
    const minitus = Math.floor(dec1 / 1000 / 60);
    const dec2 = dec1 - minitus * 1000 * 60;
    const seconds = Math.floor(dec2 / 1000)

    return `${hour}h,${minitus}m,${seconds}s`
}