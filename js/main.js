/// INIT ////////////////////////
const vcard=document.querySelectorAll('.vcard');
vcard.forEach((element) => element.style.display='none');

/// SLEEP FUNCTION /////////////
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//// 3D CARD///////////////////
const card = document.querySelector('#card');
const recto = document.querySelector('#recto');
const verso = document.querySelector('#verso');

let isDragging = false;
let prevX = 0;
let prevY = 0;
let startAngleX = 0;
let startAngleY = 0;
let lastAngleX = 0;
let lastAngleY = 0;

card.addEventListener('mousedown', async function(e) {
    await sleep(100);
    isDragging = true;
    prevX = e.clientX;
    prevY = e.clientY;
    startAngleX = getRotationAngleX(card);
    startAngleY = getRotationAngleY(card);
    lastAngleX = startAngleX;
    lastAngleY = startAngleY;
    card.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const diffX = e.clientX - prevX;
    const diffY = e.clientY - prevY;
    const newAngleX = startAngleX + (diffX * 0.4);
    const newAngleY = startAngleY - (diffY * 0.4);
    card.style.transform = `rotateY(${newAngleX}deg) rotateX(${newAngleY}deg)`;

    const isTurningOnX = Math.sign(newAngleX - lastAngleX) !== Math.sign(diffX);
    const isTurningOnY = Math.sign(newAngleY - lastAngleY) !== Math.sign(diffY);

    if (isTurningOnX || isTurningOnY) {
        if (Math.abs(newAngleX) >= 90 || Math.abs(newAngleY) >= 90) {
            recto.style.display = 'none';
            verso.style.display = 'block';
        } else {
            recto.style.display = 'block';
            verso.style.display = 'none';
        }
    }

    lastAngleX = newAngleX;
    lastAngleY = newAngleY;
});

document.addEventListener('mouseup', async function() {
    await sleep(100);
    isDragging = false;
    card.style.cursor = 'grab';
});

function getRotationAngleX(element) {
    const transform = window.getComputedStyle(element).getPropertyValue('transform');
    const matrix = transform.match(/^matrix3d\((.+)\)$/);
    if (matrix) {
        const values = matrix[1].split(', ');
        return Math.atan2(parseFloat(values[1]), parseFloat(values[0])) * (180 / Math.PI);
    }
    return 0;
}

function getRotationAngleY(element) {
    const transform = window.getComputedStyle(element).getPropertyValue('transform');
    const matrix = transform.match(/^matrix3d\((.+)\)$/);
    if (matrix) {
        const values = matrix[1].split(', ');
        return Math.atan2(parseFloat(values[9]), parseFloat(values[5])) * (180 / Math.PI);
    }
    return 0;
}



/// ON CLICK ////////////////////////////

const intro=document.querySelectorAll('.intro');

card.addEventListener('click', async function() {
    if (!isDragging) {
        intro.forEach((element) => element.style.display='none');
        vcard.forEach((element) => fadeIn(element));
        vcard.forEach((element) => element.style.display='flex');
        await sleep(2000);
        vcard.forEach((element) => element.classList.remove('fadeIn'));
    }
});

function fadeIn(element) {
    if(element.id != 'backgroundVideo') {
        element.classList.add('fadeIn');
    } else {
        element.classList.add('fadeInVideo');
    }
}

/// Random move /////////////////////////////////////



