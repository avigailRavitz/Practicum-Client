
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { EmployeeService } from '../../../services/employee.service';
import { Employee } from '../../../entities/employee.model';
import { publicDecrypt } from 'crypto';
import { animate, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-delete-employee',
  standalone: true,
  imports: [MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatDialogModule],
  templateUrl: './delete-employee.component.html',
  styleUrl: './delete-employee.component.scss',


  animations: [ /* הוספת ההגדרות של האנימציה */
    trigger('dialogAnimation', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(300, style({ opacity: 1 }))
      ]),
      transition('* => void', [
        animate(300, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class DeleteEmployeeComponent {

  constructor(private dialogRef: MatDialogRef<DeleteEmployeeComponent>,
    private employeeService: EmployeeService,
    @Inject(MAT_DIALOG_DATA) public data: { employee: Employee }) { }

  cancel(): void {
    this.dialogRef.close();
  }
  deleteEmployee(): void {
    console.log("employee", this.data.employee)
    if (this.data.employee && this.data.employee.identity) {
      console.log("idddddddd", this.data.employee.employeeId)
      this.employeeService.deleteEmployee(this.data.employee.employeeId).subscribe({
        next: (res) => {
          console.log("Employee deleted successfully");
        },
        error: (err) => {
          console.error("Error deleting employee:", err);
        }
      });
    } else {
      console.error("Invalid employee or missing identity");
    }
    this.dialogRef.close();
  }
}
