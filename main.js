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
let currentX = 0;
let currentY = 0;
const slingshot = { x: 80, y: canvas.height - 120 };
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
  // clear current drawing when returning to the menu
  splats = [];
  draw();
}

function startGame() {
  menu.classList.add('hidden');
  game.classList.remove('hidden');
  gallery.classList.add('hidden');
  // start with a blank canvas for a new masterpiece
  splats = [];
  draw();
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

canvas.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = slingshot.x;
  startY = slingshot.y;
  currentX = e.offsetX;
  currentY = e.offsetY;
});

canvas.addEventListener('mousemove', (e) => {
  if (isDragging) {
    currentX = e.offsetX;
    currentY = e.offsetY;
    draw();
  }
});

canvas.addEventListener('mouseup', (e) => {
  if (isDragging) {
    isDragging = false;
    const dx = currentX - startX;
    const dy = currentY - startY;
    const endX = startX + dx * 2;
    const endY = startY + dy * 2;
    splat(endX, endY);
    draw();
  }
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawArtboard();
  loadSplats();
  drawSlingshot();
  if (isDragging) {
    drawBand(currentX, currentY);
  }
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

function drawSlingshot() {
  ctx.strokeStyle = '#8b4513';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(slingshot.x - 20, slingshot.y);
  ctx.lineTo(slingshot.x, slingshot.y - 60);
  ctx.lineTo(slingshot.x + 20, slingshot.y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(slingshot.x, slingshot.y);
  ctx.lineTo(slingshot.x, slingshot.y + 40);
  ctx.stroke();
}

function drawBand(x, y) {
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(slingshot.x - 20, slingshot.y);
  ctx.lineTo(x, y);
  ctx.lineTo(slingshot.x + 20, slingshot.y);
  ctx.stroke();
}

function drawArtboard() {
  ctx.fillStyle = '#fff5e6';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
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
    img.alt = 'Saved artwork';
    imagesDiv.appendChild(img);
  });
}

startBtn.addEventListener('click', startGame);
backBtn.addEventListener('click', showMenu);
saveBtn.addEventListener('click', saveToGallery);

showMenu();
