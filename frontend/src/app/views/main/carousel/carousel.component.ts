import {Component} from '@angular/core';
import {ModalService} from "../../../shared/services/modal.service";

@Component({
  selector: 'main-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent {
  blocks = [
    {
      img: '1.png',
      category: 'Предложение месяца',
      title: 'Продвижение в Instagram для вашего бизнеса <span>-15%</span>!'
    },
    {
      img: '2.png',
      category: 'Акция',
      title: 'Нужен грамотный <span>копирайтер </span>?',
      description: 'Весь декабрь у нас действует акция на работу копирайтера.'
    },
    {
      img: '3.png',
      category: 'Новость дня',
      title: '<span>6 место</span> в ТОП-10 SMM-агенств Москвы!',
      description: 'Мы благодарим каждого, кто голосовал за нас!'
    },
  ];

  constructor(private modalService: ModalService) {

  }

  openModal(value: string) {
    this.modalService.showModal('order', value, 'Заявка на услугу', 'Оставить заявку');
  }
}
