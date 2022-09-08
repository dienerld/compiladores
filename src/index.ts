import readlineSync from 'readline-sync'
import fs from 'fs'

import { ErrorHandler } from './ErrorHandler'
import { Scanner } from './Scanner'

const args = process.argv.slice(2)



if (args.length > 1) {
  console.log('Usage: file scripts')
  process.exit(1)
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

  let result = ''
  for (const token of tokens) {
    result += token.toPretty()
  }
  console.log(result)
}
