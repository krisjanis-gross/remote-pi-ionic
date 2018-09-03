import { TestBed, inject } from '@angular/core/testing';

import { LocalAppDataService } from './local-app-data.service';

describe('LocalAppDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalAppDataService]
    });
  });

  it('should be created', inject([LocalAppDataService], (service: LocalAppDataService) => {
    expect(service).toBeTruthy();
  }));
});
