import { useNavigate, useLocation } from "react-router-dom";
import { formatMinutes } from "../utils/formatTime.js";
import { placeholderSVG } from "../utils/placeholder.js";

function badgeClass(level) {
  switch ((level || "").toLowerCase()) {
    case "easy":
      return "text-bg-success";
    case "medium":
      return "text-bg-warning";
    case "hard":
      return "text-bg-danger";
    default:
      return "text-bg-secondary";
  }
}

function resolveSrc(img) {
  if (!img) return placeholderSVG("Recipe");
  if (/^https?:\/\//i.test(img)) return img;
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const path = String(img).replace(/^\//, "");
  return `${base}/${path}`;
}

export default function RecipeCard({ recipe }) {
  const navigate = useNavigate();
  const location = useLocation();

  const go = () => {
    navigate(`/recipe/${recipe.id}`, {
      state: { from: location.pathname + location.search }, 
    });
  };

  const onImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = placeholderSVG(recipe?.name || "Recipe");
  };

  return (
    <article
      className="card h-100 shadow-sm"
      role="button"
      onClick={go}
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" ? go() : null)}
    >
      <img
        src={resolveSrc(recipe.image)}
        alt={recipe.name}
        className="card-img-top"
        style={{ objectFit: "cover", height: "280px", aspectRatio: "3 / 2" }}
        onError={onImgError}
        loading="lazy"
      />
      <div className="card-body">
        <h5 className="card-title mb-2">{recipe.name}</h5>
        <p className="card-text text-muted">{recipe.description}</p>

        <div className="d-flex gap-2 flex-wrap mt-2">
          {recipe.difficulty && (
            <span className={`badge ${badgeClass(recipe.difficulty)}`}>
              {recipe.difficulty}
            </span>
          )}
          {typeof recipe.cookTimeMins === "number" && (
            <span className="badge text-bg-light text-dark">
              ⏱ {formatMinutes(recipe.cookTimeMins)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
