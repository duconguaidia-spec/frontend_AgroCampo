import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { PaginaDeInicioComponent } from './pagina-de-inicio';

describe('PaginaDeInicioComponent', () => {
  let component: PaginaDeInicioComponent;
  let fixture: ComponentFixture<PaginaDeInicioComponent>;
  let router:Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaDeInicioComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaDeInicioComponent);
    component = fixture.componentInstance;
    router=TestBed.inject(Router);
   fixture.detectChanges();
  });

    it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });
 
  it('debería mostrar el título principal', () => {
    const titulo = fixture.debugElement.query(By.css('.hero-titulo'));
    expect(titulo.nativeElement.textContent).toContain('Soluciones agrícolas');
  });
 
  it('debería mostrar los tres botones de acción', () => {
    const botones = fixture.debugElement.queryAll(By.css('button'));
    expect(botones.length).toBe(3);
  });
 
  it('debería navegar a /register al hacer clic en "Crear cuenta gratis"', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    const btn = fixture.debugElement.query(By.css('.btn-crear-cuenta'));
    btn.nativeElement.click();
    expect(navigateSpy).toHaveBeenCalledWith(['/register']);
  });
 
  it('debería navegar a /mas-informacion al hacer clic en "Mas información"', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    const btn = fixture.debugElement.queryAll(By.css('.btn-mas-info'))[1];
    btn.nativeElement.click();
    expect(navigateSpy).toHaveBeenCalledWith(['/mas-informacion']);
  });
});
