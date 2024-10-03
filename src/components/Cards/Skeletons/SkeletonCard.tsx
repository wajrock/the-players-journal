import { FunctionComponent } from 'react';
import './SkeletonCard.scss'

const SkeletonCard:FunctionComponent<{type:'article-card'| 'game-card' |'game-details'}> = ({type}) => {
    
  return (<>
  
    {type === "article-card" && (<div
      className="skeleton-article-card-wrap"
    >
      <div className="skeleton-article-card-wrap-container">
      </div>
      
     
    </div>)}

    {type === "game-card" && (<div
      className="skeleton-game-card-wrap"
    >
      <div className="skeleton-game-card-wrap-container">
      </div>
      
     
    </div>)}

    {type === "game-details" && (
      <div className="skeleton-game-details-wrap">
        <div className="skeleton-game-details-wrap-cover"/>
        <div className="skeleton-game-details-wrap skeleton-texts">
          <p className="skeleton-texts-title"/>

          <div className="skeleton-texts-details ">
            <div className="skeleton-texts-details-item"/>
            <div className="skeleton-texts-details-item"/>
            <div className="skeleton-texts-details-item"/>
          </div>
          
          <div className="skeleton-texts-synopsis">
            <p className="skeleton-texts-synopsis-line"></p>
            <p className="skeleton-texts-synopsis-line"></p>
            <p className="skeleton-texts-synopsis-line"></p>
            <p className="skeleton-texts-synopsis-line"></p>
          </div>
          
          <div className="skeleton-texts-footer">
            <div className="skeleton-texts-footer-platforms">
              <div className="skeleton-texts-footer-platforms-item"/>
              <div className="skeleton-texts-footer-platforms-item"/>
              <div className="skeleton-texts-footer-platforms-item"/>
            </div>
            <div className="skeleton-texts-footer-grade"></div>
          </div>
           
        </div>
        
      </div>)}
  </>
  )
};

export default SkeletonCard;
