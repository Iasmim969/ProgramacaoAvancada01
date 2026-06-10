// 1. Classe de Banco de Dados Concreta
class BancoDeDadosMySQL {
    salvar(dados: any): void {
        console.log("Salvando dados no MySQL...");
    }
}

// 2. Servicos com responsabilidades especificas
class CalculadoraDescontoPedido {
    calcular(pedido: Pedido): number {
        if (pedido.tipoCliente === "VIP") {
            return pedido.valorTotal * 0.20;
        } else if (pedido.tipoCliente === "ESTUDANTE") {
            return pedido.valorTotal * 0.10;
        }

        return 0;
    }
}

class CalculadoraFretePedido {
    calcular(): number {
        return 15.0;
    }
}

class RepositorioPedido {
    constructor(private bancoDeDados: BancoDeDadosMySQL) {}

    salvar(pedido: Pedido): void {
        this.bancoDeDados.salvar(pedido);
    }
}

class ServicoEmailPedido {
    enviarConfirmacao(): void {
        console.log("Enviando e-mail de confirmação para o cliente...");
    }
}

// 3. Interface de tarefas do pedido
interface ITarefasPedido {
    processarPagamento(): void;
    gerarNotaFiscal(): void;
    imprimirEtiquetaFisica(): void;
}

// 4. Classe principal de Pedido
class Pedido {
    public valorTotal: number;
    public tipoCliente: string;

    constructor(valorTotal: number, tipoCliente: string) {
        this.valorTotal = valorTotal;
        this.tipoCliente = tipoCliente;
    }
}

// 5. Implementação para produtos digitais
class PedidoProdutoDigital extends Pedido implements ITarefasPedido {
    processarPagamento(): void {
        console.log("Pagamento processado online.");
    }

    gerarNotaFiscal(): void {
        console.log("Nota fiscal digital gerada.");
    }

    imprimirEtiquetaFisica(): void {
        throw new Error("Erro: Não é possível imprimir etiqueta para produto digital.");
    }
}
