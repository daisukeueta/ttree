import { z } from 'zod'

export const TreeNodeSchema = z.object({
  name: z.string(),
  path: z.string(),
  type: z.enum(['file', 'directory']),
  tokens: z.number(),
  size: z.number().optional(),
  children: z.array(z.lazy(() => TreeNodeSchema)).optional()
})

export type TreeNode = z.infer<typeof TreeNodeSchema>

export const OptionsSchema = z.object({
  maxDepth: z.number().positive().optional(),
  ignore: z.array(z.string()).optional(),
  include: z.array(z.string()).optional(),
  encoding: z.string().optional(),
  json: z.boolean().optional(),
  noFiles: z.boolean().optional(),
  sort: z.enum(['name', 'size', 'tokens']).optional(),
  threshold: z.number().nonnegative().optional()
})

export type Options = z.infer<typeof OptionsSchema>

export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E }

export const createSuccess = <T>(data: T): Result<T> => ({
  success: true,
  data
})

export const createError = <E = Error>(error: E): Result<never, E> => ({
  success: false,
  error
})

export interface FileInfo {
  path: string
  name: string
  size: number
  isDirectory: boolean
}

export interface TokenStats {
  totalFiles: number
  totalDirectories: number
  totalTokens: number
  processedFiles: number
  skippedFiles: number
}