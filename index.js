let itemsStore = []

let filterByTitleValue = ''
let filterByNationalityValue = ''

const filterByTitleInput = document.getElementById('searchName')
const filterByNationalitySelect = document.getElementById('searchNationality')
const tbody = document.getElementById('tbody')
let sortField = ''
let sortDirection = false

Array.from(document.getElementsByClassName('sortByButton')).forEach((sortFieldEl) => {
  const field = sortFieldEl.value
  sortFieldEl.addEventListener('click', (e) => {
    if (sortField === field) {
      sortDirection = !sortDirection
    }
    sortField = field
    draw()
  })
})

filterByTitleInput.addEventListener('keyup', (e) => {
  filterByTitleValue = e.target.value.toLocaleUpperCase()
  draw()
})

filterByNationalitySelect.addEventListener('change', (e) => {
  filterByNationalityValue = e.target.value
  draw()
})

let fillTable = (items) => {
  tbody.innerHTML = ''
  items.forEach(item => {
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

let fillStatistic = (items) => {
  const qtyCaptured = items
    .filter(item => item.status === 'captured')
    .length

  const qtyFemale = items
    .filter(item => item.sex === 'Female')
    .length

  const qtyByNationality = items
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
  const dir = sortDirection ? 1 : -1
  itemsStore.sort(({[sortField]: aField}, {[sortField]: bField}) => {
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
}

function filteringTable () {
  fillTable(itemsStore.filter((item) => {
    let status = true
    if (filterByTitleValue) {
      status = item.title.toLocaleUpperCase().includes(filterByTitleValue)
    }
    if (filterByNationalityValue) {
      status &&= item.nationality === filterByNationalityValue
    }
    return status
  }))
}

function fillOptions (items) {
  const byNationality = items
    .reduce((total, item) => {
      if (item.nationality) {
        total[item.nationality] = item.nationality
      }
      return total
    }, {'': ''})
  filterByNationalitySelect.innerHTML = Object.keys(byNationality)
    .map((k) => `<option value="${k}">${k}</option>`)
    .join('\n')
}

function draw() {
  sortTable()
  filteringTable()
}

fetch('fbi.json')
  .then((response) => {
    return response.json()
  })
  .then((data) => {
    itemsStore = data.items
    fillOptions(itemsStore)
    fillStatistic(itemsStore)
    draw()
  })
