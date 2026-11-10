// Assisted using common GitHub development utilities
/**
 * TokenType: クエリ字句解析用トークン種別
 */
export enum TokenType {
  KEYWORD = "KEYWORD",
  OPERATOR = "OPERATOR",
  VALUE = "VALUE",
  DATE = "DATE",
  NUMBER = "NUMBER",
  WHITESPACE = "WHITESPACE",
  EOF = "EOF",
}

/**
 * IToken: クエリ字句解析用トークン
 */
export interface IToken {
  type: TokenType;
  value: string;
  position: { line: number; column: number };
}

/**
 * クエリ字句解析器（Lexer）
 * Obsidian Tasks互換クエリ対応
 * @generated Assisted using common GitHub development utilities
 */
export class Lexer {
  private input: string;
  private pos: number = 0;
  private line: number = 1;
  private column: number = 1;
  private peekedToken: IToken | null = null;

  constructor(input: string) {
    this.input = input;
  }

  /**
   * 次のトークンを返す
   */
  public nextToken(): IToken {
    if (this.peekedToken) {
      const t = this.peekedToken;
      this.peekedToken = null;
      return t;
    }
    return this._nextTokenInternal();
  }

  /**
   * 次のトークンを先読み
   */
  public peek(): IToken {
    if (!this.peekedToken) {
      this.peekedToken = this._nextTokenInternal();
    }
    return this.peekedToken;
  }

  /**
   * トークンが残っているか
   */
  public hasNext(): boolean {
    return this.peek().type !== TokenType.EOF;
  }

  /**
   * 現在位置
   */
  public getPosition(): { line: number; column: number } {
    return { line: this.line, column: this.column };
  }

  private _nextTokenInternal(): IToken {
    this._skipWhitespace();
    if (this.pos >= this.input.length) {
      return this._makeToken(TokenType.EOF, "");
    }
    const c = this.input[this.pos];
    // KEYWORD/OPERATOR
    const keywordMatch = this._matchKeywordOrOperator();
    if (keywordMatch) {
      return keywordMatch;
    }
    // DATE
    const dateMatch = this._matchDate();
    if (dateMatch) {
      return dateMatch;
    }
    // NUMBER
    const numberMatch = this._matchNumber();
    if (numberMatch) {
      return numberMatch;
    }
    // VALUE (タグ, today, tomorrow, etc)
    const valueMatch = this._matchValue();
    if (valueMatch) {
      return valueMatch;
    }
    // WHITESPACE
    if (/\s/.test(c)) {
      const start = this._getPos();
      let val = "";
      while (this.pos < this.input.length && /\s/.test(this.input[this.pos])) {
        val += this.input[this.pos];
        this._advance();
      }
      return this._makeToken(TokenType.WHITESPACE, val, start);
    }
    // 不明な文字
    const unknown = this.input[this.pos];
    this._advance();
    console.warn(
      `[Lexer] Unknown char '${unknown}' at ${this.line}:${this.column}`
    );
    return this._makeToken(TokenType.VALUE, unknown);
  }

  private _matchKeywordOrOperator(): IToken | null {
    const keywords = [
      "not",
      "done",
      "due",
      "before",
      "after",
      "tag",
      "contains",
      "group",
      "by",
      "filename",
      "sort",
      "reverse",
      "limit",
    ];
    for (const kw of keywords.sort((a, b) => b.length - a.length)) {
      if (this.input.slice(this.pos).toLowerCase().startsWith(kw)) {
        const nextChar = this.input[this.pos + kw.length];
        if (!nextChar || /[^a-zA-Z]/.test(nextChar)) {
          const type = ["contains", "before", "after"].includes(kw)
            ? TokenType.OPERATOR
            : TokenType.KEYWORD;
          const token = this._makeToken(
            type,
            this.input.substr(this.pos, kw.length)
          );
          this._advanceN(kw.length);
          return token;
        }
      }
    }
    return null;
  }

  private _matchDate(): IToken | null {
    // YYYY-MM-DD
    const dateRegex = /^(\d{4}-\d{2}-\d{2})/;
    const m = dateRegex.exec(this.input.slice(this.pos));
    if (m) {
      const token = this._makeToken(TokenType.DATE, m[1]);
      this._advanceN(m[1].length);
      return token;
    }
    // today, tomorrow, next week, this week
    const relDates = ["today", "tomorrow", "next week", "this week"];
    for (const rel of relDates.sort((a, b) => b.length - a.length)) {
      if (this.input.slice(this.pos).toLowerCase().startsWith(rel)) {
        const token = this._makeToken(TokenType.DATE, rel);
        this._advanceN(rel.length);
        return token;
      }
    }
    return null;
  }

  private _matchNumber(): IToken | null {
    const numRegex = /^(\d+)/;
    const m = numRegex.exec(this.input.slice(this.pos));
    if (m) {
      const token = this._makeToken(TokenType.NUMBER, m[1]);
      this._advanceN(m[1].length);
      return token;
    }
    return null;
  }

  private _matchValue(): IToken | null {
    // タグ: #tag
    if (this.input[this.pos] === "#") {
      let val = "#";
      let i = this.pos + 1;
      while (i < this.input.length && /[\w\-_]/.test(this.input[i])) {
        val += this.input[i];
        i++;
      }
      if (val.length > 1) {
        const token = this._makeToken(TokenType.VALUE, val);
        this._advanceN(val.length);
        return token;
      }
    }
    // その他の値（英数字単語）
    const wordRegex = /^[a-zA-Z0-9_-]+/;
    const m = wordRegex.exec(this.input.slice(this.pos));
    if (m) {
      const token = this._makeToken(TokenType.VALUE, m[0]);
      this._advanceN(m[0].length);
      return token;
    }
    return null;
  }

  private _skipWhitespace(): void {
    while (this.pos < this.input.length && /\s/.test(this.input[this.pos])) {
      this._advance();
    }
  }

  private _advance(): void {
    if (this.input[this.pos] === "\n") {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    this.pos++;
  }

  private _advanceN(n: number): void {
    for (let i = 0; i < n; i++) {
      this._advance();
    }
  }

  private _getPos(): { line: number; column: number } {
    return { line: this.line, column: this.column };
  }

  private _makeToken(
    type: TokenType,
    value: string,
    pos?: { line: number; column: number }
  ): IToken {
    return {
      type,
      value,
      position: pos ? { ...pos } : { line: this.line, column: this.column },
    };
  }
}
