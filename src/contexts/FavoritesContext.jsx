import React, { createContext, useContext, useMemo, useCallback } from "react";
import useLocalStorage from "../hooks/useLocalStorage.js";

const STORAGE_KEY = "favorites";
const FavoritesContext = createContext(undefined);
const normalizeId = (id) => {
  const n = Number(id);
  return Number.isFinite(n) ? n : String(id);
};

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useLocalStorage(STORAGE_KEY, []);
  const favSet = useMemo(
    () => new Set(favorites.map(normalizeId)),
    [favorites],
  );

  const addFavorite = useCallback(
    (id) =>
      setFavorites((prev) => {
        const nid = normalizeId(id);
        const next = prev.map(normalizeId);
        return next.includes(nid) ? prev : [...next, nid];
      }),
    [setFavorites],
  );

  const removeFavorite = useCallback(
    (id) =>
      setFavorites((prev) => {
        const nid = normalizeId(id);
        const next = prev.map(normalizeId).filter((x) => x !== nid);
        return next;
      }),
    [setFavorites],
  );

  const toggleFavorite = useCallback(
    (id) =>
      setFavorites((prev) => {
        const nid = normalizeId(id);
        const next = prev.map(normalizeId);
        return next.includes(nid)
          ? next.filter((x) => x !== nid)
          : [...next, nid];
      }),
    [setFavorites],
  );

  const isFavorite = useCallback((id) => favSet.has(normalizeId(id)), [favSet]);

  const clearFavorites = useCallback(() => setFavorites([]), [setFavorites]);

  const value = useMemo(
    () => ({
      favorites,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      isFavorite,
      clearFavorites,
      count: favorites.length,
    }),
    [
      favorites,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      isFavorite,
      clearFavorites,
    ],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return ctx;
};
