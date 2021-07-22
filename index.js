let newData = [];
let input = document.getElementById("searchName");
let tbody = document.getElementById("tbody");
let select = document.getElementById("sortBy");
let sortField = select.options[select.selectedIndex].value;

fetch("fbi.json")
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        newData.push(...data.items);
        // console.log(newData);
        // newData.sort((a, b) => a.title < b.title ? - 1 : Number(a.title > b.title));
        // console.log(newData);
        fillTable(newData);
        fillStatistic(newData);
        select.addEventListener("change",  sortTable);
    });

let fillTable = (newData) => {newData.forEach(item => {
    let tr = document.createElement("tr");
    tr.innerHTML = ` 
        <td id="name">${item.title? item.title : "no data"}</td>
        <td>${item.sex ? item.sex : "no data"}</td>
        <td>${item.nationality ? item.nationality : "no data"}</td>
        <td>${item.race ? item.race : "no data"}</td>
        <td>${item.status ? item.status : "no data"}</td>
        <td>
            <img src=${item.images[0].original ? item.images[0].original : "https://www.fbi.gov/wanted/seeking-info/royce-perry-sr/@@images/image/large"
            }>
        </td>`;
    tbody.appendChild(tr);
})};

let fillStatistic = (newData) => {
    const qtyCatured = newData
        .filter(item => item.status === "captured")
        .reduce((total, item) => ++total, 0);  //return NAN without 0 in reduce
        
    const qtyFemale = newData
        .filter(item => item.sex === "Female")
        .reduce((total, item) => ++total, 0);  //return NAN without 0 in reduce

    let captured = document.getElementById("captured");
    let female = document.getElementById("female");
    captured.innerText = `Total captured: ${qtyCatured}`
    female.innerText = `Total female: ${qtyFemale}`
}
 
function sortTable (newData){
    let sortField = select.options[select.selectedIndex].value;
    for(let i = tbody.rows.length - 1; i >= 0; i--) {
        tbody.deleteRow(i);
    }
    sortField == "name"? sortField = "title": null;
    console.log(sortField);
    newData.sort((a, b) => a.sortField[0] < b.sortField[0] ? - 1 : Number(a.sortField[0] > b.sortField[0]));
    fillTable(newData);
}

if (input) {
    input.addEventListener('keyup', filteringTable);
}


function filteringTable() {
    var td, i,
        filter = input.value.toUpperCase(),
        table = document.querySelectorAll("table"),
        tr = [];
    
    for(i = 0; i < table.length; i++) {
        for (var a = 0; a < table[i].rows.length; a++) {
            tr.push(table[i].rows[a])
        }
    }

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0] || tr[i].getElementsByTagName("th")[0];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}