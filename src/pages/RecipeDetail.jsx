import { useEffect, useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { useFavorites } from "../contexts/FavoritesContext.jsx";
import { formatMinutes } from "../utils/formatTime.js";

function placeholderSVG(text = "Recipe", w = 1200, h = 800) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <rect width="100%" height="100%" fill="#e5e7eb"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
            font-family="system-ui,Segoe UI,Roboto" font-size="36" fill="#111827">
        ${text}
      </text>
    </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function resolveSrc(img) {
  if (!img) return placeholderSVG();
  if (/^https?:\/\//i.test(img)) return img;
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const path = String(img).replace(/^\//, "");
  return `${base}/${path}`;
}
function badgeClass(level) {
  switch ((level || "").toLowerCase()) {
    case "easy":
      return "badge text-bg-success";
    case "medium":
      return "badge text-bg-warning";
    case "hard":
      return "badge text-bg-danger";
    default:
      return "badge text-bg-secondary";
  }
}

export default function RecipeDetail() {
  const { id } = useParams();
  const numId = Number(id);
  const location = useLocation();
  const navigate = useNavigate();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const backTarget = location.state?.from || null;
  const backLabel =
    backTarget === "/favorites"
      ? "Back to Favorites"
      : backTarget?.startsWith("/favorites")
        ? "Back to Favorites"
        : "Back";

  const handleBack = () => {
    if (backTarget) return navigate(backTarget);
    if (window.history.length > 1) return navigate(-1);
    return navigate("/");
  };

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const url = `${import.meta.env.BASE_URL}data/recipes.json`;
        const res = await fetch(url, { signal: ctrl.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const found = Array.isArray(data)
          ? data.find((r) => r.id === numId || String(r.id) === id)
          : null;
        setRecipe(found ?? null);
      } catch (e) {
        if (e.name !== "AbortError")
          setErr(e.message || "Failed to load recipe");
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [id, numId]);

  if (loading) return <p className="mt-4">Loading…</p>;
  if (err) return <p className="alert alert-danger mt-4">Error: {err}</p>;
  if (!recipe) {
    return (
      <div className="mt-4">
        <p className="alert alert-warning">Recipe not found.</p>
        <Link className="btn btn-outline-dark" to="/">
          ← Back to recipes
        </Link>
      </div>
    );
  }

  const fav = isFavorite(Number(recipe.id));

  return (
    <article className="py-3">
      <button className="btn btn-link px-0" onClick={handleBack}>
        ← {backLabel}
      </button>

      <div className="row g-4 align-items-start mt-1">
        <div className="col-12 col-lg-6">
          <img
            src={resolveSrc(recipe.image)}
            alt={recipe.name}
            className="w-100 rounded shadow-sm"
            style={{ aspectRatio: "3 / 2", objectFit: "cover" }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = placeholderSVG(recipe.name);
            }}
          />
        </div>

        <div className="col-12 col-lg-6">
          <h1 className="h2">{recipe.name}</h1>

          <div className="d-flex gap-2 flex-wrap my-2">
            {recipe.difficulty && (
              <span className={badgeClass(recipe.difficulty)}>
                {recipe.difficulty}
              </span>
            )}
            {typeof recipe.cookTimeMins === "number" && (
              <span className="badge text-bg-light text-dark">
                ⏱ {formatMinutes(recipe.cookTimeMins)}
              </span>
            )}
          </div>

          {recipe.description && (
            <p className="text-muted">{recipe.description}</p>
          )}

          <div className="d-flex gap-2 mt-3">
            <button
              className={`btn ${fav ? "btn-danger" : "btn-dark"}`}
              onClick={() =>
                fav
                  ? removeFavorite(Number(recipe.id))
                  : addFavorite(Number(recipe.id))
              }
            >
              {fav ? "Remove from Favorites" : "Add to Favorites"}
            </button>
          </div>
        </div>
      </div>

      <hr className="my-4" />

      <section className="mb-4">
        <h2 className="h4">Ingredients</h2>
        {Array.isArray(recipe.ingredients) && recipe.ingredients.length ? (
          <ul className="mt-2">
            {recipe.ingredients.map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No ingredients listed.</p>
        )}
      </section>

      <section>
        <h2 className="h4">Instructions</h2>
        {Array.isArray(recipe.instructions) && recipe.instructions.length ? (
          <ol className="mt-2">
            {recipe.instructions.map((st, i) => (
              <li key={i}>{st}</li>
            ))}
          </ol>
        ) : (
          <p className="text-muted">No instructions provided.</p>
        )}
      </section>
    </article>
  );
}
