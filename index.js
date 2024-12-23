const files = [
  'document1.txt', 'presentation1.pdf', 'song1.mp3', 'installer1.exe', 'archive1.rar', 
  'report1.docx', 'image1.jpg', 'graphic1.png', 'animation1.gif', 'compressed1.zip',
  'document2.txt', 'presentation2.pdf', 'song2.mp3', 'installer2.exe', 'archive2.rar',
  // Add more files as needed
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

let bin = JSON.parse(localStorage.getItem('bin')) || [];
let actionPromise;

// Load files from local storage or use default files
let categorizedFiles = JSON.parse(localStorage.getItem('categorizedFiles')) || categorizeFiles(files);

function categorizeFiles(files) {
  return files.reduce((acc, fileName) => {
    const fileType = `.${fileName.split('.').pop()}`;
    if (!acc[fileType]) {
      acc[fileType] = [];
    }
    acc[fileType].push({ id: Date.now() + Math.random(), name: fileName, type: fileType });
    return acc;
  }, {});
}

// Save categorizedFiles and bin to local storage
function saveToLocalStorage() {
  localStorage.setItem('categorizedFiles', JSON.stringify(categorizedFiles));
  localStorage.setItem('bin', JSON.stringify(bin));
}

function displayFolders(categorizedFiles) {
  const folderContainer = document.getElementById('folders');
  folderContainer.innerHTML = '';
  for (let fileType in categorizedFiles) {
    const folder = document.createElement('div');
    folder.textContent = fileType;
    folder.onclick = () => displayFiles(categorizedFiles[fileType]);
    folderContainer.appendChild(folder);
  }
}

function displayFiles(files) {
  const fileContainer = document.getElementById('files');
  fileContainer.innerHTML = '';
  files.forEach(file => {
    const fileItem = document.createElement('div');
    const icon = document.createElement('img');
    icon.src = fileIcons[file.type] || 'https://via.placeholder.com/200?text=FILE';
    const fileName = document.createElement('p');
    fileName.textContent = file.name.split('.').slice(0, -1).join('.');

    // Add delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deleteFile(file);
    
    // Add edit button
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.onclick = () => editFileName(file);

    fileItem.appendChild(icon);
    fileItem.appendChild(fileName);
    fileItem.appendChild(editButton);
    fileItem.appendChild(deleteButton);
    fileContainer.appendChild(fileItem);
  });
}

function searchFiles() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const displayedFiles = document.getElementById('files').children;
  Array.from(displayedFiles).forEach(fileItem => {
    const fileName = fileItem.textContent.toLowerCase();
    fileItem.style.display = fileName.includes(query) ? '' : 'none';
  });
}

let sortOrder = 'asc';

function sortFiles() {
  const fileContainer = document.getElementById('files');
  const filesArray = Array.from(fileContainer.children);
  filesArray.sort((a, b) => a.textContent.localeCompare(b.textContent));
  if (sortOrder === 'desc') {
    filesArray.reverse();
  }
  sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
  fileContainer.innerHTML = '';
  filesArray.forEach(fileItem => fileContainer.appendChild(fileItem));
}

function deleteFile(file) {
  showModal('Are you sure you want to delete this file?').then(() => {
    const fileType = file.type;
    categorizedFiles[fileType] = categorizedFiles[fileType].filter(f => f.id !== file.id);
    bin.push(file);
    saveToLocalStorage();
    displayFolders(categorizedFiles);
    displayFiles(categorizedFiles[fileType]); // Update the displayed files
    displayBin();
    autoDelete(file); // Schedule auto-delete for this file
  }).catch(() => {
    console.log('Deletion cancelled');
  });
}

function displayBin() {
  const binContainer = document.getElementById('bin');
  binContainer.innerHTML = '';
  bin.forEach(file => {
    const fileItem = document.createElement('div');
    const icon = document.createElement('img');
    icon.src = fileIcons[file.type] || 'https://via.placeholder.com/200?text=FILE';
    const fileName = document.createElement('p');
    fileName.textContent = file.name.split('.').slice(0, -1).join('.');

    // Add restore button
    const restoreButton = document.createElement('button');
    restoreButton.textContent = 'Restore';
    restoreButton.onclick = () => restoreFile(file);

    fileItem.appendChild(icon);
    fileItem.appendChild(fileName);
    fileItem.appendChild(restoreButton);
    binContainer.appendChild(fileItem);
  });
}

function restoreFile(file) {
  bin = bin.filter(f => f.id !== file.id);
  const fileType = file.type;
  if (!categorizedFiles[fileType]) {
    categorizedFiles[fileType] = [];
  }
  categorizedFiles[fileType].push(file);
  saveToLocalStorage();
  displayFolders(categorizedFiles);
  displayFiles(categorizedFiles[fileType]);
  displayBin();
}

function clearBin() {
  bin = [];
  saveToLocalStorage();
  displayBin();
}

function autoDelete(file) {
  setTimeout(() => {
    bin = bin.filter(f => f.id !== file.id);
    saveToLocalStorage();
    displayBin();
  }, 30000); // 30 seconds
}

function editFileName(file) {
  const newFileName = prompt('Enter new file name:', file.name);
  if (newFileName) {
    const fileType = file.type;
    file.name = newFileName;
    saveToLocalStorage();
    displayFolders(categorizedFiles);
    displayFiles(categorizedFiles[fileType]);
  }
}

function showModal(message) {
  document.getElementById('modalMessage').textContent = message;
  document.getElementById('modal').style.display = 'flex';
  return new Promise((resolve, reject) => {
    actionPromise = { resolve, reject };
  });
}

function confirmAction() {
  actionPromise.resolve('Action confirmed');
  document.getElementById('modal').style.display = 'none';
}

function cancelAction() {
  actionPromise.reject('Action cancelled');
  document.getElementById('modal').style.display = 'none';
}

// Initial display
displayFolders(categorizedFiles);
displayBin();
