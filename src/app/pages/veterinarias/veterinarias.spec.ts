import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { VeterinariasComponent } from './veterinarias';

describe('VeterinariasComponent', () => {
  let component: VeterinariasComponent;
  let fixture: ComponentFixture<VeterinariasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VeterinariasComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(VeterinariasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    TestBed.inject(HttpTestingController).expectOne('/api/v1/veterinarias').flush({ success: true, data: [] });
    await fixture.whenStable();
  });

  afterEach(() => TestBed.inject(HttpTestingController).verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
