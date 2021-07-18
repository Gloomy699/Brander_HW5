let newData = [];
let input = document.getElementById("searchName");

fetch("fbi.json")
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        newData.push(...data.items);
        fillTable(newData);
        fillStatistic(newData);
    });

let fillTable = (newData) => {newData.map ((item) => {
    let tbody = document.getElementById("tbody");
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
    let qtyCatured = newData.reduce((total, item) => {
        if (item.status === "captured") {
            total++;
        }
        return total;
    }, 0);
    let qtyFemale = newData.reduce((total, item) => {
        if (item.sex === "Female") {
            total++;
        }
        return total;
    }, 0);
    let captured = document.getElementById("captured");
    let famale = document.getElementById("famale");
    captured.innerText = `Total captured: ${qtyCatured}`
    famale.innerText = `Total female: ${qtyFemale}`
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



