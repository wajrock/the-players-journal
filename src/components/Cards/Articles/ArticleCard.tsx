import React, { FunctionComponent, useEffect, useState } from "react";
import formatDate from "../../../utils/formatDate";
import { Link } from "react-router-dom";
import StarsNotation from "../../StarsNotation/StarsNotation";
import './ArticleCard.scss'
import { ArticleCardType } from "../../../utils/Types";
import { fetchArticleContent } from "../../../utils/Fetchs/FetchsArticle";
import { getReadingTime } from "../../../utils/Functions/FunctionsArticle";
import { useAPI } from "../../../ApiStatusContext";

export interface articleContent {
    categorie:string,
    contenu: string;
    cover_article: string;
    date_modification: string;
    date_creation:string;
    images:string[],
    nom: string;
    note: string;
    prenom: string;
    profile_picture: string;
    titre: string;
    id_auteur:string;
    identifiant:string;
    id_jeu:string;
}

const ArticleCard:FunctionComponent<{articleCardData:ArticleCardType,isFromPopup?:boolean}> = ({articleCardData,isFromPopup}) => {
    
    const [ articleContentData,setDataArticleContent ] = useState<articleContent|null>(null);
    const {setIsAPIAvailable} = useAPI();
    const [imageLoaded,setImageLoaded] = useState(()=>{
      var image = new Image();
      image.src = articleCardData ? `https://theplayersjournal.wajrock.me/assets/articles/${articleCardData.cover_article}-800.webp` : "";

      return image.complete;
    });
    const [imageSrc,setImageSrc] = useState<string>(()=>{
      var image = new Image();
      image.src = articleCardData ?  `https://theplayersjournal.wajrock.me/assets/articles/${articleCardData.cover_article}-800.webp`: "";

      return image.complete ? `https://theplayersjournal.wajrock.me/assets/articles/${articleCardData.cover_article}-800.webp`: ""
    });

    useEffect(() => {
      if (!imageLoaded){
        const img = new Image();

        img.onload = () => {
          setImageSrc(img.src);
          setImageLoaded(true);
        }
  
        img.src = articleCardData.cover_article && `https://theplayersjournal.wajrock.me/assets/articles/${articleCardData.cover_article}-800.webp`;
      
      }
    }, [imageLoaded,articleCardData.cover_article]);

    useEffect(() => {
      try {
        fetchArticleContent(articleCardData.id_article).then((data) => {
          if (data.status === 'error'){
            setIsAPIAvailable(false);
          } else {
            setDataArticleContent(data.results[0])
            localStorage.setItem(`data-article-${articleCardData.id_article}`,JSON.stringify(data.results[0])
            );
          }
          
        })
      } catch (error) {
        console.log(error);
        
      }
      
      
    },[articleCardData.id_article,articleCardData])
    
  return (
    <>
    {!isFromPopup ? (<Link
      to={`/article/${articleCardData.id_article}/${articleCardData.titre}`}
      className={`article-card-wrap ${!isFromPopup ? "clickable" : ""}`}
      state={{
        dataArticle:articleContentData,
        loadTop:true
      }}
    >
      <div className="article-card-wrap-container">

        {!imageLoaded ? (<div className="image-loader"></div>) : <img
          src={imageSrc}
          alt={"Illustration de l'article"}
          className="article-card-wrap-container-picture"
        />}

        {imageLoaded && (
          
          <div className="article-card-wrap-container-overlay"/>)}


     

        <div className="article-card-wrap-container-description description">
          <h1 className="description-title">{articleCardData.titre}</h1>
          <div className="description-tags">
          <StarsNotation note={parseInt(articleCardData?.note!)}/>
            <div className="description-tags-reading-time">
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
              <p>{articleCardData.date_creation && formatDate(articleCardData.date_creation)}</p>
            </div>
        </div>
        </div>

        
      </div>
    </Link>) : (<div
      className={`article-card-wrap`}
    >
      <div className="article-card-wrap-cover">
        <img
          src={articleCardData.cover_article && `https://theplayersjournal.wajrock.me/assets/articles/${articleCardData.cover_article}-800.webp`}
          alt=""
          className="article-card-wrap-cover-picture"
        />
        
      </div>
      
      <div className="article-card-wrap-description description">
        <h1 className="description-title">{articleCardData.titre}</h1>
        
      </div>
    </div>)}
    
    </>
  );
};

export default ArticleCard;
