import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ListagemDocentesComponent } from './listagem-docentes.component';
import { DocenteService } from '../../core/services/docente.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DocenteInterface } from '../../core/interfaces/docente.interface';
import { ToastrService } from 'ngx-toastr';

fdescribe('ListagemDocentesComponent', () => {
  let component: ListagemDocentesComponent;
  let fixture: ComponentFixture<ListagemDocentesComponent>;
  let docenteServiceMock: any;
  let routerMock: any;
  let toastrMock: any;

  const mockDocentes: DocenteInterface[] = [
    { id: 1, nomeCompleto: 'João Silva',
      genero: 'Masculino',
      nascimento: new Date('1985-10-15'),
      cpf: '123.456.789-00', rg: '12.345.678-9',
      estadoCivil: 'Solteiro',
      telefone: '123456789',
      email: 'joao@example.com',
      senha: 'senha123',
      naturalidade: 'São Paulo',
      cep: '01001-000',
      localidade: 'São Paulo',
      uf: 'SP',
      logradouro: 'Rua A',
      numero: '123',
      complemento: '',
      bairro: 'Centro',
      referencia: '',
      materias: [1, 2] },
    { id: 2,
      nomeCompleto: 'Maria Oliveira',
      genero: 'Feminino',
      nascimento: new Date('1990-07-20'),
      cpf: '987.654.321-00',
      rg: '98.765.432-1',
      estadoCivil: 'Casada',
      telefone: '987654321',
      email: 'maria@example.com',
      senha: 'senha456',
      naturalidade: 'Rio de Janeiro',
      cep: '20001-000',
      localidade: 'Rio de Janeiro',
      uf: 'RJ',
      logradouro: 'Avenida B',
      numero: '456',
      complemento: 'Apt 101',
      bairro: 'Zona Sul',
      referencia: 'Próximo ao metrô',
      materias: [3, 4] }
  ];

  beforeEach(async () => {
    docenteServiceMock = jasmine.createSpyObj('DocenteService', ['getDocentes']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    toastrMock = jasmine.createSpyObj('ToastrService', [
      'success',
      'error',
      'warning',
    ]);

    await TestBed.configureTestingModule({
      imports: [ListagemDocentesComponent, FormsModule],
      providers: [
        { provide: DocenteService, useValue: docenteServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ToastrService, useValue: toastrMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListagemDocentesComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir a lista de docentes na inicialização', () => {
    docenteServiceMock.getDocentes.and.returnValue(of(mockDocentes));
    component.ngOnInit();
    fixture.detectChanges();

    const docentesRows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(docentesRows.length).toBe(2);
    expect(docentesRows[0].nativeElement.textContent).toContain('João Silva');
    expect(docentesRows[1].nativeElement.textContent).toContain('Maria Oliveira');
  });

  it('deve filtrar docentes com base no texto de pesquisa', () => {
    docenteServiceMock.getDocentes.and.returnValue(of(mockDocentes));
    component.ngOnInit();
    fixture.detectChanges();

    component.textoPesquisa = 'João';
    component.pesquisar();
    fixture.detectChanges();

    expect(component.listaDocentes.length).toBe(1);
    expect(component.listaDocentes[0].nomeCompleto).toBe('João Silva');
  });

  it('deve ignorar maiúsculas e caracteres especiais na busca', () => {
    docenteServiceMock.getDocentes.and.returnValue(of(mockDocentes));
    component.ngOnInit();
    fixture.detectChanges();

    component.textoPesquisa = 'joão';
    component.pesquisar();
    fixture.detectChanges();

    expect(component.listaDocentes.length).toBe(1);
    expect(component.listaDocentes[0].nomeCompleto).toBe('João Silva');
  });

  it('deve retornar lista vazia se a busca não encontrar correspondência', () => {
    docenteServiceMock.getDocentes.and.returnValue(of(mockDocentes));
    component.ngOnInit();
    fixture.detectChanges();

    component.textoPesquisa = 'Nome Não Existente';
    component.pesquisar();
    fixture.detectChanges();

    expect(component.listaDocentes.length).toBe(0);
  });

  it('deve filtrar corretamente quando apenas o código é digitado', () => {
    docenteServiceMock.getDocentes.and.returnValue(of(mockDocentes));
    component.ngOnInit();
    fixture.detectChanges();

    component.textoPesquisa = '1';
    component.pesquisar();
    fixture.detectChanges();

    expect(component.listaDocentes.length).toBe(1);
    expect(component.listaDocentes[0].id).toBe(1);
  });

  it('deve lidar com erro no serviço de docentes corretamente', fakeAsync(() => {
    docenteServiceMock.getDocentes.and.returnValue(throwError('Erro ao buscar docentes'));
    component.ngOnInit();
    tick();
    fixture.detectChanges();

    expect(component.listaDocentes.length).toBe(0);
    expect(toastrMock.error).toHaveBeenCalledWith(
      'Ocorreu um erro ao carregar a lista de docentes!'
    );
  }));

  it('deve restaurar lista ao limpar campo de busca', () => {
    docenteServiceMock.getDocentes.and.returnValue(of(mockDocentes));
    component.ngOnInit();
    fixture.detectChanges();

    component.textoPesquisa = 'Maria';
    component.pesquisar();
    fixture.detectChanges();

    expect(component.listaDocentes.length).toBe(1);

    component.textoPesquisa = '';
    component.pesquisar();
    fixture.detectChanges();

    expect(component.listaDocentes.length).toBe(mockDocentes.length);
  });

  it('deve navegar corretamente ao chamar verDetalhes', () => {
    component.verDetalhes(1);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/docente', 1]);
  });

  it('deve exibir corretamente os detalhes de contato do docente', () => {
    docenteServiceMock.getDocentes.and.returnValue(of(mockDocentes));
    component.ngOnInit();
    fixture.detectChanges();

    const docente = mockDocentes[0];
    const docenteRow = fixture.debugElement.query(By.css('tbody tr'));
    expect(docenteRow.nativeElement.textContent).toContain(docente.email);
    expect(docenteRow.nativeElement.textContent).toContain(docente.telefone);
  });
});
