// Cursor //

const cursorSpritesheet = {
	'default': [0, 0],
	'pointer': [-32, 0],
	'help': [-64, 0],
	'text': [-96, 0],
	'not-allowed': [0, -32],
	'crosshair': [-32, -32],
	'all-scroll': [-96, -32],
	'e-resize': [-0, -64],
	'n-resize': [-32, -64],
	'nw-resize': [-64, -64],
	'ne-resize': [-96, -64],
	'progress': [
		[0, -96],
		[-32, -96],
		[-64, -96],
		[-96, -96],
		[0, -128],
		[-32, -128],
		[-64, -128],
		[-96, -128]
	],
	'wait': [
		[0, -160],
		[-32, -160],
		[-64, -160],
		[-96, -160],
		[0, -192],
		[-32, -192],
		[-64, -192],
		[-96, -192],
		[0, -224],
		[-32, -224],
		[-64, -224],
		[-96, -224],
		[0, -256],
		[-32, -256],
		[-64, -256],
		[-96, -256]
	]
}

const cursor = document.querySelector('#cursor');

let originalCursors = [];

document.querySelectorAll("*").forEach(element => {
	let style = window.getComputedStyle(element);

	if (style.cursor !== "none") {
		originalCursors.push({ element: element, cursor: style.cursor });
		element.style.cursor = "none";
	}
});

let currentCursorStyle = 'default';
let currentAnimationInterval = null;

document.addEventListener('mousemove', e => {
	let currentElement = document.elementFromPoint(e.clientX, e.clientY);
	let originalCursor = originalCursors.find(item => item.element === currentElement);

	let cursorStyle = originalCursor && cursorSpritesheet[originalCursor.cursor] ? originalCursor.cursor : 'default';
	
	if (cursorStyle !== currentCursorStyle) {
		currentCursorStyle = cursorStyle;

		if (currentAnimationInterval) {
			clearInterval(currentAnimationInterval);
			currentAnimationInterval = null;
		}
		
		if (typeof(cursorSpritesheet[cursorStyle][0]) === 'number') {
			cursor.style.backgroundPosition = cursorSpritesheet[cursorStyle].map(pos => `${pos}px`).join(' ');
		} else if (typeof(cursorSpritesheet[cursorStyle][0]) === 'object') {
			let currentIndex = 0;

			cursor.style.backgroundPosition = cursorSpritesheet[cursorStyle][currentIndex].map(pos => `${pos}px`).join(' ');
		
			currentAnimationInterval = setInterval(() => {
				currentIndex = (currentIndex + 1) % cursorSpritesheet[cursorStyle].length;
				cursor.style.backgroundPosition = cursorSpritesheet[cursorStyle][currentIndex].map(pos => `${pos}px`).join(' ');
			}, 100);
		}
	}

	cursor.style.left = e.clientX + 'px';
	cursor.style.top = e.clientY + 'px';
});

document.addEventListener('mouseenter', e => {
	cursor.style.display = 'block';
});

document.addEventListener('mouseleave', e => {
	cursor.style.display = 'none';
});

// Background Channels //

const backgroundChannelsContainer = document.querySelector('.background-channels');

function createChannel() {
	let channel = document.createElement('div');
	channel.classList.add('channel');
	backgroundChannelsContainer.appendChild(channel);

	let canvas = document.createElement('canvas');
	channel.appendChild(canvas);
}

let channelCanvasContexts = [];

function handleChannelCanvas() {
	channelCanvasContexts = []; // Clear previous contexts in case of reinitialization

	let channelCanvases = document.querySelectorAll('.channel canvas');

	channelCanvases.forEach(canvas => {
		let context = canvas.getContext('2d');

		channelCanvasContexts.push({ canvas, context });

		resizeChannelCanvas(canvas);
	});

	window.addEventListener('resize', () => {
		channelCanvases.forEach(canvas => {
			resizeChannelCanvas(canvas);
		});
	});
}

function resizeChannelCanvas(canvas) {
	canvas.width = canvas.parentElement.clientWidth;
	canvas.height = canvas.parentElement.clientHeight;
}

function channelCanvasDrawNoise(context, width, height) {
	let imageData = context.getImageData(0, 0, width, height);
	let buffer = new Uint32Array(imageData.data.buffer);

	for (let i = 0; i < buffer.length; i++) {
		const color = Math.random() * 255 | 0;
		buffer[i] = (255 << 24) | (color << 16) | (color << 8) | color;
	}

	context.putImageData(imageData, 0, 0);
}

let lastRenderTimestamp = 0;

function channelCanvasAnimationLoop(renderTimestamp) {
	if (renderTimestamp - lastRenderTimestamp > 50) { // Limit to ~20 FPS
		channelCanvasContexts.forEach(({ canvas, context }) => {
			channelCanvasDrawNoise(context, canvas.width, canvas.height);
		});

		lastRenderTimestamp = renderTimestamp;
	}

	requestAnimationFrame(channelCanvasAnimationLoop);
}

const backgroundChannelsCount = 12;

for (let i = 0; i < backgroundChannelsCount; i++) {
	createChannel();
}

handleChannelCanvas();
channelCanvasAnimationLoop();

// Date and Time //

function updateTime() {
	let timeElement = document.querySelector('.menu-section .bottom .time');
	let now = new Date();

	let isAmPm = new Intl.DateTimeFormat(undefined, { hour: "numeric" }).resolvedOptions().hour12;

	let hours = String(now.getHours()).padStart(2, '0');
	let minutes = String(now.getMinutes()).padStart(2, '0');

	if (isAmPm) {
		hours = String(hours % 12 || 12).padStart(2, '0'); // Convert to 12-hour format
	}

	timeElement.innerHTML = `${hours}:${minutes}` + '<span class="ampm">' + (isAmPm ? (now.getHours() < 12 ? 'AM' : 'PM') : '') + '</span>';
}

function updateDate() {
	let dateElement = document.querySelector('.menu-section .bottom .date');
	let now = new Date();

	let formattedDate = now.toLocaleDateString(undefined, { weekday: 'short', month: '2-digit', day: '2-digit' })

	formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1); // Capitalize first letter of the weekday
	formattedDate = formattedDate.replace(/[,.]/g, ''); // Remove comma/dot if present

	dateElement.innerHTML = formattedDate;
}

updateTime();
updateDate();

document.querySelector('.menu-section .bottom .time').style.animation = 'dateTimeFadeIn 0.25s ease-in-out forwards';
document.querySelector('.menu-section .bottom .date').style.animation = 'dateTimeFadeIn 0.25s ease-in-out forwards';

setInterval(updateTime, 1000);