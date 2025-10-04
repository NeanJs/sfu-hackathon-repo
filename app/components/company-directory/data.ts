// Functionality: Types and local mock data source

export type CompanyCategory =
  | 'Fintech'
  | 'Health'
  | 'SaaS'
  | 'AI'
  | 'Retail'
  | 'Education'
  | 'Climate'
  | 'Gaming'
  | 'Security'
  | 'Logistics'

export const ALL_CATEGORIES: CompanyCategory[] = [
  'Fintech',
  'Health',
  'SaaS',
  'AI',
  'Retail',
  'Education',
  'Climate',
  'Gaming',
  'Security',
  'Logistics',
]

export type Company = {
  id: string
  name: string
  category: CompanyCategory
  logoUrl: string
  website: string
}

export type QueryParams = {
  search: string
  page: number
  pageSize: number
  category?: CompanyCategory | null
}

export type QueryResult = {
  items: Company[]
  total: number
  hasMore: boolean
}

const companies: Company[] = [
  {
    id: '1',
    name: 'Apex Finance',
    category: 'Fintech',
    logoUrl: 'https://picsum.photos/seed/apex/96',
    website: 'https://example.com/apex',
  },
  {
    id: '2',
    name: 'Healix Labs',
    category: 'Health',
    logoUrl: 'https://picsum.photos/seed/healix/96',
    website: 'https://example.com/healix',
  },
  {
    id: '3',
    name: 'Nimbus Cloud',
    category: 'SaaS',
    logoUrl: 'https://picsum.photos/seed/nimbus/96',
    website: 'https://example.com/nimbus',
  },
  {
    id: '4',
    name: 'Cortex AI',
    category: 'AI',
    logoUrl: 'https://picsum.photos/seed/cortex/96',
    website: 'https://example.com/cortex',
  },
  {
    id: '5',
    name: 'Mercury Retail',
    category: 'Retail',
    logoUrl: 'https://picsum.photos/seed/mercury/96',
    website: 'https://example.com/mercury',
  },
  {
    id: '6',
    name: 'LearnLoop',
    category: 'Education',
    logoUrl: 'https://picsum.photos/seed/learnloop/96',
    website: 'https://example.com/learnloop',
  },
  {
    id: '7',
    name: 'TerraGreen',
    category: 'Climate',
    logoUrl: 'https://picsum.photos/seed/terragreen/96',
    website: 'https://example.com/terragreen',
  },
  {
    id: '8',
    name: 'PixelForge Games',
    category: 'Gaming',
    logoUrl: 'https://picsum.photos/seed/pixelforge/96',
    website: 'https://example.com/pixelforge',
  },
  {
    id: '9',
    name: 'Sentinel Secure',
    category: 'Security',
    logoUrl: 'https://picsum.photos/seed/sentinel/96',
    website: 'https://example.com/sentinel',
  },
  {
    id: '10',
    name: 'SwiftLogix',
    category: 'Logistics',
    logoUrl: 'https://picsum.photos/seed/swiftlogix/96',
    website: 'https://example.com/swiftlogix',
  },
  {
    id: '11',
    name: 'QuantumPay',
    category: 'Fintech',
    logoUrl: 'https://picsum.photos/seed/quantumpay/96',
    website: 'https://example.com/quantumpay',
  },
  {
    id: '12',
    name: 'MediTech Solutions',
    category: 'Health',
    logoUrl: 'https://picsum.photos/seed/meditech/96',
    website: 'https://example.com/meditech',
  },
  {
    id: '13',
    name: 'CloudSync Pro',
    category: 'SaaS',
    logoUrl: 'https://picsum.photos/seed/cloudsync/96',
    website: 'https://example.com/cloudsync',
  },
  {
    id: '14',
    name: 'NeuralNet Dynamics',
    category: 'AI',
    logoUrl: 'https://picsum.photos/seed/neuralnet/96',
    website: 'https://example.com/neuralnet',
  },
  {
    id: '15',
    name: 'UrbanMart',
    category: 'Retail',
    logoUrl: 'https://picsum.photos/seed/urbanmart/96',
    website: 'https://example.com/urbanmart',
  },
  {
    id: '16',
    name: 'EduTech Innovations',
    category: 'Education',
    logoUrl: 'https://picsum.photos/seed/edutech/96',
    website: 'https://example.com/edutech',
  },
  {
    id: '17',
    name: 'EcoFlow Systems',
    category: 'Climate',
    logoUrl: 'https://picsum.photos/seed/ecoflow/96',
    website: 'https://example.com/ecoflow',
  },
  {
    id: '18',
    name: 'GameCraft Studios',
    category: 'Gaming',
    logoUrl: 'https://picsum.photos/seed/gamecraft/96',
    website: 'https://example.com/gamecraft',
  },
  {
    id: '19',
    name: 'CyberShield',
    category: 'Security',
    logoUrl: 'https://picsum.photos/seed/cybershield/96',
    website: 'https://example.com/cybershield',
  },
  {
    id: '20',
    name: 'FleetMaster',
    category: 'Logistics',
    logoUrl: 'https://picsum.photos/seed/fleetmaster/96',
    website: 'https://example.com/fleetmaster',
  },
]

export async function queryCompanies({ search, page, pageSize, category }: QueryParams): Promise<QueryResult> {
  const normalizedSearch = search.trim().toLowerCase()

  const filteredBySearch = normalizedSearch
    ? companies.filter((c) => {
        const matchesName = c.name.toLowerCase().includes(normalizedSearch)
        const matchesCategory = c.category.toLowerCase().includes(normalizedSearch)
        return matchesName || matchesCategory
      })
    : companies

  const filtered = category
    ? filteredBySearch.filter((c) => c.category === category)
    : filteredBySearch

  const start = page * pageSize
  const end = start + pageSize
  const items = filtered.slice(start, end)
  const total = filtered.length
  const hasMore = end < total

  await new Promise((r) => setTimeout(r, 120))

  return { items, total, hasMore }
}

export function getAllForPrefetch(): Company[] {
  return companies
}


