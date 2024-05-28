import { Component, OnInit } from '@angular/core';
import { Employee } from '../../../entities/employee.model';
import { EmployeeService } from '../../../services/employee.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { DeleteEmployeeComponent } from '../delete-employee/delete-employee.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import * as XLSX from 'xlsx';
import { addListener } from 'process';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';
import { RolesComponent } from '../roles/roles.component';
import { RoleService } from '../../../services/role.service';


@Component({
  selector: 'app-employee-table',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatIconModule],
  templateUrl: './employee-table.component.html',
  styleUrl: './employee-table.component.scss'
})
export class EmployeeTableComponent implements OnInit {

  employees: Employee[] = [];
  rolesCount: number = 0;

  constructor(
    private employeeService: EmployeeService,
    private roleService: RoleService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadEmployees();
    this.loadRolesCount();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (res) => {
        this.employees = res;
      },
      error(err) {
        console.log(err);
      }
    });
  }

  loadRolesCount(): void {
    this.roleService.getAllRoles().subscribe(roles => {
      this.rolesCount = roles.length;
    });
  }

  addNewEmployee(): void {
    const dialogRef = this.dialog.open(AddEmployeeComponent, {
      width: '500px'
    });
    dialogRef.afterClosed().subscribe(e => {
      this.loadEmployees();
    });
  }

  editEmployee(employee: Employee): void {
    this.router.navigate(['/editEmployee', employee.employeeId]);
  }

  deleteEmployee(employee: Employee): void {
    const dialogRef = this.dialog.open(DeleteEmployeeComponent, {
      width: '500px',
      data: { employee },
      panelClass: 'delete-dialog'
    });

    dialogRef.afterOpened().subscribe(() => {
      this.ngOnInit()

    });
  }


  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase().trim();
    if (!filterValue) {
      this.loadEmployees(); // Reload all employees if search field is empty
    } else {
      this.employees = this.employees.filter(employee => {
        const formattedDate = new Date(employee.dateStart).toLocaleDateString('en-US');
        return (
          employee.identity.toLowerCase().includes(filterValue) ||
          employee.firstName.toLowerCase().includes(filterValue) ||
          employee.lastName.toLowerCase().includes(filterValue) ||
          formattedDate.includes(filterValue)
        );
      });
    }
  }

  exportToExcel(): void {

    const fileName = 'employees.xlsx';
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.employees);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Employees');
    XLSX.writeFile(wb, fileName);
  }
  printTable(): void {
    window.print();
  }

  openRolesDialog(): void {
    this.dialog.open(RolesComponent, {
      width: '600px'
    });
  }

}

