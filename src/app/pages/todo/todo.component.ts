import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import moment from 'moment';

interface SortConfig {
  key: 'name' | 'createdAt' | 'updateAt';
  direction: 'asc' | 'desc';
}

interface DateRange {
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
})
export class TodoComponent implements OnInit, OnDestroy {
  taskName = '';
  searchTerm = '';
  isTaskNameTouched = false;
  isSubmitting = false;
  tasks: { id: number, name: string, completed: boolean, createdAt: string , updateAt:string }[] = [];
  filteredTasks: { id: number, name: string, completed: boolean, createdAt: string , updateAt:string }[] = [];
  
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  sortConfig: SortConfig = {
    key: 'createdAt',
    direction: 'desc'
  };

  dateRange: DateRange = {
    startDate: '',
    endDate: ''
  };

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
    let filtered = [...this.tasks];

    // Text search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(task =>
        task.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Date range filter
    if (this.dateRange.startDate || this.dateRange.endDate) {
      filtered = filtered.filter(task => {
        const taskDate = moment(task.createdAt);
        const isAfterStart = !this.dateRange.startDate || taskDate.isSameOrAfter(this.dateRange.startDate, 'day');
        const isBeforeEnd = !this.dateRange.endDate || taskDate.isSameOrBefore(this.dateRange.endDate, 'day');
        return isAfterStart && isBeforeEnd;
      });
    }

    this.filteredTasks = filtered;
    this.sortTasks();
  }

  onDateRangeChange() {
    this.filterTasks(this.searchTerm);
  }

  sortTasks(key?: 'name' | 'createdAt' | 'updateAt') {
    if (key) {
      if (this.sortConfig.key === key) {
        // Toggle direction if clicking the same column
        this.sortConfig.direction = this.sortConfig.direction === 'asc' ? 'desc' : 'asc';
      } else {
        // New column, default to ascending
        this.sortConfig.key = key;
        this.sortConfig.direction = 'asc';
      }
    }

    this.filteredTasks.sort((a, b) => {
      let comparison = 0;
      
      if (this.sortConfig.key === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else {
        // For dates, we'll compare the timestamps
        const dateA = moment(a[this.sortConfig.key]);
        const dateB = moment(b[this.sortConfig.key]);
        comparison = dateA.isBefore(dateB) ? -1 : dateA.isAfter(dateB) ? 1 : 0;
      }

      return this.sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }

  // Update existing methods to maintain filteredTasks
  addTask() {
    if (this.taskName.trim()) {
      this.isSubmitting = true;
      setTimeout(() => {
        const newTask = {
          id: Date.now(),
          name: this.taskName.trim(),
          completed: false,
          // use moment js for date
          createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
          updateAt: moment().format('YYYY-MM-DD HH:mm:ss'),

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
      task.updateAt = moment().format('YYYY-MM-DD HH:mm:ss');
      this.filterTasks(this.searchTerm);
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
  }

  updateTask(taskId: number, newName: string) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task && newName.trim()) {
      task.name = newName.trim();
      task.updateAt = moment().format('YYYY-MM-DD HH:mm:ss');
      this.filterTasks(this.searchTerm);
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
  }

  resetDateRange() {
    console.log('resetDateRange');
    this.dateRange = {
      startDate: '',
      endDate: ''
    };
    this.filterTasks(this.searchTerm);
  }
}
