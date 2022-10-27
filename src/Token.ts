
export enum TokenType {
  // Single-character tokens.
  LEFT_PAREN, RIGHT_PAREN, LEFT_BRACE, RIGHT_BRACE,
  COMMA, DOT, MINUS, PLUS, SEMICOLON, SLASH, STAR,
  QUESTION_MARK, COLON,

  // One or two character tokens.
  BANG, BANG_EQUAL,
  EQUAL, EQUAL_EQUAL,
  GREATER, GREATER_EQUAL,
  LESS, LESS_EQUAL,

  // Literals.
  IDENTIFIER, STRING, NUMBER,

  // Keywords.
  AND, CLASS, ELSE, FALSE, FUN, FOR, IF, NIL, OR,
  PRINT, RETURN, SUPER, THIS, TRUE, VAR, WHILE,

  EOF
}

export class Token {
  constructor (public kind: TokenType, public lexeme: string, public literal: any, public line: number) { }

  toString (): string {
    return `${this.kind} ${this.lexeme} ${this.literal}`
  }

  toPretty(): string {
    const colors: { [kind: number]: string } = {
      [TokenType.MINUS]: '\x1b[36m',
      [TokenType.PLUS]: '\x1b[36m',
      [TokenType.LESS]: '\x1b[36m',
      [TokenType.LESS_EQUAL]: '\x1b[36m',
      [TokenType.STRING]: '\x1b[32m',
      [TokenType.NUMBER]: '\x1b[95m',
      [TokenType.AND]: '\x1b[31m',
      [TokenType.CLASS]: '\x1b[31m',
      [TokenType.ELSE]: '\x1b[31m',
      [TokenType.FALSE]: '\x1b[95m',
      [TokenType.FUN]: '\x1b[31m',
      [TokenType.FOR]: '\x1b[31m',
      [TokenType.IF]: '\x1b[31m',
      [TokenType.NIL]: '\x1b[95m',
      [TokenType.OR]: '\x1b[31m',
      [TokenType.PRINT]: '\x1b[31m',
      [TokenType.RETURN]: '\x1b[31m',
      [TokenType.SUPER]: '\x1b[95m',
      [TokenType.THIS]: '\x1b[95m',
      [TokenType.TRUE]: '\x1b[95m',
      [TokenType.VAR]: '\x1b[31m',
      [TokenType.WHILE]: '\x1b[31m'
    }
    if (this.kind === TokenType.EOF) return ''
    return `${colors[this.kind] ?? ''}${this.lexeme} \x1b[0m`
  }
}
