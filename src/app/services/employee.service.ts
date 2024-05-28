import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../entities/employee.model';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  
  public baseUrl = 'https://localhost:7043/api/Employee'
  constructor(private http: HttpClient) { }

  getEmployees(): Observable<Employee[]> {
    console.log("getEmployees")
    return this.http.get<Employee[]>(this.baseUrl)
  
  }
  addEmployee(employee: Employee):Observable<Employee>{

    console.log("postfunc",employee)
     return this.http.post<Employee>(`${this.baseUrl}`,employee)
  }

	deleteEmployee(employeeCode: number): Observable<Employee> {
		return this.http.delete<Employee>(
			`${this.baseUrl}/${employeeCode}`,
		);
	}
  getEmployeeById(id:number): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/${id}`); 
  }

  updateEmployeeDetails(id: number, employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.baseUrl}/${id}`, employee); 
  }



}

