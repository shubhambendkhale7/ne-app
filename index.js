const files = [
  { id: 1, name: 'document1', type: '.txt' },
  { id: 2, name: 'presentation1', type: '.pdf' },
  { id: 3, name: 'song1', type: '.mp3' },
  { id: 4, name: 'installer1', type: '.exe' },
  { id: 5, name: 'archive1', type: '.rar' },
  { id: 6, name: 'report1', type: '.docx' },
  { id: 7, name: 'image1', type: '.jpg' },
  { id: 8, name: 'graphic1', type: '.png' },
  { id: 9, name: 'animation1', type: '.gif' },
  { id: 10, name: 'compressed1', type: '.zip' },
  // more files as needed
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

const bin = [];

const categorizeFiles = (files) => {
  return files.reduce((acc, file) => {
    if (!acc[file.type]) {
      acc[file.type] = [];
    }
    acc[file.type].push(file);
    return acc;
  }, {});
};

const displayFolders = (folders) => {
  const folderContainer = document.getElementById('folders');
  folderContainer.innerHTML = '';
  for (const [type, files] of Object.entries(folders)) {
    const folder = document.createElement('div');
    folder.textContent = type;
    folder.className = 'folder';
    folder.onclick = () => displayFiles(files);
    folderContainer.appendChild(folder);
  }
};

const displayFiles = (files) => {
  const fileList = document.getElementById('file-list');
  fileList.innerHTML = '';
  files.forEach(file => {
    const fileItem = document.createElement('div');
    fileItem.className = 'file';
    const icon = document.createElement('img');
    icon.src = fileIcons[file.type];
    const fileName = document.createElement('div');
    fileName.textContent = file.name;
    fileItem.appendChild(icon);
    fileItem.appendChild(fileName);
    fileItem.onclick = () => addToBin(file);
    fileList.appendChild(fileItem);
  });
};

const searchFiles = () => {
  const query = document.getElementById('search').value.toLowerCase();
  const files = Array.from(document.querySelectorAll('#file-list .file'));
  files.forEach(file => {
    file.style.display = file.textContent.toLowerCase().includes(query) ? '' : 'none';
  });
};

let isAscending = true;

const sortFiles = () => {
  const files = Array.from(document.querySelectorAll('#file-list .file'));
  files.sort((a, b) => isAscending
    ? a.textContent.localeCompare(b.textContent)
    : b.textContent.localeCompare(a.textContent));
  
  const fileList = document.getElementById('file-list');
  fileList.innerHTML = '';
  files.forEach(file => fileList.appendChild(file));
  isAscending = !isAscending;
};

const addToBin = (file) => {
  bin.push(file);
  displayBin();
  setTimeout(() => removeFromBin(file), 30000);
};

const removeFromBin = (file) => {
  const index = bin.indexOf(file);
  if (index !== -1) {
    bin.splice(index, 1);
    displayBin();
  }
};

const displayBin = () => {
  const binContainer = document.getElementById('bin');
  binContainer.innerHTML = 'Bin:';
  bin.forEach(file => {
    const binItem = document.createElement('div');
    binItem.className = 'bin-item';
    binItem.textContent = file.name;
    binItem.onclick = () => restoreFromBin(file);
    binContainer.appendChild(binItem);
  });
};

const restoreFromBin = (file) => {
  const index = bin.indexOf(file);
  if (index !== -1) {
    bin.splice(index, 1);
    displayBin();
    displayFiles(categorizeFiles(files)[file.type]);
  }
};

const folders = categorizeFiles(files);
displayFolders(folders);
