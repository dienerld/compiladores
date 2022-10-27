import fs from 'fs'

function defineClass(name: string, fields: string[]) {
  return `export class ${name} {
  readonly kind = '${name.toLowerCase()}'
  constructor(${fields.map(f => `public ${f}`).join(', ')}) {}
}`
}

function parseTemplate(template: string) {
  const [name, fields_] = template.split('=').map(s => s.trim())
  const fields = fields_.split(',').map(s => s.trim())
  return { name, fields }
}

function defineAst(outputDir: string, classesTemplate: string[]) {
  const path = `${outputDir}/Ast.ts`

  const classes = classesTemplate.map(template => parseTemplate(template))

  const prototype = `/* AUTO-GENERATED FILE, DONT TOUCH */

import { Token } from './Token'

${classes.map(cc => defineClass(cc.name, cc.fields)).join('\n')}

export type Expr = ${classes.map(cc => cc.name).join(' | ')}

export interface Visitor<R> {
${classes.map(cc => `  ${cc.name.toLowerCase()}: (expr: ${cc.name}) => R`).join('\n')}
}

export function accept<R>(self: Expr, visitor: Visitor<R>) {
  // @ts-expect-error
  return visitor[self.kind](self)
}
`

  fs.writeFileSync(path, prototype)
}

const classesTemplate = [
  'Binary = left: Expr, operator: Token, right: Expr',
  'Unary = operator: Token, right: Expr',
  'Grouping = expression: Expr',
  'Literal = value: Token',
  'Ternary = condition: Expr, ifTrue: Expr, ifFalse: Expr'
]

const args = process.argv.slice(2)

if (args.length === 1) {
  defineAst(args[0], classesTemplate)
}
