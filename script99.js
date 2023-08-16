const table = document.getElementById("myTable");
const pagination = document.getElementById("pagination");
const buttonsContainer = document.querySelector(".buttons-container");
const rowsPerPage = 5;
let data = [];

let weekLabels = {};

async function getData() {
  const response = await fetch("02a-summarised-w-seo-csv.csv");
  const csvData = await response.text();
  const parsedData = parseCSV(csvData);

  parsedData.sort((a, b) => b["L"] - a["L"]);

  data = parsedData;

  data.forEach(row => {
    weekLabels[row['Week Number']] = row['Week Range'];
  });

  const maxWeekNumber = Math.max(...data.map(row => +row["Week Number"]));

  return maxWeekNumber;
}

// start execution
// start execution
getData()
  .then((currentWeek) => {
    // Move the generateWeekButtons() call inside the .then() block
    generateWeekButtons();
    filterByWeekNumber(currentWeek);
  });

// Rest of your code...


function parseCSV(csvData) {
  const parsedData = Papa.parse(csvData, { header: true, skipEmptyLines: true });
  return parsedData.data;
}

async function displayRows(pageNum, filteredData) {
  const startIndex = (pageNum - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredData.length);
  console.log("Start Index:", startIndex);
  console.log("End Index:", endIndex);
  console.log("Data to display:", filteredData.slice(startIndex, endIndex));


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

let currentPage = 1;
let currentStartPage = 1; // This tracks the first page number in the current pagination view

function populatePagination(numPages) {
  const maxPagesToShow = 10;
  
  let paginationHTML = "";

  // If there are pages before the current starting page, add a left arrow
  if (currentStartPage > 1) {
    paginationHTML += `<a href="#" onclick="shiftPagination(-1)">&larr;</a>`;
  }

  for (let i = 0; i < maxPagesToShow && (i + currentStartPage) <= numPages; i++) {
    const pageNum = i + currentStartPage;
    paginationHTML += `<a href="#" class="${pageNum === currentPage ? 'active-page' : ''}" onclick="gotoPage(${pageNum})">${pageNum}</a>`;
  }

  // If there are more pages to show after the current view, add a right arrow
  if (currentStartPage + maxPagesToShow <= numPages) {
    paginationHTML += `<a href="#" onclick="shiftPagination(1)">&rarr;</a>`;
  }

  pagination.innerHTML = paginationHTML;
}

function shiftPagination(direction) {
  const shiftBy = direction * 10;
  currentStartPage += shiftBy;

  const activeWeekButton = document.querySelector('.week-button.active');
  let filteredData;

  if (activeWeekButton) {
    const weekNumber = activeWeekButton.dataset.week;
    filteredData = data.filter(row => +row["Week Number"] === +weekNumber);
  } else {
    const monthButton = document.querySelector('.month-button.active');
    if (monthButton) {
      const monthNumber = monthButton.dataset.monthNumber;
      filteredData = data.filter(row => {
        const month = row['wc_date'].split('/')[1];
        return month === String(monthNumber).padStart(2, '0');
      });
    }
  }

  const numPages = Math.ceil(filteredData.length / rowsPerPage);
  populatePagination(numPages);
}












let isWeeklyButtonActive = true; // Keep track of the active button

async function gotoPage(pageNum) {
  console.log("Going to page:", pageNum);
  console.log("Original data length:", data.length);

  const activeWeekButton = document.querySelector('.week-button.active');
  console.log("Active week button:", activeWeekButton);

  const activeMonthButton = document.querySelector('.month-button.active');
  console.log("Active month button:", activeMonthButton);


  let filteredData;

  // Check for the week button
  const weekButton = document.querySelector('.week-button.active');
  if (weekButton) {
      const weekNumber = weekButton.dataset.week;
      filteredData = data.filter(row => +row["Week Number"] === +weekNumber);
  } 

  // Check for the month button
  const monthButton = document.querySelector('.month-button.active');
  if (monthButton) {
      const monthNumber = monthButton.dataset.monthNumber;
      filteredData = data.filter(row => {
          const month = row['wc_date'].split('/')[1];
          return month === String(monthNumber).padStart(2, '0');
      });
  }


  if (weekButton) {
    const weekNumber = weekButton.dataset.week;
    filteredData = data.filter(row => +row["Week Number"] === +weekNumber);
    console.log("Filtered by week:", filteredData);
} 

if (monthButton) {
    const monthNumber = monthButton.dataset.monthNumber;
    console.log("Button's month dataset:", monthButton.dataset.month);

    filteredData = data.filter(row => {
        const month = row['wc_date'].split('/')[1];
        console.log("Expected month number:", monthNumber);
        console.log("Row's month:", month);

        return month === String(monthNumber).padStart(2, '0');
    });
    console.log("Filtered by month:", filteredData);
}


  displayRows(pageNum, filteredData);

}




document.querySelector('.weekly-button').addEventListener('click', function() {
  // Update the isWeeklyButtonActive variable and set it to true
  isWeeklyButtonActive = true;
  this.classList.add('active');

  // Remove 'active' class from monthly button
  document.querySelector('.monthly-button').classList.remove('active');

  // Call function to generate week buttons
  generateWeekButtons();

  // Call the filter function with the current page
  gotoPage(1);
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


