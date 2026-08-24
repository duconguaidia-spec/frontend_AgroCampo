import { TestBed } from '@angular/core/testing';

import { RecuperacionContrasenaService } from './recuperacion-contrasena';

describe('RecuperacionContrasenaService', () => {
  let service: RecuperacionContrasenaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecuperacionContrasenaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
