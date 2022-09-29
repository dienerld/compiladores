import { Visitor, Binary, Unary, Grouping, Literal, accept } from './src/Ast'
import { Token, TokenType } from './src/Token'

const ASTPrinter: Visitor<string> = {
    binary: (expr: Binary) => {
      return `(${expr.operator.lexeme} ${accept(expr.left, ASTPrinter)} ${accept(expr.right, ASTPrinter)})`
    },
    unary: (expr: Unary) => {
      return `(${expr.operator.lexeme} ${accept(expr.right, ASTPrinter)})`
    },
    grouping: (expr: Grouping) => {
      return `${expr.expression}`
    },
    literal: (expr: Literal) => {
      return `${expr.value}`
    },
}

const test_tree = new Binary(new Literal(5), new Token(TokenType.STAR, '*', null, 0), new Unary(new Token(TokenType.MINUS, '-', null, 0), new Literal("foo")))

console.log(accept(test_tree, ASTPrinter))

