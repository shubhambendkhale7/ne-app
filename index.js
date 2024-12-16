const files = [
    { id: 1, name: 'document1.txt', type: '.txt' },
    { id: 2, name: 'presentation1.pdf', type: '.pdf' },
    { id: 3, name: 'song1.mp3', type: '.mp3' },
    // Continue for all files...
];

const fileIcons = {
    '.txt': 'https://via.placeholder.com/200?text=TXT',
    '.pdf': 'https://via.placeholder.com/200?text=PDF',
    '.mp3': 'https://via.placeholder.com/200?text=MP3',
    '.exe': 'https://via.placeholder.com/200?text=EXE',
    '.rar': 'https://via.placeholder.com/200?text=RAR',
    '.docx': 'https://via.placeholder.com/200?text=DOCX',
    '.jpg': 'https://via.placeholder.com/200?text=JPG',
    '.png': 'https://via.placeholder.com/200?text=PNG',
    '.gif': 'https://via.placeholder.com/200?text=GIF',
    '.zip': 'https://via.placeholder.com/200?text=ZIP',
};

let categorizedFiles = {};
let bin = JSON.parse(localStorage.getItem('bin')) || [];

function categorizeFiles() {
    categorizedFiles = files.reduce((acc, file) => {
        if (file) {
            if (!acc[file.type]) {
                acc[file.type] = [];
            }
            acc[file.type].push(file);
        }
        return acc;
    }, {});
}

function displayFolders() {
    const folderContainer = document.getElementById('folderContainer');
    folderContainer.innerHTML = '';
    for (const folder in categorizedFiles) {
        const folderElement = document.createElement('div');
        folderElement.textContent = folder;
        folderElement.classList.add('folder');
        folderContainer.appendChild(folderElement);

        folderElement.addEventListener('click', () => displayFiles(folder));
    }
}

function displayFiles(folder) {
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = '';

    categorizedFiles[folder].forEach(file => {
        const fileElement = document.createElement('div');
        const icon = document.createElement('img');
        icon.src = fileIcons[file.type];
        fileElement.appendChild(icon);

        const fileName = document.createElement('span');
        fileName.textContent = file.name.replace(file.type, '');
        fileElement.appendChild(fileName);

        fileElement.classList.add('file');
        fileList.appendChild(fileElement);
    });
}

function searchFiles(query, folder) {
    return categorizedFiles[folder].filter(file => file.name.includes(query));
}

function sortFiles(folder, ascending = true) {
    categorizedFiles[folder].sort((a, b) => {
        if (ascending) {
            return a.name.localeCompare(b.name);
        } else {
            return b.name.localeCompare(a.name);
        }
    });
}

function updateDisplay(folder, query = '', ascending = true) {
    let filesToDisplay = searchFiles(query, folder);
    sortFiles(folder, ascending);
    displayFiles(folder);
}

function addToBin(file) {
    bin.push(file);
    updateLocalStorage();
}

function restoreFromBin(file) {
    bin = bin.filter(binFile => binFile.id !== file.id);
    categorizedFiles[file.type].push(file);
    updateLocalStorage();
}

function clearBin() {
    bin = [];
    updateLocalStorage();
}

function updateLocalStorage() {
    localStorage.setItem('bin', JSON.stringify(bin));
}

function editFileName(file, newName) {
    const history = JSON.parse(localStorage.getItem('history')) || {};
    if (!history[file.id]) history[file.id] = [];
    history[file.id].push({ action: 'edit', oldName: file.name, newName, timestamp: Date.now() });

    file.name = newName;
    localStorage.setItem('history', JSON.stringify(history));
    updateLocalStorage();
}

function confirmAction(action) {
    return new Promise((resolve, reject) => {
        if (confirm(`Are you sure you want to ${action}?`)) {
            resolve('Action confirmed');
        } else {
            reject('Action cancelled');
        }
    });
}

// Initialization
categorizeFiles();
displayFolders();