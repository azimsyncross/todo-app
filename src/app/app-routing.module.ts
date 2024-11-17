import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RootLayoutComponent } from './layout/root-layout/root-layout.component';

const routes: Routes = [
 {
  path:"",
  component:RootLayoutComponent,
  children:[
    {
      path: 'not-found',
      loadChildren: () =>
        import('./pages/not-found/not-found.module').then(
          (m) => m.NotFoundModule
        ),
    },
    {
      path: '',
      loadChildren: () =>
        import('./pages/home/home.module').then((m) => m.HomeModule),
    },
    {
      path: 'todo',
      loadChildren: () =>
        import('./pages/todo/todo.module').then((m) => m.TodoModule),
    },
    {
      path: '**',
      redirectTo: 'not-found',
    },
  ],
 },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
