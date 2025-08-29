import { useEffect, useMemo, useRef, useState } from "react";
import RecipeCard from "../components/RecipeCard.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [fltDifficulty, setFltDifficulty] = useState("any");
  const [fltMaxTime, setFltMaxTime] = useState("any"); 
  const recipesSectionRef = useRef(null);
  const placeholderSVG = (text = "Filipino Dish", w = 900, h = 650) => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
        <rect width="100%" height="100%" fill="#e5e7eb"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
              font-family="system-ui,Segoe UI,Roboto" font-size="32" fill="#111827">${text}</text>
      </svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  };

  const location = useLocation();
  const navigate = useNavigate();

  const HEADER_OFFSET = 84;
  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y =
      el.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const [sp, setSp] = useSearchParams();

  useEffect(() => {
    setQuery(sp.get("q") || "");
    setFltDifficulty(sp.get("diff") || "any");
    setFltMaxTime(sp.get("t") || "any");
   
  }, []);

  useEffect(() => {
    const target =
      location.state?.scrollTo ||
      (location.hash ? location.hash.slice(1) : null);
    if (target) {
      setTimeout(() => scrollToId(target), 0);
      navigate(".", { replace: true, state: null });
    }
  }, [location.state, location.hash, navigate]);

  useEffect(() => {
    const next = {};
    if (query) next.q = query;
    if (fltDifficulty !== "any") next.diff = fltDifficulty;
    if (fltMaxTime !== "any") next.t = fltMaxTime;
    setSp(next, { replace: true });
  }, [query, fltDifficulty, fltMaxTime, setSp]);

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError("");
        const url = `${import.meta.env.BASE_URL}data/recipes.json`;
        const res = await fetch(url, { signal: ctrl.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setRecipes(Array.isArray(data) ? data : []);
      } catch (e) {
        if (e.name !== "AbortError")
          setError(e?.message || "Failed to load recipes");
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recipes.filter((r) => {
      if (q && !r.name?.toLowerCase().includes(q)) return false; // search
      if (fltDifficulty !== "any") {
        // difficulty
        const d = (r.difficulty || "").toLowerCase();
        if (d !== fltDifficulty) return false;
      }
      if (fltMaxTime !== "any") {
        // max time
        if (
          typeof r.cookTimeMins !== "number" ||
          r.cookTimeMins > Number(fltMaxTime)
        )
          return false;
      }
      return true;
    });
  }, [recipes, query, fltDifficulty, fltMaxTime]);

  const sorted = useMemo(() => {
    const rank = (d) =>
      ["easy", "medium", "hard"].indexOf((d || "").toLowerCase());
    const arr = [...filtered];

    if (sortBy === "time") {
      // shortest first; items without time go last
      arr.sort((a, b) => (a.cookTimeMins ?? 1e9) - (b.cookTimeMins ?? 1e9));
    } else if (sortBy === "difficulty") {
      arr.sort((a, b) => rank(a.difficulty) - rank(b.difficulty));
    } else {
      // default: name A–Z
      arr.sort((a, b) => a.name.localeCompare(b.name));
    }
    return arr;
  }, [filtered, sortBy]);

  const clearFilters = () => {
    setFltDifficulty("any");
    setFltMaxTime("any");
    setSortBy("name"); 
  };

  /* --------- UI --------- */
  return (
    <>
      {/* HERO */}
      <section
        id="top"
        className="hero shadow-lg"
        role="region"
        aria-label="Intro"
      >
        <div className="hero-inner">
          <div className="hero-copy">
            <h1>
              Discover your favorite <strong>Filipino Dishes!</strong>
            </h1>
            <p>
              Explore classics like Adobo, Sinigang, and Kare-Kare. Learn the
              ingredients, follow the steps, and save your favorites.
            </p>
            <button
              className="btn btn-dark"
              onClick={() => {
                const el = document.getElementById("recipes");
                if (!el) return;
                const hdr =
                  document.querySelector(".navbar.sticky-top")?.offsetHeight ??
                  0;
                const y =
                  el.getBoundingClientRect().top +
                  window.pageYOffset -
                  (hdr + 12);
                window.scrollTo({ top: y, behavior: "smooth" });
              }}
            >
              Browse Recipes
            </button>
          </div>

          <div className="hero-media">
            <img
              src="public/images/sisig.png"
              alt="A bowl of sizzling sisig topped with onions and chilies"
              loading="eager"
            />
          </div>
        </div>
      </section>

      <section ref={recipesSectionRef} id="recipes">
        <div className="search-filter-row">
          <input
            id="recipe-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a recipe (e.g., Adobo)…"
            aria-label="Search recipes"
            className="search-input"
          />

          <div className="filters">
            <label className="visually-hidden" htmlFor="flt-difficulty">
              Difficulty
            </label>
            <select
              id="flt-difficulty"
              className="filter-select"
              value={fltDifficulty}
              onChange={(e) => setFltDifficulty(e.target.value)}
            >
              <option value="any">Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <label className="visually-hidden" htmlFor="flt-sort">
              Sort
            </label>
            <select
              id="flt-sort"
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort"
            >
              <option value="name">Sort: Name (A–Z)</option>
              <option value="time">Sort: Time (short → long)</option>
              <option value="difficulty">Sort: Difficulty (easy → hard)</option>
            </select>

            <label className="visually-hidden" htmlFor="flt-time">
              Max Time
            </label>
            <select
              id="flt-time"
              className="filter-select"
              value={fltMaxTime}
              onChange={(e) => setFltMaxTime(e.target.value)}
            >
              <option value="any">Max Time</option>
              <option value="15">≤ 15 min</option>
              <option value="30">≤ 30 min</option>
              <option value="60">≤ 60 min</option>
              <option value="120">≤ 120 min</option>
            </select>
            
            <button
              className="btn btn-sm rounded-pill"
              style={{
                "--bs-btn-bg": "#232323",
                "--bs-btn-border-color": "#232323",
                "--bs-btn-color": "#fff",
                "--bs-btn-hover-bg": "#1f1f1f",
                "--bs-btn-hover-border-color": "#1f1f1f",
                "--bs-btn-active-bg": "#171717",
                "--bs-btn-active-border-color": "#171717",
              }}
              onClick={clearFilters}
              type="button"
            >
              Clear
            </button>
          </div>
        </div>

        <p aria-live="polite" className="text-muted small mt-2">
          {loading
            ? "Loading…"
            : `${sorted.length} recipe${sorted.length !== 1 ? "s" : ""}`}
        </p>

        {loading ? (
          <section className="grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card shadow-sm">
                <div className="skeleton" style={{ height: 200 }} />
                <div className="p-3">
                  <div
                    className="skeleton"
                    style={{ height: 18, width: "60%", marginBottom: 8 }}
                  />
                  <div
                    className="skeleton"
                    style={{ height: 14, width: "90%" }}
                  />
                </div>
              </div>
            ))}
          </section>
        ) : error ? (
          <p className="error">Error: {error}</p>
        ) : sorted.length === 0 ? (
          <p>
            No recipes found for “{query}”. Try another name or adjust filters.
          </p>
        ) : (
          <section className="grid">
            {sorted.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </section>
        )}
      </section>
    </>
  );
}
