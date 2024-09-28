import React, { FunctionComponent, useEffect, useState } from "react";
import "./Section.scss";
import "./ReviewsSection.scss"
import ReviewCard from "../Cards/Reviews/ReviewCard";
import { ContentType } from "../../utils/Types";
import { fetchReviewsFromArticle, fetchReviewsFromUser } from "../../utils/Fetchs/FetchsReviews";
import { useAPI } from "../../ApiStatusContext";
import { useLocation, useNavigate } from "react-router-dom";

export interface ReviewType {
  id_article:number;
  titre:string;
  date_creation:string;
  prenom:string;
  nom:number;
  texte:string;
  note:string;
  profile_picture:string;
}

const ReviewsSection: FunctionComponent<{title:string;endpoint:string;id_user?:string;id_article?:string;method?:string}> = ({title,endpoint,id_article,id_user,method="get"}) => {

    const [dataReviews, setDataReviews] = useState<ContentType[]|null>(() => {
      if (endpoint === "user"){
        const storedData = localStorage.getItem(`reviews-user-${id_user}`);
        return storedData && storedData !== 'undefined' ? JSON.parse(storedData) : null;
      } else{
        const storedData = localStorage.getItem(`reviews-article-${id_article}`);
        return storedData && storedData !== 'undefined' ? JSON.parse(storedData) : null;
      }
      
    });

      const {setIsAPIAvailable} = useAPI();

      const [alreadyLoad,setAlreadyLoad] = useState<boolean>(false);

      const location = useLocation();

      const isUpdated = location.state && location.state.reviewsUpdated 

  useEffect(()=>{
    if (!dataReviews || !alreadyLoad || isUpdated){
      
      location.state = { ...location.state, reviewsUpdated: undefined };
      
      if (endpoint === "user" && id_user){
        fetchReviewsFromUser(id_user).then(data => {
          
          if (data.status === 'error'){
            setIsAPIAvailable(false);
          } else {
            setDataReviews(data.results);
           localStorage.setItem(`reviews-user-${id_user}`,JSON.stringify(data.results))
          }
        })
      }
      
      if (endpoint === "article" && id_article) {
        fetchReviewsFromArticle(id_article).then(data => {
          
          
          if (data.status === 'error'){
            setIsAPIAvailable(false);
          } else {
            setDataReviews(data.results);
            localStorage.setItem(`reviews-article-${id_article}`,JSON.stringify(data.results))
          }
         
        })
      }
      setAlreadyLoad(true);
    }
        
      
  },[endpoint,id_user,id_article,dataReviews,alreadyLoad])

  return (
    <div className={`section-wrap reviews ${endpoint} `}>
      <div className="section-wrap-header">
        <h1 className="section-wrap-header-title">{title}</h1>
        {method === "post" && (<div className="section-wrap-header-actions">
            <div
              className="section-wrap-header-actions-close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 28 28"
                fill="none"
              >
                <path
                  d="M2 25.9995L25.9995 2M25.9995 26.0002L2 2.00073"
                  stroke="currenColor"
                  stroke-width="4.8"
                />
              </svg>
            </div>

            <div className="section-wrap-header-actions-validate">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 38 30"
              fill="none"
            >
              <path
                d="M35 3L13 27L3 16.0909"
                stroke="currenColor"
                stroke-width="4.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          </div>)}
      </div>

      <div className={"section-wrap-content"}>
        {dataReviews && dataReviews.length > 0 && dataReviews.map((review, index) => (
            <ReviewCard reviewCardData={review} key={index} type={endpoint}/>
        ))}

        {dataReviews && dataReviews.length === 0  && endpoint === "user" &&(
          <div className="review-card-wrap">
            <p className="review-card-wrap-empty-text">Aucun avis posté pour le moment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;
