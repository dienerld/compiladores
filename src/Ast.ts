import { Token } from './Token'

export class Binary {
  kind: 'binary' = 'binary'
  constructor(public left: Expr, public operator: Token, public right: Expr) {}
}
export class Unary {
  kind: 'unary' = 'unary'
  constructor(public operator: Token, public right: Expr) {}
}
export class Grouping {
  kind: 'grouping' = 'grouping'
  constructor(public expression: Expr) {}
}
export class Literal {
  kind: 'literal' = 'literal'
  constructor(public value: any) {}
}

export type Expr = Binary | Unary | Grouping | Literal

export interface Visitor<R> {
  binary: (expr: Binary) => R
  unary: (expr: Unary) => R
  grouping: (expr: Grouping) => R
  literal: (expr: Literal) => R
}

export function accept<R>(self: Expr, visitor: Visitor<R>) {
  // @ts-ignore
  return visitor[self.kind](self)
}
