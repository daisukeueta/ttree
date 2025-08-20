import { encoding_for_model, get_encoding } from 'tiktoken'
import { Result, createSuccess, createError } from './types.js'
import { safeReadFile, isTextFile } from './utils.js'
import { DEFAULT_ENCODING, MAX_FILE_SIZE } from './constants.js'

export class TokenCounter {
  private encoding: any
  private encodingName: string

  constructor(encodingName: string = DEFAULT_ENCODING) {
    this.encodingName = encodingName
    try {
      // Try to get encoding by name first, then by model
      if (this.isDirectEncodingName(encodingName)) {
        this.encoding = get_encoding(encodingName as any)
      } else {
        // Map common model names to their encodings
        const model = this.getModelFromEncoding(encodingName)
        this.encoding = encoding_for_model(model as any)
      }
    } catch (error) {
      throw new Error(`Failed to initialize tokenizer with encoding '${encodingName}': ${error}`)
    }
  }

  private isDirectEncodingName(encodingName: string): boolean {
    const directEncodings = ['cl100k_base', 'o200k_base', 'p50k_base', 'r50k_base']
    return directEncodings.includes(encodingName)
  }

  private getModelFromEncoding(encodingName: string): string {
    const encodingModelMap: Record<string, string> = {
      'gpt-4o': 'gpt-4o',
      'gpt-4o-mini': 'gpt-4o-mini', 
      'gpt-4': 'gpt-4',
      'gpt-4-turbo': 'gpt-4-turbo',
      'gpt-3.5-turbo': 'gpt-3.5-turbo',
      'text-davinci-003': 'text-davinci-003',
      'cl100k_base': 'gpt-3.5-turbo',
      'o200k_base': 'gpt-4o'
    }
    
    return encodingModelMap[encodingName] || 'gpt-3.5-turbo'
  }

  async countTokensInFile(filePath: string): Promise<Result<number>> {
    try {
      if (!isTextFile(filePath)) {
        return createSuccess(0)
      }

      const contentResult = await safeReadFile(filePath)
      if (!contentResult.success) {
        return createError(contentResult.error)
      }

      const content = contentResult.data
      if (content.length > MAX_FILE_SIZE) {
        return createError(new Error(`File too large: ${filePath}`))
      }

      const tokens = this.countTokensInText(content)
      return createSuccess(tokens)
    } catch (error) {
      return createError(error as Error)
    }
  }

  countTokensInText(text: string): number {
    try {
      const tokens = this.encoding.encode(text)
      return tokens.length
    } catch (error) {
      return 0
    }
  }

  dispose(): void {
    if (this.encoding) {
      this.encoding.free()
    }
  }
}

export const createTokenCounter = (encodingName?: string): TokenCounter => {
  return new TokenCounter(encodingName)
}