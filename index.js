let newData = []

let filterByTitleValue = ''

const input = document.getElementById('searchName')
const tbody = document.getElementById('tbody')
const select = document.getElementById('sortBy')
let sortField = ''
let sortDirection = false

Array.from(document.getElementsByClassName('sortByButton')).forEach((sortFieldEl) => {
  const field = sortFieldEl.value
  sortFieldEl.addEventListener('click', (e) => {
    if (sortField === field) {
      sortDirection = !sortDirection
    }
    sortField = field
    sortTable()
  })
})

select.addEventListener('change', sortTable)
input.addEventListener('keyup', (e) => {
  filterByTitleValue = e.target.value.toLocaleUpperCase()
  filteringTable()
})

fetch('fbi.json')
  .then((response) => {
    return response.json()
  })
  .then((data) => {
    newData = data.items
    fillTable(newData)
    fillStatistic(newData)
  })

let fillTable = (newData) => {
  tbody.innerHTML = ''
  newData.forEach(item => {
    let tr = document.createElement('tr')
    tr.innerHTML = ` 
        <td id="name">${item.title}</td>
        <td>${item.sex ? item.sex : 'na'}</td>
        <td>${item.nationality ? item.nationality : 'na'}</td>
        <td>${item.race ? item.race : 'na'}</td>
        <td>${item.status ? item.status : 'na'}</td>
        <td>
            <img src=${item.images[0].original ? item.images[0].original : 'https://www.fbi.gov/wanted/seeking-info/royce-perry-sr/@@images/image/large'
    }>
        </td>`
    tbody.appendChild(tr)
  })
}

let fillStatistic = (newData) => {
  const qtyCaptured = newData
    .filter(item => item.status === 'captured')
    .length

  const qtyFemale = newData
    .filter(item => item.sex === 'Female')
    .length

  const qtyByNationality = newData
    .reduce((total, item) => {
      total[item.nationality] = total[item.nationality] ? total[item.nationality]++ : 1
      return total
    }, {})
  const qtyByNationalityAsText = Object.entries(qtyByNationality)
    .map(([k, v]) => k.padEnd(25) + ':' + v)
    .join('\n')

  const statistics = document.getElementById('statistics')
  statistics.innerText = `
  Total captured: ${qtyCaptured}
  Total female: ${qtyFemale}
  ${qtyByNationalityAsText}`
}

function sortTable () {
  // let sortField = select.options[select.selectedIndex].value
  const dir = sortDirection ? 1 : -1
  newData.sort(({[sortField]: aField}, {[sortField]: bField}) => {
    const a = aField || ''
    const b = bField || ''
    if (a > b) {
      return dir
    } else if (a < b) {
      return -dir
    } else if (a === b) {
      return 0
    }
  })
  fillTable(newData)
}

function filteringTable () {
  fillTable(newData.filter((item) => {
    if (filterByTitleValue) {
      return item.title.toLocaleUpperCase().includes(filterByTitleValue)
    }
    return true
  }))
}
