let restaurants = [
    { name: "🍗 KFC", color: "#FFC107" },
    { name: "🍔 Макдональдс", color: "#FF6347" },
    { name: "🍣 Суши Wok", color: "#20B2AA" },
    { name: "🍟 Burger King", color: "#FF8C00" },
    { name: "🍕 Додо Пицца", color: "#FFB347", icon: "img/dodo.png" },
    { name: "🍱 Тануки", color: "#8A2BE2" },
    { name: "🥤 Папа Джонс", color: "#2ECC71" },
    { name: "🍜 Якитория", color: "#FF69B4" }
];

let spinSpeed = 20;
let spinDuration = 10000;
let spinPowerMin = 10;
let spinPowerMax = 100;

let startAngle = 0;
let arc = Math.PI / (restaurants.length / 2);
let spinTimeout = null;

let canvas, ctx;
let spinAngle = 0;
let spinAngleDelta = 0;
let spinTime = 0;

let currentAcceleration = 0;

function drawRouletteWheel() {
    canvas = document.getElementById("roulette");
    if (!canvas) return;
    ctx = canvas.getContext("2d");

    const canvasSize = 800;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    let outsideRadius = 340;
    let textRadius = 300;
    let insideRadius = 90;

    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    for (let i = 0; i < restaurants.length; i++) {
        let angle = startAngle + i * arc;
        ctx.fillStyle = restaurants[i].color;

        ctx.beginPath();
        ctx.arc(centerX, centerY, outsideRadius, angle, angle + arc, false);
        ctx.arc(centerX, centerY, insideRadius, angle + arc, angle, true);
        ctx.fill();

        ctx.save();
        ctx.fillStyle = "black";
        ctx.translate(
            centerX + Math.cos(angle + arc / 2) * textRadius,
            centerY + Math.sin(angle + arc / 2) * textRadius
        );
        ctx.rotate(angle + arc / 2);

        let text = restaurants[i].name;
        let maxWidth = arc * textRadius * 1.5;
        let fontSize = 22;
        ctx.font = `bold ${fontSize}px sans-serif`;

        while (ctx.measureText(text).width > maxWidth && fontSize > 10) {
            fontSize--;
            ctx.font = `bold ${fontSize}px sans-serif`;
        }

        ctx.fillText(text, (-ctx.measureText(text).width / 2) - 95, 0);
        ctx.restore();
    }
    
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.moveTo(centerX - 30, centerY - (outsideRadius + 40));
    ctx.lineTo(centerX + 30, centerY - (outsideRadius + 40));
    ctx.lineTo(centerX, centerY - (outsideRadius - 5));
    ctx.fill();
}

function rotateWheel() {
    spinTime += spinSpeed;

    if (spinTime >= spinDuration) {
        stopRotateWheel();
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

    let degrees = startAngle * 180 / Math.PI + 90;
    let arcd = arc * 180 / Math.PI;
    let index = Math.floor((360 - (degrees % 360)) / arcd);
    
    let planBIndex;
    do {
        planBIndex = Math.floor(Math.random() * restaurants.length);
    } while (planBIndex === index);

    // Выводим оба варианта
    document.getElementById("result").innerHTML = `
        <div style="font-size: 24px;">😊 Let's eat at:: <strong>${restaurants[index].name}</strong></div>
        <div style="font-size: 16px; opacity: 0.7; margin-top: 4px;">Plan 'B': ${restaurants[planBIndex].name}</div>
    `;
}

window.initRoulette = async function () {
    try {
        const response = await fetch("/api/restaurants");
        if (!response.ok) throw new Error("Failed to fetch restaurants.json");

        restaurants = await response.json();

        arc = Math.PI / (restaurants.length / 2); // пересчитать сектор
        drawRouletteWheel();
    } catch (e) {
        console.error("💥 Failed to load restaurants:", e);
        alert("❌ Failed to load restaurant list");
    }
}


window.spinRoulette = function () {
    document.getElementById("result").innerHTML = "";
    spinTime = 0;
    spinAngleDelta = Math.random() * (spinPowerMax - spinPowerMin) + spinPowerMin;
    rotateWheel();
}