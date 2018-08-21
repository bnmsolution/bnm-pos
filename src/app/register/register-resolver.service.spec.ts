/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RegisterResolverService } from './register-resolver.service';

describe('RegisterResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegisterResolverService]
    });
  });

  it('should ...', inject([RegisterResolverService], (service: RegisterResolverService) => {
    expect(service).toBeTruthy();
  }));
});
