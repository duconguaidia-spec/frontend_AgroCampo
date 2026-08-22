import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { InicioComponent } from './informacion-de-inicio';

describe('InicioComponent', () => {
  let component: InicioComponent;
  let fixture: ComponentFixture<InicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(InicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar la marca "AgroCampo" en el navbar', () => {
    const marca = fixture.debugElement.query(By.css('.navbar-nombre'));
    expect(marca.nativeElement.textContent).toContain('AgroCampo');
  });

  it('debería mostrar los 5 enlaces del menú de navegación', () => {
    const links = fixture.debugElement.queryAll(By.css('.navbar-links a'));
    expect(links.length).toBe(5);
  });

  it('debería mostrar el título principal del hero', () => {
    const titulo = fixture.debugElement.query(By.css('.hero-titulo'));
    expect(titulo.nativeElement.textContent).toContain('Plataforma integral');
  });

  it('debería mostrar el título "Todo lo que necesitas..."', () => {
    const titulo = fixture.debugElement.query(By.css('.caracteristicas-titulo'));
    expect(titulo.nativeElement.textContent).toContain('Todo lo que necesitas para el sector agropecuario');
  });

  it('debería renderizar las 2 tarjetas de características con su cifra', () => {
    const cards = fixture.debugElement.queryAll(By.css('.caracteristica-card'));
    expect(cards.length).toBe(component.caracteristicas.length);
    expect(component.caracteristicas.length).toBe(2);
  });

  it('debería mostrar el título "¿Quien puede usar AgroCampo?"', () => {
    const titulo = fixture.debugElement.query(By.css('.perfiles-titulo'));
    expect(titulo.nativeElement.textContent).toContain('¿Quien puede usar AgroCampo?');
  });

  it('debería renderizar las 4 tarjetas de perfiles de usuario', () => {
    const cards = fixture.debugElement.queryAll(By.css('.perfil-card'));
    expect(cards.length).toBe(component.perfiles.length);
    expect(component.perfiles.length).toBe(4);
  });

  it('debería mostrar el pie de página con el año actual', () => {
    const footer = fixture.debugElement.query(By.css('.footer-inferior p'));
    expect(footer.nativeElement.textContent).toContain(String(component.anioActual));
    expect(footer.nativeElement.textContent).toContain('AgroCampo');
  });
});