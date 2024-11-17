import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TodoRoutingModule } from './todo-routing.module';
import { TodoComponent } from './todo.component';
import { TodoItemComponent } from '../../components/todo-item/todo-item.component';

@NgModule({
  declarations: [
    TodoComponent,
    TodoItemComponent
  ],
  imports: [
    CommonModule,
    TodoRoutingModule,
    FormsModule
  ]
})
export class TodoModule { }
