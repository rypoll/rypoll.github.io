const table = document.getElementById("myTable");
const pagination = document.getElementById("pagination");
const weekSelect = document.getElementById("weekSelect");
const rowsPerPage = 5;
let data = [];

async function getData() {
  const response = await fetch("03a-summarised-w-seo-csv.csv");
  const csvData = await response.text();
  const parsedData = parseCSV(csvData);

  // Sort the data based on the 'L' column in descending order (biggest numbers first)
  parsedData.sort((a, b) => b["L"] - a["L"]);

  data = parsedData;
  return data;
}

function parseCSV(csvData) {
  const parsedData = Papa.parse(csvData, { header: true, skipEmptyLines: true });
  return parsedData.data;
}

function populateDropDown() {
  const weekNumbers = [...new Set(data.map((row) => row["Week Number"]))];
  weekNumbers.sort((a, b) => b - a);

  let optionsHTML = "";
  weekNumbers.forEach((week) => {
    optionsHTML += `<option value="${week}">Week ${week}</option>`;
  });

  weekSelect.innerHTML = optionsHTML;
  weekSelect.addEventListener("change", filterByWeekNumber);
}

async function displayRows(pageNum, filteredData) {
  const startIndex = (pageNum - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredData.length);

  table.innerHTML = ""; // Clear existing rows

  // Insert column headings into the table
  const columnHeadings = ["Description", "Links", "Popularity"];
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
    .slice(1, -1) // Remove the square brackets from the string
    .split(", ") // Convert the comma-separated string into an array
    .map((link) => `<a href="${link}">${extractLinkText(link)}</a>`); // Create anchor tags for each link

  return `<ol><li>${linkList.join("</li><li>")}</li></ol>`;
}

function extractLinkText(link) {
  const match = link.match(/(?:https?:\/\/)?(?:www\.)?([^./]+)\./i);
  const linkText = match ? match[1] : link;
  return linkText.charAt(0).toUpperCase() + linkText.slice(1);
}

function filterByWeekNumber() {
  const selectedWeek = weekSelect.value;
  const filteredData = data.filter((row) => row["Week Number"] == selectedWeek);

  // Calculate number of pages for the filtered data
  const numPages = Math.ceil(filteredData.length / rowsPerPage);
  populatePagination(numPages);

  // Display the first page of the filtered data
  displayRows(1, filteredData);
}

function populatePagination(numPages) {
  let paginationHTML = "";
  for (let i = 1; i <= numPages; i++) {
    paginationHTML += `<a href="#" onclick="gotoPage(${i})">${i}</a>`;
  }

  pagination.innerHTML = paginationHTML;
}

function setupPagination() {
  getData().then((data) => {
    populateDropDown();
    const numPages = Math.ceil(data.length / rowsPerPage);
    populatePagination(numPages);
    displayRows(1, data);
  });
}

function gotoPage(pageNum) {
  displayRows(pageNum, data);
}

setupPagination();
