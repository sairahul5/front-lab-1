import { useState } from "react";
import "./App.css";

function Results({ city, onBack }) {
  const [showMore, setShowMore] = useState(false);

  // demo details
  const data = {
    temp: 28,
    feels_like: 27,
    humidity: 60,
    wind: 6.2,
    sunrise: "06:12",
    sunset: "18:45",
    condition: "Sunny",
    description: "clear sky",
    icon: "https://openweathermap.org/img/wn/01d@2x.png",
  };

  const copyDetails = async () => {
    const text = `${city} — ${data.condition}, ${data.temp}°C, humidity ${data.humidity}%`;
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard");
    } catch {
      alert("Unable to copy");
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">{city || "Weather"}</h1>

      <div className="weather-card animated">
        <div className="card-main">
          <div className="icon-wrap">
            <img src={data.icon} alt="icon" />
          </div>
          <div>
            <h2>{data.temp}°C</h2>
            <p className="muted">{data.description}</p>
          </div>
        </div>

        <div className="card-actions">
          <button className="btn" onClick={() => setShowMore((s) => !s)}>
            {showMore ? "Hide details" : "Show details"}
          </button>
          <button className="btn" onClick={copyDetails}>Copy</button>
          <button className="btn" onClick={onBack}>Back</button>
        </div>

        {showMore && (
          <div className="details">
            <p>Feels like: {data.feels_like}°C</p>
            <p>Humidity: {data.humidity}%</p>
            <p>Wind: {data.wind} m/s</p>
            <p>Sunrise: {data.sunrise}</p>
            <p>Sunset: {data.sunset}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Results;
