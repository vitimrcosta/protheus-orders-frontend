# 📊 Painel de Pedidos de Vendas - Documentação Completa

## 📖 Índice
1. [Guia do Usuário](#guia-do-usuário)
2. [Fluxo Técnico](#fluxo-técnico)
3. [Estrutura de Arquivos](#estrutura-de-arquivos)
4. [Formato de Dados](#formato-de-dados)

---

## 🎯 Guia do Usuário

### O que é o Painel de Pedidos?

O **Painel de Pedidos de Vendas** é uma aplicação web que permite:
- ✅ Importar dados de pedidos via arquivo CSV
- ✅ Visualizar pedidos em uma tabela organizada
- ✅ Filtrar pedidos por cliente
- ✅ Ordenar pedidos por valor total
- ✅ Navegar entre páginas de resultados

---

### 🚀 Passo a Passo: Como Usar

#### **1. Abrir a Aplicação**
```
1. Abra o arquivo code.html no seu navegador
   (Chrome, Firefox, Safari, Edge - versões recentes)
2. Você verá a interface do Painel de Pedidos
```

#### **2. Importar um Arquivo CSV**
```
1. Clique no botão azul "Importar CSV" no topo direito
2. Selecione um arquivo .csv do seu computador
3. Aguarde a mensagem de sucesso: "X pedidos importados com sucesso!"
```

**Exemplo de arquivos disponíveis:**
- `exemplo_pedidos.csv` - 10 pedidos
- `exemplo_pedidos_2.csv` - 15 pedidos

#### **3. Visualizar Pedidos**
A tabela exibe:
- **Nº Pedido** - Identificador do pedido
- **Cliente** - Nome da empresa cliente
- **Data Embarque** - Data em formato DD/MM/YYYY
- **Valor Total** - Valor em R$ (Real Brasileiro)

Exemplo de visualização:
```
┌─────────────┬──────────────────────┬───────────────┬──────────────┐
│ Nº Pedido   │ Cliente              │ Data Embarque │ Valor Total  │
├─────────────┼──────────────────────┼───────────────┼──────────────┤
│ ORD-28491   │ Global Industries    │ 24/10/2023    │ R$ 145.280,00│
│ ORD-28440   │ Global Industries    │ 17/10/2023    │ R$ 100.000,00│
└─────────────┴──────────────────────┴───────────────┴──────────────┘
```

#### **4. Filtrar por Cliente**
```
1. Localize a barra de busca "Buscar por cliente..."
2. Digite o nome (ou parte dele) do cliente desejado
3. A tabela atualiza automaticamente mostrando apenas esse cliente
4. Para ver todos novamente, limpe o campo de busca
```

**Exemplos de busca:**
- Digite "Global" → mostra todos os pedidos de "Global Industries Ltd."
- Digite "Tech" → mostra pedidos de "Tech Solutions Inc."
- Digite "" (vazio) → mostra todos os pedidos

#### **5. Ordenar por Valor Total**
```
1. Clique no header "Valor Total" (coluna direita)
2. Primeira clique: Ordena DESCENDENTE (↓) - maiores para menores
3. Segunda clique: Ordena ASCENDENTE (↑) - menores para maiores
4. O ícone e label mudam para indicar a direção
```

**Indicadores visuais:**
- ↓ arrow_downward = Ordenação descendente (padrão)
- ↑ arrow_upward = Ordenação ascendente

#### **6. Navegar entre Páginas**
```
Mostrando 5 pedidos por página:

1. Use os botões < e > para ir para página anterior/próxima
2. Clique nos números de página (1, 2, 3...)
3. O painel mostra "Mostrando X a Y de Z resultados"
```

**Exemplo de paginação:**
```
Mostrando 1 a 5 de 42 resultados

[<] [1] [2] [3] [...] [12] [>]
```

#### **7. Ver Estatísticas**
Na parte inferior, aparecem 3 cards com dados:
- **Importações Bem-Sucedidas**: Número de arquivos importados (sempre 1)
- **Total de Registros**: Quantidade de pedidos carregados
- **Pendente de Revisão**: Indicador adicional (0)

---

## 🏗️ Fluxo Técnico

### Arquitetura da Aplicação

```
┌─────────────────────────────────────────────────────────────┐
│                      NAVEGADOR WEB                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐          ┌──────────────┐                │
│  │  code.html   │◄────────►│   app.js     │                │
│  │   (UI/DOM)   │          │ (Lógica App) │                │
│  └──────────────┘          └──────────────┘                │
│         ▲                          ▲                         │
│         │                          │                         │
│    HTML/CSS                   JavaScript                    │
│    Tailwind                   Estado & Funções              │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                   Local Storage (Dados)                      │
│  allOrders[], filteredOrders[], currentPage, currentSort    │
└─────────────────────────────────────────────────────────────┘
```

### Fluxo de Dados Detalhado

#### **1. Inicialização (Page Load)**

```javascript
DOMContentLoaded
    ↓
[app.js]
    ├─ Aguarda elemento da página carregar
    ├─ Obtém referências aos elementos DOM
    ├─ Anexa event listeners aos botões
    └─ Inicializa stats (mostra 0 registros)
```

#### **2. Importação de CSV**

```
Usuário clica "Importar CSV"
    ↓
csvImportBtn → evento click
    ↓
csvFileInput.click() → abre file picker
    ↓
Usuário seleciona arquivo .csv
    ↓
handleCSVImport() é acionado
    ↓
FileReader.readAsText()
    ├─ Lê o conteúdo do arquivo
    ├─ Separa por linhas (split '\n')
    ├─ Extrai headers da primeira linha
    └─ Cria mapa de índices de colunas
         ↓
Valida se CSV tem colunas obrigatórias
    ├─ c6_num ✓
    ├─ c6_cliente ✓
    └─ c6_entreg ✓
         ↓
Se válido: Processa cada linha
    ├─ Extrai: numPedido, cliente, dataEmbarque
    ├─ Calcula valorTotal:
    │  ├─ Se tem coluna "Valor/Total": usa esse valor
    │  └─ Se não: Qtd × Preço
    ├─ Trata decimais (vírgula e ponto)
    └─ Cria objeto order
         ↓
Armazena em allOrders[]
    ├─ Ordena por valorTotal DESC
    ├─ Copia para filteredOrders[]
    ├─ Reseta currentPage = 1
    └─ Renderiza tabela
         ↓
Exibe mensagem: "X pedidos importados!"
```

**Exemplo de Objeto Order:**
```javascript
{
  numPedido: "ORD-28491",
  cliente: "Global Industries Ltd.",
  dataEmbarque: "24/10/2023",
  valorTotal: 145280.00
}
```

#### **3. Busca/Filtro por Cliente**

```
Usuário digita na barra de busca
    ↓
searchInput → evento input (a cada tecla)
    ↓
handleSearch() é acionado
    ↓
Extrai termo de busca
    ├─ Converte para minúsculas
    ├─ Remove espaços extras (.trim())
    └─ Armazena em searchTerm
         ↓
Se searchTerm vazio:
    └─ filteredOrders = cópia completa de allOrders
         ↓
Se searchTerm preenchido:
    ├─ Filtra allOrders
    ├─ Compara: order.cliente.includes(searchTerm)
    └─ Cria novo array filteredOrders
         ↓
Reseta para página 1
    ├─ currentPage = 1
    ├─ renderTable()
    └─ renderPagination()
         ↓
Tabela atualiza em tempo real
```

**Exemplo:**
```
Busca: "tech"
    ↓
Encontra:
  - "Tech Solutions Inc." ✓
  - "Premium Logistics" ✗ (não contém "tech")
```

#### **4. Ordenação**

```
Usuário clica no header "Valor Total"
    ↓
sortHeader → evento click
    ↓
toggleSort() é acionado
    ↓
Verifica direção atual
    ├─ Se desc: muda para asc
    ├─ Se asc: muda para desc
    └─ Armazena em currentSort
         ↓
sortOrders(field, direction)
    ├─ Compara valores de dois pedidos
    ├─ Aplica lógica:
    │  ├─ DESC: b.valorTotal - a.valorTotal (maior primeiro)
    │  └─ ASC: a.valorTotal - b.valorTotal (menor primeiro)
    └─ Ordena allOrders[]
         ↓
Copia para filteredOrders[]
    ├─ Reseta currentPage = 1
    ├─ updateSortHeader() (muda ícone ↑/↓)
    ├─ renderTable()
    └─ renderPagination()
         ↓
Tabela se reorganiza
```

**Lógica de Ordenação:**
```javascript
// Descendente (maior para menor)
allOrders.sort((a, b) => b.valorTotal - a.valorTotal)

// Ascendente (menor para maior)
allOrders.sort((a, b) => a.valorTotal - b.valorTotal)
```

#### **5. Paginação**

```
renderTable()
    ├─ Calcula índices:
    │  ├─ startIndex = (currentPage - 1) × 5
    │  └─ endIndex = startIndex + 5
    │
    ├─ Extrai slice da página:
    │  └─ pageOrders = filteredOrders.slice(start, end)
    │
    └─ Renderiza apenas 5 itens
         ↓
renderPagination()
    ├─ totalPages = Math.ceil(filteredOrders.length / 5)
    ├─ Cria botões [1] [2] [3] ... [12]
    └─ currentPage é destacado (botão azul)
         ↓
Usuário clica página
    ↓
goToPage(page)
    ├─ Valida: page >= 1 && page <= totalPages
    ├─ currentPage = page
    ├─ renderTable() (nova página)
    ├─ renderPagination() (atualiza destaque)
    └─ window.scrollTo({top: 0}) (volta ao topo)
```

**Cálculo de Paginação:**
```
Total: 42 pedidos, 5 por página

Página 1: índices 0-4 (pedidos 1-5)
Página 2: índices 5-9 (pedidos 6-10)
Página 3: índices 10-14 (pedidos 11-15)
...
Página 9: índices 40-41 (pedidos 41-42)
Total: 9 páginas
```

#### **6. Renderização da Tabela**

```
renderTable()
    ├─ Limpa tbody (tableBody.innerHTML = '')
    │
    ├─ Se filteredOrders.length === 0:
    │  └─ Exibe mensagem "Nenhum pedido encontrado"
    │
    └─ Se tem pedidos:
        ├─ Para cada pedido na página:
        │  ├─ Cria <tr> (linha)
        │  ├─ Formata data: formatDate()
        │  ├─ Formata valor: formatCurrency()
        │  ├─ Escapa HTML: escapeHtml()
        │  └─ Insere na tabela
        │
        ├─ updateStats()
        │  ├─ Atualiza "Mostrando X a Y de Z"
        │  ├─ Atualiza cards de estatísticas
        │  └─ updatePaginationButtons() (ativa/desativa <, >)
```

---

### Estado Interno da Aplicação

```javascript
// Dados
let allOrders = [];           // Todos os pedidos importados
let filteredOrders = [];      // Pedidos após filtro

// Paginação
let currentPage = 1;          // Página atual
const itemsPerPage = 5;       // Items por página

// Ordenação
let currentSort = {
  field: 'valorTotal',        // Campo para ordenar
  direction: 'desc'           // 'desc' ou 'asc'
};
```

---

### Funções Principais

#### **handleCSVImport(event)**
- Lê arquivo CSV
- Valida estrutura
- Extrai dados
- Calcula valores

#### **handleSearch(event)**
- Filtra por cliente
- Atualiza filteredOrders
- Reseta paginação

#### **toggleSort()**
- Alterna direção (asc ↔ desc)
- Reordena dados
- Atualiza ícone visual

#### **renderTable()**
- Limpa tabela
- Renderiza página atual
- Atualiza estatísticas

#### **renderPagination()**
- Cria botões de página
- Destaca página atual
- Adiciona eventos de clique

#### **Funções Auxiliares**
- `formatCurrency()` - Formata valores em BRL
- `formatDate()` - Converte datas para DD/MM/YYYY
- `escapeHtml()` - Previne XSS

---

## 📁 Estrutura de Arquivos

```
Teste1/
├── code.html                    # Interface HTML (UI)
├── app.js                       # Lógica da aplicação (JavaScript)
├── exemplo_pedidos.csv          # Dados de exemplo 1
├── exemplo_pedidos_2.csv        # Dados de exemplo 2
└── README.md                    # Esta documentação
```

### Responsabilidades

| Arquivo | Responsabilidade |
|---------|------------------|
| `code.html` | Estrutura HTML, estilos Tailwind CSS, elementos DOM |
| `app.js` | Lógica de negócio, manipulação de dados, eventos |
| `exemplo_pedidos.csv` | Dados de teste (10 pedidos) |
| `exemplo_pedidos_2.csv` | Dados de teste (15 pedidos) |

---

## 📋 Formato de Dados

### Colunas Obrigatórias do CSV

```csv
C6_NUM,C6_CLIENTE,C6_ENTREG,Qtd,Preço
```

| Coluna | Descrição | Exemplo | Obrigatória |
|--------|-----------|---------|------------|
| **C6_NUM** | Número do pedido | ORD-28491 | ✓ Sim |
| **C6_CLIENTE** | Nome do cliente | Global Industries Ltd. | ✓ Sim |
| **C6_ENTREG** | Data de embarque | 24/10/2023 | ✓ Sim |
| **Qtd** | Quantidade | 100 | Parcial* |
| **Preço** | Preço unitário | 1452.80 | Parcial* |
| **Valor Total** | Valor total (alternativa) | 145280.00 | Parcial* |

*Nota: Ou tem "Qtd + Preço" ou tem "Valor Total"

### Formatos Aceitos

#### **Datas**
- ✓ `24/10/2023` (DD/MM/YYYY)
- ✓ `2023-10-24` (YYYY-MM-DD)
- ✓ `10/24/2023` (MM/DD/YYYY)

#### **Valores Numéricos**
- ✓ `1452.80` (ponto decimal)
- ✓ `1452,80` (vírgula decimal)
- ✓ `145280` (inteiro)

### Exemplo Completo

```csv
C6_NUM,C6_CLIENTE,C6_ENTREG,Qtd,Preço
ORD-28491,Global Industries Ltd.,24/10/2023,100,1452.80
ORD-28485,Tech Solutions Inc.,22/10/2023,85,1087.65
ORD-28472,Acme Corporation,20/10/2023,120,651.00
```

---

## 🔄 Fluxo Completo de Uso

### Cenário: Filtrar e Ordenar Pedidos de um Cliente

```
1. ABRIR
   └─ Página carregada, tabela vazia

2. IMPORTAR
   └─ Importa exemplo_pedidos.csv
      └─ 10 pedidos carregados
      └─ Ordenados por valor DESC

3. BUSCAR
   └─ Digita "Global" na barra
   └─ Filtra 2 pedidos de Global Industries

4. ORDENAR
   └─ Clica em "Valor Total"
   └─ Alterna para ASC (menor para maior)
   └─ Mostra: ORD-28440 (100k) depois ORD-28491 (145k)

5. PAGINAR
   └─ Página 1 de 1 (apenas 2 pedidos, cabe em 1 página)

6. RESULTADO
   ├─ Vê 2 pedidos ordenados
   └─ Cards mostram: 1 importação, 10 registros totais
```

---

## 💡 Pontos Técnicos Importantes

### Estado Reativo
- Dados em memória (não persiste ao recarregar)
- Cada ação atualiza o DOM imediatamente
- Sem framework (vanilla JavaScript)

### Segurança
- `escapeHtml()` previne injeção XSS
- Validação de estrutura CSV
- Sem comunicação com servidor (tudo local)

### Performance
- Paginação: Renderiza apenas 5 itens por vez
- Filtro: Usa `array.filter()` nativo
- Ordenação: Usa `array.sort()` nativo

### Compatibilidade
- Navegadores modernos (ES6+)
- FileReader API para ler arquivos
- Intl API para formatação de datas/moedas

---

## 🎨 Tema e Interface

### Componentes Visuais

- **Header Sticky**: Fica no topo ao rolar
- **Cards de Estatísticas**: Mostram KPIs
- **Tabela Responsiva**: Adapta em móbile
- **Tema Claro/Escuro**: Suportado via `dark:` classes Tailwind
- **Ícones**: Material Symbols (Google Icons)

### Cores

- **Primária**: `#137fec` (Azul)
- **Fundo Claro**: `#f6f7f8` (Cinza muito claro)
- **Fundo Escuro**: `#101922` (Azul escuro)

---

## 📞 Troubleshooting

### Problema: Valores aparecem como 0

**Causa**: Colunas não encontradas ou formato incorreto
**Solução**: 
- Verifique nome das colunas (case-insensitive, mas deve conter "qtd", "preço", "valor", etc)
- Verifique formato decimal (use ponto ou vírgula)

### Problema: Data mostra como "Invalid Date"

**Causa**: Formato de data não reconhecido
**Solução**:
- Use DD/MM/YYYY ou YYYY-MM-DD
- Não use outro separador

### Problema: Filtro não encontra cliente

**Causa**: Busca case-sensitive ou espaços extras
**Solução**:
- Busca é case-insensitive, mas precisa de correspondência exata
- Tente buscar parte do nome

---

## 📝 Resumo Executivo

| Aspecto | Detalhe |
|---------|---------|
| **Tipo** | Aplicação Web SPA (Single Page Application) |
| **Stack** | HTML5 + CSS (Tailwind) + JavaScript Vanilla |
| **Dados** | CSV (importado localmente) |
| **Funcionalidades** | Import, Filter, Sort, Paginate |
| **Usuários** | Gestores de vendas, analistas |
| **Idioma** | Português Brasil |
| **Persistência** | Memória (dados perdem ao recarregar) |
| **Servidor** | Não necessário (roda no navegador) |

---

**Última atualização**: 15 de Janeiro de 2026
