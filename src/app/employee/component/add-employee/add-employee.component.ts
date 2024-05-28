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
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    CommonModule
  ],
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {
  employeeForm!: FormGroup;

  constructor(
    private _employeeService: EmployeeService,
     private formBuilder: FormBuilder,
     public dialogRef: MatDialogRef<AddEmployeeComponent>,
     private router:Router) { }

  ngOnInit(): void {
    this.initForm();
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


    this.employeeForm.get('birthday')?.valueChanges.subscribe(value => {
      this.validateAge(value); 
    });

     
  this.employeeForm.get('dateStart')?.valueChanges.subscribe(value => {
    this.validateDateStart(value); 
  });
  }

  validateAge(birthday: Date): void {
    if (birthday) {
      const today = new Date();
      let age = today.getFullYear() - birthday.getFullYear();
      const monthDiff = today.getMonth() - birthday.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
        age--; 
      }
      if (age < 18) {
        this.employeeForm.get('birthday')?.setErrors({ 'underage': true }); 
      } else {
        this.employeeForm.get('birthday')?.setErrors(null); 
      }
    }
  }
  
  validateDateStart(dateStart: Date): void {
    if (dateStart) {
      const today = new Date();
      const minDate = new Date(today.getFullYear(), today.getMonth() - 2, today.getDate());
      const maxDate = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate());
      console.log("minDate", minDate);
      console.log("maxDate", maxDate);
      if (dateStart < minDate || dateStart > maxDate) {
        console.log("dateStart < minDate")
        this.employeeForm.get('dateStart')?.setErrors({ 'tooEarly': true });
        
      } else {
        console.log("dateStart is within the allowed range");
        this.employeeForm.get('dateStart')?.setErrors(null);
      }
    }
  }
  
  

  addEmployee(): void {
    console.log("this.employeeForm.valid", this.employeeForm.valid)
    if (this.employeeForm.valid) {
      const newEmployee: Employee = this.employeeForm.value;
      console.log("newEmployee", newEmployee);
      if (!(newEmployee.birthday instanceof Date)) {
        newEmployee.birthday = new Date(newEmployee.birthday);
      }
      newEmployee.birthday = (newEmployee.birthday)
      newEmployee.dateStart = (newEmployee.dateStart)
      console.log("this.employeeForm.value.gender", this.employeeForm.value.gender)
      this._employeeService.addEmployee(newEmployee).subscribe({
        next: (res) => { 
          console.log(res)
          this.router.navigate(['/editEmployee',res.employeeId])
  
        },
      })
    }
    this._employeeService.getEmployees().subscribe();
    this.dialogRef.close(this.employeeForm.value);
  }

  close(): void {
    this.dialogRef.close();
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
          return 'Invalid pattern (9 digits only)';
        }
        return 'Invalid pattern';
      }
      if (control.errors['underage']) {
        return 'Employee must be 18 years old or older';
      }
      if (control.errors['tooEarly']) {
        return 'Cannot set work start date before the current month';
      }
    }
    return '';
  }


}
