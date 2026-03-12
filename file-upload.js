const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const fileNameDisplay = document.getElementById('fileNameDisplay');
const textArea = document.getElementById('resultText');
const coordBtn = document.getElementById('coordBtn');

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


//event listeners for LGS coords
document.addEventListener('DOMContentLoaded', () => {

    textArea.addEventListener('input', () => {
        // .trim() ensures that strings with only spaces/newlines are still considered empty
        if (textArea.value.trim().length > 0) {
            coordBtn.disabled = false;
        } else {
            coordBtn.disabled = true;
        }
    });
});

coordBtn.addEventListener('click', (e) => {
    if (textArea.value.trim().length > 0) {
        LGStoGE(textArea.value);
    }

    coordBtn.disabled = true;
    coordBtn.innerText = "Processing...";
});