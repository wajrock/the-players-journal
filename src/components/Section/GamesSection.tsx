import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import "./Section.scss";
import "./GamesSection.scss"
import GameCard from "../Cards/Games/GameCard";
import { ContentType } from "../../utils/Types";
import { Link } from "react-router-dom";
import { fetchGames } from "../../utils/Fetchs/FetchsGames";
import { useAPI } from "../../ApiStatusContext";

const GamesSection: FunctionComponent<{ title: string }> = ({ title }) => {

    const [dataGames, setDataGames] = useState<ContentType[] | null>(() => {
      const storedData = localStorage.getItem(`games`);
      return storedData && storedData !== 'undefined' ? JSON.parse(storedData) : null;
    });

  const refSection = useRef<HTMLDivElement>(null);
  const [alreadyLoad,setAlreadyLoad] = useState(false);

  const {setIsAPIAvailable} = useAPI();

  useEffect(() => {
    if (!dataGames || !alreadyLoad){
      fetchGames().then(data => {
        
        if (data.status === 'error'){
          setIsAPIAvailable(false);
        } else {
          setDataGames(data.results);
          localStorage.setItem(`games`, JSON.stringify(data.results));
        }
        
        
        setAlreadyLoad(true);
    })
    
  }}, [dataGames,alreadyLoad]);

  return (
    <div className="section-wrap games">
      <div className="section-wrap-header">
        <h1 className="section-wrap-header-title">{title}</h1>
      </div>

      <div className={"section-wrap-content"} >
        {dataGames && dataGames.slice(0, 8).map((game, index) => (
          <GameCard gameCardData={game} key={index} />
        ))}
      </div>
    </div>
  );
};

export default GamesSection;
