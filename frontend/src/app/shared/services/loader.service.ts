import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  isShowed$ = new Subject<boolean>();

  constructor() {
  }

  showLoader() {
    this.isShowed$.next(true);
  }

  hideLoader() {
    setTimeout(() => {
      this.isShowed$.next(false);
    }, 500);
  }
}
