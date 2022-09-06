import readlineSync from 'readline-sync'
import fs from 'fs'

const args = process.argv.slice(2)
let hadError = false

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
  if (hadError) {
    process.exit(1)
  }
}

function runPrompt (): void {
  while (true) {
    const line = readlineSync.question('> ')
    if (line === '' || line === 'quit') { break }
    run(line)
    hadError = false
  }
}

function run (source: string): void {
  const tokens = source.split(' ')
  tokens.forEach(token => {
    console.log(token)
  })
}

function error (lineNumber: number, message: string): void {
  report(lineNumber, '', message)
}

function report (lineNumber: number, where: string, message: string): void {
  console.error(`[line: ${lineNumber}] Error: ${where}: ${message}`)
  hadError = true
}
