
document.addEventListener("DOMContentLoaded", () => {


    const buttons = document.querySelectorAll("nav button");
    const sections = document.querySelectorAll("section");

    buttons.forEach(button => {
        button.addEventListener("click", () => {

            const target = button.getAttribute("data-target");

            sections.forEach(section => {
                section.classList.remove("active");
            });

            const activeSection = document.getElementById(target);
            if (activeSection) {
                activeSection.classList.add("active");
            }

            if (target === "character") {
                animateBars();
            }
        });
    });


    const modal = document.getElementById("projectModal");

    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

});


function animateBars() {
    const fills = document.querySelectorAll(".fill");

    fills.forEach(fill => {
        fill.style.width = "0%";
    });

    setTimeout(() => {
        fills.forEach(fill => {

            let width = "0%";

            if (fill.classList.contains("html")) {
                width = "80%";
            } else if (fill.classList.contains("css")) {
                width = "75%";
            } else if (fill.classList.contains("js")) {
                width = "60%";
            } else if (fill.classList.contains("gd")) {
                width = "60%";
            }

            fill.style.width = width;
        });
    }, 50);
}



function openProject(title, description, siteUrl, githubUrl) {
    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalDescription").innerText = description;

    document.getElementById("siteLink").href = siteUrl;
    document.getElementById("githubLink").href = githubUrl;

    document.getElementById("projectModal").classList.remove("hidden");
}


function closeModal() {
    document.getElementById("projectModal").classList.add("hidden");
}

async function getQuest() {
    const text = document.getElementById("questText");
    text.innerText = "Loading quest...";

    try {
        const response = await fetch("https://api.adviceslip.com/advice");
        const data = await response.json();

        text.innerText = "Advice: " + data.slip.advice;

    } catch (error) {
        text.innerText = "Advice failed to load";
        console.error(error);
    }
}

async function getWeather() {
    const city = document.getElementById("cityInput").value;
    const text = document.getElementById("weatherText");

    if (!city) {
        text.innerText = "Enter a city first!";
        return;
    }

    text.innerText = "Loading weather";

    try {
        // Eerst: stad → coordinaten
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
        const geoData = await geoRes.json();

        if (!geoData.results) {
            text.innerText = "City not found";
            return;
        }

        const lat = geoData.results[0].latitude;
        const lon = geoData.results[0].longitude;

        // Dan: weer ophalen
        const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );

        const weatherData = await weatherRes.json();

        const temp = weatherData.current_weather.temperature;
        const wind = weatherData.current_weather.windspeed;

        text.innerText = `${temp}°C |Wind: ${wind} km/h`;

    } catch (error) {
        text.innerText = "Weather failed to load";
        console.error(error);
    }
}