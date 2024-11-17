import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
})
export class TodoComponent implements OnInit {
  taskName = '';
  isTaskNameTouched = false;
  isSubmitting = false;
  tasks: { id: number, name: string, completed: boolean }[] = [];

  ngOnInit() {
    // Load tasks from localStorage when the component is initialized
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      this.tasks = JSON.parse(storedTasks);
    }
  }

  addTask() {
    if (this.taskName.trim()) {
      this.isSubmitting = true;
      setTimeout(() => {
        const newTask = {
          id: Date.now(), // Unique ID using current timestamp
          name: this.taskName.trim(),
          completed: false
        };
        this.tasks.push(newTask);

        // Save tasks to localStorage
        localStorage.setItem('tasks', JSON.stringify(this.tasks));

        // Reset form fields
        this.taskName = '';
        this.isTaskNameTouched = false;
        this.isSubmitting = false;
      }, 3000); // Simulate a delay
    }
  }

  removeTask(taskId: number) {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  toggleCompletion(taskId: number) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
  }

  updateTask(taskId: number, newName: string) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task && newName.trim()) {
      task.name = newName.trim();
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
  }
}
