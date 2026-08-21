import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForoComponent } from './foro';

describe('ForoComponent', () => {
  let component: ForoComponent;
  let fixture: ComponentFixture<ForoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ForoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
