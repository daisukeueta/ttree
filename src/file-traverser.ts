import path from 'path'
import { FileInfo, Options, Result, createSuccess, createError } from './types.js'
import { safeReaddir, safeStat, matchesPatterns } from './utils.js'
import { DEFAULT_IGNORE_PATTERNS, DEFAULT_MAX_DEPTH } from './constants.js'
import { GitignoreParser } from './gitignore-parser.js'

export class FileTraverser {
  private ignorePatterns: string[]
  private includePatterns: string[]
  private maxDepth: number
  private gitignoreParser: GitignoreParser

  constructor(options: Options = {}) {
    this.ignorePatterns = [...DEFAULT_IGNORE_PATTERNS, ...(options.ignore || [])]
    this.includePatterns = options.include || []
    this.maxDepth = options.maxDepth || DEFAULT_MAX_DEPTH
    this.gitignoreParser = new GitignoreParser()
  }

  async traverse(rootPath: string): Promise<Result<FileInfo[]>> {
    try {
      const normalizedRoot = path.resolve(rootPath)
      const files: FileInfo[] = []
      
      await this.gitignoreParser.loadGitignore(normalizedRoot)
      await this.traverseRecursive(normalizedRoot, files, 0, normalizedRoot)
      
      return createSuccess(files)
    } catch (error) {
      return createError(error as Error)
    }
  }

  private async traverseRecursive(
    dirPath: string, 
    files: FileInfo[], 
    depth: number,
    rootPath: string
  ): Promise<void> {
    if (depth > this.maxDepth) {
      return
    }

    const entriesResult = await safeReaddir(dirPath)
    if (!entriesResult.success) {
      return
    }

    for (const entry of entriesResult.data) {
      const fullPath = path.join(dirPath, entry)
      const relativePath = path.relative(process.cwd(), fullPath)

      if (this.shouldIgnore(relativePath) || this.gitignoreParser.isIgnored(fullPath, rootPath)) {
        continue
      }

      if (this.includePatterns.length > 0 && !this.shouldInclude(relativePath)) {
        continue
      }

      const statResult = await safeStat(fullPath)
      if (!statResult.success) {
        continue
      }

      const stats = statResult.data
      const fileInfo: FileInfo = {
        path: fullPath,
        name: entry,
        size: stats.size,
        isDirectory: stats.isDirectory()
      }

      files.push(fileInfo)

      if (stats.isDirectory()) {
        await this.traverseRecursive(fullPath, files, depth + 1, rootPath)
      }
    }
  }

  private shouldIgnore(filePath: string): boolean {
    return matchesPatterns(filePath, this.ignorePatterns)
  }

  private shouldInclude(filePath: string): boolean {
    return matchesPatterns(filePath, this.includePatterns)
  }
}