// scripts/home.js
// Nav toggle lives in scripts/nav.js, shared by every page.

// ---------------------------------------------------------------
// Weather — Open-Meteo, a free public weather service, for CIDOL
// World's Abuja, Nigeria headquarters. No signup or key needed.
// ---------------------------------------------------------------
const CHAMBER_LAT = 9.0765;
const CHAMBER_LON = 7.3986;

// Open-Meteo returns a numeric WMO weather code, not a text
// description or an icon — this table maps each code to both,
// using the small local icon set in images/weather/.
const WEATHER_CODES = {
  0: { text: "Clear sky", icon: "sun" },
  1: { text: "Mainly clear", icon: "sun" },
  2: { text: "Partly cloudy", icon: "partly-cloudy" },
  3: { text: "Overcast", icon: "cloudy" },
  45: { text: "Foggy", icon: "fog" },
  48: { text: "Foggy", icon: "fog" },
  51: { text: "Light drizzle", icon: "rain" },
  53: { text: "Drizzle", icon: "rain" },
  55: { text: "Dense drizzle", icon: "rain" },
  61: { text: "Light rain", icon: "rain" },
  63: { text: "Rain", icon: "rain" },
  65: { text: "Heavy rain", icon: "rain" },
  80: { text: "Rain showers", icon: "rain" },
  81: { text: "Rain showers", icon: "rain" },
  82: { text: "Heavy rain showers", icon: "rain" },
  95: { text: "Thunderstorm", icon: "thunderstorm" },
  96: { text: "Thunderstorm", icon: "thunderstorm" },
  99: { text: "Thunderstorm", icon: "thunderstorm" },
};

function describeWeather(code) {
  return WEATHER_CODES[code] ?? { text: "Cloudy", icon: "cloudy" };
}

async function loadWeather() {
  const tempEl = document.querySelector("#currentTemp");
  const descEl = document.querySelector("#currentDesc");
  const iconEl = document.querySelector("#currentIcon");
  const forecastEl = document.querySelector("#forecastList");
  const statusEl = document.querySelector("#weatherStatus");
  if (!tempEl || !forecastEl) return;

  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${CHAMBER_LAT}&longitude=${CHAMBER_LON}` +
    `&current=temperature_2m,weather_code` +
    `&daily=temperature_2m_max,weather_code` +
    `&timezone=auto&forecast_days=4`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather request failed with status ${response.status}`);
    }

    const data = await response.json();
    const current = describeWeather(data.current.weather_code);

    tempEl.textContent = `${Math.round(data.current.temperature_2m)}\u00b0C`;
    descEl.textContent = current.text;
    iconEl.src = `images/weather/${current.icon}.svg`;
    iconEl.alt = current.text;
    iconEl.hidden = false;

    // Skip today (index 0) — the next three days make the forecast.
    const days = data.daily.time.slice(1, 4);
    const highs = data.daily.temperature_2m_max.slice(1, 4);
    const codes = data.daily.weather_code.slice(1, 4);

    forecastEl.innerHTML = days
      .map((isoDate, i) => {
        const label = new Date(isoDate).toLocaleDateString("en-GB", { weekday: "short" });
        const condition = describeWeather(codes[i]);
        return `
          <li class="forecast-day">
            <span class="forecast-day__label">${label}</span>
            <img src="images/weather/${condition.icon}.svg" alt="${condition.text}" width="32" height="32" loading="lazy">
            <span class="forecast-day__temp">${Math.round(highs[i])}\u00b0C</span>
          </li>
        `;
      })
      .join("");

    if (statusEl) statusEl.hidden = true;
  } catch (error) {
    console.error("Could not load weather:", error);
    if (statusEl) {
      statusEl.textContent = "Weather is temporarily unavailable.";
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
