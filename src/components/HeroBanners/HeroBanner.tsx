import React, {FunctionComponent } from "react";
import "./HeroBanner.scss";


const HerroBanner:FunctionComponent<{imagePath:string,top:boolean,left:boolean,bottom:boolean,isResponsive?:boolean}> = ({imagePath,top,left,bottom,isResponsive=true}) => {

  return (
    <div
      className="hero-banner-wrap"
    >
      <div className="hero-banner-wrap-background">
          {!imagePath.includes('data') ? (<img 
          src={`${imagePath}-800.webp`}
          srcSet={`
              ${imagePath}-800.webp 800w, 
              ${imagePath}-1200.webp 1200w, 
              ${imagePath}-1600.webp 1600w`}
          sizes="100vw" 
          alt="Large couverture de l'article"/>) : (
            <img 
          src={`${imagePath}`}
          alt="Large couverture de l'article"/>
          )}

      </div>
      <div className="hero-banner-wrap-overlays">
        {top && <div className="hero-banner-wrap-overlays-top"></div>}
        {bottom && <div className="hero-banner-wrap-overlays-bottom"></div>}
        {left && <div className="hero-banner-wrap-overlays-left"></div>}
      </div>
      
    </div>
  );
};

export default HerroBanner;
