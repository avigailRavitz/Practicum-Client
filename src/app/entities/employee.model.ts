export class Employee{
    employeeId!:number
    identity!:string
    firstName!: string
    lastName!:string
    dateStart !:Date
    birthday !:Date
    gender !:Gender
}

export enum Gender{
   Male, Famale
}