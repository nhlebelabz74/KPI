import axios from "axios";
import * as XLSX from 'xlsx';

const getExcel = async (targetSheetName = null) => {
  // Get today's date
  const today = new Date();
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Function to determine accounting folder based on month and year
  const getAccountingFolder = (month, year) => {
    // March 2025 to Feb 2026 -> Accounting 2026
    // March 2026 to Feb 2027 -> Accounting 2027, etc.
    if (month >= 2) { // March onwards (month index 2+)
      return `Accounting ${year + 1}`;
    } else { // January, February
      return `Accounting ${year}`;
    }
  };

  // Function to get previous month and year
  const getPreviousMonth = (currentMonth, currentYear) => {
    if (currentMonth === 0) {
      return { month: 11, year: currentYear - 1 };
    }
    return { month: currentMonth - 1, year: currentYear };
  };

  // Start from previous month
  let searchDate = getPreviousMonth(today.getMonth(), today.getFullYear());
  
  const api = axios.create({
    baseURL: "https://prod-158.westeurope.logic.azure.com:443/workflows/3760c6d02c5142f1ae66f15ae677d899/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=bhKdPvZljg9gySUvT7jhBaZuOVzxV9O8u6SC8kRFpUg",
    headers: {
      "Content-Type": "application/json"
    }
  });

  // Maximum attempts to prevent infinite loop (12 months should be enough)
  const maxAttempts = 12;
  let attempts = 0;

  while (attempts < maxAttempts) {
    const monthName = monthNames[searchDate.month];
    const accountingFolder = getAccountingFolder(searchDate.month, searchDate.year);
    const path = `${accountingFolder}/${monthName} ${searchDate.year}`;
    
    const fileNames = [
      `LNP Inc Budgets ${monthName} ${searchDate.year} - Final.xlsx`,
      `LNP Inc Budgets ${monthName} ${searchDate.year} - Draft.xlsx`
    ];

    console.log(`Searching in: ${path}`);

    try {
      // Try to find files in current month folder
      let fileFound = false;
      
      for (const fileName of fileNames) {
        try {
          const response = await api.post("", {
            path: path,
            fileName: fileName
          });

          // If we get here, the file was found
          console.log(`File found: ${fileName} in ${path}`);
          fileFound = true;
          
          // Process the Excel file and convert to JSON
          const processedData = await processExcelData(response.data, targetSheetName);
          
          return {
            success: true,
            file: fileName,
            path: path,
            rawData: response.data,
            ...processedData
          };
          
        } catch (fileError) {
          // File not found, continue to next file
          console.log(`File not found: ${fileName}`);
        }
      }

      if (fileFound)
        break; // Exit the while loop if any file was found

    } catch (pathError) {
      // Path doesn't exist, continue to previous month
      console.log(`Path not found: ${path}`);
    }

    // Move to previous month
    searchDate = getPreviousMonth(searchDate.month, searchDate.year);
    attempts++;
    
    console.log(`Moving to previous month: ${monthNames[searchDate.month]} ${searchDate.year}`);
  }

  if (attempts >= maxAttempts)
    throw new Error("No Excel files found after searching through 12 months");
};

// Function to process Excel data and extract specific sheet
const processExcelData = async (excelData, targetSheetName = null) => {
  try {
    let workbook;
    
    // Handle different data formats from Power Automate
    if (typeof excelData === 'string') {
      // If it's base64 encoded with data URL prefix
      if (excelData.includes('base64,')) {
        const base64Data = excelData.split('base64,')[1];
        // Convert base64 to Uint8Array for XLSX
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        workbook = XLSX.read(bytes, { type: 'array' });
      } else {
        // If it's a regular base64 string
        const binaryString = atob(excelData);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        workbook = XLSX.read(bytes, { type: 'array' });
      }
    } else if (excelData instanceof ArrayBuffer) {
      workbook = XLSX.read(new Uint8Array(excelData), { type: 'array' });
    } else if (excelData instanceof Uint8Array) {
      workbook = XLSX.read(excelData, { type: 'array' });
    } else {
      throw new Error('Unsupported data format received from Power Automate');
    }

    // Get all sheet names
    const sheetNames = workbook.SheetNames;
    
    let result = {
      sheetNames: sheetNames,
      data: {}
    };

    if (targetSheetName) {
      // Extract specific sheet
      if (sheetNames.includes(targetSheetName)) {
        const worksheet = workbook.Sheets[targetSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        result.data[targetSheetName] = jsonData;
        result.targetSheet = targetSheetName;
        result.extractedData = jsonData;
      } else {
        throw new Error(`Sheet "${targetSheetName}" not found. Available sheets: ${sheetNames.join(', ')}`);
      }
    } else {
      // Extract all sheets
      sheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        result.data[sheetName] = jsonData;
      });
    }

    return result;
  } catch (error) {
    console.error('Error processing Excel data:', error);
    throw new Error(`Failed to process Excel file: ${error.message}`);
  }
};

// get employee data
const getData = async ({ surname, name }) => {
  try {
    const result = await getExcel("YTD Figures Employees");
    let data = result.extractedData;

    data = data.filter(row => row.length > 0); // remove all empty rows (arrays)
    data = data.slice(1, -1); // remove first and last rows
    data = data.slice(2); // remove the first two rows

    // loop through data and find employee by surname
    let employeeData = data.find(row => row[0] && row[0].includes(surname)) || 
                      data.find(row => row[0] && row[0].includes(name));
    
    if (!employeeData) {
      throw new Error(`Employee not found with surname "${surname}" or name "${name}"`);
    }
    
    employeeData = employeeData.slice(1);

    const billedData = employeeData.filter((_, index) => index % 2 === 0); // even indices for billed
    const collectedData = employeeData.filter((_, index) => index % 2 !== 0); // odd indices for collected

    // fill both arrays with 0s until they are of length 12
    while (billedData.length < 12) {
      billedData.push(0);
      collectedData.push(0);
    }

    // the final object with values rounded to 2 decimal places
    employeeData = {
      billed: billedData.map(value => {
        const num = parseFloat(value);
        return isNaN(num) ? 0 : parseFloat(num.toFixed(2));
      }),
      collected: collectedData.map(value => {
        const num = parseFloat(value);
        return isNaN(num) ? 0 : parseFloat(num.toFixed(2));
      })
    };

    return employeeData;
  } catch (error) {
    console.error('Error getting employee data:', error);
    throw error;
  }
}

export default getData;