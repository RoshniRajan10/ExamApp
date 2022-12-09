export interface FaqModel {
  $key: any
  createdAt: number
  fAnswer: string
  fQuestion: string
  isPublished: boolean
  categorykey: string
  subCategoryKey: string
  subCategoryName?: string
  categoryName?: string
}
