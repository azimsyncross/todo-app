import { Component } from '@angular/core';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
})
export class TodoComponent {
  taskName = '';
  isTaskNameTouched = false;
  isSubmitting = false;
  tasks: { name: string, completed: boolean }[] = [];

  addTask() {
    if (this.taskName.trim()) {
      this.isSubmitting = true;
      setTimeout(() => {
        this.tasks.push({ name: this.taskName.trim(), completed: false });
        this.taskName = '';
        this.isTaskNameTouched = false;
        this.isSubmitting = false;
      }, 3000); // Simulate a delay
    }
  }

  removeTask(index: number) {
    this.tasks.splice(index, 1);
  }

  toggleCompletion(index: number) {
    this.tasks[index].completed = !this.tasks[index].completed;
  }
}
