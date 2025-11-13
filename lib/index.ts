// Export all types for frontend use
export type { 
  SearchFilters, 
  PropertyWithRelations, 
  PropertySearchResult,
  SavedSearch,
  PropertyType,
  PropertyCategory,
  SortOption
} from './types'

export {
  PropertyTypeSchema,
  PropertyCategorySchema,
  SortOptionSchema,
  SearchFiltersSchema
} from './types'

export {
  buildWhereClause,
  buildOrderByClause,
  calculatePagination,
  formatPriceRange,
  formatAreaRange
} from './search-utils'