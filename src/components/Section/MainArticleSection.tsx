import React, { useEffect, useState } from "react";
import "./MainArticleSection.scss";
import StarsNotation from "../StarsNotation/StarsNotation";
import { Link } from "react-router-dom";
import { formatText } from "../../utils/Functions/FunctionsArticle";
import { fetchArticlesFromCategory } from "../../utils/Fetchs/FetchsArticles";
import { fetchArticleContent } from "../../utils/Fetchs/FetchsArticle";
import { useAPI } from "../../ApiStatusContext";

const MainArticleSection = () => {

  const [dataLastArticle, setDataLastArticle] = useState(() => {
    const storedData = localStorage.getItem(`data-last-article`);
    return storedData && storedData !== 'undefined' ? JSON.parse(storedData) : null;
  });
    const [contentLastArticle, setContentLastArticle] = useState(() => {
      const storedData = localStorage.getItem(`content-last-article`);
      return storedData && storedData !== 'undefined' ? JSON.parse(storedData) : null;
    });

    const {setIsAPIAvailable} = useAPI();
  useEffect(() => {
    if (!dataLastArticle) {
      fetchArticlesFromCategory("last-article").then((data) => {
        
        if (data.status === 'error'){
          setIsAPIAvailable(false);
        } else {
          setDataLastArticle(data.results[0]);
          localStorage.setItem(
            "data-last-article",
            JSON.stringify(data.results[0])
          );
        }
      });
    }

    if (dataLastArticle && !contentLastArticle) {
      fetchArticleContent(dataLastArticle.id_article).then((data) => {
        if (data.status === 'error'){
          setIsAPIAvailable(false);
        } else {
          setContentLastArticle(data.results[0]);
          localStorage.setItem(
            "content-last-article",
            JSON.stringify(data.results[0])
          );
        }
      });
    }
  }, [dataLastArticle, contentLastArticle]);

  return (<> {dataLastArticle &&(
  
    <div
      className="main-article-wrap"
    >
      <div className="main-article-wrap-header">
        <StarsNotation note={parseInt(dataLastArticle?.note!)} />
        <div className="main-article-wrap-header-reading-time">
          <svg xmlns="http://www.w3.org/2000/svg"viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
            <path d="M16.5 12H12.25C12.1119 12 12 11.8881 12 11.75V8.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <p>{`4 min`}</p>
        </div>
      </div>

      <div className="main-article-wrap-description description">
        <h1 className="description-title">{dataLastArticle!.titre}</h1>
        <em className="description-text">
        {formatText(dataLastArticle!.contenu)}
      </em>
      </div>
      
      
      <div className="main-article-wrap-footer">
        <Link 
          className="main-article-wrap-footer-cta"
          to={`/article/${dataLastArticle!.id_article}/${dataLastArticle!.titre}`}
          state={{ dataArticle: contentLastArticle, loadTop: true }}
        >
          <p>Lire l'article</p>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
            <path d="M7 7H17M17 7V17M17 7L7 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </Link>
      </div>
    </div>)}
    </>
  );
};

export default MainArticleSection;
