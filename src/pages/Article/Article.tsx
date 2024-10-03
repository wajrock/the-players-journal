import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import "./Article.scss";
import GameDetails from "../../components/GameDetails/GameDetails";
import { useUser } from "../../UserContext";
import Footer from "../../components/Footer/Footer";
import formatDate from "../../utils/formatDate";
import ReviewsSection from "../../components/Section/ReviewsSection";
import NewReviewSection from "../../components/Section/NewReviewSection";
import ArticleCard from "../../components/Cards/Articles/ArticleCard";
import {
  deleteArticle,
  formatContentArticle,
  getReadingTime,
  wichReviewView,
} from "../../utils/Functions/FunctionsArticle";
import {
  fetchArticleContent,
  fetchArticleReviews,
} from "../../utils/Fetchs/FetchsArticle";
import HerroBanner from "../../components/HeroBanners/HeroBanner";
import DeletePopup from "../../components/Popup/DeletePopup/DeletePopup";
import { useAPI } from "../../ApiStatusContext";
import BottomBar from "../../components/BottomBar/BottomBar";

const Article = () => {
  const { user } = useUser();

  const { article_id } = useParams<string>();

  const loc = useLocation();
  const navigate = useNavigate();

  const reviewsSectionRef = useRef<HTMLDivElement>(null);

  const [popupDeleteArticle,setPopupDeleteArticle] = useState(false);

  const [articleData, setDataArticle] = useState(() => {
    const storedData = localStorage.getItem(`data-article-${article_id}`);
    if (storedData && storedData !== 'undefined'){
      return JSON.parse(storedData)
    }
    if (loc.state && loc.state.dataArticle) {
      return loc.state.dataArticle;
    }
    return null;
  });

  const [reviewsLength, setReviewsLength] = useState<number>();

  const [isFirstRender, setIsFirstRender] = useState(true);

  const [typeReviews, setTypeReviews] = useState<string[]>([""]);

  
  const [textFormatted, setTextFormatted] = useState(() => {
    const storedData = localStorage.getItem(`content-formatted-article-${article_id}`);
    return storedData && storedData !== 'undefined' ? JSON.parse(storedData) : null;
  });

  const isOwnArticle =
    articleData && user && articleData.id_auteur === user.id_utilisateur;

  const {setIsAPIAvailable} = useAPI();

  const isUpdated = loc.state && loc.state.reviewsUpdated 

  useEffect(() => {
    
    
    if (isFirstRender) {
      
      loc.state && loc.state.loadTop && window.scrollTo(0, 0);
      loc.state &&
        loc.state.scrollVal &&
        window.scrollTo(0, loc.state.scrollVal);

        const hash = loc.hash;
        if (hash && hash === '#reviews') {
          if (reviewsSectionRef.current) {
            reviewsSectionRef.current.scrollIntoView();
          }
        }

        fetchArticleReviews(article_id!).then(data=>{
          if (data.status === 'error'){
            setIsAPIAvailable(false)
          } else {
            setReviewsLength(data.results.length);
            
            wichReviewView(
              article_id!,
              user,
              data.results.length,
              articleData,
              setTypeReviews
            );
          }
        })

       
      setIsFirstRender(false);
    }

    if (!articleData) {
      fetchArticleContent(article_id!).then((data) => {
        if (data.status === 'error'){
          setIsAPIAvailable(false);
        } else {
          setDataArticle(data.results[0]);
        }

        
      });
    }

    if (articleData) {
      
      localStorage.setItem(
        `data-article-${article_id}`,
        JSON.stringify(articleData)
      );

        const formatContent = formatContentArticle(
          articleData.contenu,
          articleData.images
        );
        
        setTextFormatted(formatContent);
        localStorage.setItem(
          `content-formatted-article-${article_id}`,
          JSON.stringify(formatContent)
        );
    }
  }, [
    user,
    reviewsLength,
    article_id,
    articleData,
    isFirstRender,
    loc.state,
    loc.pathname,
    loc.hash,
    textFormatted,
    typeReviews,
  ]);

  useEffect(()=>{
    
    if (isUpdated && articleData){
      loc.state = { ...loc.state, reviewsUpdated: undefined };
        
        
        fetchArticleReviews(article_id!).then(data=>{
          if (data.status === 'error'){
            setIsAPIAvailable(false)
          } else {
            setReviewsLength(data.results.length);

            wichReviewView(
              article_id!,
              user,
              data.results.length,
              articleData,
              setTypeReviews
            );
          }
        })
    }
  },[articleData,article_id,isFirstRender,loc])

  return (
    <>{articleData ? (
    <div className="article-wrap">
      <HerroBanner
        top
        left={true}
        bottom
        imagePath={articleData ? `https://theplayersjournal.wajrock.me/assets/articles/${articleData.cover_article}` : ''}
      />
      <Header />
      <section className="article-content">
        <div className="article-content-header">
          {isOwnArticle && (
            <div className="article-content-header-actions">
              <Link
                to={`/edition/${article_id}`}
                state={{dataArticle:articleData,loadTop:true}}
                replace={true}
                className="article-content-header-actions-edit"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <g clipPath="url(#clip0_189_1750)">
                    <path
                      d="M14.167 2.49939C14.3792 2.24859 14.6418 2.04444 14.9378 1.89996C15.2339 1.75548 15.5571 1.67384 15.8867 1.66024C16.2163 1.64664 16.5452 1.70137 16.8523 1.82096C17.1594 1.94055 17.4381 2.12237 17.6706 2.35483C17.903 2.58728 18.0842 2.86528 18.2024 3.17109C18.3207 3.47691 18.3735 3.80384 18.3575 4.13104C18.3415 4.45824 18.257 4.77855 18.1094 5.07153C17.9618 5.36451 17.7544 5.62375 17.5003 5.83272L6.25033 17.0827L1.66699 18.3327L2.91699 13.7494L14.167 2.49939Z"
                      stroke="currentColor"
                      strokeWidth="1.66667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_189_1750">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <p>Editer</p>
              </Link>
              <div className="article-content-header-actions-delete" onClick={()=> articleData && setPopupDeleteArticle(true)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 28 28"
                  fill="none"
                >
                  <path
                    d="M3.5 6.99967H24.5M22.1667 6.99967V23.333C22.1667 24.4997 21 25.6663 19.8333 25.6663H8.16667C7 25.6663 5.83333 24.4997 5.83333 23.333V6.99967M9.33333 6.99967V4.66634C9.33333 3.49967 10.5 2.33301 11.6667 2.33301H16.3333C17.5 2.33301 18.6667 3.49967 18.6667 4.66634V6.99967"
                    stroke="currentColor"
                    stroke-width="2.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <p>Supprimer</p>
              </div>
            </div>
          )}
          <div className="article-content-header-infos infos">
            <h1 className="infos-title">{articleData?.titre}</h1>
            <div className="infos-header">
            <Link to={articleData && articleData.identifiant ? `/@${articleData.identifiant.toLowerCase()}` : ""} state={{loadTop:true}}><div className="infos-header-author">
              <img
                src={`https://theplayersjournal.wajrock.me/assets/users/${articleData?.profile_picture}-50.webp`}
                alt=""
                className="infos-header-author-profile-picture"
                />
                <p>
                {articleData?.prenom} {articleData?.nom}
                </p>
              </div></Link>

              <div className="infos-header-reading-time">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <path
                    d="M16.5 12H12.25C12.1119 12 12 11.8881 12 11.75V8.5"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
                <p>
                  {getReadingTime(articleData?.contenu!)}
                </p>
              </div>
              <div className="infos-header-publish-date">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                <path d="M16 2V6M8 2V6M3 10H21M8 14H8.01M12 14H12.01M16 14H16.01M8 18H8.01M12 18H12.01M16 18H16.01M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
                <p>
                {
                  articleData && articleData.date_modification
                    ? `${formatDate(
                        articleData.date_modification
                      )} à ${formatDate(articleData.date_modification, true)}`
                    : articleData &&
                      articleData.date_creation &&
                      formatDate(articleData?.date_creation)
                }
                </p>
              </div>
            </div>
        </div>
      </div>

        <GameDetails article_id={article_id!} />

        <div className="article-content-text">
          {textFormatted && (
            <p dangerouslySetInnerHTML={{ __html: textFormatted }} />
          )}
        </div>
      </section>
      <section className="article-reviews" id="reviews" ref={reviewsSectionRef}>
        {typeReviews.includes("new-review") && (
          <NewReviewSection
            title={`Donne ton avis sur ce jeu`}
            id_article={article_id}
            id_user={user?.id_utilisateur}
          />
        )}

        {typeReviews.includes("login") && (
          <div className="message-banner-wrap">
            <h2 className="message-banner-wrap-subtitle">
              REJOINS LA COMMUNAUTE
            </h2>
            <h1 className="message-banner-wrap-title">
              <span>Connectes-toi</span> pour donner ton avis ✍
            </h1>
            <a href="/authentication" className="message-banner-wrap-cta"><p>Je me connectes</p></a>
          </div>
        )}

        {typeReviews.includes("new-review-first") && (
          <NewReviewSection
            title={`Sois le premier à donner ton avis sur ce jeu`}
            id_article={article_id}
            id_user={user?.id_utilisateur}
          />
        )}

        {typeReviews.includes("reviews") && <ReviewsSection
            title={"Les avis de la communauté"}
            endpoint={"article"}
            id_article={article_id}
            key={loc.state && loc.state.reviewsUpdated ? `updated` : 'default'} 
        />}
      </section>
      <Footer />
      <BottomBar />

      {popupDeleteArticle && (<DeletePopup textCta="Supprimer cet article" openPopupSetter={setPopupDeleteArticle} action={async()=>{
        if(await deleteArticle(articleData.id_jeu)){
    
          const referrer = document.referrer;

          if (referrer.includes(window.location.origin)) {
            navigate(-1);
          } else {
            navigate("/");
          }
        }
      }
        }>
        <ArticleCard articleCardData={
          {
            "id_article":article_id!,
            "cover_article":articleData!.cover_article,
            "note":articleData?.note!,
            "contenu":articleData?.contenu!,
            "profile_picture":articleData?.profile_picture!,
            "nom":articleData?.nom!,
            "prenom":articleData?.prenom!,
            "date_creation":articleData?.date_creation!,
            "titre":articleData?.titre!,

          }
          
          }
          isFromPopup={true}/>
      </DeletePopup>)}
    </div>):(<p>Impossible de charger les données</p>)}
    
    </>
  );
};

export default Article;
