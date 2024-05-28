
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { role } from '../../../entities/role.model';
import { RoleService } from '../../../services/role.service';
import { EmployeeService } from '../../../services/employee.service';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Employee } from '../../../entities/employee.model';
import { Router } from '@angular/router';
import { employeeRoles } from '../../../entities/employeeRoles.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-role',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatNativeDateModule,
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatNativeDateModule
  ],
  templateUrl: './edit-role.component.html',
  styleUrl: './edit-role.component.scss'
})
export class EditRoleComponent implements OnInit {

  positionForm!: FormGroup;
  positionlist!: role[];
  employeeId!: number
  employee!: Employee
  employeeRoles!: employeeRoles
  roleId: number;
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditRoleComponent>,
    private _employeeService: EmployeeService,
    private router: Router,
    private _roleService: RoleService,
    @Inject(MAT_DIALOG_DATA) public data: { employeeId: number, roleId: number },) {
    this.employeeId = this.data.employeeId;
    this.roleId = this.data.roleId;

    this.positionForm = this.formBuilder.group({
      roleId: ['', Validators.required],
      managerialPosition: ['', Validators.required],
      dateOfStartingWork: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this._employeeService.getEmployeeById(this.employeeId).subscribe(employee => {
      this.employee = employee;


    })
    this._roleService.getPositionOfEmployeeById(this.employeeId).subscribe(p => {
      this.employeeRoles = p;
      this.positionForm = this.formBuilder.group({

        managerialPosition: [this.employeeRoles.managerialPosition, Validators.required],
        dateOfStartingWork: [this.employeeRoles.dateOfStartingWork, Validators.required],
      });

    })
    this.positionForm.get('dateOfStartingWork')?.valueChanges.subscribe(() => {
      this.checkDate();
    });
  }

  checkDate() {
    const dateOfStartingWork = this.positionForm.get('dateOfStartingWork')?.value
    if (this.employee && new Date(dateOfStartingWork) < new Date(this.employee.dateStart)) {
      this.positionForm.get('dateOfStartingWork')?.setErrors({ invalidateEntryDate: true })
    } else {
      this.positionForm.get('dateOfStartingWork')?.setErrors(null);
    }
  }

  save(): void {
    if (this.positionForm.valid) {
      const newEmployeeRole: employeeRoles = {
        roleId: this.positionForm.get('roleId')?.value,
        managerialPosition: this.positionForm.get('managerialPosition')?.value,
        dateOfStartingWork: this.positionForm.get('dateOfStartingWork')?.value
      };
      this._roleService.updateRoleOfEmployee(this.employeeId, this.roleId, newEmployeeRole).subscribe({
        next: (res) => {
          console.log(res)
        },
      }
      )
    }
    this._employeeService.getEmployees().subscribe();
    this.router.navigate(['/editEmployee', this.employeeId])
    this.dialogRef.close(this.positionForm.value);
  }

  close(): void {
    this.dialogRef.close();
  }
}

