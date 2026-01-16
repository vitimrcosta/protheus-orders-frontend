// Estado da aplicação
let allOrders = [];
let filteredOrders = [];
let currentPage = 1;
const itemsPerPage = 5;
let currentSort = { field: 'valorTotal', direction: 'desc' };

// Elementos DOM
let csvImportBtn;
let csvFileInput;
let searchInput;
let tableBody;
let prevBtn;
let nextBtn;
let paginationNumbers;
let showingStart;
let showingEnd;
let totalRecords;
let sortHeader;

// Inicializar
document.addEventListener('DOMContentLoaded', function () {
  // Obter elementos DOM
  csvImportBtn = document.getElementById('csvImportBtn');
  csvFileInput = document.getElementById('csvFileInput');
  searchInput = document.getElementById('searchInput');
  tableBody = document.getElementById('tableBody');
  prevBtn = document.getElementById('prevBtn');
  nextBtn = document.getElementById('nextBtn');
  paginationNumbers = document.getElementById('paginationNumbers');
  showingStart = document.getElementById('showingStart');
  showingEnd = document.getElementById('showingEnd');
  totalRecords = document.getElementById('totalRecords');
  sortHeader = document.getElementById('sortHeader');

  // Event Listeners
  csvImportBtn.addEventListener('click', () => csvFileInput.click());
  csvFileInput.addEventListener('change', handleCSVImport);
  searchInput.addEventListener('input', handleSearch);
  prevBtn.addEventListener('click', previousPage);
  nextBtn.addEventListener('click', nextPage);
  sortHeader.addEventListener('click', toggleSort);

  // Inicializar stats
  updateStats();
});

// Função para importar CSV
function handleCSVImport(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const csv = e.target.result;
      const lines = csv.split('\n').map(line => line.trim()).filter(line => line);
      
      if (lines.length < 2) {
        alert('CSV vazio ou inválido.');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim());

      // Mapeamento de colunas - melhorado
      const headerMap = {};
      headers.forEach((header, index) => {
        headerMap[header.toLowerCase()] = index;
      });

      console.log('Headers encontrados:', Object.keys(headerMap));

      // Validar se CSV tem as colunas necessárias
      const requiredColumns = ['c6_num', 'c6_cliente', 'c6_entreg'];
      const hasRequiredColumns = requiredColumns.every(col => 
        Object.keys(headerMap).some(key => key.includes(col.toLowerCase()))
      );

      if (!hasRequiredColumns) {
        alert('CSV deve conter as colunas: C6_NUM, C6_CLIENTE, C6_ENTREG');
        return;
      }

      allOrders = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        
        // Encontrar os valores das colunas
        let numPedido = '';
        let cliente = '';
        let dataEmbarque = '';
        let valorTotal = 0;

        // Procurar pelas colunas de valor
        let foundValueColumn = false;

        headers.forEach((header, index) => {
          const lowerHeader = header.toLowerCase();
          const val = values[index] || '';

          if (lowerHeader.includes('c6_num')) {
            numPedido = val;
          } else if (lowerHeader.includes('c6_cliente')) {
            cliente = val;
          } else if (lowerHeader.includes('c6_entreg')) {
            dataEmbarque = val;
          } else if (lowerHeader.includes('valor') || lowerHeader.includes('total')) {
            // Se encontrar coluna de valor/total, usar esse valor
            const numVal = parseFloat(val.replace(',', '.')) || 0;
            valorTotal = numVal;
            foundValueColumn = true;
          }
        });

        // Se não encontrou coluna de valor, procurar por Qtd e Preço
        if (!foundValueColumn) {
          let qtd = 0;
          let preco = 0;

          headers.forEach((header, index) => {
            const lowerHeader = header.toLowerCase();
            const val = values[index] || '';

            if (lowerHeader.includes('qtd') || lowerHeader.includes('quantidade')) {
              qtd = parseFloat(val.replace(',', '.')) || 0;
            } else if (lowerHeader.includes('preço') || lowerHeader.includes('preco') || lowerHeader.includes('price')) {
              preco = parseFloat(val.replace(',', '.')) || 0;
            }
          });

          valorTotal = qtd * preco;
        }

        if (numPedido && cliente) {
          allOrders.push({
            numPedido,
            cliente,
            dataEmbarque,
            valorTotal: parseFloat(valorTotal.toFixed(2))
          });
        }
      }

      console.log('Pedidos importados:', allOrders);

      // Ordenar por valor total decrescente
      sortOrders('valorTotal', 'desc');
      filteredOrders = [...allOrders];
      currentPage = 1;
      updateStats();
      renderTable();
      renderPagination();
      
      // Limpar input
      csvFileInput.value = '';
      alert(`${allOrders.length} pedidos importados com sucesso!`);
    } catch (error) {
      alert('Erro ao processar CSV: ' + error.message);
      console.error(error);
    }
  };
  reader.readAsText(file);
}

// Função para filtrar por cliente
function handleSearch(event) {
  const searchTerm = event.target.value.toLowerCase().trim();
  
  if (searchTerm === '') {
    filteredOrders = [...allOrders];
  } else {
    filteredOrders = allOrders.filter(order =>
      order.cliente.toLowerCase().includes(searchTerm)
    );
  }
  
  currentPage = 1;
  renderTable();
  renderPagination();
}

// Função para alternar ordenação
function toggleSort() {
  if (currentSort.field === 'valorTotal') {
    currentSort.direction = currentSort.direction === 'desc' ? 'asc' : 'desc';
  } else {
    currentSort.field = 'valorTotal';
    currentSort.direction = 'desc';
  }

  sortOrders(currentSort.field, currentSort.direction);
  filteredOrders = [...allOrders];
  currentPage = 1;
  renderTable();
  renderPagination();
  updateSortHeader();
}

// Função para ordenar
function sortOrders(field, direction) {
  allOrders.sort((a, b) => {
    let aVal = a[field];
    let bVal = b[field];

    if (direction === 'desc') {
      return bVal - aVal;
    } else {
      return aVal - bVal;
    }
  });
}

// Atualizar header de ordenação
function updateSortHeader() {
  const icon = sortHeader.querySelector('.material-symbols-outlined');
  const label = sortHeader.querySelector('.text-\\[10px\\]');

  if (currentSort.direction === 'desc') {
    icon.textContent = 'arrow_downward';
    label.textContent = 'Ordenado ↓';
  } else {
    icon.textContent = 'arrow_upward';
    label.textContent = 'Ordenado ↑';
  }
}

// Função para renderizar a tabela
function renderTable() {
  tableBody.innerHTML = '';
  
  if (filteredOrders.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" class="px-6 py-10 text-center text-slate-500">
          Nenhum pedido encontrado. Importe um arquivo CSV para começar.
        </td>
      </tr>
    `;
    updateStats();
    return;
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageOrders = filteredOrders.slice(startIndex, endIndex);

  pageOrders.forEach(order => {
    const row = document.createElement('tr');
    row.className = 'hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors';
    
    const formattedDate = formatDate(order.dataEmbarque);
    const formattedValue = formatCurrency(order.valorTotal);

    row.innerHTML = `
      <td class="px-6 py-5">
        <span class="text-sm font-bold text-slate-900 dark:text-white font-mono">
          ${escapeHtml(order.numPedido)}
        </span>
      </td>
      <td class="px-6 py-5">
        <div class="flex flex-col">
          <span class="text-sm font-semibold text-slate-900 dark:text-white">
            ${escapeHtml(order.cliente)}
          </span>
        </div>
      </td>
      <td class="px-6 py-5">
        <span class="text-sm text-slate-600 dark:text-slate-300">
          ${formattedDate}
        </span>
      </td>
      <td class="px-6 py-5 text-right">
        <span class="text-sm font-black text-primary">
          ${formattedValue}
        </span>
      </td>
    `;
    
    tableBody.appendChild(row);
  });

  updateStats();
  updatePaginationButtons();
}

// Função para atualizar estatísticas
function updateStats() {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredOrders.length);
  
  showingStart.textContent = filteredOrders.length > 0 ? startIndex + 1 : 0;
  showingEnd.textContent = endIndex;
  totalRecords.textContent = filteredOrders.length;
  document.getElementById('totalOrdersCount').textContent = allOrders.length;
  document.getElementById('successfulImports').textContent = allOrders.length > 0 ? 1 : 0;
}

// Função para renderizar paginação
function renderPagination() {
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  paginationNumbers.innerHTML = '';

  if (totalPages <= 1) return;

  for (let i = 1; i <= Math.min(totalPages, 5); i++) {
    const button = document.createElement('button');
    button.className = i === currentPage
      ? 'size-9 flex items-center justify-center rounded-lg bg-primary text-white text-sm font-bold'
      : 'size-9 flex items-center justify-center rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800';
    button.textContent = i;
    button.addEventListener('click', () => goToPage(i));
    paginationNumbers.appendChild(button);
  }

  if (totalPages > 5) {
    const ellipsis = document.createElement('span');
    ellipsis.className = 'px-1 text-slate-400';
    ellipsis.textContent = '...';
    paginationNumbers.appendChild(ellipsis);

    const lastButton = document.createElement('button');
    lastButton.className = 'size-9 flex items-center justify-center rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800';
    lastButton.textContent = totalPages;
    lastButton.addEventListener('click', () => goToPage(totalPages));
    paginationNumbers.appendChild(lastButton);
  }
}

// Funções de paginação
function goToPage(page) {
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderTable();
  renderPagination();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function previousPage() {
  goToPage(currentPage - 1);
}

function nextPage() {
  goToPage(currentPage + 1);
}

function updatePaginationButtons() {
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

// Funções auxiliares
function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

function formatDate(dateString) {
  if (!dateString) return '-';
  
  // Tentar diversos formatos
  let date;
  
  // Formato DD/MM/YYYY
  if (dateString.includes('/')) {
    const [day, month, year] = dateString.split('/');
    date = new Date(year, month - 1, day);
  }
  // Formato YYYY-MM-DD
  else if (dateString.includes('-')) {
    date = new Date(dateString);
  }
  // Outro formato
  else {
    date = new Date(dateString);
  }

  if (isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
