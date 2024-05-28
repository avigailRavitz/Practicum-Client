import { Component, Input, OnInit } from '@angular/core';
import { employeeRoles } from '../../../entities/employeeRoles.model';
import { role } from '../../../entities/role.model';
import { EmployeeService } from '../../../services/employee.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RoleService } from '../../../services/role.service';
import { Router } from 'express';
import { AddRoleComponent } from '../add-role/add-role.component';
import { EditRoleComponent } from '../edit-role/edit-role.component';
import { DeleteRoleComponent } from '../delete-role/delete-role.component';

@Component({
  selector: 'app-role-table',
  standalone: true,
  imports: [MatIconModule,
    CommonModule,
    MatTableModule,
    MatIconModule],
  templateUrl: './role-table.component.html',
  styleUrl: './role-table.component.scss'
})
export class RoleTableComponent implements OnInit {

  @Input() employeeId !: number;
  @Input() roleId!: number;
  displayedColumns: string[] = ['nameRole', 'dateStart', 'manager', 'action'];
  employees!: MatTableDataSource<employeeRoles>;

  constructor(
    private _roleService: RoleService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    console.log("employeeId", this.employeeId);
    this._roleService.getPositionOfEmployeeById(this.employeeId).subscribe({
      next: (res: employeeRoles[] | employeeRoles) => {
        if (Array.isArray(res)) {
          this.employees = new MatTableDataSource<employeeRoles>(res);
        } else {
          this.employees = new MatTableDataSource<employeeRoles>([res]);
        }
        console.log("this.employees", this.employees.data);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  editRoleEmployee(employeeRoles: employeeRoles): void {
    const dialogRef = this.dialog.open(EditRoleComponent, {
      width: '50%',
      height: '50%',
      data: { employeeId: this.employeeId, roleId: employeeRoles.roleId }
    });


    dialogRef.afterClosed().subscribe(formData => {
      this.ngOnInit()
      if (formData) {
        console.log('Form data:', formData);
      } else {
        console.log('Dialog closed without form data');
      }

    });
    console.log('Edit employee:', employeeRoles);
  }

  deleteRoleEmployee(employee: employeeRoles) {
    console.log("this.roleId", employee.roleId)
    const roleId: number = Number(employee.roleId);
    const employeeId: number = this.employeeId
    const dialogRef = this.dialog.open(DeleteRoleComponent, {
      width: '500px',
      data: { employeeId, roleId },
      panelClass: 'delete-dialog'
    });
    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit()
    })
    console.log('Delete employee:', employee);
  }

  openAddRoleToEmployeeDialog(): void {
    const dialogRef = this.dialog.open(AddRoleComponent, {
      width: '50%',
      height: '70%',
      data: { employeeId: this.employeeId } // Pass employeeId to the dialog component
    });
    this.ngOnInit()

    dialogRef.afterClosed().subscribe(formData => {

      if (formData) {
        console.log('Form data:', formData);
      } else {
        console.log('Dialog closed ');
      }
    });
  }
}
