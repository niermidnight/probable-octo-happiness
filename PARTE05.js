const modal = document.querySelector('.modal-container')
const tbody = document.querySelector('tbody')

const editButtons = document.querySelectorAll('.edit-btn')
const deleteButtons = document.querySelectorAll('.delete-btn')

const sNome = document.querySelector('#nome')
const sVersao = document.querySelector('#versao')
const sFinalidade = document.querySelector('#finalidade')
const sInfo = document.querySelector('#info')
const sFunc = document.querySelector('#func')
const sSimAcessaWeb = document.querySelector('#simAcessaWeb')
const sNaoAcessaWeb = document.querySelector('#naoAcessaWeb')
const sSimInfoSigilosa = document.querySelector('#simInfoSigilosa')
const sNaoInfoSigilosa = document.querySelector('#naoInfoSigilosa')
const sQualInfoSigilosa = document.querySelector('#qualInfoSigilosa')
const sAcessaWeb = document.querySelector('input[name="acessaWeb"]:checked') || null
const sInfoSigilosa = document.querySelector('input[name="informacaoSigilosa"]:checked') || null
const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) || []
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens))

const btnSalvar = document.querySelector('#btnsalvar')
const barrapesquisar = document.getElementById('barrapesquisar')
const itemsPerPage = 4

let currentPage = 1
let itensFiltrados = []
let itens = []
let id

function showInitialItems() {
  const tableRows = document.querySelectorAll('#employeeList tbody tr')
  const totalPages = Math.ceil(tableRows.length / itemsPerPage)

  tableRows.forEach((row, index) => {
    if (index < itemsPerPage) {
      row.style.display = 'table-row';
    } else {
      row.style.display = 'none';
    }
  })

  const currentPageElement = document.getElementById('currentPage');
  if (currentPageElement) {
    currentPageElement.textContent = `Página ${currentPage} de ${totalPages}`;
  }
}

function loadItens() {
  itens = getItensBD();
  itensFiltrados = itens;
  renderizarItensFiltrados();
  showInitialItems(); // Mostra os primeiros 5 itens ao carregar
}
loadItens()

function renderizarItensFiltrados() {
  tbody.innerHTML = ''
  itensFiltrados.forEach((item, index) => {
    insertItem(item, index)
  })
}
function filtrarItens(termoPesquisa) {
  termoPesquisa = termoPesquisa.toLowerCase()
  itensFiltrados = itens.filter(item => {
    return (
      item.nome.toLowerCase().includes(termoPesquisa) ||
      item.info.toLowerCase().includes(termoPesquisa) ||
      item.finalidade.toLowerCase().includes(termoPesquisa)
    )
  })
  renderizarItensFiltrados()
}
barrapesquisar.addEventListener('input', () => {
  const termoPesquisa = barrapesquisar.value
  filtrarItens(termoPesquisa)
})

function openmodal(edit = false, index = 0) {
  modal.classList.add('active')
  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active')
    }
  }
  if (edit) {
    sNome.value = itens[index].nome
    sVersao.value = itens[index].versao
    sFinalidade.value = itens[index].finalidade
    sInfo.value = itens[index].info
    sFunc.value = itens[index].func
    sQualInfoSigilosa.value=itens[index].qualInfoSigilosa
    id = index
    if (itens[index].acessaWeb === "Sim") {
      sSimAcessaWeb.checked = true
      sNaoAcessaWeb.checked = false
    } else {
      sSimAcessaWeb.checked = false
      sNaoAcessaWeb.checked = true
    }

    if (itens[index].informacaoSigilosa === "Sim") {
      sSimInfoSigilosa.checked = true
      sNaoInfoSigilosa.checked = false
      mostrarCampoSigiloso()
    } else {
      sSimInfoSigilosa.checked = false
      sNaoInfoSigilosa.checked = true
      ocultarCampoSigiloso()
    }
  } else {
    sNome.value = ''
    sVersao.value = ''
    sFinalidade.value = ''
    sInfo.value = ''
    sFunc.value = ''
    sSimAcessaWeb.checked = false
    sNaoAcessaWeb.checked = false
    sSimInfoSigilosa.checked = false
    sNaoInfoSigilosa.checked = false
    sQualInfoSigilosa.value = ''
  }
}
sSimAcessaWeb.addEventListener('change', () => {
  sNaoAcessaWeb.checked = !sSimAcessaWeb.checked
})
sNaoAcessaWeb.addEventListener('change', () => {
  sSimAcessaWeb.checked = !sNaoAcessaWeb.checked
})
sSimInfoSigilosa.addEventListener('change', () => {
  sNaoInfoSigilosa.checked = !sSimInfoSigilosa.checked
  mostrarCampoSigiloso()
})
sNaoInfoSigilosa.addEventListener('change', () => {
  sSimInfoSigilosa.checked = !sNaoInfoSigilosa.checked
  ocultarCampoSigiloso()
})
function editItem(index) {
  openmodal(true, index)
}
editButtons.forEach((button, index) => {
  button.addEventListener('click', () => openmodal(true, index))
})
deleteButtons.forEach((button, index) => {
  button.addEventListener('click', () => deleteItem(index))
})
function deleteItem(index) {
  if (confirm('Realmente deseja apagar o Conteudo?')) {
    itens.splice(index, 1)
    setItensBD()
    loadItens()
  }
}

function insertItem(item, index) {
  let tr = document.createElement('tr')
  tr.innerHTML = `
    <td>${item.nome}</td>
    <td>${item.versao}</td>
    <td>${item.finalidade}</td>
    <td>${item.info}</td>
    <td>${item.func}</td>
    <td>${item.acessaWeb === "Sim" ? "Sim" : "Não"}</td>
    <td>${item.informacaoSigilosa === "Sim" ? "Sim" : "Não"}</td>
    <td>${item.qualInfoSigilosa}</td>
    <td><button class="edit-btn"><i class='bx bx-edit' ></i></button></td>
    <td><button class="delete-btn"><i class='bx bx-trash'></i></button></td>`
  tbody.appendChild(tr)
  tr.querySelector('.edit-btn').addEventListener('click', () => editItem(index))
  tr.querySelector('.delete-btn').addEventListener('click', () => deleteItem(index))
  updateTable()
}
btnSalvar.onclick = e => {
  if (sNome.value == '' || sVersao.value == '' || sFinalidade.value == '' || sInfo.value == '' || sFunc.value == '') {
    return
  }
  e.preventDefault()
  if (id !== undefined) {
    itens[id].nome = sNome.value
    itens[id].versao = sVersao.value
    itens[id].finalidade = sFinalidade.value
    itens[id].info = sInfo.value
    itens[id].func = sFunc.value
    if (sSimAcessaWeb.checked) {
      itens[id].acessaWeb = "Sim"
    } else if (sNaoAcessaWeb.checked) {
      itens[id].acessaWeb = "Não"
    }
    if (sSimInfoSigilosa.checked) {
      itens[id].informacaoSigilosa = "Sim"
      itens[id].qualInfoSigilosa = sQualInfoSigilosa.value;
    } else if (sNaoInfoSigilosa.checked) {
      itens[id].informacaoSigilosa = "Não"
      itens[id].qualInfoSigilosa = ""
    }
  } 
  else {
    itens.push({
      'nome': sNome.value,
      'versao': sVersao.value,
      'finalidade': sFinalidade.value,
      'info': sInfo.value,
      'func': sFunc.value,
      'acessaWeb': sSimAcessaWeb.checked ? "Sim" : "Não",
      'informacaoSigilosa': sSimInfoSigilosa.checked ? "Sim" : "Não",
      'qualInfoSigilosa': sQualInfoSigilosa.value
    })}
  setItensBD()
  loadItens()
  modal.classList.remove('active')
  id = undefined
}
function loadItens() {
  itens = getItensBD()
  itensFiltrados = itens
  renderizarItensFiltrados()
}
function updateTable() {
  const tableRows = document.querySelectorAll('#employeeList tbody tr')
  const totalPages = Math.ceil(tableRows.length / itemsPerPage)
  tableRows.forEach((row, index) => {
    if (index >= (currentPage - 1) * itemsPerPage && index < currentPage * itemsPerPage) {
      row.style.display = 'table-row'
    } else {
      row.style.display = 'none'
    }
  })
  const currentPageElement = document.getElementById('currentPage')
  if (currentPageElement) {
    currentPageElement.textContent = `Página ${currentPage} de ${totalPages}`
  }
}
document.getElementById('previousPage').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--
    updateTable()
  }
})
document.getElementById('nextPage').addEventListener('click', () => {
  const tableRows = document.querySelectorAll('#employeeList tbody tr')
  const totalPages = Math.ceil(tableRows.length / itemsPerPage)
  if (currentPage < totalPages) {
    currentPage++
    updateTable()
  }
})
document.getElementById("simAcessaWeb").addEventListener("click", function () {
  sAcessaWeb = "Sim"
})
document.getElementById("naoAcessaWeb").addEventListener("click", function () {
  sAcessaWeb = "Não"
})
document.getElementById("simInfoSigilosa").addEventListener("click", function () {
  sInfoSigilosa = "Sim"
  mostrarCampoSigiloso()
})
document.getElementById("naoInfoSigilosa").addEventListener("click", function () {
  sInfoSigilosa = "Não"
  ocultarCampoSigiloso()
})


function addOrUpdateItem() {
  itens[id] = {
    'nome': sNome.value
  }
  if (sNome.value == '') {
    return
  }
  if (id !== undefined) {
    itens[id] = {
      'nome': sNome.value
    }
  } else {
    itens.push({
      'nome': sNome.value
    })
  }

  itens.sort((a,b) => a.nome.localeCompare(b.nome))
  setItensBD()
  loadItens()
  modal.classList.remove('active')
  id = undefined
}
function loadAndSortItens() {
  itens = getItensBD()
  return itens.sort((a,b) => a.nome.localeCompare(b.nome))
}
function loadItens() {
  const sortedItens = loadAndSortItens()
  itensFiltrados = sortedItens
  renderizarItensFiltrados()
}



function exportTableToExcel(employeeList, filename = '') {
  let downloadLink;
  const dataType = 'application/vnd.ms-excel';
  const tableSelect = document.getElementById(employeeList);

  // Clone a tabela para evitar afetar a tabela na página da web
  const tableClone = tableSelect.cloneNode(true);

  // Adicionar estilos para alinhamento, centralização e bordas ao HTML gerado
  const tableRows = tableClone.getElementsByTagName('tr');
  for (let i = 0; i < tableRows.length; i++) {
    const tableCells = tableRows[i].querySelectorAll('th, td');
    for (let j = 0; j < tableCells.length; j++) {
      tableCells[j].style.textAlign = 'center'; // Centralizar horizontalmente
      tableCells[j].style.verticalAlign = 'middle'; // Alinhar verticalmente no meio
      tableCells[j].style.border = '1px solid #000'; // Adicionar borda
      
      // Adicione uma cor cinza ao cabeçalho (se for um elemento 'th')
      if (i === 0) {
        tableCells[j].style.backgroundColor = '#CCCCCC'; // Cor cinza
        tableCells[j].style.fontWeight = 'bold'; // Texto em negrito

        // Defina o tamanho da fonte para cabeçalhos como 14pt
        tableCells[j].style.fontSize = '14pt'; // Tamanho da fonte 14pt
      } else {
        // Defina o tamanho da fonte para células de dados como 12pt
        tableCells[j].style.fontSize = '12pt'; // Tamanho da fonte 12pt
      }
    }
  }

  // Converte a tabela clonada em HTML
  const tableHTML = tableClone.outerHTML.replace(/ /g, '%20');
  
  // Especificar o nome do arquivo
  filename = filename ? filename + '.xls' : 'excel_data.xls';
  
  // Cria o elemento de link de download
  downloadLink = document.createElement("a");
  
  document.body.appendChild(downloadLink);
  
  if (navigator.msSaveOrOpenBlob) {
    var blob = new Blob(['\ufeff', tableHTML], {
        type: dataType
    });
    navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    // Cria um link para o arquivo
    downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
  
    // Define o nome do arquivo
    downloadLink.download = filename;
    
    // Aciona a função
    downloadLink.click();
  }
}


loadAndSortItens()
updateTable()
loadItens()