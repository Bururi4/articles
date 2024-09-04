import {Component, OnInit} from '@angular/core';
import {ArticlesService} from "../../../shared/services/articles.service";
import {CategoryService} from "../../../shared/services/category.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {catchError, concatMap, debounceTime, mergeMap, Observable} from "rxjs";
import {ActiveParamsUtil} from "../../../shared/utils/active-params.utils";
import {HttpErrorResponse} from "@angular/common/http";
import {RelatedArticleType} from "../../../../types/related-article.type";
import {CategoryType} from "../../../../types/category.type";
import {ArticleParamsType} from "../../../../types/article-params.type";
import {FilterType} from "../../../../types/filter.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {RelatedArticleResponseType} from "../../../../types/related-article-response.type";
import {ArticlesType} from "../../../../types/articles.type";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {
  articles: RelatedArticleType[] = [];
  categories: CategoryType[] = [];
  activeParams: ArticleParamsType = {categories: []};
  appliedFilters: FilterType[] = [];
  sortingOpen = false;
  pages: number[] = [];

  constructor(private articleService: ArticlesService,
              private categoryService: CategoryService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.categoryService.getCategories().pipe(
      concatMap((categories: CategoryType[]): Observable<Params> => {
        this.categories = categories;
        return this.activatedRoute.queryParams;
      }),
      catchError(error => {
        this._snackBar.open('Ошибка при получении категорий');
        throw new Error(error);
      }),
      debounceTime(500),
      mergeMap((params: Params): Observable<DefaultResponseType | RelatedArticleResponseType> => {
        this.activeParams = ActiveParamsUtil.processParams(params);
        this.appliedFilters = [];
        this.activeParams.categories.forEach(url => {
          const foundType = this.categories.find((category: CategoryType): boolean => category.url === url);
          if (foundType) {
            this.appliedFilters.push({
              name: foundType.name,
              urlParam: foundType.url
            })
          }
        });
        return this.articleService.getArticles(this.activeParams);
      }),

      catchError(error => {
        this._snackBar.open('Ошибка при получении статей');
        throw new Error(error);
      }),
    )
      .subscribe({
        next: (data) => {
          let error = null;
          if ((data as DefaultResponseType).error !== undefined) {
            error = (data as DefaultResponseType).message;
          }
          if (error) {
            this._snackBar.open(error);
            throw new Error(error);
          }
          data = data as ArticlesType;
          this.pages = [];
          for (let i = 1; i <= data.pages; i++) {
            this.pages.push(i);
          }
          this.articles = data.items;
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this._snackBar.open(errorResponse.error.message);
          } else {
            this._snackBar.open('Ошибка при получении статей');
          }
        }
      });
  }

  removeAppliedFilter(appliedFilter: FilterType) {
    this.activeParams.categories = this.activeParams.categories.filter((item: string): boolean => item !== appliedFilter.urlParam);
    this.activeParams.page = 1;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: this.activeParams,
      queryParamsHandling: 'merge'
    });
  }

  toggleSorting() {
    this.sortingOpen = !this.sortingOpen;
  }

  toggleFilter(filter: string) {
    const foundType: string | undefined = this.activeParams.categories.find((item: string): boolean => item === filter);
    if (!foundType) {
      this.activeParams.categories = [...this.activeParams.categories, filter]
    } else {
      this.activeParams.categories = this.activeParams.categories.filter(item => item !== filter);
    }
    this.activeParams.page = 1;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: this.activeParams,
      queryParamsHandling: 'merge'
    });
  }

  appliedFilter(category: string) {
    return this.appliedFilters.find((filter: FilterType): boolean => filter.urlParam === category);
  }

  openPage(page: number) {
    this.activeParams.page = page;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: this.activeParams,
      queryParamsHandling: 'merge'
    });
  }

  openPrevPage() {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
    }

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: this.activeParams,
      queryParamsHandling: 'merge'
    });
  }

  openNextPage() {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;
    }

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: this.activeParams,
      queryParamsHandling: 'merge'
    });
  }
}
