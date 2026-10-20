import { CupomDesconto } from "./CupomDesconto";

class Item {
  constructor(
    public readonly descricao: string,
    public readonly precoUnitario: number,
    public readonly quantidade: number
  ) {
    if (quantidade <= 0 || !Number.isInteger(quantidade)) {
      throw new Error("A quantidade é invalida, tente novamente");
    }
  }
}



class PercentualDesconto implements CupomDesconto {
  constructor(private percentual: number) {
    if(percentual >15){
        throw new Error("Desconto maximo permitido de 10%")
    }
  }
  

  aplicar(total: number): number {
    const desconto = total * (this.percentual / 100);
    return Math.max(0, total - desconto);
  }
}

class CupomValorFixo implements CupomDesconto {
  constructor(private valor: number) {}
  
  aplicar(total: number): number {
    return Math.max(0, total - this.valor);
  }
}

class Carrinho {
  private itens: Item[] = [];
  private finalizado: boolean = false;

  adicionarItem(item: Item): void {
    if (this.finalizado) {
      throw new Error("Alteração não permitida, o carrinho já foi finalizado");
    }
    this.itens.push(item);
  }

  finalizar(): void {
    this.finalizado = true;
  }

  total(cupom?: CupomDesconto): number {
    let subtotal = this.itens.reduce(
      (soma, item) => soma + item.precoUnitario * item.quantidade,
      0
    );

    if (cupom) {
      subtotal = cupom.aplicar(subtotal);
    }
    return Math.max(0, subtotal);
  }

  getItens(): ReadonlyArray<Item> {
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
} catch (e: any) {
  console.log("Erro capturado com sucesso (Qtde 0):", e.message);
}

// 4. Adicionar item após finalizar() -> adicionar item deve lançar Erro
carrinho.finalizar();
try {
  carrinho.adicionarItem(new Item("Caneta", 5, 1));
} catch (e: any) {
  console.log("Erro capturado com sucesso (Carrinho finalizado):", e.message);
}
try {
  const cupomInvalido = new PercentualDesconto(20);
} catch (e: any) {
  console.log("Erro capturado com sucesso (Desconto acima de 15%):", e.message);
}
// 5. Cupom de valor fixo de 150 sobre total de 100 -> total() = 0 (nunca negativo)
const carrinhoPesado = new Carrinho();
carrinhoPesado.adicionarItem(new Item("Mouse Gamer", 100, 1));
const cupom150 = new CupomValorFixo(150);
console.log("Total com cupom fixo de 150:", carrinhoPesado.total(cupom150)); // Esperado: 0