import React, { ChangeEvent, FunctionComponent, useEffect, useState } from "react";
import "./Section.scss";
import "./NewReviewSection.scss"
import StarsNotation from "../StarsNotation/StarsNotation";
import { addReview } from "../../utils/Fetchs/FetchsReviews";
import { useLocation, useNavigate } from "react-router-dom";
import { useAPI } from "../../ApiStatusContext";
import { useToast } from "../../ToastContext";

export interface ReviewType {
  id_article: number;
  titre: string;
  date_creation: string;
  prenom: string;
  nom: number;
  texte: string;
  note: string;
  profile_picture: string;
}

const NewReviewSection: FunctionComponent<{
  title: string;
  id_user?: string;
  id_article?: string;
}> = ({ title, id_article, id_user }) => {
  
  const [gradeReview, setGradeReview] = useState('0');
  const [titleReview, setTitleReview] = useState("");
  const [contentReview, setContentReview] = useState("");

  const loc = useLocation();
  const navigate = useNavigate();
  const {setIsAPIAvailable} = useAPI();
  const {showToast} = useToast();

  const handleUpdate = (event: ChangeEvent<HTMLInputElement>|ChangeEvent<HTMLTextAreaElement>,valueSetter:(v:any)=>void) => {
    valueSetter(event.target.value);
  };

  const handleReset = () => {
    setGradeReview('0');
    setTitleReview("");
    setContentReview("");
  }

  const handleSubmit = () => {
    const reviewData = {
      "titre":titleReview,
      "texte":contentReview,
      "note":gradeReview.toString(),
      "id_article":id_article,
      "id_utilisateur":id_user
    }
    addReview(reviewData).then(data => {
      if (data.status === 'error'){
        setIsAPIAvailable(false);
      } else {
        const scroll = window.scrollY;
        navigate(`${loc.pathname}`,{state:{scrollVal:scroll,reviewsUpdated:true},replace:true});
        showToast("Ton avis a été ajouté avec succès !","success","Avis ajouté !")
      }
    });
  }

  return (
    <div className={`section-wrap new-review`}>
      <div className="section-wrap-header">
        <h1 className="section-wrap-header-title">{title}</h1>
   
      </div>

      <div className={"section-wrap-content"}>
        <div className="new-review-card-wrap">
          <div className="new-review-card-wrap-header">
            

          <div className="new-review-card-wrap-header-grade">
          <button
            className={`new-review-card-wrap-header-grade-controls ${parseFloat(gradeReview) < 1 ? 'disabled' : ''}`}
            onClick={()=> {
              const currentGradeValue = parseFloat(gradeReview);
              currentGradeValue >= 1 && setGradeReview((currentGradeValue-1).toString())
              }
            }
            >-</button>
            <StarsNotation note={parseFloat(gradeReview)} />
            <button 
              className={`new-review-card-wrap-header-grade-controls ${parseFloat(gradeReview) > 9 ? 'disabled' : ''}`}
              onClick={()=> {
                const currentGradeValue = parseFloat(gradeReview);
                currentGradeValue <= 9 && setGradeReview((currentGradeValue+1).toString())
                }
              }
            
            >+</button>
          </div>

          <div className="new-review-card-wrap-header-actions">
                  {(titleReview !== "" || contentReview !== "" || gradeReview !== '0') && (<div className="new-review-card-wrap-header-actions-close" onClick={handleReset}>
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
                  </div>)}

                  {titleReview !== "" && contentReview !== "" &&(<div className="new-review-card-wrap-header-actions-validate" onClick={handleSubmit}>
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
                  </div>)}
                </div>
            
          </div>
          <input
            type="text"
            name="title"
            id="title"
            title="title"
            value={titleReview}
            onChange={(event)=>handleUpdate(event,setTitleReview)}
            placeholder="Ajoutez un titre"
          />
          <textarea
            name=""
            id=""
            title="contenu"
            value={contentReview}
            onChange={(event)=>handleUpdate(event,setContentReview)}
            placeholder="Donnez votre avis ...."
            rows={4}
          ></textarea>
               
        </div>
      </div>
    </div>
  );
};

export default NewReviewSection;
