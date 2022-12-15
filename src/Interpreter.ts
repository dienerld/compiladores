import { Visitor, Binary, Unary, Grouping, Literal, accept, Ternary } from './Ast'
import { TokenType } from './Token'

type LoxValue = any

function isTruthy (value: any) {
  if (value === null) return false
  if (typeof value === 'boolean') return value
  return true
}

const unaryOperators = new Map<TokenType, Function>([
  [TokenType.MINUS, x => -x],
  [TokenType.BANG, x => !isTruthy(x)]
])

const binaryOperators = new Map<TokenType, Function>([
  [TokenType.MINUS, (x, y) => x - y],
  [TokenType.PLUS, (x, y) => x + y],
  [TokenType.STAR, (x, y) => x * y],
  [TokenType.SLASH, (x, y) => x / y],
  [TokenType.GREATER, (x, y) => x > y],
  [TokenType.GREATER_EQUAL, (x, y) => x >= y],
  [TokenType.LESS, (x, y) => x < y],
  [TokenType.LESS_EQUAL, (x, y) => x <= y],
  [TokenType.EQUAL_EQUAL, (x, y) => x === y],
  [TokenType.BANG_EQUAL, (x, y) => x !== y]
])

const Interpreter: Visitor<LoxValue> = {
  binary: (expr: Binary) => binaryOperators.get(expr.operator.kind)(accept(expr.left, Interpreter), accept(expr.right, Interpreter)),
  unary: (expr: Unary) => unaryOperators.get(expr.operator.kind)(accept(expr.right, Interpreter)),
  grouping: (expr: Grouping) => accept(expr.expression, Interpreter),
  literal: (expr: Literal) => expr.value,
  ternary: (expr: Ternary) => accept(expr.condition, Interpreter) ? accept(expr.ifTrue, Interpreter) : accept(expr.ifFalse, Interpreter)
}

export { Interpreter }
