import { Token, TokenType } from './Token'
import { ErrorHandler } from './ErrorHandler'

function isDigit(c: string) {
  return c.match(/[0-9]/) != null
}

function isAlpha(c: string) {
  return c.match(/[a-zA-Z_]/) != null
}

function isAlphanum(c: string) {
  return isAlpha(c) || isDigit(c)
}

const KEYWORDS_TABLE: { [kw: string]: TokenType | undefined } = {
  "and": TokenType.AND,
  "class": TokenType.CLASS,
  "else": TokenType.ELSE,
  "false": TokenType.FALSE,
  "for": TokenType.FOR,
  "fun": TokenType.FUN,
  "if": TokenType.IF,
  "nil": TokenType.NIL,
  "or": TokenType.OR,
  "print": TokenType.PRINT,
  "return": TokenType.RETURN,
  "super": TokenType.SUPER,
  "this": TokenType.THIS,
  "true": TokenType.TRUE,
  "var": TokenType.VAR,
  "while": TokenType.WHILE,
}

export class Scanner {
  tokens: Token[] = []

  start: number = 0
  current: number = 0
  line: number = 1

  constructor(public source: string) {

  }

  isAtEnd() {
    return this.current >= this.source.length
  }

  scan(): Token[] {
    while (!this.isAtEnd()) {
      this.start = this.current
      this.scanToken()
    }

    this.tokens.push(new Token(TokenType.EOF, "", null, this.line))
    return this.tokens;
  }

  consume(): string {
    const char = this.source.charAt(this.current)
    this.current += 1
    return char
  }

  peek() {
    if (this.isAtEnd()) return '\0'
    return this.source.charAt(this.current)
  }

  peekNext() {
    if (this.current + 1 >= this.source.length) return '\0'
    return this.source.charAt(this.current + 1)
  }

  expect(expected: string) {
    if (this.source.charAt(this.current) != expected) return false

    this.current += 1
    return true
  }

  push(kind: TokenType, value?: any) {
    const lexeme = this.source.substring(this.start, this.current)
    this.tokens.push(new Token(kind, lexeme, value ?? null, this.line))
  }

  scanToken() {
    const c = this.consume()
    switch (c) {
      case '(': this.push(TokenType.LEFT_PAREN); break;
      case ')': this.push(TokenType.RIGHT_PAREN); break;
      case '{': this.push(TokenType.LEFT_BRACE); break;
      case '}': this.push(TokenType.RIGHT_BRACE); break;
      case ',': this.push(TokenType.COMMA); break;
      case '.': this.push(TokenType.DOT); break;
      case '-': this.push(TokenType.MINUS); break;
      case '+': this.push(TokenType.PLUS); break;
      case ';': this.push(TokenType.SEMICOLON); break;
      case '*': this.push(TokenType.STAR); break;
      case '!':
        this.push(this.expect('=') ? TokenType.BANG_EQUAL : TokenType.BANG);
        break;
      case '=':
        this.push(this.expect('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL);
        break;
      case '<':
        this.push(this.expect('=') ? TokenType.LESS_EQUAL : TokenType.LESS);
        break;
      case '>':
        this.push(this.expect('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER);
        break;
      case '/':
        if (this.expect('/')) {
          // A comment goes until the end of the line.
          while (this.peek() != '\n' && !this.isAtEnd()) this.consume();
        } else {
          this.push(TokenType.SLASH);
        }
        break;
      case ' ':
      case '\r':
      case '\t':
        // Ignore whitespace.
        break;

      case '\n':
        this.line += 1
        break;
      case '"': this.scanString(); break;
      default:
        if (isDigit(c)) {
          this.scanNumber()
        } else if (isAlpha(c)) {
          this.scanIdentifier()
        } else {
          ErrorHandler.error(this.line, "Unexpected character.");
        }
        break;
    }
  }

  scanString() {
    while (this.peek() != '"' && !this.isAtEnd()) {
      if (this.peek() == '\n') this.line += 1
      this.consume()
    }

    if (this.isAtEnd()) {
      ErrorHandler.error(this.line, "Unterminated string.")
      return
    }

    // The closing ".
    this.consume()

    // Trim the surrounding quotes.
    const value = this.source.substring(this.start + 1, this.current - 1);
    this.push(TokenType.STRING, value);
  }

  scanNumber() {
    while (isDigit(this.peek())) this.consume()

    // Look for a fractional part.
    if (this.peek() == '.' && isDigit(this.peekNext())) {
      // Consume the "."
      this.consume()

      while (isDigit(this.peek())) this.consume();
    }

    this.push(TokenType.NUMBER, Number (this.source.substring(this.start, this.current)));
  }

  scanIdentifier() {
    while (isAlphanum(this.peek())) this.consume()

    const text = this.source.substring(this.start, this.current)
    const kind = KEYWORDS_TABLE[text]

    this.push(kind ?? TokenType.IDENTIFIER)
  }
}
