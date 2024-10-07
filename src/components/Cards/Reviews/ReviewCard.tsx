import React, { FunctionComponent, useState } from "react";
import formatDate from "../../../utils/formatDate";
import { Link, useLocation, useNavigate } from "react-router-dom";
import StarsNotation from "../../StarsNotation/StarsNotation";
import "./ReviewCard.scss";
import { ContentType } from "../../../utils/Types";
import { useUser } from "../../../UserContext";
import { deleteReview } from "../../../utils/Fetchs/FetchsReviews";
import DeletePopup from "../../Popup/DeletePopup/DeletePopup";
import { useToast } from "../../../ToastContext";
import { useAPI } from "../../../ApiStatusContext";

const ReviewCard: FunctionComponent<{ reviewCardData: ContentType,type:string }> = ({
  reviewCardData,type
}) => {

  const { user } = useUser();

  const loc = useLocation();

  const navigate = useNavigate();

  const isOwnReview = reviewCardData.id_utilisateur === user?.id_utilisateur;
  const isAdmin = user?.type === "admin";

  const [openPopup, setOpenPopup] = useState(false);
  const {showToast} = useToast();
  const {setIsAPIAvailable} = useAPI();

  const handleDelete = () => {
    const reviewData = {
      id_avis: reviewCardData.id_avis,
    };
    deleteReview(reviewData).then((data) => {
      switch (data.code) {
        case 500:
          setIsAPIAvailable(false);
          break;
        case 400:
          showToast("Impossible de supprimer ton avis","error","Oups..");
          break;
        case 200:
          setOpenPopup(false);
          const scroll = window.scrollY;
          navigate(`${loc.pathname}`, { state: { scrollVal: scroll,reviewsUpdated:true } });
          showToast("Ton avis a été supprimé avec succès !","success","Avis supprimé !")
          break;
        default:
          break;
      }
    });
  };
  
  return (
    <>
      {openPopup && (
        <DeletePopup
          openPopupSetter={setOpenPopup}
          action={handleDelete}
          textCta="Supprimer cet avis"
        >
          <div
          
          className="review-card-wrap popup"
        >
          <div className="review-card-wrap-header">
            <StarsNotation note={parseInt(reviewCardData?.note!)} />
          </div>
          <div className="review-card-wrap-details">
            <Link to={`/@${reviewCardData.identifiant?.toLowerCase()}`} state={{loadTop:true}}>
              <div className="review-card-wrap-details-author">
                <img
                  src={`https://theplayersjournal.wajrock.me/assets/users/${reviewCardData.profile_picture}-50.webp`}
                  alt=""
                  className="review-card-wrap-details-profile-picture"
                />
                <p>
                  {reviewCardData.prenom} {reviewCardData.nom}
                </p>
              </div>
            </Link>
            <p className="review-card-wrap-details-date">{formatDate(reviewCardData.date_creation)}</p>
          </div>
          

          <h1 className="review-card-wrap-title">{reviewCardData.titre}</h1>
          <p className="review-card-wrap-text">{reviewCardData.texte}</p>
        </div>
         
        </DeletePopup>
      )}
      {isOwnReview || isAdmin ? (
        <div className="review-card-wrap">
          <div className="review-card-wrap-header">
            <StarsNotation note={parseInt(reviewCardData?.note!)} />
            <div
              className="review-card-wrap-header-delete"
              onClick={() => {
                setOpenPopup(true);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M3 6H21M19 6V20C19 21 18 22 17 22H7C6 22 5 21 5 20V6M8 6V4C8 3 9 2 10 2H14C15 2 16 3 16 4V6"
                  stroke="currenColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            {type === "user" && (<Link to={`/article/${reviewCardData.id_article}/${reviewCardData!.title_article}/#reviews`}><div
              className="review-card-wrap-header-link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                <path d="M4 5H19M19 5V20M19 5L4 20" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div></Link>)}
          </div>

          <div className="review-card-wrap-details">
            <Link to={`/@${reviewCardData.identifiant?.toLowerCase()}`} state={{loadTop:true}}>
              <div className="review-card-wrap-details-author">
                <img
                  src={`https://theplayersjournal.wajrock.me/assets/users/${reviewCardData.profile_picture}-50.webp`}
                  alt=""
                  className="review-card-wrap-details-profile-picture"
                />
                <p>
                  {reviewCardData.prenom} {reviewCardData.nom}
                </p>
              </div>
            </Link>
            <p className="review-card-wrap-details-date">{formatDate(reviewCardData.date_creation)}</p>
          </div>

          <h1 className="review-card-wrap-title">{reviewCardData.titre}</h1>
          <p className="review-card-wrap-text">{reviewCardData.texte}</p>
        </div>
      ) : (

        <div
          
          className="review-card-wrap"
        >
          <div className="review-card-wrap-header">
            <StarsNotation note={parseInt(reviewCardData?.note!)} />
            {type === "user" && (<Link to={`/article/${reviewCardData.id_article}/${reviewCardData!.title_article}#reviews`}><div
              className="review-card-wrap-header-link"
              onClick={() => {
                navigate(`/article/${reviewCardData.id_article}`)
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                <path d="M4 5H19M19 5V20M19 5L4 20" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div></Link>)}
          </div>
          <div className="review-card-wrap-details">
            <Link to={`/@${reviewCardData.identifiant?.toLowerCase()}`} state={{loadTop:true}}>
              <div className="review-card-wrap-details-author">
                <img
                  src={`https://theplayersjournal.wajrock.me/assets/users/${reviewCardData.profile_picture}-50.webp`}
                  alt=""
                  className="review-card-wrap-details-profile-picture"
                />
                <p>
                  {reviewCardData.prenom} {reviewCardData.nom}
                </p>
              </div>
            </Link>
            <p className="review-card-wrap-details-date">{formatDate(reviewCardData.date_creation)}</p>
          </div>
          

          <h1 className="review-card-wrap-title">{reviewCardData.titre}</h1>
          <p className="review-card-wrap-text">{reviewCardData.texte}</p>
        </div>
      )}
    </>
  );
};

export default ReviewCard;
