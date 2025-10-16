import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import Results from "./Results";

function useDebounced(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function App() {
  const [city, setCity] = useState("");
  const debouncedCity = useDebounced(city, 300);
  const [view, setView] = useState("search");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const suggestionsRef = useRef(null);

  const CITIES = useMemo(
    () => ["London", "Los Angeles", "Lagos", "Lahore", "Lisbon", "Lima", "Lyon", "Lucknow"],
    []
  );

  useEffect(() => {
    if (!debouncedCity) {
      setSuggestions([]);
      return;
    }
    const q = debouncedCity.toLowerCase();
    const matched = CITIES.filter((c) => c.toLowerCase().startsWith(q)).slice(0, 5);
    setSuggestions(matched);
  }, [debouncedCity, CITIES]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!city.trim()) return;
    setLoading(true);

    // emulate network delay
    await new Promise((r) => setTimeout(r, 700));

    setLoading(false);
    setView("results");
  };

  function handleSelectSuggestion(s) {
    setCity(s);
    setSuggestions([]);
  }

  function handleKeyDown(e) {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[activeIdx]);
    }
  }

  const handleBack = () => {
    setView("search");
    setCity("");
    setSuggestions([]);
    setActiveIdx(-1);
  };

  if (view === "results") {
    return <Results city={city} onBack={handleBack} />;
  }

  return (
    <div className="app-container">
      <h1 className="title">Weather Finder</h1>

      <form onSubmit={handleSubmit} className="search-box" role="search" aria-label="Search for city">
        <div className="input-wrap">
          <input
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setActiveIdx(-1);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Enter city name"
            aria-autocomplete="list"
            aria-controls="suggestions"
            aria-expanded={suggestions.length > 0}
          />

          {loading && <div className="spinner" aria-hidden="true" />}

          {suggestions.length > 0 && (
            <ul id="suggestions" className="suggestions" ref={suggestionsRef} role="listbox">
              {suggestions.map((s, i) => (
                <li
                  key={s}
                  role="option"
                  aria-selected={i === activeIdx}
                  className={i === activeIdx ? "active" : ""}
                  onMouseDown={(ev) => {
                    ev.preventDefault();
                    handleSelectSuggestion(s);
                  }}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="submit" className="primary">
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
    </div>
  );
}

export default App;
