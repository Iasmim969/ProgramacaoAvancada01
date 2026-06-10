// 1. Abstracao de persistencia e implementacoes concretas
interface IBancoDeDados {
    salvar(dados: any): void;
}

class BancoDeDadosMySQL implements IBancoDeDados {
    salvar(dados: any): void {
        console.log("Salvando dados no MySQL...");
    }
}

class BancoDeDadosPostgreSQL implements IBancoDeDados {
    salvar(dados: any): void {
        console.log("Salvando dados no PostgreSQL...");
    }
}

class BancoDeDadosEmMemoria implements IBancoDeDados {
    public dadosSalvos: any[] = [];

    salvar(dados: any): void {
        this.dadosSalvos.push(dados);
        console.log("Salvando dados em memoria...");
    }
}

// 2. Politicas de desconto
interface IPoliticaDesconto {
    calcular(valorTotal: number): number;
}

class DescontoClienteVip implements IPoliticaDesconto {
    calcular(valorTotal: number): number {
        return valorTotal * 0.20;
    }
}

class DescontoClienteEstudante implements IPoliticaDesconto {
    calcular(valorTotal: number): number {
        return valorTotal * 0.10;
    }
}

class SemDesconto implements IPoliticaDesconto {
    calcular(_valorTotal: number): number {
        return 0;
    }
}

// Exemplo de extensao: novo desconto sem alterar a calculadora.
class DescontoClientePremium implements IPoliticaDesconto {
    calcular(valorTotal: number): number {
        return valorTotal * 0.15;
    }
}

// 3. Servicos com responsabilidades especificas
class CalculadoraDescontoPedido {
    calcular(pedido: Pedido): number {
        return pedido.politicaDesconto.calcular(pedido.valorTotal);
    }
}

class CalculadoraFretePedido {
    calcular(): number {
        return 15.0;
    }
}

class RepositorioPedido {
    constructor(private bancoDeDados: IBancoDeDados) {}

    salvar(pedido: Pedido): void {
        this.bancoDeDados.salvar(pedido);
    }
}

class ServicoEmailPedido {
    enviarConfirmacao(): void {
        console.log("Enviando e-mail de confirmação para o cliente...");
    }
}

// 4. Interfaces de capacidades do pedido
interface IPedidoPagavel {
    processarPagamento(): void;
}

interface IPedidoFaturavel {
    gerarNotaFiscal(): void;
}

interface IPedidoComEntregaFisica {
    calcularFrete(calculadoraFrete: CalculadoraFretePedido): number;
    imprimirEtiquetaFisica(): void;
}

// 5. Servicos que dependem apenas das interfaces necessarias
class ServicoPagamentoPedido {
    processar(pedido: IPedidoPagavel): void {
        pedido.processarPagamento();
    }
}

class ServicoFaturamentoPedido {
    emitirNotaFiscal(pedido: IPedidoFaturavel): void {
        pedido.gerarNotaFiscal();
    }
}

class ServicoEntregaFisicaPedido {
    prepararEntrega(pedido: IPedidoComEntregaFisica): void {
        const frete = pedido.calcularFrete(new CalculadoraFretePedido());
        console.log(`Frete calculado: R$ ${frete}`);
        pedido.imprimirEtiquetaFisica();
    }
}

// 6. Classe principal de Pedido
class Pedido {
    public valorTotal: number;
    public politicaDesconto: IPoliticaDesconto;

    constructor(valorTotal: number, politicaDesconto: IPoliticaDesconto = new SemDesconto()) {
        this.valorTotal = valorTotal;
        this.politicaDesconto = politicaDesconto;
    }
}

// 7. Implementação para produtos digitais
class PedidoProdutoDigital extends Pedido implements IPedidoPagavel, IPedidoFaturavel {
    processarPagamento(): void {
        console.log("Pagamento processado online.");
    }

    gerarNotaFiscal(): void {
        console.log("Nota fiscal digital gerada.");
    }
}

// 8. Implementação para produtos físicos
class PedidoProdutoFisico extends Pedido implements IPedidoPagavel, IPedidoFaturavel, IPedidoComEntregaFisica {
    processarPagamento(): void {
        console.log("Pagamento processado.");
    }

    gerarNotaFiscal(): void {
        console.log("Nota fiscal gerada.");
    }

    calcularFrete(calculadoraFrete: CalculadoraFretePedido): number {
        return calculadoraFrete.calcular();
    }

    imprimirEtiquetaFisica(): void {
        console.log("Etiqueta física impressa.");
    }
}

// 9. Exemplo de injecao de dependencia
const bancoDeDados: IBancoDeDados = new BancoDeDadosMySQL();
const repositorioPedido = new RepositorioPedido(bancoDeDados);
const pedidoFisico = new PedidoProdutoFisico(100, new DescontoClientePremium());

repositorioPedido.salvar(pedidoFisico);

/*
Justificativas arquiteturais:

1. SRP: a classe Pedido deixou de concentrar calculo de desconto, frete,
persistencia e envio de e-mail. Essas responsabilidades foram extraidas para
servicos especificos, deixando Pedido focada nos dados centrais do pedido.

2. OCP: as regras de desconto foram movidas para implementacoes da interface
IPoliticaDesconto. Assim, novos tipos de cliente podem ser adicionados criando
novas classes de desconto, sem alterar a CalculadoraDescontoPedido.

3. LSP: PedidoProdutoDigital nao e mais obrigado a implementar operacoes de
entrega fisica que nao se aplicam a ele. Dessa forma, uma classe filha nao
precisa lancar erro para cumprir um contrato inadequado.

4. ISP: a antiga interface generica de tarefas foi dividida em interfaces
menores e coesas: IPedidoPagavel, IPedidoFaturavel e IPedidoComEntregaFisica.
Cada classe implementa apenas as capacidades que realmente possui.

5. DIP: RepositorioPedido depende da abstracao IBancoDeDados, nao de uma classe
concreta como BancoDeDadosMySQL. A implementacao do banco e injetada no
construtor, facilitando troca de tecnologia e testes com BancoDeDadosEmMemoria.
*/
