// scripts/home.js
// Course objective 2: variables, functions, objects, template literals.
// Course objective 3: fetch()/async-await driven DOM updates.
// Nav toggle lives in scripts/nav.js, shared by every page.

// ---------------------------------------------------------------
// Weather — OpenWeatherMap current conditions + 3-day forecast
// ---------------------------------------------------------------

// Get a free key at https://openweathermap.org/api and paste it below.
// Coordinates are for CIDOL World's Abuja, Nigeria headquarters.
const WEATHER_API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";
const CHAMBER_LAT = 9.0765;
const CHAMBER_LON = 7.3986;

async function loadWeather() {
  const tempEl = document.querySelector("#currentTemp");
  const descEl = document.querySelector("#currentDesc");
  const iconEl = document.querySelector("#currentIcon");
  const forecastEl = document.querySelector("#forecastList");
  const statusEl = document.querySelector("#weatherStatus");
  if (!tempEl || !forecastEl) return;

  if (!WEATHER_API_KEY || WEATHER_API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") {
    if (statusEl) {
      statusEl.textContent =
        "Add a free OpenWeatherMap API key in scripts/home.js (WEATHER_API_KEY) to show live weather.";
      statusEl.hidden = false;
    }
    return;
  }

  const base = "https://api.openweathermap.org/data/2.5";
  const currentUrl = `${base}/weather?lat=${CHAMBER_LAT}&lon=${CHAMBER_LON}&units=metric&appid=${WEATHER_API_KEY}`;
  const forecastUrl = `${base}/forecast?lat=${CHAMBER_LAT}&lon=${CHAMBER_LON}&units=metric&appid=${WEATHER_API_KEY}`;

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl),
    ]);

    if (!currentRes.ok || !forecastRes.ok) {
      throw new Error("Weather request failed");
    }

    const current = await currentRes.json();
    const forecast = await forecastRes.json();

    const currentCondition = current.weather[0];
    tempEl.textContent = `${Math.round(current.main.temp)}\u00b0C`;
    descEl.textContent = currentCondition.description;
    iconEl.src = `https://openweathermap.org/img/wn/${currentCondition.icon}@2x.png`;
    iconEl.alt = currentCondition.description;

    // The free /forecast endpoint returns one entry every 3 hours for
    // 5 days. Taking the 12:00 entry for each date gives one clearly
    // labeled reading per day for the next three days.
    const middayEntries = forecast.list
      .filter((entry) => entry.dt_txt.includes("12:00:00"))
      .slice(0, 3);

    forecastEl.innerHTML = middayEntries
      .map((entry) => {
        const day = new Date(entry.dt_txt).toLocaleDateString("en-GB", {
          weekday: "short",
        });
        const condition = entry.weather[0];
        return `
          <li class="forecast-day">
            <span class="forecast-day__label">${day}</span>
            <img src="https://openweathermap.org/img/wn/${condition.icon}.png" alt="${condition.description}" width="40" height="40" loading="lazy">
            <span class="forecast-day__temp">${Math.round(entry.main.temp)}\u00b0C</span>
          </li>
        `;
      })
      .join("");

    if (statusEl) statusEl.hidden = true;
  } catch (error) {
    console.error("Could not load weather:", error);
    if (statusEl) {
      statusEl.textContent = "Weather is temporarily unavailable. Please try again later.";
      statusEl.hidden = false;
    }
  }
}

// ---------------------------------------------------------------
// Member spotlights — random gold/silver picks from members.json
// ---------------------------------------------------------------
const SPOTLIGHT_LEVEL_LABELS = {
  2: { text: "Silver Member", badgeClass: "badge--silver" },
  3: { text: "Gold Member", badgeClass: "badge--gold" },
};

function spotlightCardTemplate(member) {
  const level = SPOTLIGHT_LEVEL_LABELS[member.level];

  return `
    <article class="spotlight-card">
      <img src="images/members/${member.image}" alt="${member.name} logo" width="120" height="80" loading="lazy">
      <div class="spotlight-card__body">
        <div class="spotlight-card__top">
          <h3>${member.name}</h3>
          <span class="badge ${level.badgeClass}">${level.text}</span>
        </div>
        <ul class="spotlight-card__meta">
          <li>${member.address}</li>
          <li><a href="tel:${member.phone.replace(/[^\d+]/g, "")}">${member.phone}</a></li>
          <li><a href="${member.url}" target="_blank" rel="noopener">${member.url.replace(/^https?:\/\//, "")}</a></li>
        </ul>
      </div>
    </article>
  `;
}

// Fisher-Yates shuffle so each page load can surface a different set
// of eligible members, not just the first few in the JSON file.
function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

async function loadSpotlights() {
  const container = document.querySelector("#spotlights");
  const statusEl = document.querySelector("#spotlightStatus");
  if (!container) return;

  try {
    const response = await fetch("data/members.json");
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    const eligible = data.members.filter(
      (member) => member.level === 2 || member.level === 3
    );

    const picks = shuffle(eligible).slice(0, eligible.length >= 3 ? 3 : 2);
    container.innerHTML = picks.map(spotlightCardTemplate).join("");

    if (statusEl) statusEl.hidden = true;
  } catch (error) {
    console.error("Could not load member spotlights:", error);
    if (statusEl) {
      statusEl.textContent = "Member spotlights are temporarily unavailable.";
      statusEl.hidden = false;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadWeather();
  loadSpotlights();
});
