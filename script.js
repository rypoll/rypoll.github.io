const table = document.getElementById("myTable");
const pagination = document.getElementById("pagination");
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

async function displayRows(pageNum, filteredData) {
  const startIndex = (pageNum - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredData.length);

  table.innerHTML = ""; // Clear existing rows

  // Insert column headings into the table
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
    .slice(1, -1) // Remove the square brackets from the string
    .split(", ") // Convert the comma-separated string into an array
    .slice(0, 9) // Take only the first 9 links
    .map((link, index) => {
      return `${index + 1}. <a href="${link}">${extractLinkText(link)}</a>`; // Include the link number
    });

  const numRows = Math.ceil(linkList.length / 3);

  let tableB = "<table class='inner-table'>"; // Add the 'inner-table' class here

  for (let i = 0; i < 3; i++) {
    tableB += "<tr>";

    for (let j = 0; j < numRows; j++) {
      const index = j * 3 + i; // Change the index calculation to populate along columns

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

function setupPagination() {
  getData().then((data) => {
    const numPages = Math.ceil(data.length / rowsPerPage);
    populatePagination(numPages);
    displayRows(1, data);
  });
}

function gotoPage(pageNum) {
  displayRows(pageNum, data);
}

setupPagination();
