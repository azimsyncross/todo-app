import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
})
export class TodoItemComponent {
  @Input() task!: { name: string, completed: boolean };
  @Output() remove = new EventEmitter<void>();
  @Output() toggleCompletion = new EventEmitter<void>();

  onToggleCompletion() {
    this.toggleCompletion.emit();
  }

  onRemove() {
    this.remove.emit();
  }
}
