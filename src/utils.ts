import { promises as fs } from 'fs'
import path from 'path'
import { Result, createSuccess, createError } from './types.js'
import { BINARY_EXTENSIONS, TEXT_EXTENSIONS } from './constants.js'

export const isTextFile = (filePath: string): boolean => {
  const ext = path.extname(filePath).toLowerCase()
  
  if (BINARY_EXTENSIONS.has(ext)) {
    return false
  }
  
  if (TEXT_EXTENSIONS.has(ext)) {
    return true
  }
  
  return !ext || ext === '.txt'
}

export const formatTokens = (tokens: number): string => {
  if (tokens < 1000) {
    return tokens.toString()
  } else if (tokens < 1000000) {
    return `${(tokens / 1000).toFixed(1)}k`
  } else {
    return `${(tokens / 1000000).toFixed(1)}M`
  }
}

export const formatSize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  
  return `${size.toFixed(unitIndex === 0 ? 0 : 1)}${units[unitIndex]}`
}

export const safeReadFile = async (filePath: string): Promise<Result<string>> => {
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    return createSuccess(content)
  } catch (error) {
    return createError(error as Error)
  }
}

export const safeReaddir = async (dirPath: string): Promise<Result<string[]>> => {
  try {
    const entries = await fs.readdir(dirPath)
    return createSuccess(entries)
  } catch (error) {
    return createError(error as Error)
  }
}

export const safeStat = async (filePath: string): Promise<Result<fs.Stats>> => {
  try {
    const stats = await fs.stat(filePath)
    return createSuccess(stats)
  } catch (error) {
    return createError(error as Error)
  }
}

export const normalizePattern = (pattern: string): RegExp => {
  const escaped = pattern
    .replace(/\./g, '\\.')
    .replace(/\*\*/g, '.*')
    .replace(/\*/g, '[^/]*')
    .replace(/\?/g, '[^/]')
  
  return new RegExp(`^${escaped}$`)
}

export const matchesPatterns = (filePath: string, patterns: string[]): boolean => {
  const normalizedPath = path.normalize(filePath).replace(/\\/g, '/')
  
  return patterns.some(pattern => {
    const regex = normalizePattern(pattern)
    return regex.test(normalizedPath) || regex.test(path.basename(normalizedPath))
  })
}