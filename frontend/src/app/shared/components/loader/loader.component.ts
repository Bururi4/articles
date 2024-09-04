import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoaderService} from "../../services/loader.service";

@Component({
  selector: 'loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, OnDestroy {

  isShowed: boolean = false;

  constructor(private loaderService: LoaderService) {
  }

  ngOnInit(): void {
    this.loaderService.isShowed$.subscribe((isShowed: boolean) => {
      this.isShowed = isShowed;
    });
  }

  ngOnDestroy(): void {
    this.loaderService.isShowed$.unsubscribe();
  }
}
