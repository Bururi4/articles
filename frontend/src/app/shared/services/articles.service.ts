import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {DefaultResponseType} from "../../../types/default-response.type";
import {RelatedArticleType} from "../../../types/related-article.type";
import {RelatedArticleResponseType} from "../../../types/related-article-response.type";
import {ArticleParamsType} from "../../../types/article-params.type";
import {ArticleType} from "../../../types/article.type";

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private http: HttpClient) {
  }

  getPopularArticles(): Observable<DefaultResponseType | RelatedArticleType[]> {
    return this.http.get<DefaultResponseType | RelatedArticleType[]>(environment.api + 'articles/top');
  }

  getRelatedArticles(url: string): Observable<DefaultResponseType | RelatedArticleType[]> {
    return this.http.get<DefaultResponseType | RelatedArticleType[]>(environment.api + 'articles/related/' + url);
  }

  getArticles(params: ArticleParamsType): Observable<DefaultResponseType | RelatedArticleResponseType> {
    return this.http.get<DefaultResponseType | RelatedArticleResponseType>(environment.api + 'articles', {
      params: params
    });
  }

  getArticle(url: string): Observable<DefaultResponseType | ArticleType> {
    return this.http.get<DefaultResponseType | ArticleType>(environment.api + 'articles/' + url);
  }
}
