import {Component, Input} from '@angular/core';
import {RelatedArticleType} from "../../../../types/related-article.type";

@Component({
  selector: 'article-item',
  templateUrl: './article-item.component.html',
  styleUrls: ['./article-item.component.scss']
})
export class ArticleItemComponent {
  @Input() article!: RelatedArticleType;
}
