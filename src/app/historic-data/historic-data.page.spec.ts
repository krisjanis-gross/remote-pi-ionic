import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricDataPage } from './historic-data.page';

describe('HistoricDataPage', () => {
  let component: HistoricDataPage;
  let fixture: ComponentFixture<HistoricDataPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricDataPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
