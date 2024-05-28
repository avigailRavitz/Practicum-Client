import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { RoleService } from '../../../services/role.service';
import { Employee } from '../../../entities/employee.model';
import { role } from '../../../entities/role.model';
import { animate, style, transition, trigger } from '@angular/animations';



@Component({
  selector: 'app-delete-role',
  standalone: true,
  imports: [MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatDialogModule],
  templateUrl: './delete-role.component.html',
  styleUrl: './delete-role.component.scss',

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
export class DeleteRoleComponent {
  constructor(private dialogRef: MatDialogRef<DeleteRoleComponent>,
    private roleService: RoleService,
    @Inject(MAT_DIALOG_DATA) public data: { employeeId: number, roleId: number }) { }

  cancel(): void {
    this.dialogRef.close();
  }
  deleteRole(): void {
    this.roleService.deletePositionOfEmployee(this.data.employeeId, this.data.roleId).subscribe({
      next: (res) => {
        console.log("role deleted successfully")
      },
      error: (res) => {
        console.log("Error deleting role", res)
      }
    })

    this.dialogRef.close();
  }
}


