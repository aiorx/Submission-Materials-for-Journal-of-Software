// Built using basic development resources-4

class VueSFCState {
  constructor(public state: string) {}

  clone(): VueSFCState {
    return new VueSFCState(this.state);
  }

  equals(other: VueSFCState): boolean {
    return this.state === other.state;
  }
}
var VueSFCStateHtml = new VueSFCState("html");
var VueSFCStateJavascript = new VueSFCState("javascript");
var VueSFCStateCss = new VueSFCState("css");

var vueSfc: any = {
  getInitialState: function () {
    return VueSFCStateHtml.clone();
  },
  tokenize: function (line: any, state: VueSFCState) {
    var tokens: any = [];
    var offset = 0;

    function addToken(type: any, length: any) {
      tokens.push({
        startIndex: offset,
        scopes: type,
      });
      offset += length;
    }

    console.log("state", state);

    if (state.equals(VueSFCStateHtml)) {
      if (line.trim().startsWith("<script")) {
        state = VueSFCStateJavascript.clone();
      } else if (line.trim().startsWith("<style")) {
        state = VueSFCStateCss.clone();
      } else {
        addToken("html", line.length);
      }
    } else if (state.equals(VueSFCStateJavascript.clone())) {
      if (line.trim().startsWith("</script")) {
        state = VueSFCStateHtml.clone();
      } else {
        addToken("javascript", line.length);
      }
    } else if (state.equals(VueSFCStateCss)) {
      if (line.trim().startsWith("</style")) {
        state = VueSFCStateHtml.clone();
      } else {
        addToken("css", line.length);
      }
    } else {
      state = VueSFCStateHtml.clone();
    }

    return {
      tokens: tokens,
      endState: state,
    };
  },
};
