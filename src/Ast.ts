import {Token} from './Token'

interface Binary {
  kind: "binary",
  left: Expr,
  operator: Token,
  right: Expr
}

interface Grouping {
  kind: "grouping",
  expression: Expr,
}

interface Literal {
  kind: "literal",
  value: any
}

interface Unary {
  kind: "unary",
  operator: Token,
  right: Expr
}

type Expr = Binary | Unary | Grouping | Literal;

interface Visitor<R> {
  binary: (expr: Binary) => R,
  unary: (expr: Unary) => R,
  grouping: (expr: Grouping) => R,
  literal: (expr: Literal) => R,
}

const ASTPrinter: Visitor<string> = {
  binary: (expr: Binary) => {
    return `(${expr.operator.lexeme} ${accept(expr.left, ASTPrinter)} ${accept(expr.right, ASTPrinter)})`
  },
  unary: (expr: Unary) => {
    return "(unary)"
  },
  grouping: (expr: Grouping) => {
    return "(grouping)"
  },
  literal: (expr: Literal) => {
    return `${expr.value}`
  },
}

function accept<R>(self: Expr, visitor: Visitor<R>) {
  // @ts-ignore
  return visitor[self.kind](self)
}
