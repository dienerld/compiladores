import readlineSync from 'readline-sync'
import fs from 'fs'

import { ErrorHandler } from './ErrorHandler'
import { Scanner } from './Scanner'
import { Parser } from './Parser'
import { accept, Binary, Grouping, Literal, Ternary, Unary, Visitor } from './Ast'
import { Interpreter } from './Interpreter'

const args = process.argv.slice(2)

if (args.length > 1) {
  console.log('Usage: file scripts')
  process.exit(1)
}

const ASTPrinter: Visitor<string> = {
  binary: (expr: Binary) => `(${expr.operator.toPretty()}${accept(expr.left, ASTPrinter)}${accept(expr.right, ASTPrinter)})`,
  unary: (expr: Unary) => `(${expr.operator.toPretty}${accept(expr.right, ASTPrinter)})`,
  grouping: (expr: Grouping) => `(group ${accept(expr.expression, ASTPrinter)})`,
  literal: (expr: Literal) => `${expr.value} `,
  ternary: (expr: Ternary) => `(ternary ${accept(expr.condition, ASTPrinter)}${accept(expr.ifTrue, ASTPrinter)}${accept(expr.ifFalse, ASTPrinter)})`
}

if (args.length === 1) {
  console.log('Leitura de arquivo')
  runFile(args[0])
} else {
  console.log('REPL')
  runPrompt()
}

function runFile (filename: string): void {
  const text = fs.readFileSync(filename, 'utf8')
  run(text)
  if (ErrorHandler.hadError) {
    process.exit(1)
  }
}

function runPrompt (): void {
  while (true) {
    const line = readlineSync.question('> ')
    if (line === '' || line === 'quit') { break }
    run(line)
    ErrorHandler.hadError = false
  }
}

function run (source: string): void {
  const scanner = new Scanner(source)
  const tokens = scanner.scan()
  const parser = new Parser(tokens)
  const expr = parser.parse()

  if (ErrorHandler.hadError || expr === null) return

  console.log(accept(expr, Interpreter))
}
