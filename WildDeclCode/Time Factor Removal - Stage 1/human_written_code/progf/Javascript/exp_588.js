//META{"name":"NitroEmoteAndScreenShareBypass","source":"https://github.com/oSumAtrIX/BetterDiscordPlugins","website":"https://github.com/oSumAtrIX"}*//
class NitroEmoteAndScreenShareBypass {
    getName() {
        return "NitroEmoteAndScreenShareBypass";
    }
    getDescription() {
        return "Send nitro emotes (lame bypass) and enable high quality screen sharing without Nitro";
    }
    getVersion() {
        return "3.2";
    }
    getAuthor() {
        return "oSumAtrIX";
    }
    stop() {}
	
    start() {
        var checkExist = setInterval(function () {	
    		for (var mdl of Object.values(webpackJsonp.push([[],{['']:(_,e,r)=>{e.cache=r.c}},[['']]]).cache)) {
    		    var d = mdl.exports.default;
    		    if (d && d['getCurrentUser']) d.getCurrentUser().premiumType = 2;
    		}
        	clearInterval(checkExist);
    	}, 1000);
    }

    onSwitch() {
        var useFileUpload = false;
        var div = document.getElementsByClassName("name-3YKhmS")[0];
	    var serverName = div != undefined ? div.innerHTML : "noServer";
        var btn = $(".buttonContainer-28fw2U")[1];
        if (btn != null)
            btn.onclick = function () {
                var checkExist = setInterval(function() {
                    var scroller = $(".listItems-1uJgMC")[0];
                    if (scroller == null) return;
                    clearInterval(checkExist);
                    scroller.parentElement.onclick = (e) => {
                        var target = e.target;
                        var src = target.firstChild.src;
			var ext = src.slice(-7, -4);
			    
                        if (ext == "gif" || target.parentElement.parentElement.children[0].firstChild.children[1].innerHTML != serverName) {
                            var curChannel = BdApi.findModuleByProps("getLastSelectedChannelId").getChannelId();
                            var url = src.slice(0, -4) + "?size=40";
                            useFileUpload ?
                                fetch(url)
                                .then(res => res.blob()).then(blob => {
                                    BdApi.findModuleByProps("instantBatchUpload").instantBatchUpload(curChannel, [new File([blob], 'oSumAtrIX.'+ext, blob)]);
                                }) :
                                BdApi.findModuleByProps("sendMessage").sendMessage(curChannel, {
                                    content: url
                                });
                        }
                    }
                }, 100);
            }
    }
}
