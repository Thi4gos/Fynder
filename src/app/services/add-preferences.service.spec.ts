import { TestBed } from '@angular/core/testing';

import { AddPreferencesService } from './add-preferences.service';

describe('AddPreferencesService', () => {
  let service: AddPreferencesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddPreferencesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
