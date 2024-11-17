import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-editable-task',
  template: `
    <div class="relative">
      <span
        *ngIf="!isEditing"
        (click)="startEditing()"
        class="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
      >
        {{ task.name }}
      </span>
      <input
        *ngIf="isEditing"
        [value]="task.name"
        (blur)="onBlur($event)"
        (keyup.enter)="onBlur($event)"
        (keyup.escape)="cancelEdit()"
        #editInput
        class="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  `
})
export class EditableTaskComponent {
  @Input() task!: { id: number, name: string, completed: boolean };
  @Output() update = new EventEmitter<string>();
  @ViewChild('editInput') editInput!: ElementRef<HTMLInputElement>;

  isEditing = false;

  startEditing() {
    this.isEditing = true;
    setTimeout(() => {
      if (this.editInput?.nativeElement) {
        this.editInput.nativeElement.focus();
        this.editInput.nativeElement.select();
      }
    });
  }

  cancelEdit() {
    this.isEditing = false;
  }

  onBlur(event: Event) {
    const value = (event.target as HTMLInputElement).value.trim();
    if (value && value !== this.task.name) {
      this.update.emit(value);
    }
    this.isEditing = false;
  }
} 