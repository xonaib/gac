import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmployeeListComponent } from './employee/employee.component';
import {EmployeeTasksComponent} from './employee-tasks/employee-tasks.component';

const routes = [
  {path: '', component: EmployeeListComponent},
  {path: 'Tasks/:id', component: EmployeeTasksComponent}
];



@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
