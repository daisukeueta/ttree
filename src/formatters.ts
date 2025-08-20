import { formatTokens } from './utils.js'

export const formatTokenCount = (tokens: number): string => {
  const formatted = formatTokens(tokens)
  return `(${formatted} tokens)`
}

export const formatWithColor = (text: string, color: string): string => {
  const colors: Record<string, string> = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m'
  }
  
  return `${colors[color] || ''}${text}${colors.reset}`
}

export const formatDirectoryName = (name: string): string => {
  return formatWithColor(name + '/', 'blue')
}

export const formatFileName = (name: string): string => {
  return name
}

export const formatTokensColored = (tokens: number): string => {
  const formatted = formatTokenCount(tokens)
  
  if (tokens === 0) {
    return formatWithColor(formatted, 'gray')
  } else if (tokens < 100) {
    return formatWithColor(formatted, 'green')
  } else if (tokens < 1000) {
    return formatWithColor(formatted, 'yellow')
  } else {
    return formatWithColor(formatted, 'red')
  }
}

export const formatTreePrefix = (isLast: boolean, depth: number): string => {
  if (depth === 0) return ''
  
  const prefix = '├── '
  const lastPrefix = '└── '
  const continuation = '│   '
  const space = '    '
  
  let result = ''
  for (let i = 1; i < depth; i++) {
    result += continuation
  }
  
  result += isLast ? lastPrefix : prefix
  return formatWithColor(result, 'gray')
}