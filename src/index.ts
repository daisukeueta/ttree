#!/usr/bin/env node

import path from 'path'
import { createCLI, parseOptions } from './cli.js'
import { FileTraverser } from './file-traverser.js'
import { TreeBuilder } from './tree-builder.js'
import { TreeRenderer } from './tree-renderer.js'
import { CostCalculator } from './cost-calculator.js'
import { CostFormatter } from './cost-formatter.js'

async function main() {
  const program = createCLI()
  program.parse()

  try {
    const targetPath = program.args[0] || '.'
    const resolvedPath = path.resolve(targetPath)
    const options = parseOptions(program)

    const traverser = new FileTraverser(options)
    const builder = new TreeBuilder(options)
    const renderer = new TreeRenderer(options)

    console.log(`Analyzing directory: ${resolvedPath}`)
    
    const filesResult = await traverser.traverse(resolvedPath)
    if (!filesResult.success) {
      console.error(`Error traversing directory: ${filesResult.error.message}`)
      process.exit(1)
    }

    console.log(`Found ${filesResult.data.length} items, building token tree...`)

    const treeResult = await builder.buildTree(filesResult.data, resolvedPath)
    if (!treeResult.success) {
      console.error(`Error building tree: ${treeResult.error.message}`)
      process.exit(1)
    }

    const output = renderer.render(treeResult.data)
    console.log('\n' + output)

    // Show cost estimates (always displayed)
    const costCalculator = new CostCalculator({
      outputRatio: options.outputRatio || 0.5,
      selectedModels: options.models
    })
    const costFormatter = new CostFormatter(costCalculator)
    
    // Calculate total tokens
    const totalTokens = treeResult.data.tokens
    
    // Get cost estimates
    const estimates = costCalculator.calculateCosts(totalTokens)
    
    // Render cost table
    const costTable = costFormatter.renderCostTable(estimates)
    console.log('\n' + costTable)

    builder.dispose()

  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}

// Always run main when this file is executed
main().catch((error) => {
  console.error(`Unexpected error: ${error}`)
  process.exit(1)
})