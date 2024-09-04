import {Component, OnInit} from '@angular/core';
import {ModalService} from "../../shared/services/modal.service";
import {RelatedArticleType} from "../../../types/related-article.type";
import {ArticlesService} from "../../shared/services/articles.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DefaultResponseType} from "../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  articles: RelatedArticleType[] = [];

  reviews = [
    {
      name: 'Станислав',
      image: '1.png',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'
    },
    {
      name: 'Алёна',
      image: '2.png',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    },
    {
      name: 'Мария',
      image: '3.png',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
    }
  ];

  constructor(private modalService: ModalService,
              private articleService: ArticlesService,
              private _snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.articleService.getPopularArticles()
      .subscribe({
        next: (data: DefaultResponseType | RelatedArticleType[]) => {
          let error = null;
          if ((data as DefaultResponseType).error !== undefined) {
            error = (data as DefaultResponseType).message;
          }
          if (error) {
            this._snackBar.open(error);
            throw new Error(error);
          }
          this.articles = data as RelatedArticleType[];
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this._snackBar.open(errorResponse.error.message);
          } else {
            this._snackBar.open('Ошибка при получении популярных статей');
          }
        }
      });
  }

  openModal(value: string) {
    this.modalService.showModal('order', value, 'Заявка на услугу', 'Оставить заявку');
  }
}
