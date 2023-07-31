const table = document.getElementById("myTable");
const pagination = document.getElementById("pagination");
const buttonsContainer = document.querySelector(".buttons-container");
const rowsPerPage = 5;
let data = [];

async function getData() {
  const response = await fetch("03a-summarised-w-seo-csv.csv");
  const csvData = await response.text();
  const parsedData = parseCSV(csvData);

  parsedData.sort((a, b) => b["L"] - a["L"]);

  data = parsedData;

  const maxWeekNumber = Math.max(...data.map(row => +row["Week Number"]));

  return maxWeekNumber;
}

// start execution
getData()
  .then((currentWeek) => {
    generateWeekButtons();
    filterByWeekNumber(currentWeek);
  });

function parseCSV(csvData) {
  const parsedData = Papa.parse(csvData, { header: true, skipEmptyLines: true });
  return parsedData.data;
}

async function displayRows(pageNum, filteredData) {
  const startIndex = (pageNum - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredData.length);

  table.innerHTML = "";

  const columnHeadings = ["Description", "Links", "Rank"];
  const headerRow = document.createElement("tr");
  columnHeadings.forEach((heading) => {
    const th = document.createElement("th");
    th.textContent = heading;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  for (let i = startIndex; i < endIndex; i++) {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${filteredData[i]["Topic summary"]}</td>
                     <td>${generateLinkList(filteredData[i]["Associated Links"])}</td>
                     <td>${filteredData[i]["L"]}</td>`;
    table.appendChild(row);
  }
}

function generateLinkList(links) {
  const linkList = links
    .slice(1, -1)
    .split(", ")
    .slice(0, 9)
    .map((link, index) => {
      return `${index + 1}. <a href="${link}">${extractLinkText(link)}</a>`;
    });

  const numRows = Math.ceil(linkList.length / 3);

  let tableB = "<table class='inner-table'>";

  for (let i = 0; i < 3; i++) {
    tableB += "<tr>";

    for (let j = 0; j < numRows; j++) {
      const index = j * 3 + i;

      if (index < linkList.length) {
        tableB += "<td>" + linkList[index] + "</td>";
      } else {
        tableB += "<td></td>";
      }
    }

    tableB += "</tr>";
  }

  tableB += "</table>";

  return tableB;
}

function extractLinkText(link) {
  const match = link.match(/(?:https?:\/\/)?(?:www\.)?([^./]+)\./i);
  const linkText = match ? match[1] : link;
  return linkText.charAt(0).toUpperCase() + linkText.slice(1);
}

function populatePagination(numPages) {
  let paginationHTML = "";
  for (let i = 1; i <= numPages; i++) {
    paginationHTML += `<a href="#" onclick="gotoPage(${i})">${i}</a>`;
  }

  pagination.innerHTML = paginationHTML;
}












async function gotoPage(pageNum) {
  let filteredData;

  if (document.querySelector('.weekly-button').classList.contains('active')) {
    const weekNumber = document.querySelector('.week-button.active').textContent;
    filteredData = data.filter(row => +row["Week Number"] === +weekNumber);
  } else if (document.querySelector('.monthly-button').classList.contains('active')) {
    const monthNumber = document.querySelector('.month-button.active').textContent;
    filteredData = data.filter(row => {
      const month = row['wc_date'].split('/')[1];
      return month === String(monthNumber).padStart(2, '0');
    });
  }

  displayRows(pageNum, filteredData);
}



document.querySelector('.weekly-button').addEventListener('click', function() {
  // Remove 'active' class from monthly button and add it to the weekly button
  document.querySelector('.monthly-button').classList.remove('active');
  this.classList.add('active');
  
  // Call function to generate week buttons
  generateWeekButtons();
});

document.querySelector('.monthly-button').addEventListener('click', function() {
  // Remove 'active' class from weekly button and add it to the monthly button
  document.querySelector('.weekly-button').classList.remove('active');
  this.classList.add('active');

  // Call function to generate month buttons
  generateMonthButtons();

  // Get the current month
  const currentMonth = getCurrentMonth(new Date());

  // Call function to filter data by the current month
  filterByMonthNumber(currentMonth);
});
