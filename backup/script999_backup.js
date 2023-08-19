// Import PapaParse library (include this in your HTML file before the script.js)
// <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js"></script>

const table = document.getElementById("myTable");
const pagination = document.getElementById("pagination");
const rowsPerPage = 10;


async function getData() {
  const response = await fetch("data.csv");
  const csvData = await response.text();
  const parsedData = parseCSV(csvData);

  // Sort the data based on the 'L' column in descending order (biggest numbers first)
  parsedData.sort((a, b) => b['L'] - a['L']);

  return parsedData;
}

function parseCSV(csvData) {
  const parsedData = Papa.parse(csvData, { header: true, skipEmptyLines: true });
  return parsedData.data;
}

async function displayRows(pageNum) {
  const data = await getData();
  const startIndex = (pageNum - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, data.length);

  table.innerHTML = ""; // Clear existing rows

  for (let i = startIndex; i < endIndex; i++) {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${data[i]['Topic summary']}</td>
                     <td>${generateLinkList(data[i]['Associated Links'])}</td>
                     <td>${data[i]['L']}</td>`;
    table.appendChild(row);
  }
}

function generateLinkList(links) {
  const linkList = links
    .slice(1, -1) // Remove the square brackets from the string
    .split(', ') // Convert the comma-separated string into an array
    .map((link) => `<a href="${link}">${link.replace(/'/g, '')}</a>`); // Create anchor tags for each link

  return `<ol><li>${linkList.join('</li><li>')}</li></ol>`;
}

function setupPagination() {
  getData().then((data) => {
    const numPages = Math.ceil(data.length / rowsPerPage);

    let paginationHTML = "";
    for (let i = 1; i <= numPages; i++) {
      paginationHTML += `<a href="#" onclick="gotoPage(${i})">${i}</a>`;
    }

    pagination.innerHTML = paginationHTML;
  });
}

function gotoPage(pageNum) {
  displayRows(pageNum);
}

setupPagination();
gotoPage(1); // Display the first page on page load
