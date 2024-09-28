import React, { FunctionComponent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './ContributorCard.scss'
import { ContentType } from "../../../utils/Types";


const ContributorCard:FunctionComponent<{dataContributor:ContentType}> = ({dataContributor}) => {
  const [imageLoaded, setImageLoaded] = useState<boolean>(() => {
    if (dataContributor && dataContributor.profile_picture) {
      const img = new Image();
      img.src = `https://theplayersjournal.wajrock.me/assets/users/${dataContributor.profile_picture}`;
      return img.complete; // Si l'image est en cache, elle sera immédiatement disponible
    }
    return false;
  });

  const [imageSrc, setImageSrc] = useState<string>(() => {
    if (dataContributor && dataContributor.profile_picture) {
      const img = new Image();
      img.src = `https://theplayersjournal.wajrock.me/assets/users/${dataContributor.profile_picture}`;
      return img.complete
        ? `https://theplayersjournal.wajrock.me/assets/users/${dataContributor.profile_picture}`
        : "";
    }
    return "";
  });

  useEffect(() => {
    if (!imageLoaded && dataContributor && dataContributor.profile_picture) {
      const imageUrl = `https://theplayersjournal.wajrock.me/assets/users/${dataContributor.profile_picture}`;
      
      const img = new Image();
      img.src = imageUrl;

      img.onload = () => {
        setImageSrc(imageUrl);
        setImageLoaded(true);
      };
    }
  }, [dataContributor,imageLoaded]);


  return (
    <Link className="contributor-card-wrap" to={`/@${dataContributor.identifiant?.toLowerCase()}`} state={{loadTop:true}}>
      {!imageLoaded ? (<div className="image-loader"></div>) : <img
          src={imageSrc}
          alt={`${dataContributor.prenom} ${dataContributor.nom}`}
          className="contributor-card-wrap-picture"
      />}
      <div className="contributor-card-wrap-description">
        <h1 className="contributor-card-wrap-description-name">{dataContributor.prenom} {dataContributor.nom}</h1>
        <p className="contributor-card-wrap-description-number-articles">{dataContributor.nb_articles} articles</p>
      </div>
    </Link>
  );
};

export default ContributorCard;
