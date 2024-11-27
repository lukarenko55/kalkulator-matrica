document.addEventListener("DOMContentLoaded", () => {
    initializeMatrix("A", 3, 3);
    initializeMatrix("B", 3, 3);

    setupDimensionControls("A");
    setupDimensionControls("B");
});

// Synchronize sliders and inputs for matrix dimensions
function setupDimensionControls(id) {
    const rowsSlider = document.getElementById(`rows${id}`);
    const colsSlider = document.getElementById(`cols${id}`);
    const rowsInput = document.getElementById(`rows${id}Input`);
    const colsInput = document.getElementById(`cols${id}Input`);

    const syncDimensions = () => {
        rowsInput.value = rowsSlider.value;
        colsInput.value = colsSlider.value;
        initializeMatrix(id, parseInt(rowsSlider.value), parseInt(colsSlider.value));
    };

    const syncSliders = () => {
        rowsSlider.value = rowsInput.value;
        colsSlider.value = colsInput.value;
        initializeMatrix(id, parseInt(rowsInput.value), parseInt(colsInput.value));
    };

    rowsSlider.addEventListener("input", syncDimensions);
    colsSlider.addEventListener("input", syncDimensions);

    rowsInput.addEventListener("change", syncSliders);
    colsInput.addEventListener("change", syncSliders);
}

// Initialize a matrix with input fields
function initializeMatrix(id, rows, cols) {
    const matrixDiv = document.getElementById(`matrix${id}`);
    matrixDiv.innerHTML = "";
    for (let i = 0; i < rows; i++) {
        const row = document.createElement("div");
        row.classList.add("matrix-row");
        for (let j = 0; j < cols; j++) {
            const input = document.createElement("input");
            input.type = "number";
            input.value = 0;
            input.className = `matrix-input-${id}`;
            row.appendChild(input);
        }
        matrixDiv.appendChild(row);
    }
}

// Get matrix values from input fields
function getMatrixValues(id) {
    const inputs = document.querySelectorAll(`.matrix-input-${id}`);
    const rows = parseInt(document.getElementById(`rows${id}`).value);
    const cols = parseInt(document.getElementById(`cols${id}`).value);
    const values = [];
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            row.push(parseFloat(inputs[i * cols + j].value));
        }
        values.push(row);
    }
    return values;
}

// Set matrix values to input fields
function setMatrixValues(id, values) {
    const rows = values.length;
    const cols = values[0].length;
    document.getElementById(`rows${id}`).value = rows;
    document.getElementById(`cols${id}`).value = cols;
    initializeMatrix(id, rows, cols);
    const inputs = document.querySelectorAll(`.matrix-input-${id}`);
    inputs.forEach((input, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        input.value = values[row][col];
    });
}

// Display result in a table format
function displayResult(matrix) {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "<h3>Result:</h3>";
    const table = document.createElement("table");
    table.className = "matrix-table";
    matrix.forEach(row => {
        const rowElem = document.createElement("tr");
        row.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value.toFixed(2);
            rowElem.appendChild(cell);
        });
        table.appendChild(rowElem);
    });
    resultDiv.appendChild(table);
}

// Matrix operations

// Clear all matrix values
function clearMatrix(id) {
    const inputs = document.querySelectorAll(`.matrix-input-${id}`);
    inputs.forEach(input => (input.value = 0));
}

// Fill matrix with random values
function fillRandom(id) {
    const inputs = document.querySelectorAll(`.matrix-input-${id}`);
    inputs.forEach(input => (input.value = (Math.random() * 10).toFixed(2)));
}

// Transpose matrix
function transposeMatrix(id) {
    const matrix = getMatrixValues(id);
    const result = matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
    setMatrixValues(id, result);
    displayResult(result);
}

// Multiply matrix by a scalar
function scalarMultiply(id) {
    const scalar = parseFloat(prompt("Enter a scalar value:"));
    if (isNaN(scalar)) {
        alert("Invalid scalar value!");
        return;
    }
    const matrix = getMatrixValues(id);
    const result = matrix.map(row => row.map(value => value * scalar));
    setMatrixValues(id, result);
    displayResult(result);
}

// Add two matrices
function addMatrices() {
    const A = getMatrixValues("A");
    const B = getMatrixValues("B");
    if (A.length !== B.length || A[0].length !== B[0].length) {
        alert("Matrices must have the same dimensions to add!");
        return;
    }
    const result = A.map((row, i) => row.map((value, j) => value + B[i][j]));
    displayResult(result);
}

// Subtract two matrices
function subtractMatrices() {
    const A = getMatrixValues("A");
    const B = getMatrixValues("B");
    if (A.length !== B.length || A[0].length !== B[0].length) {
        alert("Matrices must have the same dimensions to subtract!");
        return;
    }
    const result = A.map((row, i) => row.map((value, j) => value - B[i][j]));
    displayResult(result);
}

// Multiply two matrices
function multiplyMatrices() {
    const A = getMatrixValues("A");
    const B = getMatrixValues("B");
    if (A[0].length !== B.length) {
        alert("Number of columns in Matrix A must equal number of rows in Matrix B!");
        return;
    }
    const result = A.map(row =>
        B[0].map((_, colIndex) =>
            row.reduce((sum, value, rowIndex) => sum + value * B[rowIndex][colIndex], 0)
        )
    );
    displayResult(result);
}

// Calculate determinant of a square matrix
function determinant(id) {
    const matrix = getMatrixValues(id);
    if (matrix.length !== matrix[0].length) {
        alert("Matrix must be square to calculate determinant!");
        return;
    }
    const result = calculateDeterminant(matrix);
    //alert(`Determinant: ${result}`);
    displayResult([[result]]);
}

function calculateDeterminant(matrix) {
    const n = matrix.length;
    if (n === 1) return matrix[0][0];
    if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    return matrix[0].reduce((sum, value, colIndex) => {
        const subMatrix = matrix.slice(1).map(row => row.filter((_, i) => i !== colIndex));
        return sum + value * calculateDeterminant(subMatrix) * (colIndex % 2 === 0 ? 1 : -1);
    }, 0);
}

// Calculate inverse of a square matrix
function inverseMatrix(id) {
    const matrix = getMatrixValues(id);
    if (matrix.length !== matrix[0].length) {
        alert("Matrix must be square to calculate inverse!");
        return;
    }
    const det = calculateDeterminant(matrix);
    if (det === 0) {
        alert("Matrix is not invertible!");
        return;
    }
    const n = matrix.length;
    const adjugate = matrix.map((row, i) =>
        row.map((_, j) => {
            const minor = matrix
                .filter((_, rowIdx) => rowIdx !== i)
                .map(row => row.filter((_, colIdx) => colIdx !== j));
            return calculateDeterminant(minor) * ((i + j) % 2 === 0 ? 1 : -1);
        })
    );
    const result = adjugate[0].map((_, i) => adjugate.map(row => row[i])).map(row => row.map(value => value / det));
    setMatrixValues(id, result);
    displayResult(result);
}

// Raise matrix to a power
function powerMatrix(id) {
    const power = parseInt(prompt("Enter the power:"));
    if (isNaN(power) || power < 0) {
        alert("Enter a valid non-negative integer for power!");
        return;
    }
    let matrix = getMatrixValues(id);
    if (matrix.length !== matrix[0].length) {
        alert("Matrix must be square to calculate power!");
        return;
    }
    let result = matrix;
    for (let i = 1; i < power; i++) {
        result = multiplyMatricesHelper(result, matrix);
    }
    displayResult(result);
}

// Helper to multiply matrices
function multiplyMatricesHelper(A, B) {
    return A.map(row =>
        B[0].map((_, colIndex) =>
            row.reduce((sum, value, rowIndex) => sum + value * B[rowIndex][colIndex], 0)
        )
    );
}
