// Example Data
const files = [
  'document1.txt', 'presentation1.pdf', 'song1.mp3', 'installer1.exe',
  'archive1.rar', 'report1.docx', 'image1.jpg', 'graphic1.png', 'animation1.gif',
  'compressed1.zip', 'document2.txt', 'presentation2.pdf', 'song2.mp3',
  null, 'document3.txt'
].filter(Boolean).map((file, index) => {
  const [name, type] = file.split('.');
  return { id: index + 1, name, type: `.${type}` };
});

// File Icons
const fileIcons = {
  '.txt': 'https://via.placeholder.com/50?text=TXT',
  '.pdf': 'https://via.placeholder.com/50?text=PDF',
  '.mp3': 'https://via.placeholder.com/50?text=MP3',
  '.exe': 'https://via.placeholder.com/50?text=EXE',
  '.rar': 'https://via.placeholder.com/50?text=RAR',
  '.docx': 'https://via.placeholder.com/50?text=DOCX',
  '.jpg': 'https://via.placeholder.com/50?text=JPG',
  '.png': 'https://via.placeholder.com/50?text=PNG',
  '.gif': 'https://via.placeholder.com/50?text=GIF',
  '.zip': 'https://via.placeholder.com/50?text=ZIP'
};

// Categorized Files
const categorizedFiles = files.reduce((folders, file) => {
  if (!folders[file.type]) folders[file.type] = [];
  folders[file.type].push(file);
  return folders;
}, {});

// Bin Management
const bin = JSON.parse(localStorage.getItem('bin')) || [];

// DOM Elements
const folderContainer = document.getElementById('folders');
const fileList = document.getElementById('file-list');
const binContainer = document.getElementById('bin');

// Helper Functions
function renderFolders() {
  folderContainer.innerHTML = '';
  Object.keys(categorizedFiles).forEach(type => {
    const folder = document.createElement('div');
    folder.textContent = type;
    folder.classList.add('folder');
    folder.onclick = () => renderFiles(type);
    folderContainer.appendChild(folder);
  });
}

function renderFiles(type) {
  fileList.innerHTML = '';
  categorizedFiles[type].forEach(file => {
    const fileItem = document.createElement('div');
    fileItem.classList.add('file-item');

    const icon = document.createElement('img');
    icon.src = fileIcons[file.type] || 'https://via.placeholder.com/50?text=FILE';

    const fileName = document.createElement('div');
    fileName.textContent = file.name;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deleteFile(file.id, type);

    fileItem.appendChild(icon);
    fileItem.appendChild(fileName);
    fileItem.appendChild(deleteButton);
    fileList.appendChild(fileItem);
  });
}

function renderBin() {
  binContainer.innerHTML = '';
  bin.forEach(file => {
    const fileItem = document.createElement('div');
    fileItem.classList.add('file-item');

    const fileName = document.createElement('div');
    fileName.textContent = file.name;

    const restoreButton = document.createElement('button');
    restoreButton.textContent = 'Restore';
    restoreButton.onclick = () => restoreFile(file.id);

    fileItem.appendChild(fileName);
    fileItem.appendChild(restoreButton);
    binContainer.appendChild(fileItem);
  });
}

function deleteFile(fileId, type) {
  const fileIndex = categorizedFiles[type].findIndex(file => file.id === fileId);
  const [removedFile] = categorizedFiles[type].splice(fileIndex, 1);
  bin.push(removedFile);
  localStorage.setItem('bin', JSON.stringify(bin));
  renderFiles(type);
  renderBin();
}

function restoreFile(fileId) {
  const fileIndex = bin.findIndex(file => file.id === fileId);
  const [restoredFile] = bin.splice(fileIndex, 1);
  categorizedFiles[restoredFile.type].push(restoredFile);
  localStorage.setItem('bin', JSON.stringify(bin));
  renderFiles(restoredFile.type);
  renderBin();
}

// Modal for Confirmations
function confirmAction(message) {
  return new Promise((resolve, reject) => {
    const modal = document.getElementById('modal');
    const overlay = document.getElementById('overlay');
    const modalMessage = document.getElementById('modal-message');

    modalMessage.textContent = message;
    modal.style.display = 'block';
    overlay.style.display = 'block';

    document.getElementById('confirm').onclick = () => {
      modal.style.display = 'none';
      overlay.style.display = 'none';
      resolve();
    };

    document.getElementById('cancel').onclick = () => {
      modal.style.display = 'none';
      overlay.style.display = 'none';
      reject();
    };
  });
}

// Initialize App
renderFolders();
renderBin();
