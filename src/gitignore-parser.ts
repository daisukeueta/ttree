import { promises as fs } from 'fs'
import path from 'path'
import { Result, createSuccess, createError } from './types.js'

export class GitignoreParser {
  private patterns: string[] = []
  private negativePatterns: string[] = []

  async loadGitignore(rootPath: string): Promise<Result<void>> {
    const gitignorePath = path.join(rootPath, '.gitignore')
    
    try {
      const content = await fs.readFile(gitignorePath, 'utf-8')
      this.parseGitignore(content)
      return createSuccess(undefined)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return createSuccess(undefined)
      }
      return createError(error as Error)
    }
  }

  private parseGitignore(content: string): void {
    const lines = content.split('\n')
    this.patterns = []
    this.negativePatterns = []

    for (let line of lines) {
      line = line.trim()
      
      if (line === '' || line.startsWith('#')) {
        continue
      }

      if (line.startsWith('!')) {
        this.negativePatterns.push(this.normalizePattern(line.slice(1)))
      } else {
        this.patterns.push(this.normalizePattern(line))
      }
    }
  }

  private normalizePattern(pattern: string): string {
    pattern = pattern.trim()
    
    if (pattern.startsWith('/')) {
      pattern = pattern.slice(1)
    }
    
    // ディレクトリパターンの場合、そのディレクトリ自体とその中身両方をマッチさせる
    if (pattern.endsWith('/')) {
      pattern = pattern.slice(0, -1)
    }
    
    return pattern
  }

  isIgnored(filePath: string, rootPath: string): boolean {
    const relativePath = path.relative(rootPath, filePath).replace(/\\/g, '/')
    
    const isMatched = this.patterns.some(pattern => this.matchPattern(relativePath, pattern))
    
    if (!isMatched) {
      return false
    }
    
    const isNegated = this.negativePatterns.some(pattern => this.matchPattern(relativePath, pattern))
    return !isNegated
  }

  private matchPattern(filePath: string, pattern: string): boolean {
    const regex = this.patternToRegex(pattern)
    return regex.test(filePath)
  }

  private patternToRegex(pattern: string): RegExp {
    let regexStr = pattern
      .replace(/\./g, '\\.')
      .replace(/\*\*/g, '§DOUBLESTAR§')
      .replace(/\*/g, '[^/]*')
      .replace(/§DOUBLESTAR§/g, '.*')
      .replace(/\?/g, '[^/]')

    // パターンがファイル名のみの場合（スラッシュを含まない）
    if (!pattern.includes('/')) {
      regexStr = `(^|.*/)${regexStr}(/.*)?$`
    } else {
      // パスを含むパターンの場合、完全一致またはディレクトリ内のファイルにマッチ
      regexStr = `^${regexStr}(/.*)?$`
    }

    return new RegExp(regexStr)
  }

  getPatterns(): string[] {
    return [...this.patterns]
  }

  getNegativePatterns(): string[] {
    return [...this.negativePatterns]
  }
}