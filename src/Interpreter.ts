/* eslint-disable @typescript-eslint/no-throw-literal */
import { Visitor, Binary, Unary, Grouping, Literal, accept, Ternary } from './Ast'
import { TokenType } from './Token'
import { ErrorHandler } from './ErrorHandler'

type LoxValue = any

function isTruthy (value: any) {
  if (value === null) return false
  if (typeof value === 'boolean') return value
  return true
}

function arithmeticBinaryNumeric(f: Function) {
  return (x: any, y: any) => {
    if (typeof x === 'number' && typeof y === 'number') {
      return f(x, y)
    }
    throw ErrorHandler.error(0, 'Operators must be numbers')
  }
}

const unaryOperators = new Map<TokenType, Function>([
  [TokenType.MINUS, x => {
    if (typeof x === 'number') {
      return -x
    }
    ErrorHandler.error(0, 'Operator must be a number')
  }],
  [TokenType.BANG, x => !isTruthy(x)]
])

const binaryOperators = new Map<TokenType, Function>([
  [TokenType.MINUS, arithmeticBinaryNumeric((x, y) => x - y)],
  [TokenType.PLUS, (x, y) => x + y],
  [TokenType.STAR, arithmeticBinaryNumeric((x, y) => x * y)],
  [TokenType.SLASH, arithmeticBinaryNumeric((x, y) => x / y)],
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
