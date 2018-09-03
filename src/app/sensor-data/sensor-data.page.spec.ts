import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorDataPage } from './sensor-data.page';

describe('SensorDataPage', () => {
  let component: SensorDataPage;
  let fixture: ComponentFixture<SensorDataPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorDataPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
