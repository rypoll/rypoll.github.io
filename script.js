document.addEventListener("DOMContentLoaded", function() {
    let currentPage = 1;
    const rowsPerPage = 20; // Each row in your CSV results in 5 rows in the table, so this essentially gets 4 original CSV rows per page
    let allData = [];

    // Use PapaParse to read and process the CSV data
    Papa.parse('02a-summarised-w-seo-csv.csv', {
        download: true,
        header: true,
        complete: function(results) {
            allData = results.data;
            populateTable(allData, 0);  // Start from the first row initially
            generatePagination(allData.length);
        }
    });

    function formatDate(cellDateStr) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Resetting the time part, considering only the date part
    
        const [day, month, year] = cellDateStr.split("/");
        const cellDate = new Date(year, month - 1, day);
    
        const msInADay = 24 * 60 * 60 * 1000;
        const daysDifference = Math.round((today - cellDate) / msInADay);
    
        if (daysDifference === 0) {
            return "Today";
        } else if (daysDifference < 30) {
            return `${daysDifference} days ago`;
        } else {
            const months = Math.ceil(daysDifference / 30);  // Using Math.ceil to round up
            return `${months} mo. ago`;
        }
    }
    
    function populateTable(data, start) {
        let table = document.getElementById('data-table');
        table.innerHTML = ""; // clear previous content
    
        let slicedData = data.slice(start, start + rowsPerPage);
    
        slicedData.forEach(row => {
            // Format the date
            let formattedDate = formatDate(row.Date);
            
            // Create row for 'Date'
            let trDate = document.createElement('tr');
            let td = document.createElement('td');
            td.classList.add('date-formatted');
            td.textContent = formattedDate;
            trDate.appendChild(td);
            table.appendChild(trDate);

            // Create row for 'Topic summary'
            let trTopicSummary = document.createElement('tr');
            trTopicSummary.innerHTML = `<td>${row['Topic summary']}</td>`;
            table.appendChild(trTopicSummary);



            // Create row for 'Category'
            let trCategory = document.createElement('tr');
            let tdCategory = document.createElement('td');
            let categories = row.Category.slice(1, -1).split(',').map(item => item.trim().slice(1, -1));

            console.log(row.Category, typeof row.Category);

            // Loop through the category array and format each category
            categories.forEach(cat => {
                let span = document.createElement('span');
                
                // Convert and format category for class name
                let className = cat.toLowerCase().replace(/ /g, '-');
                span.className = `category ${className}`;
                
                // Capitalize each word for display, with a special case for 'AI'
                let displayCat = cat.split(' ').map(word => {
                    if (word.toLowerCase() === 'ai') {
                        return 'AI';  // Special case for the word 'AI'
                    }
                    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                }).join(' ');
            
                // Set the text content
                span.textContent = displayCat;
                
                // Append to the table cell
                tdCategory.appendChild(span);
            });

            trCategory.appendChild(tdCategory);
            table.appendChild(trCategory);




            // Create row for 'Associated Links'
            let trLinks = document.createElement('tr');
            let tdLinks = document.createElement('td');

            // Parse the string array
            let links;
            try {
                links = JSON.parse(row['Associated Links'].replace(/'/g, "\""));
            } catch (e) {
                console.error("Failed to parse links:", row['Associated Links']);
            }
            // Check if links were successfully parsed
            if (links && Array.isArray(links)) {
                links.forEach((link, index) => {
                    // Extract the desired part of the URL
                    let withoutHttps = link.replace('https://', '');
                    let extractedPart = withoutHttps.startsWith('www.') ? withoutHttps.split('www.')[1].split('.')[0] : withoutHttps.split('.')[0];
                    
                    // Capitalize the first letter
                    let capitalizedPart = extractedPart.charAt(0).toUpperCase() + extractedPart.slice(1);

                    // Create a link element
                    let linkElement = document.createElement('a');
                    linkElement.href = link;
                    linkElement.target = "_blank";  // Open in a new tab
                    linkElement.textContent = `${index + 1}. ${capitalizedPart}`;

                    // Style the link
                    linkElement.style.fontSize = '12px';         // Small font size
                    linkElement.style.color = '#61747a';              // Default text color
                    linkElement.style.padding = '5px 10px';      // Some padding
                    linkElement.style.borderRadius = '20px';     // Rounded corners
                    linkElement.style.marginRight = '10px';      // Some spacing between links if there are multiple

                    // Append the link to the td
                    tdLinks.appendChild(linkElement);
                });
            }

            trLinks.appendChild(tdLinks);
            table.appendChild(trLinks);



            // Create row for 'L'
            let trSeoStats = document.createElement('tr');
            let tdSeoStats = document.createElement('td');

            // Format the number from 'L'
            let formattedNumber;
            if (row.L < 1000) {
                formattedNumber = row.L;
            } else if (row.L >= 1000 && row.L < 10000) {
                formattedNumber = `${(row.L / 1000).toFixed(1)}K`;
            } else {
                formattedNumber = `${Math.round(row.L / 1000)}K`;
            }

            // Span for the formatted number with styling
            let spanNumber = document.createElement('span');
            spanNumber.textContent = formattedNumber;
            spanNumber.style.background = "#1a282d";
            spanNumber.style.padding = "5px 10px";
            spanNumber.style.borderRadius = "20px";
            spanNumber.style.color = "white";

            // Create the "Backlinks:" text and the "i" information icon
            let infoIcon = "ℹ️";  // Unicode for information symbol with a circle around it.
            let spanIcon = document.createElement('span');
            spanIcon.textContent = infoIcon;
            spanIcon.title = "Backlinks are incoming links to a webpage. They serve as a proxy for content quality and popularity in SEO metrics.";  // The tooltip
            tdSeoStats.appendChild(spanIcon);

            let backlinkText = document.createTextNode(" Backlinks:");
            tdSeoStats.appendChild(backlinkText);
            // Append everything to the table cell
            tdSeoStats.appendChild(backlinkText);
            tdSeoStats.appendChild(spanIcon);
            tdSeoStats.appendChild(spanNumber);
            tdSeoStats.style.fontSize = "12px";  // Setting the font size

            // Append the table cell to the row, and then append the row to the table
            trSeoStats.appendChild(tdSeoStats);
            table.appendChild(trSeoStats);


        });
    }

    function generatePagination(totalLength) {
        let paginationContainer = document.getElementById("pagination");
        paginationContainer.innerHTML = ""; // Clear previous pagination

        let totalPages = Math.ceil(totalLength / rowsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            let pageBtn = document.createElement("button");
            pageBtn.textContent = i;
            pageBtn.onclick = function() {
                currentPage = i;
                populateTable(allData, (i-1) * rowsPerPage);
                generatePagination(totalLength); // Recreate pagination so the clicked page gets "active" class
            };

            if (currentPage === i) {
                pageBtn.classList.add("active");
            }

            paginationContainer.appendChild(pageBtn);
        }
    }


    //Start dropdown stuff
    const dropdown1 = document.getElementById('dropdown1');
    const dropdown2 = document.getElementById('dropdown2');
    
    updateDropdown2();

    dropdown1.addEventListener('change', updateDropdown2);

    function updateDropdown2() {
        dropdown2.innerHTML = ''; // Clear previous options
        switch (dropdown1.value) {
            case "Daily":
                populateDaily();
                break;
            case "Weekly":
                // Assuming you're using PapaParse, you'll need to fetch and parse the CSV to get the "wc_date" values.
                // This is a stub until you have the actual CSV parsing in place.
                populateWeekly();
                break;
            case "Monthly":
                populateMonthly();
                break;
        }
    }

    function populateDaily() {
        let today = new Date(2023, 7, 19); // Example date
        let startDate = new Date(2023, 3, 1); 
        while(today >= startDate) {
            let option = new Option(`${today.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, today.toISOString());
            dropdown2.add(option);
            today.setDate(today.getDate() - 1);
        }
    }

    function populateWeekly() {
        let currentDate = new Date(); // Today's date (automatically gets the current date)
        let dayOfWeek = currentDate.getUTCDay();
    
        // Adjust the current date to the beginning of the current week (i.e., Monday)
        currentDate.setUTCDate(currentDate.getUTCDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    
        let firstMondayOfYear = new Date(currentDate.getFullYear(), 0, 2); // Get the first Monday of the current year
    
        let weekCommencingDates = []; // Array to hold all week commencing dates
        
        while (currentDate >= firstMondayOfYear) {
            weekCommencingDates.push(new Date(currentDate)); // Push the current week commencing date to the array
            currentDate.setDate(currentDate.getDate() - 7); // Go back one week
        }
    
        // Loop through the array in its current order so the most recent week commencing date is added first
        for(let date of weekCommencingDates) {
            let optionText = date.toLocaleDateString('en-GB'); // Format the date
            dropdown2.add(new Option(optionText, optionText)); // Add to dropdown
        }
    
        // Explicitly set the most recent week as the default option
        dropdown2.value = weekCommencingDates[0].toLocaleDateString('en-GB');
    }
    
    
    
    

    function populateMonthly() {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let today = new Date(2023, 7, 19); // Example date
        let month = today.getMonth();
        while (month >= 0) {
            dropdown2.add(new Option(`${months[month]} 2023`, month + 1));
            month--;
        }
    }

    
});


