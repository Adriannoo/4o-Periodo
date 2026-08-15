import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListagemMovimentacoes } from './listagem-movimentacoes';

describe('ListagemMovimentacoes', () => {
  let component: ListagemMovimentacoes;
  let fixture: ComponentFixture<ListagemMovimentacoes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListagemMovimentacoes],
    }).compileComponents();

    fixture = TestBed.createComponent(ListagemMovimentacoes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
