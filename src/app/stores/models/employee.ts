import { Document } from './document';

export enum EmployeeType {
  FullTime = 'fullTime',
  PartTime = 'partTime'
}

export enum EmployeeRole {
  Admin = 'admin',
  Manager = 'manager',
  Clerk = 'clerk'
}

export class Employee extends Document {
  code: string;
  type: EmployeeType;
  pinCode: string;
  role: EmployeeRole;
  name: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  note: string;
  dateOfBirth: Date;
  dateOfJoin: Date;

  constructor() {
    super();
  }
}
