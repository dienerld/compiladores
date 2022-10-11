import { Visitor, Binary, Unary, Grouping, Literal, accept } from './src/Ast'
import { Token, TokenType } from './src/Token'

const ASTPrinter: Visitor<string> = {
  binary: (expr: Binary) => {
    return `(${expr.operator.toPretty()}${accept(expr.left, ASTPrinter)}${accept(expr.right, ASTPrinter)})`
  },
  unary: (expr: Unary) => {
    return `(${expr.operator.toPretty()}${accept(expr.right, ASTPrinter)})`
  },
  grouping: (expr: Grouping) => {
    return `(group ${expr.expression})`
  },
  literal: (expr: Literal) => {
    return `${expr.value.toPretty()}`
  }
}

const test_tree = new Binary(
  new Literal(new Token(TokenType.NUMBER, '5', 5, 0)),
  new Token(TokenType.STAR, '*', null, 0),
  new Unary(new Token(TokenType.MINUS, '-', null, 0),
    new Literal(new Token(TokenType.STRING, '"foo"', 'foo', 0)))
)

console.log(accept(test_tree, ASTPrinter))
