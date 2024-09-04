import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MainRoutingModule} from './main-routing.module';
import {MainComponent} from "./main.component";
import {CarouselComponent} from "./carousel/carousel.component";
import {CarouselModule} from "primeng/carousel";
import {SharedModule} from "../../shared/shared.module";
import {RouterModule} from "@angular/router";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    MainComponent,
    CarouselComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MainRoutingModule,
    CarouselModule,
  ]
})
export class MainModule {
}
