import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {CommentAddType} from "../../../types/comment-add.type";
import {environment} from "../../../environments/environment";
import {CommentResponseType} from "../../../types/comment-response.type";
import {CommentParamsType} from "../../../types/comment-params.type";
import {CommentActionType} from "../../../types/comment-action.type";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) {
  }

  getComments(params: CommentParamsType): Observable<CommentResponseType | DefaultResponseType> {
    return this.http.get<CommentResponseType | DefaultResponseType>(environment.api + 'comments', {
      params: params
    });
  }

  addComment(params: CommentAddType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', {
      text: params.text,
      article: params.article
    });
  }

  applyAction(commentId: string, action: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + commentId + '/apply-action', {
      action
    });
  }

  getArticleComment(id: string): Observable<CommentActionType[] | DefaultResponseType | null> {
    return this.http.get<CommentActionType[] | DefaultResponseType>(environment.api + 'comments/article-comment-actions', {
      params: {articleId: id}
    });
  }
}
