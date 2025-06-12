const menu = document.getElementById('menu');
const game = document.getElementById('game');
const gallery = document.getElementById('gallery');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const backBtn = document.getElementById('backBtn');
const saveBtn = document.getElementById('saveBtn');
const objectSelect = document.getElementById('objectSelect');
const imagesDiv = document.getElementById('images');

let isDragging = false;
let startX = 0;
let startY = 0;
let objects = {
  tomato: 'red',
  paintball: 'blue',
  balloon: 'purple',
  duck: 'yellow',
  egg: 'orange'
};

function showMenu() {
  menu.classList.remove('hidden');
  game.classList.add('hidden');
  gallery.classList.remove('hidden');
  loadGallery();
}

function startGame() {
  menu.classList.add('hidden');
  game.classList.remove('hidden');
  gallery.classList.add('hidden');
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

canvas.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.offsetX;
  startY = e.offsetY;
});

canvas.addEventListener('mousemove', (e) => {
  if (isDragging) {
    draw();
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.strokeStyle = '#555';
    ctx.stroke();
  }
});

canvas.addEventListener('mouseup', (e) => {
  if (isDragging) {
    isDragging = false;
    const dx = e.offsetX - startX;
    const dy = e.offsetY - startY;
    const endX = startX + dx * 2;
    const endY = startY + dy * 2;
    splat(endX, endY);
  }
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  loadSplats();
}

let splats = [];

function splat(x, y) {
  const color = objects[objectSelect.value];
  const radius = randomInt(20, 60);
  splats.push({ x, y, color, radius });
  draw();
}

function loadSplats() {
  for (const s of splats) {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    ctx.fillStyle = s.color;
    ctx.fill();
  }
}

function saveToGallery() {
  const data = canvas.toDataURL('image/png');
  let saved = JSON.parse(localStorage.getItem('splatGallery') || '[]');
  saved.push(data);
  localStorage.setItem('splatGallery', JSON.stringify(saved));
  loadGallery();
}

function loadGallery() {
  imagesDiv.innerHTML = '';
  const saved = JSON.parse(localStorage.getItem('splatGallery') || '[]');
  saved.forEach(data => {
    const img = document.createElement('img');
    img.src = data;
    imagesDiv.appendChild(img);
  });
}

startBtn.addEventListener('click', startGame);
backBtn.addEventListener('click', showMenu);
saveBtn.addEventListener('click', saveToGallery);

showMenu();
