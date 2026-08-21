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

  it('debería mostrar la marca "AgroCampo" en el encabezado', () => {
    const marca = fixture.debugElement.query(By.css('.brand-name'));
    expect(marca.nativeElement.textContent).toContain('AgroCampo');
  });

  it('debería mostrar el título "Más información"', () => {
    const titulo = fixture.debugElement.query(By.css('.mi-header h1'));
    expect(titulo.nativeElement.textContent).toContain('Más información');
  });

  it('debería mostrar la tarjeta de introducción', () => {
    const intro = fixture.debugElement.query(By.css('.mi-intro-card h2'));
    expect(intro.nativeElement.textContent).toContain('El campo colombiano en la era digital');
  });

  it('debería mostrar las tarjetas de misión y visión', () => {
    const cards = fixture.debugElement.queryAll(By.css('.mv-card'));
    expect(cards.length).toBe(2);
  });

  it('debería renderizar los 7 módulos de la plataforma', () => {
    const cards = fixture.debugElement.queryAll(By.css('.modulo-card'));
    expect(cards.length).toBe(component.modulos.length);
    expect(component.modulos.length).toBe(7);
  });

  it('cada módulo debería tener título, descripción y requisito', () => {
    const primerModulo = fixture.debugElement.query(By.css('.modulo-card'));
    expect(primerModulo.query(By.css('h3')).nativeElement.textContent).toContain('Inicio de sesión');
    expect(primerModulo.query(By.css('span')).nativeElement.textContent).toContain('RF 1');
  });
});
