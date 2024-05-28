
import { RoleTableComponent } from '../role-table/role-table.component';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { EmployeeService } from '../../../services/employee.service';
import { Employee } from '../../../entities/employee.model';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { RoleService } from '../../../services/role.service';
import { RolesComponent } from '../roles/roles.component';
import { MatDialog } from '@angular/material/dialog';
import { AddRoleComponent } from '../add-role/add-role.component';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [RoleTableComponent,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    CommonModule],
  templateUrl: './edit-employee.component.html',
  styleUrl: './edit-employee.component.scss'
})

export class EditEmployeeComponent implements OnInit {
  rolesCount: number = 0;
  employeeForm!: FormGroup;

  employee!: Employee
  employeeId!: number
  constructor(
    private _employeeService: EmployeeService,
    private roleService: RoleService,
    private formBuilder: FormBuilder,
    private router: Router,
    public route: ActivatedRoute,
    private dialog: MatDialog) {
  }
  ngOnInit(): void {
    this.loadRolesCount();
    console.log("999999999999999999")
    this.employeeId = Number(this.route.snapshot.paramMap.get('id'));
    this._employeeService.getEmployeeById(this.employeeId).subscribe({
      next: (res) => {
        this.employee = res;
        console.log("this.employee", this.employee)
        this.employeeForm = this.formBuilder.group({
          firstName: [this.employee.firstName, [Validators.required, Validators.minLength(2)]],
          lastName: [this.employee.lastName, [Validators.required, Validators.minLength(2)]],
          identity: [this.employee.identity, [Validators.required, Validators.pattern(/^\d{9}$/)]],
          birthday: new FormControl(this.employee.birthday, [Validators.required, this.validateAge.bind(this)]),
          gender: [this.employee.gender, Validators.required],
          dateStart: [this.employee.dateStart, Validators.required],
        })
      }
    })
    this.initForm();
  }

  loadRolesCount(): void {
    this.roleService.getAllRoles().subscribe(roles => {
      this.rolesCount = roles.length;
    });
  }

  update(): void {
    if (this.employeeForm.valid) {
      const employee: Employee = {
        employeeId: this.employeeId,
        identity: this.employeeForm.get('identity')?.value,
        firstName: this.employeeForm.get('firstName')?.value,
        lastName: this.employeeForm.get('lastName')?.value,
        dateStart: this.employeeForm.get('dateStart')?.value,
        birthday: this.employeeForm.get('birthday')?.value,
        gender: this.employeeForm.get('gender')?.value,
      }
      this._employeeService.updateEmployeeDetails(this.employeeId, employee).subscribe({
        next: (res) => {
          console.log("sssssssssss", res)
        },
        error(res) {
          console.log(res)
        }
      })
      console.log("employeeeee", employee)
    }
  }
  addRole(): void {

  }
  initForm(): void {
    this.employeeForm = this.formBuilder.group({
      identity: new FormControl("", [Validators.required, Validators.pattern(/^\d{9}$/)]),
      firstName: new FormControl("", [Validators.required, Validators.minLength(2)]),
      lastName: new FormControl("", [Validators.required, Validators.minLength(2)]),
      dateStart: new FormControl("", [Validators.required]),
      birthday: new FormControl("", [Validators.required]),
      gender: new FormControl("", [Validators.required]),
    });
  }


//בדיקה ולדציה תאריך לידה
  validateAge(control: FormControl): { [key: string]: any } | null {
    const birthday = control.value;
    // בדיקה אם התאריך הוא תאריך חוקי
    if (isNaN(Date.parse(birthday))) {
      return { 'invalidDate': true }; 
    }
    const today = new Date();
    const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    if (new Date(birthday) > eighteenYearsAgo) {
      return { 'underage': true }; 
    }
    return null;
  }
  

  getFormControlError(controlName: string): string {
    const control = this.employeeForm.get(controlName);
    if (control && control.errors) {
      if (control.errors['required']) {
        return 'This field is required';
      }
      if (control.errors['minlength']) {
        return 'Minimum length is 2 characters';
      }
      if (control.errors['pattern']) {
        if (controlName === 'identity') {
          return 'Invalid pattern (only 9 digits)';
        }
        return 'Invalid pattern';
      }
    }
    return '';
  }


  printTable(): void {
    window.print();
  }
  openRolesDialog(): void {
    this.dialog.open(RolesComponent, {
      width: '600px'
    });
  }

  //הוספת תפקיד לעובד

  openAddEmployeeDialog(): void {
    const dialogRef = this.dialog.open(AddRoleComponent, {
      width: '50%',
      height: '70%',
      data: { employeeId: this.employeeId }
    });

    dialogRef.afterClosed().subscribe(formData => {
      this.initForm();
      if (formData) {
        console.log('Form data:', formData);
      } else {
        console.log('Dialog closed ');
      }
    });
  }

}


