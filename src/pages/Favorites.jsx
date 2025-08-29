import { useEffect, useMemo, useState } from "react";
import { useFavorites } from "../contexts/FavoritesContext.jsx";
import RecipeCard from "../components/RecipeCard.jsx";

export default function Favorites() {
  const { favorites } = useFavorites();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}data/recipes.json`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => setRecipes(data))
      .catch((err) => setError(err?.message ?? "Failed to load recipes"))
      .finally(() => setLoading(false));
  }, []);

  const favRecipes = useMemo(
    () => recipes.filter((r) => favorites.includes(r.id)),
    [recipes, favorites],
  );

  if (loading) return <p>Loading favorites…</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return favRecipes.length === 0 ? (
    <p>You don't have any favorites yet.</p>
  ) : (
    <section className="grid">
      {favRecipes.map((r) => (
        <RecipeCard key={r.id} recipe={r} />
      ))}
    </section>
  );
}
