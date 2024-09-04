import {RelatedArticleType} from "./related-article.type";

export type RelatedArticleResponseType = {
  totalCount: number,
  pages: number,
  items: RelatedArticleType[]
}
