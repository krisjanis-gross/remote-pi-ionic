import { TestBed, inject } from '@angular/core/testing';

import { BackendDataService } from './backend-data.service';

describe('BackendDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BackendDataService]
    });
  });

  it('should be created', inject([BackendDataService], (service: BackendDataService) => {
    expect(service).toBeTruthy();
  }));
});
