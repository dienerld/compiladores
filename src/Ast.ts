/* AUTO-GENERATED FILE, DONT TOUCH */

import { Token } from './Token'

export class Binary {
  readonly kind = 'binary'
  constructor(public left: Expr, public operator: Token, public right: Expr) {}
}
export class Unary {
  readonly kind = 'unary'
  constructor(public operator: Token, public right: Expr) {}
}
export class Grouping {
  readonly kind = 'grouping'
  constructor(public expression: Expr) {}
}
export class Literal {
  readonly kind = 'literal'
  constructor(public value: Token) {}
}
export class Ternary {
  readonly kind = 'ternary'
  constructor(public condition: Expr, public ifTrue: Expr, public ifFalse: Expr) {}
}

export type Expr = Binary | Unary | Grouping | Literal | Ternary

export interface Visitor<R> {
  binary: (expr: Binary) => R
  unary: (expr: Unary) => R
  grouping: (expr: Grouping) => R
  literal: (expr: Literal) => R
  ternary: (expr: Ternary) => R
}

export function accept<R>(self: Expr, visitor: Visitor<R>) {
  // @ts-expect-error
  return visitor[self.kind](self)
}
