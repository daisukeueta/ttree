export interface ModelPricing {
  id: string
  name: string
  provider: string
  inputPricePerMillion: number  // USD per 1M tokens
  outputPricePerMillion: number // USD per 1M tokens
  isDefault?: boolean
}

export const MODEL_PRICING: ModelPricing[] = [
  // Claude (Anthropic)
  {
    id: 'claude-haiku-3.5',
    name: 'Claude Haiku 3.5',
    provider: 'Anthropic',
    inputPricePerMillion: 0.80,
    outputPricePerMillion: 4.00
  },
  {
    id: 'claude-sonnet-4',
    name: 'Claude Sonnet 4',
    provider: 'Anthropic',
    inputPricePerMillion: 3.00,
    outputPricePerMillion: 15.00,
    isDefault: true
  },
  {
    id: 'claude-opus-4.1',
    name: 'Claude Opus 4.1',
    provider: 'Anthropic',
    inputPricePerMillion: 15.00,
    outputPricePerMillion: 75.00
  },
  
  // OpenAI
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    inputPricePerMillion: 2.50,
    outputPricePerMillion: 10.00
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    inputPricePerMillion: 0.15,
    outputPricePerMillion: 0.60
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    inputPricePerMillion: 10.00,
    outputPricePerMillion: 30.00
  },

  // Google
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    inputPricePerMillion: 1.25,
    outputPricePerMillion: 5.00
  }
]

export const getModelPricing = (modelId: string): ModelPricing | undefined => {
  return MODEL_PRICING.find(model => model.id === modelId)
}

export const getAllModels = (): ModelPricing[] => {
  return [...MODEL_PRICING]
}

export const getDefaultModels = (): ModelPricing[] => {
  return MODEL_PRICING.filter(model => 
    ['claude-sonnet-4', 'claude-opus-4.1'].includes(model.id)
  )
}