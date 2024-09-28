import React, { FunctionComponent, useEffect, useState } from "react";
import "./Section.scss";
import "./ArticlesSection.scss"
import ArticleCard from "../Cards/Articles/ArticleCard";
import { ContentType } from "../../utils/Types";
import { Link } from "react-router-dom";
import { fetchArticlesFromCategory, fetchArticlesFromUser } from "../../utils/Fetchs/FetchsArticles";
import { useAPI } from "../../ApiStatusContext";
import SkeletonCard from "../Cards/Skeletons/SkeletonCard";

const ArticlesSection: FunctionComponent<{title:string,endpoint:string;id_user?:string}> = ({title,endpoint,id_user}) => {
  const [dataArticles, setDataArticles] = useState<ContentType[] | null>( () => {
    if (endpoint === "user") {
      const storedData = localStorage.getItem(`articles-user-${id_user}`);
      return storedData && storedData !== "undefined" ? JSON.parse(storedData) : null; // Vérifie que storedData n'est pas null avant de le parser
    } else {
      const storedData = localStorage.getItem(`articles-${endpoint}`);
      return storedData && storedData !== "undefined"? JSON.parse(storedData) : null; // Vérifie que storedData n'est pas null avant de le parser
    }
  })
  const [alreadyLoad,setAlreadyLoad] = useState(false);

  const {setIsAPIAvailable} = useAPI();

  useEffect(()=>{

    if (!dataArticles || !alreadyLoad){
      if (endpoint === "user" && id_user){
        
        fetchArticlesFromUser(id_user).then(data => {
          
          if (data.status === 'error'){
            setIsAPIAvailable(false);
          } else {
            setDataArticles(data.results);
            localStorage.setItem(`articles-user-${id_user}`,JSON.stringify(data.results));
          }
        })
      } else {
        fetchArticlesFromCategory(endpoint).then(data => {
          setDataArticles(data.results);
          localStorage.setItem(`articles-${endpoint}`,JSON.stringify(data.results));
        })
      }
      setAlreadyLoad(true);
    }
  },[dataArticles,endpoint,id_user,alreadyLoad])

  return (
    <div className={`section-wrap articles ${endpoint}`}>
      <div className="section-wrap-header">
        <h1 className="section-wrap-header-title">{title}</h1>
      </div>
      
      <div className={`section-wrap-content`} >
        {dataArticles ? (dataArticles.map((article) => (
            <ArticleCard articleCardData={article} key={article.id_article} isFromPopup={false}/>
        ))) : (Array(5).fill(" ").map((article) => (
          <SkeletonCard type="article-card"/>
      )))}

      </div>
    </div>
  );
};

export default ArticlesSection;
