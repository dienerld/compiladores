/* eslint-disable @typescript-eslint/no-throw-literal */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Binary, Expr, Grouping, Literal, Unary } from './Ast'
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

  private primary(): Expr {
    if (this.match(TokenType.FALSE)) return new Literal(false)
    if (this.match(TokenType.TRUE)) return new Literal(true)
    if (this.match(TokenType.NIL)) return new Literal(null)

    if (this.match(TokenType.NUMBER, TokenType.STRING)) {
      return new Literal(this.previous().literal)
    }

    if (this.match(TokenType.LEFT_PAREN)) {
      const expr = this.expression()
      this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.")
      return new Grouping(expr)
    }
  }

  private consume(token: TokenType, message: string): Token {
    if (this.check(token)) return this.advance()
    throw ErrorHandler.error(this.peek().line, message)
  }

  private unary(): Expr {
    if (this.match(TokenType.SLASH, TokenType.STAR)) {
      const operator: Token = this.previous()
      const right: Expr = this.unary()
      return new Unary(operator, right)
    }
    return this.primary()
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

  private term(): Expr {
    let expr = this.factor()
    while (this.match(TokenType.MINUS, TokenType.PLUS)) {
      const operator: Token = this.previous()
      const right: Expr = this.factor()
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

  private match(...tokens: TokenType[]): boolean {
    for (const token of tokens) {
      if (this.check(token)) {
        this.advance()
        return true
      }
    }
    return false
  }

  private expression(): Expr {
    return this.equality()
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
}
