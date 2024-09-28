import React, {useEffect, useState } from "react";
import "./HeroBanner.scss";
import { fetchArticlesFromCategory } from "../../utils/Fetchs/FetchsArticles";


const HomeHeroBanner = () => {
  const [coverLastArticle, setCoverLastArticle] = useState<string|null>(()=>{
    const storedData = localStorage.getItem(`cover-last-article`);
    return storedData ? JSON.parse(storedData) : null;
  }
  );

  useEffect(() => {
    if (!coverLastArticle){
      fetchArticlesFromCategory('last-article-cover').then(data => {
        setCoverLastArticle(data.results[0]);
        localStorage.setItem("cover-last-article", JSON.stringify(data.results[0]));
      })
    }
  }, [coverLastArticle]);

  return (
    <div
      className="hero-banner-wrap"
    >
      <div className="hero-banner-wrap-background">
        <img 
          src={`https://theplayersjournal.wajrock.me/assets/articles/${coverLastArticle!}-800.webp`}
          srcSet={`
              https://theplayersjournal.wajrock.me/assets/articles/${coverLastArticle!}-800.webp 800w, 
              https://theplayersjournal.wajrock.me/assets/articles/${coverLastArticle!}-1200.webp 1200w, 
              https://theplayersjournal.wajrock.me/assets/articles/${coverLastArticle!}-1600.webp 1600w`}
          sizes="100vw" 
          alt="Large couverture de l'article"/>
      </div>
      <div className="hero-banner-wrap-overlays">
        <div className="hero-banner-wrap-overlays-left"></div>
        <div className="hero-banner-wrap-overlays-top"></div>
        <div className="hero-banner-wrap-overlays-bottom"></div>
      </div>
      
    </div>
  );
};

export default HomeHeroBanner;
