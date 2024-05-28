import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { employeeRoles } from '../entities/employeeRoles.model';
import { role } from '../entities/role.model';
import { Employee } from '../entities/employee.model';
import { map, switchMap, toArray } from 'rxjs/operators';
import { mergeMap } from 'rxjs/operators';
import { log } from 'console';


@Injectable({
  providedIn: 'root'
})
export class RoleService {


  public baseUrl = 'https://localhost:7043/api'
  constructor(private http: HttpClient) { }

  getPositionOfEmployeeById(employeeId: number): Observable<any> {

    return this.http.get<any>(`${this.baseUrl}/EmployeeInRole/${employeeId}`);
  }

  getAllRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/Role`)
  }
  addNewRole(roleName: string): Observable<any> {
    const roleData = { name: roleName };
    return this.http.post<any>(`${this.baseUrl}/Role`, roleData);
  }

  addNewRoleToEmployee(employeeId: number, employeeRoles: employeeRoles): Observable<employeeRoles> {
    console.log("addNewRoleToEmployee", employeeRoles)
    return this.http.post<employeeRoles>(`${this.baseUrl}/EmployeeInRole/${employeeId}`, employeeRoles);
  }

  updateRoleOfEmployee(employeeId: number, roleId: number, employee: employeeRoles): Observable<Employee> {
    console.log("updateRoleOfEmployee", "employeeId", employeeId, "roleId", roleId, "employee", employee)
    return this.http.put<Employee>(`${this.baseUrl}/EmployeeInRole/${employeeId}/role/${roleId}`, employee);
  }

  deletePositionOfEmployee(employeeId: number, roleId: number): Observable<Employee> {
    console.log("roleId", roleId)
    return this.http.delete<Employee>(`${this.baseUrl}/EmployeeInRole/${employeeId}/role/${roleId}`);
  }

  getEmployeePositionsNotAssigned(employeeId: number): Observable<role[]> {
    return this.getPositionOfEmployeeById(employeeId).pipe(
      switchMap(employeePositions => {
        return this.getAllRoles().pipe(
          map(allPositions => {
            return allPositions.filter(position => !employeePositions.some((x: employeeRoles) => x?.roleId === position?.roleId));

          })
        );
      })
    );
  }
}
