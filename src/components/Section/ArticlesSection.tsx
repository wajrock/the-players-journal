import React, { FunctionComponent } from "react";
import "./Section.scss";
import "./ArticlesSection.scss"
import ArticleCard from "../Cards/Articles/ArticleCard";
import SkeletonCard from "../Cards/Skeletons/SkeletonCard";
import useArticles from "../../Hooks/UseArticles";

const ArticlesSection: FunctionComponent<{title:string,endpoint:string;id_user?:string}> = ({title,endpoint,id_user}) => {

  const {dataArticles} = useArticles(endpoint as 'latest-articles'|'most-popular'|'user',endpoint ==="user" ? id_user : undefined)
  console.log(dataArticles);
  
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
