import {RelatedArticleType} from "./related-article.type";

export type ArticlesType = {
  totalCount: number;
  pages: number;
  items: RelatedArticleType[]
}
