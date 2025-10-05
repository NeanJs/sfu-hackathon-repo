// Functionality: Types and API-driven data source

export type CompanyCategory = string

export type Company = {
  id: string
  name: string
  category: CompanyCategory
  logoUrl: string
  website: string
  summary?: string
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
type ApiDiscoveryCompany = {
  company_name?: string
  category?: string
  summary_violation?: string
}

type ApiDiscoveryResponse = {
  discovery_list_title?: string
  companies?: ApiDiscoveryCompany[]
} | null

const API_ENDPOINT = '/api/public-discovery'

let cachedCompanies: Company[] | null = null
let cachedTitle: string | null = null

async function loadFromApi(): Promise<void> {
  const res = await fetch(API_ENDPOINT)
  if (!res.ok) throw new Error('Failed to load discovery list')
  const json: ApiDiscoveryResponse = await res.json()
  const list = json?.companies ?? []
  cachedTitle = json?.discovery_list_title ?? ''
  cachedCompanies = list.map((c, idx) => {
    const name = c.company_name?.trim() || 'Unknown'
    return {
      id: `${idx + 1}-${name}`,
      name,
      category: (c.category || 'Unknown') as CompanyCategory,
      logoUrl: '',
      website: '',
      summary: c.summary_violation || '',
    }
  })
}

export async function queryCompanies({ search, page, pageSize, category }: QueryParams): Promise<QueryResult> {
  if (!cachedCompanies) {
    await loadFromApi()
  }
  const source = cachedCompanies ?? []
  const normalizedSearch = search.trim().toLowerCase()

  const filteredBySearch = normalizedSearch
    ? source.filter((c) => {
        const inName = c.name.toLowerCase().includes(normalizedSearch)
        const inCategory = c.category.toLowerCase().includes(normalizedSearch)
        const inSummary = (c.summary || '').toLowerCase().includes(normalizedSearch)
        return inName || inCategory || inSummary
      })
    : source

  const filtered = category
    ? filteredBySearch.filter((c) => c.category === category)
    : filteredBySearch

  const start = page * pageSize
  const end = start + pageSize
  const items = filtered.slice(start, end)
  const total = filtered.length
  const hasMore = end < total

  return { items, total, hasMore }
}

export function getDiscoveryListTitle(): string | null {
  return cachedTitle
}


export async function getCategories(): Promise<CompanyCategory[]> {
  if (!cachedCompanies) {
    await loadFromApi()
  }
  const categories = new Set<CompanyCategory>()
  for (const c of cachedCompanies ?? []) {
    const cat = (c.category || '').trim()
    if (cat) categories.add(cat as CompanyCategory)
  }
  return Array.from(categories).sort((a, b) => a.localeCompare(b))
}
