const number = 'number';
const keyword = 'keyword';
const identifier = 'identifier';
const operator = 'operator';
const string = 'string';
const equal = 'equal';
const ret = 'return';

class Token {
	constructor() {
		this._token = '';
	}

	set token(token) {
		this._token = token;
	}

	get token() {
		return this._token;
	}

	start(index, line, column) {
		this._start = { index, line, column };
	}

	end(index, line, column) {
		this._end = { index, line, column };
		if (this.type === identifier && isKeyword(this._token)) {
			this.type = keyword;
		}
	}

	get pos() {
		return `${this._start.line} col ${this._start.column}`
	}

	isComplete() {
		return this._start && this._end;
	}

	isStarting() {
		return this._start && !this._end;
	}
}


class Tokenizer {
	constructor() {
		this._tokenList = [];
		this._index = 0;
	}

	parse(input) {
		this._index = 0;
		this._tokenList = [];
		this._line = 1;
		this._column = 1;

		this._token = new Token();

		while (this._index < input.length) {
			const char = input[this._index];

			if (char === '\n') {
				this._endIfStarting();
				this._line++;
				this._column = 1;
				this._index++;
				continue;
			}

			if (char === ' ' || char === '\t') {
				this._endIfStarting();
				this._nextCursor();
				continue;
			}

			if (isOperator(char)) {
				this._endIfStarting();
				this._singleCharToken(operator, char);
				continue;
			}

			if (isLetter(char)) {
				if (this._token.isStarting()) {
					this._token.token += char;
				} else {
					this._startToken(identifier, char);
				}
				this._nextCursor();
				continue;
			}

			if (isNumber(char)) {
				if (this._token.isStarting()) {
					this._token.token += char;
				} else {
					this._startToken(number, char);
				}
				this._nextCursor();
				continue;
			}


			if (char === '=') {
				this._endIfStarting();
				this._singleCharToken(equal, char);
				continue;
			}


			if (char === '(') {
				this._endIfStarting();
				this._singleCharToken('openParen', char);
				continue;
			}

			if (char === ')') {
				this._endIfStarting();
				this._singleCharToken('closeParen', char);
				continue;
			}

			if (char === '{') {
				this._endIfStarting();
				this._singleCharToken('openBrace', char);
				continue;
			}

			if (char === '}') {
				this._endIfStarting();
				this._singleCharToken('closeBrace', char);
				continue;
			}

			if (char === '[') {
				this._endIfStarting();
				this._singleCharToken('openSquareBracket', char);
				continue;
			}

			if (char === ']') {
				this._endIfStarting();
				this._singleCharToken('closeSquareBracket', char);
				continue;
			}

			if (char === ':') {
				this._endIfStarting();
				this._singleCharToken('colon', char);
				continue;
			}

			if (char === ';') {
				this._endIfStarting();
				this._singleCharToken('semicolon', char);
				continue;
			}

			if (char === ',') {
				this._endIfStarting();
				this._singleCharToken('comma', char);
				continue;
			}

			// TODO must change this if we want to use floating number
			if (char === '.') {
				this._endIfStarting();
				this._singleCharToken('dot', char);
				continue;
			}

			if (char === '"') {
				this._endIfStarting();
				this._startToken(string, char);

				this._nextCursor();
				let newChar = input[this._index];
				this._token.token += newChar;
				while(newChar !== '"' && this._index < input.length) {
					this._nextCursor();
					newChar = input[this._index];
					this._token.token += newChar;
				}
				this._nextCursor();
				this._endToken();
				continue;
			}


			throw new Error('Invalid character: ' + char + '('+ char.charCodeAt(0).toString(16) +') at ' + this._index + ' on line ' + this._line + ' column ' + this._column);
		}

		this._endIfStarting();

		return this._tokenList;
	}

	_endIfStarting() {
		if (this._token.isStarting()) {
			this._endToken();
		}
	}

	_startToken(type, firstChar) {
		this._token.type = type;
		this._token.start(this._index, this._line, this._column);
		this._token.token = firstChar;
	}

	_endToken() {
		this._token.end(this._index, this._line, this._column);
		this._tokenList.push(this._token);
		this._token = new Token();
	}

	_singleCharToken(type, char) {
		this._startToken(type, char);
		this._endToken();
		this._nextCursor();
	}

	_nextCursor() {
		this._index++;
		this._column++;
	}
}

/**
 * Below is the code generated Supported by standard GitHub tools
 */

/**
 * @param {string} input
 * @return {string}
 * @example
 * // returns 'hello'
 * unescapeString('"hello"');
 * @example
 * // returns 'hello'
 * unescapeString('"hello"');
 */

function isNumber(char) {
	return char >= '0' && char <= '9';
}

function isLetter(char) {
	return char >= 'a' && char <= 'z' || char >= 'A' && char <= 'Z';
}

function isOperator(char) {
	return char === '+' || char === '-' || char === '*' || char === '/';
}

function isKeyword(char) {
	return char === 'var' ||
		char === 'fn' ||
		char === 'if' ||
		char === 'else' ||
		char === 'while' ||
		char === 'for' ||
		char === 'return' ||
		char === 'break' ||
		char === 'continue' ||
		char === 'true' ||
		char === 'false' ||
		char === 'null';
}

function isString(char) {
	return char === '"';
}

function isSpace(char) {
	return char === ' ';
}

function isEnd(char) {
	return char === ';';
}

function isIdentifier(char) {
	return isLetter(char) || isNumber(char);
}

function isToken(char) {
	return isNumber(char) || isLetter(char) || isOperator(char) || isKeyword(char) || isString(char) || isSpace(char) || isEnd(char);
}

function isWhiteSpace(char) {
	return char === ' ' || char === '\n' || char === '\t';
}

function isQuote(char) {
	return char === '"';
}

function isEscape(char) {
	return char === '\\';
}

function isSlash(char) {
	return char === '/';
}

function isStar(char) {
	return char === '*';
}

function isLineTerminator(char) {
	return char === '\n';
}

module.exports = Tokenizer;

