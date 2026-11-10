var View = require('../types/views').View;

export interface BuildContextOption {
  isGenerateOnlyView?: boolean;
}

class BuildContext {
  current!: View;
  option?: BuildContextOption;
  code = "";
  indent = 0;
  withoutIndent = false;
  withoutLineBreak = false;

  nest() {
    this.indent += 4;
  }
  unnest() {
    this.indent -= 4;
  }
  nestBlock(closure: function () { return void; }) {
    this.nest();
    closure();
    this.unnest();
  }

  disableIndent() {
    this.withoutIndent = true;
  }
  enableIndent() {
    this.withoutIndent = false;
  }

  disableLineBreak() {
    this.withoutLineBreak = true;
  }
  enableLineBreak() {
    this.withoutLineBreak = false;
  }

  singleLine(closure: function () { return void; }) {
    this.disableIndent();
    this.disableLineBreak();
    closure();
    this.enableLineBreak();
    this.enableIndent();
  }

  add(
    code: string,
    options?: {
      withoutIndent?: boolean;
      withoutLineBreak?: boolean;
    }
  ) {
    let withoutIndent = options?(.withoutIndent != null ? .withoutIndent : this.withoutIndent);
    let withoutLineBreak = options?(.withoutLineBreak != null ? .withoutLineBreak : this.withoutLineBreak);
    if (code === "\n") {
      withoutIndent = true;
      withoutLineBreak = true;
    }

    const indent = withoutIndent ? "" : this._indent();
    const linebreak = withoutLineBreak ? "" : "\n";
    this.code += "" + (indent) + "" + (code) + "" + (linebreak) + "";
  }
  lineBreak() {
    this.add("");
  }

  _indent(): string {
    return Array(this.indent).fill(" ").join("");
  }
}
