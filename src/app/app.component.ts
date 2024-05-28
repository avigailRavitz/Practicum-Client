import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmployeeTableComponent } from './employee/component/employee-table/employee-table.component';
import { CommonModule } from '@angular/common';
import { AddEmployeeComponent } from './employee/component/add-employee/add-employee.component';
import { EditEmployeeComponent } from './employee/component/edit-employee/edit-employee.component';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EmployeeTableComponent, CommonModule, AddEmployeeComponent, EditEmployeeComponent,MatDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'PRACTICUM';
}
