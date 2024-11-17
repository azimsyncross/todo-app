import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
})
export class TodoItemComponent implements OnInit {
  @Input() task!: { id: number, name: string, completed: boolean };
  @Output() remove = new EventEmitter<number>();
  @Output() toggleCompletion = new EventEmitter<number>();
  @Output() update = new EventEmitter<string>();

  isEditing = false;
  editedTaskName = '';

  ngOnInit() {
    this.editedTaskName = this.task.name;
  }

  onToggleCompletion() {
    this.toggleCompletion.emit(this.task.id);
  }

  onRemove() {
    this.remove.emit(this.task.id);
  }

  startEditing() {
    this.isEditing = true;
    this.editedTaskName = this.task.name;
  }

  saveEdit() {
    if (this.editedTaskName.trim()) {
      this.update.emit(this.editedTaskName);
      this.isEditing = false;
    }
  }
}
