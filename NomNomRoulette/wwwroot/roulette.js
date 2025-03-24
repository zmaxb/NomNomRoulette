let restaurants = [];
let spinSpeed = 20;
let spinDuration = 10000;
let spinPowerMin = 10;
let spinPowerMax = 100;

let startAngle = 0;
let arc = 0;
let spinTimeout = null;

let canvas, ctx;
let spinAngleDelta = 0;
let spinTime = 0;

function drawRouletteWheel() {
    canvas = document.getElementById("roulette");
    if (!canvas) return;

    const size = Math.min(window.innerWidth, 800);
    canvas.width = size;
    canvas.height = size;

    ctx = canvas.getContext("2d");

    const centerX = size / 2;
    const centerY = size / 2;

    const outsideRadius = size * 0.42;
    const textRadius = size * 0.3;
    const insideRadius = size * 0.12;

    ctx.clearRect(0, 0, size, size);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    restaurants.forEach((rest, i) => {
        const angle = startAngle + i * arc;
        ctx.beginPath();
        ctx.fillStyle = rest.color;
        ctx.arc(centerX, centerY, outsideRadius, angle, angle + arc, false);
        ctx.arc(centerX, centerY, insideRadius, angle + arc, angle, true);
        ctx.fill();

        ctx.save();
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const textX = centerX + Math.cos(angle + arc / 2) * textRadius;
        const textY = centerY + Math.sin(angle + arc / 2) * textRadius;

        ctx.translate(textX, textY);
        ctx.rotate(angle + arc / 2);

        const text = rest.name;
        let fontSize = size / 30;
        ctx.font = `bold ${fontSize}px sans-serif`;
        const maxWidth = arc * textRadius * 1.5;

        while (ctx.measureText(text).width > maxWidth && fontSize > 10) {
            fontSize--;
            ctx.font = `bold ${fontSize}px sans-serif`;
        }

        ctx.fillText(text, 0, 0);
        ctx.restore();
    });

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.moveTo(centerX - size * 0.04, centerY - (outsideRadius + size * 0.05));
    ctx.lineTo(centerX + size * 0.04, centerY - (outsideRadius + size * 0.05));
    ctx.lineTo(centerX, centerY - (outsideRadius - size * 0.015));
    ctx.fill();
}

function showFireworks() {
    const canvas = document.getElementById("fireworks");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const bursts = 3;

    for (let i = 0; i < bursts; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height * 0.7;

        for (let j = 0; j < 50; j++) {
            particles.push({
                x,
                y,
                dx: (Math.random() - 0.5) * 8,
                dy: (Math.random() - 0.5) * 8,
                radius: Math.random() * 3 + 1,
                color: `hsl(${Math.random() * 360}, 100%, 60%)`,
                alpha: 1,
                decay: Math.random() * 0.02 + 0.01
            });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.dx;
            p.y += p.dy;
            p.alpha -= p.decay;
        });

        particles.forEach(p => {
            if (p.alpha <= 0) return;
            ctx.beginPath();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.globalAlpha = 1;
        if (particles.some(p => p.alpha > 0)) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    animate();
}

function rotateWheel() {
    spinTime += spinSpeed;

    if (spinTime >= spinDuration) {
        stopRotateWheel();
        showFireworks();
        return;
    }

    spinAngleDelta *= 0.985;
    startAngle += (spinAngleDelta * Math.PI / 180);
    drawRouletteWheel();
    spinTimeout = setTimeout(rotateWheel, spinSpeed);
}

function stopRotateWheel() {
    clearTimeout(spinTimeout);
    spinAngleDelta = 0;

    const degrees = startAngle * 180 / Math.PI + 90;
    const arcd = arc * 180 / Math.PI;
    const index = Math.floor((360 - (degrees % 360)) / arcd);

    let planBIndex;
    do {
        planBIndex = Math.floor(Math.random() * restaurants.length);
    } while (planBIndex === index);

    document.getElementById("result").innerHTML = `
        <div style="font-size: 24px;">😊 Let's eat at: <strong>${restaurants[index].name}</strong></div>
        <div style="font-size: 16px; opacity: 0.7; margin-top: 4px;">Plan 'B': ${restaurants[planBIndex].name}</div>
    `;
}

window.initRoulette = async function () {
    try {
        const response = await fetch("/api/restaurants");
        if (!response.ok) throw new Error("Failed to fetch restaurants.json");

        restaurants = await response.json();
        arc = Math.PI / (restaurants.length / 2);
        drawRouletteWheel();
    } catch (e) {
        console.error("Failed to load restaurants:", e);
        alert("Failed to load restaurant list");
    }
};

window.spinRoulette = function () {
    document.getElementById("result").innerHTML = "";
    spinTime = 0;
    spinAngleDelta = Math.random() * (spinPowerMax - spinPowerMin) + spinPowerMin;
    rotateWheel();
};
