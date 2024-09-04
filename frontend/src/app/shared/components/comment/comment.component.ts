import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommentActionType} from "../../../../types/comment-action.type";
import {CommentAction} from "../../../../types/comment-action.enum";
import {CommentType} from "../../../../types/comment.type";

@Component({
  selector: 'comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent {
  @Input() comment: CommentType = {} as CommentType;
  commentActionEnum = CommentAction;
  @Output() action: EventEmitter<CommentActionType> = new EventEmitter<CommentActionType>();

  applyAction(action: string) {
    this.action.emit({comment: this.comment.id, action});
  }
}
