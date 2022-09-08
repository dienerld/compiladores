export class ErrorHandler {
  static hadError = false

  static error (lineNumber: number, message: string): void {
    this.report(lineNumber, '', message)
  }

  static report (lineNumber: number, where: string, message: string): void {
    console.error(`[line: ${lineNumber}] Error: ${where}: ${message}`)
    this.hadError = true
  }
}
