import React, { FunctionComponent, useEffect, useState } from "react";
import "./GameDetails.scss";
import StarsNotation from "../StarsNotation/StarsNotation";
import { fetchArticleGameDetails } from "../../utils/Fetchs/FetchsArticle";
import formatDate from "../../utils/formatDate";
import SkeletonCard from "../Cards/Skeletons/SkeletonCard";

export interface Game {
  cover: string;
  date_sortie: string;
  nom: string;
  note: number;
  plateformes: string[];
  prix: string;
  synopsis: string;
  categorie: string;
}

const GameDetails: FunctionComponent<{ article_id: string }> = ({
  article_id,
}) => {
  const [gameData,setGameData] = useState<Game|null>(()=>{
    // const storedData = localStorage.getItem(`article-games-details-${article_id}`);
    // return storedData ? JSON.parse(storedData) : null;
    return null;
  });

  const [imageLoaded,setImageLoaded] = useState(()=>{
    if (gameData){
      var image = new Image();
      image.src = `https://theplayersjournal.wajrock.me/assets/games_cover/${gameData.cover}`;
      return image.complete;
    }
   return false;

    
  });
  const [imageSrc,setImageSrc] = useState<string>(()=>{
    if (gameData){
      var image = new Image();
      image.src =`https://theplayersjournal.wajrock.me/assets/games_cover/${gameData.cover}`;
      return image.complete ? `https://theplayersjournal.wajrock.me/assets/games_cover/${gameData.cover}`: ""
    }

    return "";
  });

  useEffect(() => {
    if (!imageLoaded && gameData && gameData.cover){
      const img = new Image();

      img.onload = () => {
        setImageSrc(img.src);
        setImageLoaded(true);
      }

      img.src = gameData.cover && `https://theplayersjournal.wajrock.me/assets/games_cover/${gameData.cover}`;
    
    }
  }, [imageLoaded,gameData]);

  useEffect(() => {
    if (!gameData) {
      fetchArticleGameDetails(article_id).then((data) => {
        setGameData(data.results[0]);
        
        localStorage.setItem(
          `article-games-details-${article_id}`,
          JSON.stringify(data.results[0])
        );
      });
    }
  }, [gameData, article_id]);
  return (
    <> {gameData ? (
    
    <div className="game-details-wrap">
      {!imageLoaded ? (<div className="image-loader"></div>) : <img
          src={imageSrc}
          alt={`Jaquette du jeu`}
          className="game-details-wrap-cover"
      />}
      <div className="game-details-wrap-texts texts">
        <h1 className="texts-title">{gameData?.nom}</h1>
        <div className="texts-details ">
        <div className="texts-details-item">
          <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none">
            <path d="M6 11H10M8 9V13M15 12H15.01M18 10H18.01M17.32 5H6.68C5.69028 5.00023 4.73579 5.36738 4.00103 6.03046C3.26628 6.69355 2.80345 7.60549 2.702 8.59C2.696 8.642 2.692 8.691 2.685 8.742C2.604 9.416 2 14.456 2 16C2 16.7956 2.31607 17.5587 2.87868 18.1213C3.44129 18.6839 4.20435 19 5 19C6 19 6.5 18.5 7 18L8.414 16.586C8.78899 16.2109 9.29761 16.0001 9.828 16H14.172C14.7024 16.0001 15.211 16.2109 15.586 16.586L17 18C17.5 18.5 18 19 19 19C19.7956 19 20.5587 18.6839 21.1213 18.1213C21.6839 17.5587 22 16.7956 22 16C22 14.455 21.396 9.416 21.315 8.742C21.308 8.692 21.304 8.642 21.298 8.591C21.1968 7.60631 20.7341 6.69413 19.9993 6.03083C19.2645 5.36754 18.3099 5.00026 17.32 5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
            <p>{gameData?.categorie}</p>
          </div>

          <div className="texts-details-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M16 2V6M8 2V6M3 10H21M8 14H8.01M12 14H12.01M16 14H16.01M8 18H8.01M12 18H12.01M16 18H16.01M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <p>{gameData && formatDate(gameData!.date_sortie)}</p>
          </div>

          <div className="texts-details-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
  <path d="M16 8H10C9.46957 8 8.96086 8.21071 8.58579 8.58579C8.21071 8.96086 8 9.46957 8 10C8 10.5304 8.21071 11.0391 8.58579 11.4142C8.96086 11.7893 9.46957 12 10 12H14C14.5304 12 15.0391 12.2107 15.4142 12.5858C15.7893 12.9609 16 13.4696 16 14C16 14.5304 15.7893 15.0391 15.4142 15.4142C15.0391 15.7893 14.5304 16 14 16H8M12 18V6M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
            <p>{gameData?.prix}</p>
          </div>

          
        </div>
        <p className="texts-synopsis">{gameData?.synopsis}</p>
        <div className="texts-footer">
          <div className="texts-footer-platforms">
            {gameData && gameData.plateformes && gameData.plateformes.includes("XBOX X") && (
              <div className="texts-footer-platforms-item">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M5.42 19.528A9.96 9.96 0 0 0 12 22a9.97 9.97 0 0 0 6.585-2.472c1.564-1.594-3.597-7.258-6.585-9.515c-2.985 2.257-8.15 7.921-6.582 9.515m9.3-12.005c2.083 2.467 6.236 8.594 5.063 10.76A9.95 9.95 0 0 0 22 12.002a9.96 9.96 0 0 0-2.975-7.113s-.023-.018-.068-.035a.7.7 0 0 0-.234-.038c-.494 0-1.655.362-4.005 2.706M5.045 4.855c-.048.017-.068.034-.072.035A9.96 9.96 0 0 0 2 12.003c0 2.379.832 4.561 2.217 6.278C3.051 16.11 7.201 9.988 9.285 7.523C6.935 5.178 5.772 4.818 5.28 4.818a.6.6 0 0 0-.234.039zM12 4.959S9.546 3.523 7.63 3.455c-.753-.027-1.213.246-1.268.282C8.15 2.539 10.05 2 11.988 2H12c1.945 0 3.838.538 5.638 1.737c-.056-.038-.512-.31-1.266-.282c-1.917.068-4.372 1.5-4.372 1.5z"
                  />
                </svg>
              </div>
            )}

            {gameData && gameData.plateformes && gameData.plateformes.includes("PS5") && (
              <div className="texts-footer-platforms-item">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.585 17.011c-.43.543-1.483.93-1.483.93l-7.832 2.817V18.68l5.764-2.057c.654-.234.754-.566.223-.74s-1.492-.125-2.147.111l-3.84 1.354v-2.155l.221-.076s1.11-.393 2.67-.566c1.561-.172 3.472.024 4.972.593c1.69.535 1.88 1.323 1.452 1.866m-8.57-3.537V8.162c0-.624-.115-1.198-.7-1.36c-.447-.144-.725.272-.725.895V21l-3.583-1.139V4c1.523.283 3.743.953 4.936 1.355c3.035 1.043 4.064 2.342 4.064 5.267c0 2.851-1.758 3.932-3.992 2.852m-11.583 4.99c-1.736-.49-2.025-1.51-1.234-2.097c.731-.542 1.975-.95 1.975-.95l5.138-1.83v2.086l-3.698 1.325c-.653.234-.753.566-.223.74c.532.175 1.493.125 2.147-.11l1.774-.644v1.865l-.354.06c-1.774.29-3.663.169-5.525-.445"
                  />
                </svg>
              </div>
            )}

            {gameData && gameData.plateformes && gameData.plateformes.includes("SWITCH") && (
              <div className="texts-footer-platforms-item">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M14.176 24h3.674c3.376 0 6.15-2.774 6.15-6.15V6.15C24 2.775 21.226 0 17.85 0H14.1c-.074 0-.15.074-.15.15v23.7c-.001.076.075.15.226.15m4.574-13.199c1.351 0 2.399 1.125 2.399 2.398c0 1.352-1.125 2.4-2.399 2.4c-1.35 0-2.4-1.049-2.4-2.4c-.075-1.349 1.05-2.398 2.4-2.398M11.4 0H6.15C2.775 0 0 2.775 0 6.15v11.7C0 21.226 2.775 24 6.15 24h5.25c.074 0 .15-.074.15-.149V.15c.001-.076-.075-.15-.15-.15M9.676 22.051H6.15a4.194 4.194 0 0 1-4.201-4.201V6.15A4.194 4.194 0 0 1 6.15 1.949H9.6zM3.75 7.199c0 1.275.975 2.25 2.25 2.25s2.25-.975 2.25-2.25c0-1.273-.975-2.25-2.25-2.25s-2.25.977-2.25 2.25"
                  />
                </svg>
              </div>
            )}
            {gameData!.plateformes.includes("PC") && (
              <div className="texts-footer-platforms-item">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="m3.001 5.479l7.377-1.016v7.127H3zm0 13.042l7.377 1.017v-7.04H3zm8.188 1.125L21.001 21v-8.502h-9.812zm0-15.292v7.236h9.812V3z"
                  />
                </svg>
              </div>
            )}
          </div>
          {gameData && <StarsNotation note={gameData.note} />}
        </div>
      </div>
    </div>) : <SkeletonCard type="game-details"/>}
    </>
  );
};

export default GameDetails;
