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
      <div className="article-card-wrap-cover">

        {!imageLoaded ? (<div className="image-loader"></div>) : <img
          src={imageSrc}
          alt={"Illustration de l'article"}
          className="article-card-wrap-cover-picture"
        />}
        
      </div>
      
      <div className="article-card-wrap-description description">
      <div className="description-tags">
          <StarsNotation note={parseInt(articleCardData?.note!)}/>
          <div className="description-tags-reading-time">
            <svg xmlns="http://www.w3.org/2000/svg"viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
              <path d="M16.5 12H12.25C12.1119 12 12 11.8881 12 11.75V8.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <p>{articleCardData.contenu && getReadingTime(articleCardData.contenu)}</p>
          </div>
          
        </div>
        <div className="description-header">
          <img
            src={`https://theplayersjournal.wajrock.me/assets/users/${articleCardData.profile_picture}`}
            alt=""
            className="description-header-profile-picture"
          />
          <p>
            {articleCardData.prenom} {articleCardData.nom} · {articleCardData.date_creation && formatDate(articleCardData.date_creation)}
          </p>
        </div>
        <h1 className="description-title">{articleCardData.titre}</h1>
        
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
