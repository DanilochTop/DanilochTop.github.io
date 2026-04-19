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

// Date and Time //

function updateTime() {
	const timeElement = document.querySelector('.menu-section .bottom .time');
	const now = new Date();
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	timeElement.textContent = `${hours}:${minutes}`;
}

updateTime();
document.querySelector('.menu-section .bottom .time').style.animation = 'timeFadeIn 1s ease-in-out forwards';

setInterval(updateTime, 1000);