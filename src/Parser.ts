/* eslint-disable @typescript-eslint/no-throw-literal */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Binary, Expr, Grouping, Literal, Ternary, Unary } from './Ast'
import { ErrorHandler } from './ErrorHandler'
import { Token, TokenType } from './Token'

export class Parser {
  current = 0
  constructor(private readonly tokens: Token[]) { }

  private check(token: TokenType): boolean {
    if (this.isAtEnd()) return false
    return this.peek().kind === token
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++
    return this.previous()
  }

  private isAtEnd(): boolean {
    return this.peek().kind === TokenType.EOF
  }

  private peek(): Token {
    return this.tokens[this.current]
  }

  private previous(): Token {
    return this.tokens[this.current - 1]
  }

  private error(where: Token, message: string): void {
    ErrorHandler.report(where.line, where.lexeme, message)
    throw new ErrorHandler(message)
  }

  private consume(token: TokenType, message: string): Token {
    if (this.check(token)) return this.advance()
    throw this.error(this.peek(), message)
  }

  private match(...tokens: TokenType[]): boolean {
    for (const token of tokens) {
      if (this.check(token)) {
        this.advance()
        return true
      }
    }
    return false
  }

  private synchronize() {
    this.advance()

    while (!this.isAtEnd()) {
      if (this.previous().kind === TokenType.SEMICOLON) return

      switch (this.peek().kind) {
        case TokenType.CLASS:
        case TokenType.FUN:
        case TokenType.VAR:
        case TokenType.FOR:
        case TokenType.IF:
        case TokenType.WHILE:
        case TokenType.PRINT:
        case TokenType.RETURN:
          return
      }

      this.advance()
    }
  }

  private expression(): Expr {
    return this.ternary()
  }

  private ternary(): Expr {
    const expr = this.equality()

    if (this.check(TokenType.QUESTION_MARK)) {
      this.advance()
      const ifTrue = this.equality()
      this.consume(TokenType.COLON, 'Expected Colon')
      const ifFalse = this.ternary()
      return new Ternary(expr, ifTrue, ifFalse)
    }

    return expr
  }

  private equality(): Expr {
    let expr: Expr = this.comparison()

    while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
      const operator: Token = this.previous()
      const right: Expr = this.comparison()
      expr = new Binary(expr, operator, right)
    }

    return expr
  }

  private comparison(): Expr {
    let expr: Expr = this.term()

    while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
      const operator: Token = this.previous()
      const right: Expr = this.term()
      expr = new Binary(expr, operator, right)
    }

    return expr
  }

  private term(): Expr {
    let expr = this.factor()
    while (this.match(TokenType.MINUS, TokenType.PLUS)) {
      const operator: Token = this.previous()
      const right: Expr = this.factor()
      expr = new Binary(expr, operator, right)
    }
    return expr
  }

  private factor(): Expr {
    let expr = this.unary()
    while (this.match(TokenType.SLASH, TokenType.STAR)) {
      const operator: Token = this.previous()
      const right: Expr = this.unary()
      expr = new Binary(expr, operator, right)
    }
    return expr
  }

  private unary(): Expr {
    if (this.match(TokenType.SLASH, TokenType.STAR)) {
      const operator: Token = this.previous()
      const right: Expr = this.unary()
      return new Unary(operator, right)
    }
    return this.primary()
  }

  private primary(): Expr {
    // @ts-expect-error
    if (this.match(TokenType.FALSE)) return new Literal(false)
    // @ts-expect-error
    if (this.match(TokenType.TRUE)) return new Literal(true)
    // @ts-expect-error
    if (this.match(TokenType.NIL)) return new Literal(null)

    if (this.match(TokenType.NUMBER, TokenType.STRING)) {
      return new Literal(this.previous().literal)
    }

    if (this.match(TokenType.LEFT_PAREN)) {
      const expr = this.expression()
      this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.")
      return new Grouping(expr)
    }

    throw this.error(this.peek(), 'Expected Expression')
  }

  parse() {
    try {
      return this.expression()
    } catch (e) {
      if (e instanceof ErrorHandler) return null

      console.error(e)
      return null
    }
  }
}
