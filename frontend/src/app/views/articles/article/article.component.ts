import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {catchError, combineLatest, concatMap, debounceTime, mergeMap, of, Subscription} from "rxjs";
import {ArticlesService} from "../../../shared/services/articles.service";
import {HttpErrorResponse} from "@angular/common/http";
import {AuthService} from "../../../core/auth/auth.service";
import {CommentService} from "../../../shared/services/comment.service";
import {FormBuilder, Validators} from "@angular/forms";
import {RelatedArticleType} from "../../../../types/related-article.type";
import {ArticleType} from "../../../../types/article.type";
import {CommentType} from "../../../../types/comment.type";
import {CommentActionType} from "../../../../types/comment-action.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommentAction} from "../../../../types/comment-action.enum";
import {CommentResponseType} from "../../../../types/comment-response.type";
import {DefaultResponseType} from "../../../../types/default-response.type";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit, OnDestroy {
  url: string = '';
  isLogged: boolean = false;
  relatedArticles: RelatedArticleType[] = [];
  article: ArticleType = {} as ArticleType;
  additionalComments: CommentType[] = [];
  commentForm = this.fb.group({
    comment: ['', Validators.required]
  });
  offset: number = 3;
  userCommentActions: CommentActionType[] = [];
  private subs: Subscription = new Subscription();

  constructor(private activatedRoute: ActivatedRoute,
              private articleService: ArticlesService,
              private authService: AuthService,
              private commentService: CommentService,
              private fb: FormBuilder,
              private _snackBar: MatSnackBar) {
    // this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit() {
    this.subs.add(this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    }));
    this.activatedRoute.params
      .pipe(
        debounceTime(500),
        mergeMap((params: Params) => {
          this.offset = 3;
          this.url = params['url'];
          return combineLatest([this.articleService.getRelatedArticles(this.url), this.articleService.getArticle(this.url)]);
        }),
        catchError(error => {
          this._snackBar.open('Ошибка получения параметров url');
          throw new Error(error);
        }),
        mergeMap(([articleRelated, article]) => {
          this.showRelatedArticle(articleRelated);
          return this.showArticle(article);
        }),
        catchError(error => {
          this._snackBar.open('Ошибка отображения связанных статей или основной статьи');
          throw new Error(error);
        })
      )
      .subscribe({
        next: (comments: CommentActionType[] | DefaultResponseType | null) => {
          if (comments) {
            this.showArticleCommentActions(comments);
          }
        },

        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this._snackBar.open(errorResponse.error.message);
          } else {
            this._snackBar.open('Ошибка отображения реакции пользователя на комментарии');
          }
        }
      });
  }

  private showRelatedArticle(articleRelated: DefaultResponseType | RelatedArticleType[]) {
    let error = null;

    if ((articleRelated as DefaultResponseType).error !== undefined) {
      error = (articleRelated as DefaultResponseType).message;
    }

    if (error) {
      this._snackBar.open(error);
      throw new Error(error);
    }

    this.relatedArticles = articleRelated as RelatedArticleType[];
  }

  private showArticle(article: DefaultResponseType | ArticleType) {
    let error = null;

    if ((article as DefaultResponseType).error !== undefined) {
      error = (article as DefaultResponseType).message;
    }

    if (error) {
      this._snackBar.open(error);
      throw new Error(error);
    }

    this.article = article as ArticleType;

    if (this.isLogged) {
      return this.commentService.getArticleComment(this.article.id);
    }
    return of(null);
  }

  private showArticleCommentActions(comments: DefaultResponseType | CommentActionType[], additionalComment: boolean = false) {
    let error = null;

    if ((comments as DefaultResponseType).error !== undefined) {
      error = (comments as DefaultResponseType).message;
    }

    if (error) {
      this._snackBar.open(error);
      throw new Error(error);
    }
    this.userCommentActions = comments as CommentActionType[];

    if (additionalComment) {
      this.additionalComments.filter((item: CommentType) => {
        return (comments as CommentActionType[]).forEach(((action: CommentActionType) => {
          if (action.comment === item.id) {
            if (action.action === CommentAction.like) {
              item.user.like = true;
            }
            if (action.action === CommentAction.dislike) {
              item.user.dislike = true;
            }
          }
        }))
      });
    } else {
      this.article.comments.map((item: CommentType) => {
        return (comments as CommentActionType[]).forEach(((action: CommentActionType) => {
          if (action.comment === item.id) {
            if (action.action === CommentAction.like) {
              item.user.like = true;
            }
            if (action.action === CommentAction.dislike) {
              item.user.dislike = true;
            }
          }
        }))
      });
    }
  }

  addComment() {
    if (this.isLogged) {
      if (this.commentForm.valid && this.commentForm.value.comment) {
        this.commentService.addComment({text: this.commentForm.value.comment, article: this.article.id})
          .pipe(
            concatMap((data: DefaultResponseType) => {
              if (data.error) {
                this._snackBar.open(data.message);
                throw new Error(data.message);
              }

              this._snackBar.open('Комментарий успешно добавлено');
              this.commentForm.reset();
              if (this.additionalComments.length > 0) {
                this.additionalComments = [];
                this.offset = 3;
              }
              return this.articleService.getArticle(this.url);
            }),

            catchError(error => {
              this._snackBar.open('Ошибка добавления комментария');
              throw new Error(error);
            }),

            concatMap((data: DefaultResponseType | ArticleType) => this.showArticle(data)),

            catchError(error => {
              this._snackBar.open(error);
              throw new Error(error);
            }),
          )
          .subscribe({
            next: (comments: CommentActionType[] | DefaultResponseType | null) => {
              if (comments) {
                this.showArticleCommentActions(comments);
              }
            },
            error: (errorResponse: HttpErrorResponse) => {
              if (errorResponse.error && errorResponse.error.message) {
                this._snackBar.open(errorResponse.error.message);
              } else {
                this._snackBar.open('Ошибка при получении статей');
              }
            }
          })
      }
    }
  }

  getComments() {
    this.commentService.getComments({article: this.article.id, offset: this.offset})
      .pipe(
        concatMap((comments: DefaultResponseType | CommentResponseType) => {
          let error = null;
          if ((comments as DefaultResponseType).error !== undefined) {
            error = (comments as DefaultResponseType).message;
          }
          if (error) {
            this._snackBar.open(error);
            throw new Error(error);
          }
          (comments as CommentResponseType).comments.forEach(((item: CommentType) => {
            this.additionalComments.push(item);
          }));
          this.offset += 10;
          if (this.isLogged) {
            return this.commentService.getArticleComment(this.article.id);
          }
          return of(null);
        }),
        catchError(error => {
          this._snackBar.open('Ошибка получения дополнительных комментарий');
          throw new Error(error);
        }),
      )
      .subscribe({
        next: (comments: CommentActionType[] | DefaultResponseType | null) => {
          if (comments) {
            this.showArticleCommentActions(comments);
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          this._snackBar.open('Ошибка отображения реакции пользователя на комментарии');
        }
      });
  }

  applyActionToComment(actionData: CommentActionType, additionalComment: boolean = false) {
    if (this.isLogged) {
      this.commentService.applyAction(actionData.comment, actionData.action)
        .pipe(
          concatMap((data: DefaultResponseType | ArticleType) => {
            if ((data as DefaultResponseType).error) {
              this._snackBar.open((data as DefaultResponseType).message);
              throw new Error((data as DefaultResponseType).message);
            }
            this._snackBar.open((data as DefaultResponseType).message);
            if (additionalComment) {
              this.additionalComments.map((comment) => {
                if (comment.id === actionData.comment) {
                  if (actionData.action === CommentAction.like) {
                    if (comment.user.dislike) {
                      comment.dislikesCount -= 1;
                      comment.user.dislike = false;
                    }
                    if (comment.user.like) {
                      comment.likesCount -= 1;
                      comment.user.like = false;
                    } else {
                      comment.likesCount += 1;
                      comment.user.like = true;
                    }
                  }
                  if (actionData.action === CommentAction.dislike) {
                    if (comment.user.like) {
                      comment.likesCount -= 1;
                      comment.user.like = false;
                    }
                    if (comment.user.dislike) {
                      comment.dislikesCount -= 1;
                      comment.user.dislike = false;
                    } else {
                      comment.dislikesCount += 1;
                      comment.user.dislike = true;
                    }
                  }
                }
              });
              return of(null);
            } else {
              return this.articleService.getArticle(this.url);
            }

          }),

          catchError(error => {
            this._snackBar.open('Ошибка добавления реакции');
            throw new Error(error);
          }),

          concatMap((data: DefaultResponseType | ArticleType | null) => {
            if (data) {
              if ((data as DefaultResponseType).error) {
                this._snackBar.open((data as DefaultResponseType).message);
                new Error((data as DefaultResponseType).message);
                return of(null);
              }
              return this.showArticle(data as ArticleType);
            }

            return of(null);
          }),

          catchError(error => {
            this._snackBar.open('Ошибка отображения основной статьи');
            throw new Error(error);
          }),
        )
        .subscribe({
          next: (comments: CommentActionType[] | DefaultResponseType | null) => {
            if (comments) {
              this.showArticleCommentActions(comments as CommentActionType[]);
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Жалоба уже отправлена');
            }
          }
        });

    } else {
      this._snackBar.open('Вы не авторизованы');
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
