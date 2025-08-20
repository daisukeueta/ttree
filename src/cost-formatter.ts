import { CostEstimate, CostCalculator } from './cost-calculator.js'
import { formatWithColor } from './formatters.js'

export class CostFormatter {
  private costCalculator: CostCalculator

  constructor(costCalculator: CostCalculator) {
    this.costCalculator = costCalculator
  }

  renderCostTable(estimates: CostEstimate[]): string {
    if (estimates.length === 0) {
      return ''
    }

    // Sort by total cost (ascending)
    const sortedEstimates = [...estimates].sort((a, b) => a.totalCostUSD - b.totalCostUSD)

    const header = formatWithColor('💰 Cost Estimates (Input + Output @ 0.5x ratio):', 'bright')
    
    let table = '┌─────────────────┬─────────┬─────────┬───────────┐\n'
    table += '│ Model           │ Input   │ Output  │ Total     │\n'
    table += '├─────────────────┼─────────┼─────────┼───────────┤\n'

    for (const estimate of sortedEstimates) {
      const modelName = this.truncateModelName(estimate.modelName)
      const inputCost = this.costCalculator.formatCost(estimate.inputCostUSD)
      const outputCost = this.costCalculator.formatCost(estimate.outputCostUSD)
      const totalCost = this.costCalculator.formatCost(estimate.totalCostUSD)

      // Color code by cost level
      const coloredTotal = this.colorCodeCost(totalCost, estimate.totalCostUSD)
      
      table += `│ ${modelName.padEnd(15)} │ ${inputCost.padStart(7)} │ ${outputCost.padStart(7)} │ ${totalCost.padStart(9)} │\n`
    }

    table += '└─────────────────┴─────────┴─────────┴───────────┘'

    return `${header}\n${table}`
  }

  renderInlineNodeCost(tokens: number, selectedModels: string[] = ['claude-sonnet-4', 'claude-opus-4.1']): string {
    if (tokens === 0) return ''

    const calculator = new CostCalculator({ selectedModels })
    const estimates = calculator.calculateCosts(tokens)
    
    const costStrings = estimates.map(estimate => {
      const cost = calculator.formatCost(estimate.totalCostUSD)
      const modelShort = this.getShortModelName(estimate.modelName)
      return `${cost} ${modelShort}`
    })

    return formatWithColor(`[${costStrings.join(' | ')}]`, 'dim')
  }

  private truncateModelName(name: string): string {
    if (name.length <= 15) return name
    
    // Smart truncation for common model names
    const replacements: Record<string, string> = {
      'Claude Haiku 3.5': 'Claude Haiku',
      'Claude Sonnet 4': 'Claude Sonnet',
      'Claude Opus 4.1': 'Claude Opus',
      'GPT-4o': 'GPT-4o',
      'GPT-4o Mini': 'GPT-4o Mini',
      'GPT-4 Turbo': 'GPT-4 Turbo',
      'Gemini 1.5 Pro': 'Gemini Pro'
    }

    return replacements[name] || name.substring(0, 15)
  }

  private getShortModelName(name: string): string {
    const shortNames: Record<string, string> = {
      'Claude Haiku 3.5': 'Haiku',
      'Claude Sonnet 4': 'Sonnet',
      'Claude Opus 4.1': 'Opus',
      'GPT-4o': 'GPT-4o',
      'GPT-4o Mini': 'Mini',
      'GPT-4 Turbo': 'Turbo',
      'Gemini 1.5 Pro': 'Gemini'
    }

    return shortNames[name] || name.split(' ')[0]
  }

  private colorCodeCost(costString: string, costUSD: number): string {
    if (costUSD < 0.01) {
      return formatWithColor(costString, 'green')
    } else if (costUSD < 0.1) {
      return formatWithColor(costString, 'yellow')
    } else {
      return formatWithColor(costString, 'red')
    }
  }
}