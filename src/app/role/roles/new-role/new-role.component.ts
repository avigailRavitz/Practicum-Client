import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RoleService } from '../../../../services/role.service';

@Component({
  selector: 'app-new-role',
  standalone: true,
  imports: [MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './new-role.component.html',
  styleUrl: './new-role.component.scss'
})

export class NewRoleComponent implements OnInit {
  roleForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<NewRoleComponent>,
    private formBuilder: FormBuilder,
    private roleService: RoleService
  ) { }

  ngOnInit(): void {
    this.roleForm = this.formBuilder.group({
      roleName: ['', Validators.required]
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  saveRole(): void {
    if (this.roleForm.valid) {
      const roleName = this.roleForm.get('roleName').value;
      console.log('Role Name:', roleName);
      this.roleService.addNewRole(roleName).subscribe({
        next(value) {
          console.log("add-new-role", roleName)
        },
      })
      this.dialogRef.close();
    }
  }

}
