import React, { FunctionComponent, useEffect, useState } from "react";
import './GameCard.scss'
import { ContentType } from "../../../utils/Types";
import { Link } from "react-router-dom";

export interface GameType {
  nom:number;
  cover:string;
}

const GameCard:FunctionComponent<{gameCardData:ContentType}> = ({gameCardData}) => {
  const [imageLoaded,setImageLoaded] = useState(()=>{
    var image = new Image();
    image.src = gameCardData ? `https://theplayersjournal.wajrock.me/assets/games_cover/${gameCardData.cover}` : "";

    return image.complete;
  });
  const [imageSrc,setImageSrc] = useState<string>(()=>{
    var image = new Image();
    image.src = gameCardData ?  `https://theplayersjournal.wajrock.me/assets/games_cover/${gameCardData.cover}`: "";

    return image.complete ? `https://theplayersjournal.wajrock.me/assets/games_cover/${gameCardData.cover}`: ""
  });

  useEffect(() => {
    if (!imageLoaded){
      const img = new Image();

      img.onload = () => {
        setImageSrc(img.src);
        setImageLoaded(true);
      }

      img.src = gameCardData.cover && `https://theplayersjournal.wajrock.me/assets/games_cover/${gameCardData.cover}`;
    
    }
  }, [imageLoaded,gameCardData.cover]);
  return (
    <Link to={`/article/${gameCardData.id_article}/${gameCardData.title_article}`} state={{loadTop:true}} className="game-card-wrap">
      {!imageLoaded ? (<div className="image-loader"></div>) : <img
          src={imageSrc}
          alt={"Jaquette du jeu"}
          loading="lazy"
      />}
    </Link>
  );
};

export default GameCard;
