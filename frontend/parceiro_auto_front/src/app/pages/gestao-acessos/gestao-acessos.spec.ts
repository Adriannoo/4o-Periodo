import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestaoAcessos } from './gestao-acessos';

describe('GestaoAcessos', () => {
  let component: GestaoAcessos;
  let fixture: ComponentFixture<GestaoAcessos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestaoAcessos],
    }).compileComponents();

    fixture = TestBed.createComponent(GestaoAcessos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
