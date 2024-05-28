import { Routes } from '@angular/router';
import { EmployeeTableComponent } from './employee/component/employee-table/employee-table.component';
import { AddEmployeeComponent } from './employee/component/add-employee/add-employee.component';
import { RoleTableComponent } from './employee/component/role-table/role-table.component';
import { EditEmployeeComponent } from './employee/component/edit-employee/edit-employee.component';



export const routes: Routes = [
    { path: '', redirectTo: '', pathMatch: 'full' },
    { path: '', component: EmployeeTableComponent },
    { path: 'add-employee', component: AddEmployeeComponent },
    { path: 'editEmployee/:id', component: EditEmployeeComponent }
];
