import { Command } from 'commander'
import { Options, OptionsSchema } from './types.js'

export const createCLI = (): Command => {
  const program = new Command()

  program
    .name('ttree')
    .description('Tree-format directory structure display with token counting')
    .version('0.1.0')
    .argument('[path]', 'Directory path to analyze', '.')
    .option('-d, --max-depth <number>', 'Maximum depth to traverse', (value) => parseInt(value))
    .option('-i, --ignore <patterns>', 'Ignore patterns (comma-separated)', (value) => value.split(','))
    .option('--include <patterns>', 'Include patterns (comma-separated)', (value) => value.split(','))
    .option('-e, --encoding <encoding>', 'Token encoding: o200k_base (GPT-4o, default), cl100k_base (GPT-3.5/4), or model names', 'o200k_base')
    .option('-j, --json', 'Output in JSON format')
    .option('--no-files', 'Show directories only')
    .option('-s, --sort <type>', 'Sort by: name, size, tokens', 'name')
    .option('-t, --threshold <number>', 'Minimum tokens to display', (value) => parseInt(value))
    .option('--cost', 'Show cost estimates for AI models')
    .option('--models <models>', 'Models to show costs for (comma-separated)', (value) => value.split(','))
    .option('--output-ratio <ratio>', 'Output token ratio for cost estimation', (value) => parseFloat(value), 0.5)

  return program
}

export const parseOptions = (program: Command): Options => {
  const opts = program.opts()
  
  const options: Options = {
    maxDepth: opts.maxDepth,
    ignore: opts.ignore,
    include: opts.include,
    encoding: opts.encoding,
    json: opts.json,
    noFiles: opts.noFiles,
    sort: opts.sort,
    threshold: opts.threshold,
    cost: opts.cost,
    models: opts.models,
    outputRatio: opts.outputRatio
  }

  const result = OptionsSchema.safeParse(options)
  if (!result.success) {
    throw new Error(`Invalid options: ${result.error.message}`)
  }

  return result.data
}