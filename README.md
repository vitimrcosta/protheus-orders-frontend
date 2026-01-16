# Painel de Pedidos de Vendas

## 📋 Descrição
Página dinâmica para gerenciar e visualizar pedidos de vendas importados de arquivos CSV, com filtros, paginação e layout responsivo.

## 🚀 Início Rápido

### Pré-requisitos
- Git instalado ([Download](https://git-scm.com/))
- Navegador moderno (Chrome, Firefox, Safari, Edge)

### Clonar e Executar

```bash
# 1. Clone o repositório
git clone https://github.com/vitimrcosta/protheus-orders-frontend.git

# 2. Navegue até a pasta do projeto
cd protheus-orders-frontend

# 3. Abra no navegador
# Opção A: Clique duplo em code.html
# Opção B: Use um servidor local (recomendado para melhor compatibilidade)

# Servidor local com Python 3:
python -m http.server 8000

# Servidor local com Node.js (live-server):
npx live-server

# Ou simplesmente arraste o arquivo code.html para seu navegador
```

Depois, acesse `http://localhost:8000` ou abra o arquivo `code.html` diretamente no seu navegador.

## ✨ Funcionalidades

### Importar CSV
- Clique no botão **"Importar CSV"** para selecionar um arquivo
- O arquivo deve conter as seguintes colunas:
  - **C6_NUM**: Número do pedido
  - **C6_CLIENTE**: Nome do cliente
  - **C6_ENTREG**: Data de embarque
  - **Valor Total** (opcional): Valor total ou colunas Qtd e Preço para calcular

### Filtrar por Cliente
- Use a barra de busca para filtrar pedidos por cliente
- A busca é em tempo real e não diferencia maiúsculas/minúsculas
- Deixe em branco para ver todos os pedidos

### Ordenação
- Os pedidos são automaticamente ordenados por **Valor Total** em ordem decrescente
- Os maiores pedidos aparecem primeiro

### Paginação
- Visualize 5 pedidos por página
- Use os botões de navegação ou clique nos números das páginas
- Indicador mostra "Mostrando X a Y de Z resultados"

### Exportar Dados
- Clique em **"Exportar Dados"** para baixar os pedidos em formato CSV
- Útil para análise em outras ferramentas

## 📁 Formato do CSV

### Exemplo básico:
```csv
C6_NUM,C6_CLIENTE,C6_ENTREG,Valor Total
ORD-001,Empresa A,01/01/2024,5000.00
ORD-002,Empresa B,02/01/2024,3500.00
```

### Com cálculo de valor (Qtd × Preço):
```csv
C6_NUM,C6_CLIENTE,C6_ENTREG,Qtd,Preço
ORD-001,Empresa A,01/01/2024,100,50.00
ORD-002,Empresa B,02/01/2024,70,50.00
```

## 🎨 Características de Design

- ✅ **Layout Responsivo**: Adapta-se a dispositivos móveis, tablets e desktops
- ✅ **Tema Claro/Escuro**: Suporte a modo noturno
- ✅ **Interface Intuitiva**: Botões e ícones claros
- ✅ **Validação de Dados**: Verifica se o CSV tem as colunas necessárias

## 🌐 Linguagem
- Interface totalmente em **Português Brasil**
- Datas no formato DD/MM/YYYY
- Valores em Real (R$)

## 📊 Estatísticas
- **Importações Bem-Sucedidas**: Número de arquivos importados
- **Total de Registros**: Quantidade de pedidos carregados
- **Pendente de Revisão**: Contador personalizável

## 🚀 Como Usar

1. Abra o arquivo `code.html` no navegador
2. Clique em **"Importar CSV"**
3. Selecione seu arquivo CSV
4. Os dados aparecem na tabela automaticamente
5. Use a barra de busca para filtrar por cliente
6. Navegue pelas páginas conforme necessário
7. Exporte os dados quando necessário

## 💡 Dicas

- Certifique-se de que os nomes das colunas no CSV estejam corretos (C6_NUM, C6_CLIENTE, C6_ENTREG)
- As datas podem estar em formato DD/MM/YYYY ou YYYY-MM-DD
- Se houver colunas "Qtd" e "Preço", o valor total será calculado automaticamente
- A barra de pesquisa busca por correspondência parcial no nome do cliente

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **Tailwind CSS**: Estilização responsiva
- **JavaScript Vanilla**: Funcionalidades dinâmicas
- **Material Symbols**: Ícones

## 📝 Notas

- Todos os dados são processados localmente no navegador (sem envio a servidores)
- Suportado em navegadores modernos (Chrome, Firefox, Safari, Edge)
- Funciona offline após carregamento da página

## 📦 Estrutura do Projeto

```
protheus-orders-frontend/
├── code.html              # Arquivo principal (abra no navegador)
├── app.js                 # Lógica JavaScript
├── README.md              # Este arquivo
├── .gitignore             # Arquivo de exclusão Git
├── DOCUMENTACAO_COMPLETA.md  # Documentação técnica completa
├── exemplo_pedidos.csv    # Arquivo CSV de exemplo
└── exemplo_pedidos_2.csv  # Outro exemplo
```

## 🤝 Contribuindo

Para reportar issues ou sugerir melhorias:
1. Abra uma [Issue](https://github.com/vitimrcosta/protheus-orders-frontend/issues)
2. Fork o projeto
3. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
4. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
5. Push para a branch (`git push origin feature/AmazingFeature`)
6. Abra um Pull Request

## 📄 Licença

Este projeto está disponível para uso livre.

## 👤 Autor

**Vitimrcosta**
- GitHub: [@vitimrcosta](https://github.com/vitimrcosta)
