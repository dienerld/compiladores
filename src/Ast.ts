import { Token } from './Token'

class Binary {
  static kind = 'binary'
  constructor(
    public left: Expr,
    public operator: Token,
    public right: Expr
  ) {}
}

class Grouping {
  static kind = 'grouping'
  constructor(public expression: Expr) {}
}

class Literal {
  static kind = 'literal'
  constructor(public value: any) {}
}

class Unary {
  static kind = 'unary'
  constructor(public operator: Token, public right: Expr) {}
}

type Expr = Binary | Unary | Grouping | Literal

interface Visitor<R> {
  binary: (expr: Binary) => R
  unary: (expr: Unary) => R
  grouping: (expr: Grouping) => R
  literal: (expr: Literal) => R
}

const ASTPrinter: Visitor<string> = {
  binary: (expr: Binary) => {
    return `(${expr.operator.lexeme} ${accept(expr.left, ASTPrinter)} ${accept(expr.right, ASTPrinter)})`
  },
  unary: (expr: Unary) => {
    return '(unary)'
  },
  grouping: (expr: Grouping) => {
    return '(grouping)'
  },
  literal: (expr: Literal) => {
    return `${expr.value}`
  }
}

function accept<R>(self: Expr, visitor: Visitor<R>) {
  // @ts-expect-error
  return visitor[self.kind](self)
}
