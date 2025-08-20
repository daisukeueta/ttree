import { TreeNode, Options, TokenStats } from './types.js'
import { 
  formatDirectoryName, 
  formatFileName, 
  formatTokensColored, 
  formatTreePrefix,
  formatWithColor 
} from './formatters.js'

export class TreeRenderer {
  private options: Options
  private stats: TokenStats

  constructor(options: Options = {}) {
    this.options = options
    this.stats = {
      totalFiles: 0,
      totalDirectories: 0,
      totalTokens: 0,
      processedFiles: 0,
      skippedFiles: 0
    }
  }

  render(tree: TreeNode): string {
    if (this.options.json) {
      return this.renderJson(tree)
    }

    this.collectStats(tree)
    const treeOutput = this.renderTree(tree, 0, true, [])
    const statsOutput = this.renderStats()
    
    return treeOutput + '\n' + statsOutput
  }

  private renderTree(
    node: TreeNode, 
    depth: number, 
    isLast: boolean, 
    parentIsLast: boolean[]
  ): string {
    let output = ''
    
    if (depth > 0) {
      output += this.renderTreePrefix(depth, isLast, parentIsLast)
    }

    output += this.renderNode(node)
    output += '\n'

    if (node.children && node.children.length > 0) {
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i]
        const childIsLast = i === node.children.length - 1
        const newParentIsLast = [...parentIsLast, isLast]
        
        output += this.renderTree(child, depth + 1, childIsLast, newParentIsLast)
      }
    }

    return output
  }

  private renderTreePrefix(
    depth: number, 
    isLast: boolean, 
    parentIsLast: boolean[]
  ): string {
    let prefix = ''
    
    for (let i = 0; i < depth - 1; i++) {
      if (parentIsLast[i]) {
        prefix += '    '
      } else {
        prefix += formatWithColor('│   ', 'gray')
      }
    }
    
    if (isLast) {
      prefix += formatWithColor('└── ', 'gray')
    } else {
      prefix += formatWithColor('├── ', 'gray')
    }
    
    return prefix
  }

  private renderNode(node: TreeNode): string {
    const name = node.type === 'directory' 
      ? formatDirectoryName(node.name)
      : formatFileName(node.name)
    
    const tokens = formatTokensColored(node.tokens)
    
    return `${name} ${tokens}`
  }

  private renderStats(): string {
    const totalLine = formatWithColor(
      `Total: ${this.stats.totalTokens.toLocaleString()} tokens`, 
      'bright'
    )
    
    const detailsLine = formatWithColor(
      `Files: ${this.stats.totalFiles}, Directories: ${this.stats.totalDirectories}`,
      'dim'
    )
    
    return `${totalLine}\n${detailsLine}`
  }

  private renderJson(tree: TreeNode): string {
    const result = {
      tree,
      stats: this.stats
    }
    
    return JSON.stringify(result, null, 2)
  }

  private collectStats(node: TreeNode): void {
    if (node.type === 'file') {
      this.stats.totalFiles++
      this.stats.processedFiles++
    } else {
      this.stats.totalDirectories++
    }
    
    this.stats.totalTokens += node.tokens

    if (node.children) {
      for (const child of node.children) {
        this.collectStats(child)
      }
    }
  }
}