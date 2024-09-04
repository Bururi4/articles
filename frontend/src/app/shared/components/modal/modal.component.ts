import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {FormBuilder, Validators} from "@angular/forms";
import {ModalService} from "../../services/modal.service";
import {RequestService} from "../../services/requests.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DefaultResponseType} from "../../../../types/default-response.type";

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})

export class ModalComponent implements OnInit, OnDestroy {
  isVisible: boolean = false;
  consultationForm: boolean = true;
  title: string = '';
  type: string = '';
  service: string = '';
  button: string = '';

  private subscription: Subscription = new Subscription();

  modalForm = this.fb.group({
    service: [''],
    name: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern(/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/)]],
  })

  constructor(private fb: FormBuilder,
              private modalService: ModalService,
              private requestService: RequestService,
              private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.subscription.add(this.modalService.isShowed$.subscribe((isShowed: boolean): void => {
      this.isVisible = isShowed;
    }));

    this.subscription.add(this.modalService.modal$.subscribe((data: {
      type: string,
      service: string,
      title: string,
      button: string
    }): void => {
      this.modalForm.get('service')?.patchValue(data.service);
      this.type = data.type;
      this.service = data.service;
      this.title = data.title;
      this.button = data.button;
    }));
  }

  closeModal() {
    this.modalService.hideModal();
    this.consultationForm = true;
    this.modalForm.reset();
    this.modalForm.setErrors(null);
    this.modalForm.get('service')?.patchValue(this.service);
  }

  send(): void {
    if (this.modalForm.value.name && this.modalForm.value.phone && this.modalForm.value.service && this.modalForm.valid) {
      this.requestService.newRequest(this.modalForm.value.name, this.modalForm.value.phone, this.type, this.modalForm.value.service)
        .subscribe({
          next: (data: DefaultResponseType): void => {
            let error = null;
            if (data.error) {
              error = (data as DefaultResponseType).message;
            }
            if (error) {
              this._snackBar.open(error);
              throw new Error(error);
            }
            this.consultationForm = false;
            this.modalForm.reset();
            this.modalForm.get('service')?.patchValue(this.service);

            setTimeout((): void => {
              if (!this.consultationForm) {
                this.consultationForm = true;
              }
            }, 10000);
          },
          error: (): void => {
            this._snackBar.open('Ошибка при отправке запроса');
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
