import { useEffect, useState } from "react";
import { SuggestionBox } from "../components/SuggestionBox";


export function Film() {
  const [films, setFilms] = useState<{ trending: Film[]; forYou: Film[] }>({
    trending: [],
    forYou: [],
  });

  useEffect(() => {
    fetch("http://localhost:3000/get-dashboard-films")
      .then((res) => res.json())
      .then((data) => setFilms(data));
  }, []);

  return (
    <div>
      <SuggestionBox />
    </div>
  );
}
