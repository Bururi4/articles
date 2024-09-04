import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {LoaderComponent} from './components/loader/loader.component';
import {LayoutComponent} from "./layout/layout.component";
import {FooterComponent} from "./layout/footer/footer.component";
import {HeaderComponent} from "./layout/header/header.component";
import {ArticleItemComponent} from './components/article/article-item.component';
import {CommentComponent} from './components/comment/comment.component';
import {ModalComponent} from './components/modal/modal.component';
import {DialogModule} from "primeng/dialog";
import {CutDescriptionPipe} from "./pipes/cut-description.pipe";
import {MatMenuModule} from "@angular/material/menu";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {NgxMaskModule} from "ngx-mask";

@NgModule({
  declarations: [
    LayoutComponent,
    FooterComponent,
    HeaderComponent,
    ArticleItemComponent,
    CommentComponent,
    LoaderComponent,
    ModalComponent,
    CutDescriptionPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatMenuModule,
    DialogModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    NgxMaskModule,
  ],
  exports: [
    LayoutComponent,
    FooterComponent,
    HeaderComponent,
    ArticleItemComponent,
    CommentComponent,
    LoaderComponent,
    ModalComponent,
    CutDescriptionPipe
  ]
})
export class SharedModule {
}
