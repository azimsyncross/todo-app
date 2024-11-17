import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
})
export class TodoComponent implements OnInit, OnDestroy {
  taskName = '';
  searchTerm = '';
  isTaskNameTouched = false;
  isSubmitting = false;
  tasks: { id: number, name: string, completed: boolean }[] = [];
  filteredTasks: { id: number, name: string, completed: boolean }[] = [];
  
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  ngOnInit() {
    // Load tasks from localStorage when the component is initialized
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      this.tasks = JSON.parse(storedTasks);
      this.filteredTasks = [...this.tasks];
    }

    // Setup search with debounce
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(300), // Wait 300ms after the last event
        distinctUntilChanged() // Only emit if value is different from previous
      )
      .subscribe(searchTerm => {
        this.filterTasks(searchTerm);
      });
  }

  ngOnDestroy() {
    this.searchSubscription?.unsubscribe();
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  private filterTasks(searchTerm: string) {
    if (!searchTerm.trim()) {
      this.filteredTasks = [...this.tasks];
    } else {
      this.filteredTasks = this.tasks.filter(task =>
        task.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }

  // Update existing methods to maintain filteredTasks
  addTask() {
    if (this.taskName.trim()) {
      this.isSubmitting = true;
      setTimeout(() => {
        const newTask = {
          id: Date.now(),
          name: this.taskName.trim(),
          completed: false
        };
        this.tasks.push(newTask);
        
        // Update filtered tasks
        this.filterTasks(this.searchTerm);
        
        // Save tasks to localStorage
        localStorage.setItem('tasks', JSON.stringify(this.tasks));

        // Reset form fields
        this.taskName = '';
        this.isTaskNameTouched = false;
        this.isSubmitting = false;
      }, 3000);
    }
  }

  removeTask(taskId: number) {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
    this.filterTasks(this.searchTerm);
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  toggleCompletion(taskId: number) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      this.filterTasks(this.searchTerm);
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
  }

  updateTask(taskId: number, newName: string) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task && newName.trim()) {
      task.name = newName.trim();
      this.filterTasks(this.searchTerm);
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
  }
}
