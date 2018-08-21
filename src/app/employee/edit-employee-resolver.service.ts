import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Employee} from 'pos-models';

import {EmployeeService} from 'src/app/core';

@Injectable()
export class EditEmployeeResolverService {

  constructor(private employeeService: EmployeeService) {
  }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Employee> {
    const employeeId = route.paramMap.get('id');
    return this.employeeService.getItemById(employeeId);
  }
}

