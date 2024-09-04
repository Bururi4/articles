import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  isShowed$ = new Subject<boolean>();
  modal$ = new Subject<{ type: string, service: string, title: string, button: string }>();

  showModal(type: string, service: string, title: string, button: string): void {
    this.isShowed$.next(true);
    this.modal$.next({type, service, title, button});
  }

  hideModal() {
    this.isShowed$.next(false);
  }
}
