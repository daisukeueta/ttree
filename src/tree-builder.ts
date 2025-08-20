import path from 'path'
import { TreeNode, FileInfo, Options, Result, createSuccess, createError } from './types.js'
import { TokenCounter, createTokenCounter } from './token-counter.js'

export class TreeBuilder {
  private tokenCounter: TokenCounter
  private options: Options

  constructor(options: Options = {}) {
    this.options = options
    this.tokenCounter = createTokenCounter(options.encoding)
  }

  async buildTree(files: FileInfo[], rootPath: string): Promise<Result<TreeNode>> {
    try {
      const sortedFiles = this.sortFiles(files)
      const rootNode = await this.createRootNode(rootPath, sortedFiles)
      const tree = await this.buildTreeRecursive(rootNode, sortedFiles)
      
      return createSuccess(tree)
    } catch (error) {
      return createError(error as Error)
    }
  }

  private async createRootNode(rootPath: string, files: FileInfo[]): Promise<TreeNode> {
    const rootName = path.basename(rootPath) || rootPath
    const rootTokens = await this.calculateDirectoryTokens(rootPath, files)
    
    return {
      name: rootName,
      path: rootPath,
      type: 'directory',
      tokens: rootTokens,
      children: []
    }
  }

  private async buildTreeRecursive(parentNode: TreeNode, files: FileInfo[]): Promise<TreeNode> {
    const children = files.filter(file => 
      path.dirname(file.path) === parentNode.path
    )

    for (const childFile of children) {
      const childNode = await this.createNodeFromFile(childFile, files)
      
      if (this.shouldIncludeNode(childNode)) {
        if (!parentNode.children) {
          parentNode.children = []
        }
        parentNode.children.push(childNode)
      }
    }

    if (parentNode.children) {
      parentNode.children = this.sortNodes(parentNode.children)
      
      for (const child of parentNode.children) {
        if (child.type === 'directory') {
          await this.buildTreeRecursive(child, files)
        }
      }
    }

    return parentNode
  }

  private async createNodeFromFile(file: FileInfo, allFiles: FileInfo[]): Promise<TreeNode> {
    let tokens = 0
    
    if (file.isDirectory) {
      tokens = await this.calculateDirectoryTokens(file.path, allFiles)
    } else {
      const tokenResult = await this.tokenCounter.countTokensInFile(file.path)
      tokens = tokenResult.success ? tokenResult.data : 0
    }

    return {
      name: file.name,
      path: file.path,
      type: file.isDirectory ? 'directory' : 'file',
      tokens,
      size: file.size,
      children: file.isDirectory ? [] : undefined
    }
  }

  private async calculateDirectoryTokens(dirPath: string, files: FileInfo[]): Promise<number> {
    let totalTokens = 0
    
    const filesInDirectory = files.filter(file => 
      file.path.startsWith(dirPath + path.sep) || file.path === dirPath
    )

    for (const file of filesInDirectory) {
      if (!file.isDirectory) {
        const tokenResult = await this.tokenCounter.countTokensInFile(file.path)
        if (tokenResult.success) {
          totalTokens += tokenResult.data
        }
      }
    }

    return totalTokens
  }

  private shouldIncludeNode(node: TreeNode): boolean {
    if (this.options.noFiles && node.type === 'file') {
      return false
    }

    if (this.options.threshold && node.tokens < this.options.threshold) {
      return false
    }

    return true
  }

  private sortFiles(files: FileInfo[]): FileInfo[] {
    const sortBy = this.options.sort || 'name'
    
    return [...files].sort((a, b) => {
      if (a.isDirectory !== b.isDirectory) {
        return a.isDirectory ? -1 : 1
      }

      switch (sortBy) {
        case 'size':
          return b.size - a.size
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })
  }

  private sortNodes(nodes: TreeNode[]): TreeNode[] {
    const sortBy = this.options.sort || 'name'
    
    return [...nodes].sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1
      }

      switch (sortBy) {
        case 'tokens':
          return b.tokens - a.tokens
        case 'size':
          return (b.size || 0) - (a.size || 0)
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })
  }

  dispose(): void {
    this.tokenCounter.dispose()
  }
}