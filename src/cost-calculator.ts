import { ModelPricing, getAllModels, getModelPricing, getDefaultModels } from './pricing-data.js'

export interface CostEstimate {
  modelId: string
  modelName: string
  provider: string
  inputTokens: number
  outputTokensEstimate: number
  inputCostUSD: number
  outputCostUSD: number
  totalCostUSD: number
}

export interface CostOptions {
  outputRatio?: number // Default: 0.5
  selectedModels?: string[]
  currency?: 'usd' | 'jpy'
}

export class CostCalculator {
  private outputRatio: number
  private selectedModels: string[]

  constructor(options: CostOptions = {}) {
    this.outputRatio = options.outputRatio || 0.5
    this.selectedModels = options.selectedModels || []
  }

  calculateCosts(inputTokens: number): CostEstimate[] {
    const models = this.selectedModels.length > 0 
      ? this.selectedModels.map(id => getModelPricing(id)).filter(Boolean) as ModelPricing[]
      : getDefaultModels()

    return models.map(model => this.calculateModelCost(model, inputTokens))
  }

  private calculateModelCost(model: ModelPricing, inputTokens: number): CostEstimate {
    const outputTokens = Math.round(inputTokens * this.outputRatio)
    
    const inputCostUSD = (inputTokens / 1_000_000) * model.inputPricePerMillion
    const outputCostUSD = (outputTokens / 1_000_000) * model.outputPricePerMillion
    const totalCostUSD = inputCostUSD + outputCostUSD

    return {
      modelId: model.id,
      modelName: model.name,
      provider: model.provider,
      inputTokens,
      outputTokensEstimate: outputTokens,
      inputCostUSD,
      outputCostUSD,
      totalCostUSD
    }
  }

  formatCost(cost: number, currency: 'usd' | 'jpy' = 'usd'): string {
    if (currency === 'jpy') {
      const jpy = cost * 150 // Approximate USD to JPY rate
      return `¥${jpy.toFixed(0)}`
    }
    
    if (cost < 0.001) {
      return `$${(cost * 1000).toFixed(2)}‰` // per mille
    } else if (cost < 1) {
      return `$${cost.toFixed(3)}`
    } else {
      return `$${cost.toFixed(2)}`
    }
  }
}