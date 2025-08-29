import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "../contexts/FavoritesContext.jsx";
import RecipeCard from "../components/RecipeCard.jsx";

export default function Favorites() {
  const { favorites } = useFavorites();          
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const hasFavs = favorites.length > 0;

  useEffect(() => {
    if (!hasFavs) return;                      

    const ctrl = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const url = `${import.meta.env.BASE_URL}data/recipes.json`; 
        const res = await fetch(url, { signal: ctrl.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setRecipes(Array.isArray(data) ? data : []);
      } catch (e) {
        if (e.name !== "AbortError") setErr(e.message || "Failed to fetch recipes");
      } finally {
        setLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, [hasFavs]);

  if (!hasFavs) {
    return (
      <div className="container-xxl py-4">
        <div className="alert alert-info">
          You have no favorites yet.{" "}
          <Link to="/" className="alert-link">Browse recipes</Link> and tap “Add to Favorites”.
        </div>
      </div>
    );
  }

  const favoriteRecipes = useMemo(
    () => recipes.filter(r => favorites.includes(Number(r.id))),
    [recipes, favorites]
  );

  return (
    <div className="container-xxl py-4">
      <h1 className="h4 mb-3">Your Favorites</h1>

      {loading ? (
        <p>Loading…</p>
      ) : err ? (
        <div className="alert alert-danger">
          We couldn’t load your saved recipes. Please refresh and try again.
        </div>
      ) : favoriteRecipes.length === 0 ? (
        <div className="alert alert-info">
          Your favorites list is empty. <Link to="/" className="alert-link">Browse recipes</Link>.
        </div>
      ) : (
        <section className="grid">
          {favoriteRecipes.map(r => <RecipeCard key={r.id} recipe={r} />)}
        </section>
      )}
    </div>
  );
}
