class Item {
    descricao;
    precoUnitario;
    quantidade;
    constructor(descricao, precoUnitario, quantidade) {
        this.descricao = descricao;
        this.precoUnitario = precoUnitario;
        this.quantidade = quantidade;
        if (quantidade <= 0 || !Number.isInteger(quantidade)) {
            throw new Error("A quantidade é invalida, tente novamente");
        }
    }
}
class PercentualDesconto {
    percentual;
    constructor(percentual) {
        this.percentual = percentual;
        if (percentual > 15) {
            throw new Error("Desconto maximo permitido de 10%");
        }
    }
    aplicar(total) {
        const desconto = total * (this.percentual / 100);
        return Math.max(0, total - desconto);
    }
}
class CupomValorFixo {
    valor;
    constructor(valor) {
        this.valor = valor;
    }
    aplicar(total) {
        return Math.max(0, total - this.valor);
    }
}
class Carrinho {
    itens = [];
    finalizado = false;
    adicionarItem(item) {
        if (this.finalizado) {
            throw new Error("Alteração não permitida, o carrinho já foi finalizado");
        }
        this.itens.push(item);
    }
    finalizar() {
        this.finalizado = true;
    }
    total(cupom) {
        let subtotal = this.itens.reduce((soma, item) => soma + item.precoUnitario * item.quantidade, 0);
        if (cupom) {
            subtotal = cupom.aplicar(subtotal);
        }
        return Math.max(0, subtotal);
    }
    getItens() {
        return [...this.itens];
    }
}
// --- CASOS DE TESTE ---
// 1. Item "Livro", preço 50, quantidade 2 -> total() = 100
const carrinho = new Carrinho();
carrinho.adicionarItem(new Item("Livro", 50, 2));
console.log("Total inicial:", carrinho.total()); // Esperado: 100
// 2. Mesmo carrinho com cupom de 10% -> total() após aplicar = 90
const cupom10Porcento = new PercentualDesconto(10);
console.log("Total com 10% de desconto:", carrinho.total(cupom10Porcento)); // Esperado: 90
// 3. Item com quantidade 0 -> adicionar item deve lançar Erro
try {
    carrinho.adicionarItem(new Item("Caderno", 20, 0));
}
catch (e) {
    console.log("Erro capturado com sucesso (Qtde 0):", e.message);
}
// 4. Adicionar item após finalizar() -> adicionar item deve lançar Erro
carrinho.finalizar();
try {
    carrinho.adicionarItem(new Item("Caneta", 5, 1));
}
catch (e) {
    console.log("Erro capturado com sucesso (Carrinho finalizado):", e.message);
}
try {
    const cupomInvalido = new PercentualDesconto(20);
}
catch (e) {
    console.log("Erro capturado com sucesso (Desconto acima de 15%):", e.message);
}
// 5. Cupom de valor fixo de 150 sobre total de 100 -> total() = 0 (nunca negativo)
const carrinhoPesado = new Carrinho();
carrinhoPesado.adicionarItem(new Item("Mouse Gamer", 100, 1));
const cupom150 = new CupomValorFixo(150);
console.log("Total com cupom fixo de 150:", carrinhoPesado.total(cupom150)); // Esperado: 0
export {};
