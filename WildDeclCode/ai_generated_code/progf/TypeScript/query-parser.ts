// Assisted using common GitHub development utilities
import { Lexer, IToken, TokenType } from "./query-lexer";

// AST Node interfaces
export interface IQueryNode {
  type: "Query";
  filters: IFilterNode[];
  sort?: ISortNode;
  group?: IGroupNode;
  limit?: ILimitNode;
}

export interface IFilterNode {
  type: "Filter";
  expression: IExpressionNode;
}

export interface ISortNode {
  type: "Sort";
  field: string;
  reverse: boolean;
}

export interface IGroupNode {
  type: "Group";
  field: string;
}

export interface ILimitNode {
  type: "Limit";
  count: number;
}

// Expression types
export type IExpressionNode =
  | IComparisonExpression
  | IContainsExpression
  | INotExpression
  | IAndExpression
  | IOrExpression
  | IValueExpression;

export interface IComparisonExpression {
  type: "Comparison";
  field: string;
  operator: string;
  value: string;
}

export interface IContainsExpression {
  type: "Contains";
  field: string;
  value: string;
}

export interface INotExpression {
  type: "Not";
  expr: IExpressionNode;
}

export interface IAndExpression {
  type: "And";
  left: IExpressionNode;
  right: IExpressionNode;
}

export interface IOrExpression {
  type: "Or";
  left: IExpressionNode;
  right: IExpressionNode;
}

export interface IValueExpression {
  type: "Value";
  value: string;
}

/**
 * クエリ構文解析器（Parser）
 * @generated Assisted using common GitHub development utilities
 */
export class Parser {
  private lexer: Lexer;
  private current: IToken;
  private errors: string[] = [];

  constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.current = this.lexer.nextToken();
  }

  public parseQuery(): IQueryNode {
    const filters: IFilterNode[] = [];
    let sort: ISortNode | undefined;
    let group: IGroupNode | undefined;
    let limit: ILimitNode | undefined;
    while (this.current.type !== TokenType.EOF) {
      if (this._isFilterStart()) {
        filters.push(this.parseFilter());
      } else if (this._matchKeyword("sort")) {
        sort = this.parseSort();
      } else if (this._matchKeyword("group")) {
        group = this.parseGroup();
      } else if (this._matchKeyword("limit")) {
        limit = this.parseLimit();
      } else {
        this._error(`Unexpected token: ${this.current.value}`);
        this._advance();
      }
    }
    return { type: "Query", filters, sort, group, limit };
  }

  public parseFilter(): IFilterNode {
    const expr = this.parseExpression();
    return { type: "Filter", expression: expr };
  }

  public parseSort(): ISortNode {
    // sort by <field> [reverse]
    this._expectKeyword("sort");
    this._expectKeyword("by");
    const field = this._expectValue();
    let reverse = false;
    if (this._matchKeyword("reverse")) {
      reverse = true;
      this._advance();
    }
    return { type: "Sort", field, reverse };
  }

  public parseGroup(): IGroupNode {
    // group by <field>
    this._expectKeyword("group");
    this._expectKeyword("by");
    const field = this._expectValue();
    return { type: "Group", field };
  }

  public parseLimit(): ILimitNode {
    // limit <number>
    this._expectKeyword("limit");
    const count = parseInt(this._expectNumber(), 10);
    return { type: "Limit", count };
  }

  public parseExpression(): IExpressionNode {
    // Handle NOT
    if (this._matchKeyword("not")) {
      this._advance();
      return { type: "Not", expr: this.parseExpression() };
    }
    let left = this._parseSimpleExpression();
    while (this._matchKeyword("and") || this._matchKeyword("or")) {
      const op = this.current.value.toLowerCase();
      this._advance();
      const right = this._parseSimpleExpression();
      if (op === "and") {
        left = { type: "And", left, right };
      } else {
        left = { type: "Or", left, right };
      }
    }
    return left;
  }

  private _parseSimpleExpression(): IExpressionNode {
    // due before tomorrow, tag contains #work, done, etc
    if (
      this.current.type === TokenType.KEYWORD &&
      ["due", "tag", "done"].includes(this.current.value.toLowerCase())
    ) {
      const field = this.current.value.toLowerCase();
      this._advance();
      // TokenTypeをstringとして比較
      if (
        (field === "tag" &&
          String(this.current.type) === String(TokenType.OPERATOR) &&
          this.current.value.toLowerCase() === "contains") ||
        (field === "due" &&
          String(this.current.type) === String(TokenType.OPERATOR) &&
          (this.current.value.toLowerCase() === "before" ||
            this.current.value.toLowerCase() === "after"))
      ) {
        const operator = this.current.value.toLowerCase();
        this._advance();
        const value = this._expectValue();
        if (field === "tag" && operator === "contains") {
          return { type: "Contains", field, value };
        } else if (
          field === "due" &&
          (operator === "before" || operator === "after")
        ) {
          return { type: "Comparison", field, operator, value };
        }
      } else if (field === "done") {
        // done/undone
        return { type: "Value", value: "done" };
      }
    } else if (this.current.type === TokenType.VALUE) {
      const value = this.current.value;
      this._advance();
      return { type: "Value", value };
    }
    this._error(`Invalid expression at: ${this.current.value}`);
    this._advance();
    return { type: "Value", value: "" };
  }

  private _isFilterStart(): boolean {
    // フィルター開始条件: not, due, tag, done, ...
    return (
      this.current.type === TokenType.KEYWORD &&
      ["not", "due", "tag", "done"].includes(this.current.value.toLowerCase())
    );
  }

  private _matchKeyword(word: string): boolean {
    return (
      this.current.type === TokenType.KEYWORD &&
      this.current.value.toLowerCase() === word.toLowerCase()
    );
  }

  private _expectKeyword(word: string): void {
    if (!this._matchKeyword(word)) {
      this._error(`Expected keyword '${word}' but got '${this.current.value}'`);
    }
    this._advance();
  }

  private _expectValue(): string {
    if (this.current.type !== TokenType.VALUE) {
      this._error(`Expected value but got '${this.current.value}'`);
      this._advance();
      return "";
    }
    const val = this.current.value;
    this._advance();
    return val;
  }

  private _expectNumber(): string {
    if (this.current.type !== TokenType.NUMBER) {
      this._error(`Expected number but got '${this.current.value}'`);
      this._advance();
      return "";
    }
    const val = this.current.value;
    this._advance();
    return val;
  }

  private _advance(): void {
    this.current = this.lexer.nextToken();
  }

  private _error(msg: string): void {
    this.errors.push(msg);
  }

  public getErrors(): string[] {
    return this.errors;
  }
}
