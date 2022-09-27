import fs from 'fs'

import { Token } from '../Token'

interface Unary {
  kind: 'unary'
  operator: Token
  right: Expr
}

interface Binary {
  kind: 'binary'
  operator: Token
  right: Expr
}

interface Grouping {
  kind: 'grouping'
  expression: Expr
}

interface Literal {
  kind: 'literal'
  value: any
}

type Expr = Unary | Binary | Grouping | Literal

const args = process.argv.slice(2)

if (args.length > 2) {
  console.log('Usage: file scripts')
  process.exit(1)
}
if (args.length === 2) {
  defineAst(args[0], args[1])
}

function defineAst(outputDir: string, baseName: string) {
  const path = `${outputDir}/${baseName}.ts`
  const nameClass = baseName.trim().split('')
  nameClass[0] = nameClass[0].toUpperCase()
  const name = nameClass.join('')

  const prototype = `
class ${name} {
  class Binary {
    left: Expr
    operator: Token
    right: Expr
  }

}

export { ${name} }
`

  fs.writeFileSync(path, prototype)
}
