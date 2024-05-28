
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RoleService } from '../../../services/role.service';
import { Observable } from 'rxjs';
import { role } from '../../../entities/role.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NewRoleComponent } from '../new-role/new-role.component';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    MatDialogModule,
    CommonModule,
    MatIconModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})

export class RolesComponent implements OnInit {
  roles$: Observable<role[]>;

  constructor(
    private dialogRef: MatDialogRef<RolesComponent>,
    private dialog: MatDialog,
    private roleService: RoleService) { }

  ngOnInit(): void {
    this.roles$ = this.roleService.getAllRoles();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  openNewRoleDialog(): void {
    const dialogRef = this.dialog.open(NewRoleComponent, {
      width: '300px', // רוחב הדיאלוג
      disableClose: true, // אפשרות לסגירת הדיאלוג בלחיצה מחוץ לו
    });
    dialogRef.afterClosed().subscribe(formData => {
      this.ngOnInit()
    });
  }
}

