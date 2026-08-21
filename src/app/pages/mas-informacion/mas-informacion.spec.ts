import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { MasInformacionComponent } from './mas-informacion';

describe('MasInformacionComponent', () => {
  let component: MasInformacionComponent;
  let fixture: ComponentFixture<MasInformacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasInformacionComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(MasInformacionComponent);
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

  it('debería mostrar los 6 enlaces del menú de navegación', () => {
    const links = fixture.debugElement.queryAll(By.css('.navbar-links a'));
    expect(links.length).toBe(6);
  });

  it('debería mostrar el ícono de usuario en el navbar', () => {
    const icono = fixture.debugElement.query(By.css('.navbar-usuario svg'));
    expect(icono).toBeTruthy();
  });

  it('debería mostrar el título "Mas Información"', () => {
    const titulo = fixture.debugElement.query(By.css('.mi-header-titulo'));
    expect(titulo.nativeElement.textContent).toContain('Mas Información');
  });

  it('debería mostrar la tarjeta de introducción', () => {
    const intro = fixture.debugElement.query(By.css('.mi-intro-card h2'));
    expect(intro.nativeElement.textContent).toContain('El campo colombiano en la era digital');
  });

  it('debería mostrar las tarjetas de misión y visión', () => {
    const cards = fixture.debugElement.queryAll(By.css('.mv-card'));
    expect(cards.length).toBe(2);
  });

  it('debería renderizar los 6 módulos de la plataforma', () => {
    const cards = fixture.debugElement.queryAll(By.css('.modulo-card'));
    expect(cards.length).toBe(component.modulos.length);
    expect(component.modulos.length).toBe(6);
  });

  it('cada módulo debería tener título, descripción y etiqueta', () => {
    const primerModulo = fixture.debugElement.query(By.css('.modulo-card'));
    expect(primerModulo.query(By.css('h4')).nativeElement.textContent).toContain('Gestion Agropecuaria');
    expect(primerModulo.query(By.css('.modulo-etiqueta')).nativeElement.textContent).toContain('Modulo 1');
  });

  it('debería mostrar el pie de página con el año actual', () => {
    const footer = fixture.debugElement.query(By.css('.mi-footer p'));
    expect(footer.nativeElement.textContent).toContain(String(component.anioActual));
    expect(footer.nativeElement.textContent).toContain('AgroCampo');
  });
});
