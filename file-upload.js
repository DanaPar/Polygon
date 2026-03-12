const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const fileNameDisplay = document.getElementById('fileNameDisplay');
const textArea = document.getElementById('resultText');

let selectedFile = null;

// 1. Handle Drag & Drop Visuals
['dragenter', 'dragover'].forEach(name => {
    dropZone.addEventListener(name, (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });
});

['dragleave', 'drop'].forEach(name => {
    dropZone.addEventListener(name, (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
    });
});

// 2. Handle File Drop & Validation
dropZone.addEventListener('drop', (e) => {
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length) {
        validateAndSetFile(droppedFiles[0]);
    }
});

// 3. Handle Manual Selection
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
        validateAndSetFile(e.target.files[0]);
    }
});

function validateAndSetFile(file) {
    if (!file.name.toLowerCase().endsWith('.kml')) {
        alert("Error: Please upload a .kml file only.");
        fileInput.value = ""; // Reset input
        uploadBtn.disabled = true;
        return;
    }

    selectedFile = file;

    // Success: Update UI
    fileNameDisplay.innerHTML = `<strong>Selected:</strong> ${file.name}`;
    uploadBtn.disabled = false;

    console.log("Ready to send to backend:", file);
}


uploadBtn.addEventListener('click', (e) => {
    if (selectedFile) {
        GEtoLGS(selectedFile);
    }

    uploadBtn.disabled = true;
    uploadBtn.innerText = "Processing...";
});