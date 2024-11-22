import { TestBed } from '@angular/core/testing';

import { ConectDBService } from './conect-db.service';

describe('ConectDBService', () => {
  let service: ConectDBService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConectDBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
