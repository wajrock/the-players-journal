import React, { FunctionComponent, useRef } from "react";
import "./Header.scss";
import { useUser } from "../../UserContext";

const Header:FunctionComponent<{type?:string}> = ({type="default"}) => {
  const { user } = useUser();
  const headerRef = useRef<HTMLDivElement>(null);
  

  return (
    <div className={`header-wrap ${type === "logotype" ? "type-logotype" : ""}`} ref={headerRef}>
      <div className="header-wrap-content">
        {type !== "logotype" ? (
          <div className="header-wrap-content-left">
            <a href="/" className="header-wrap-content-left-logo">
              <p>The Players Journal</p>
            </a>
            <nav className="header-wrap-content-left-navbar navbar">
              <a href="/articles" className="navbar-item">
                Articles
              </a>
              <a href="/jeux" className="navbar-item">
                Jeux
              </a>
            </nav>
          </div>
        ) : (<a href="/" className="logotype">
          <p>The Players Journal</p>
        </a>)}
      

      {user && type !== "logotype" && (
        <div className="header-wrap-content-right">
            { user.type === 'admin' && (<a href="/redaction" className="logotype"><div className="write-cta">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none">
                    <g clipPath="url(#clip0_189_1750)">
                        <path d="M14.167 2.49939C14.3792 2.24859 14.6418 2.04444 14.9378 1.89996C15.2339 1.75548 15.5571 1.67384 15.8867 1.66024C16.2163 1.64664 16.5452 1.70137 16.8523 1.82096C17.1594 1.94055 17.4381 2.12237 17.6706 2.35483C17.903 2.58728 18.0842 2.86528 18.2024 3.17109C18.3207 3.47691 18.3735 3.80384 18.3575 4.13104C18.3415 4.45824 18.257 4.77855 18.1094 5.07153C17.9618 5.36451 17.7544 5.62375 17.5003 5.83272L6.25033 17.0827L1.66699 18.3327L2.91699 13.7494L14.167 2.49939Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_189_1750">
                        <rect width="20" height="20" fill="white"/>
                        </clipPath>
                    </defs>
                </svg>
                <p>Rédiger</p>
            </div></a>)}
            <a className="profile" href={`/@${user.identifiant.toLowerCase()}`} title="Profile">
                <img src={`https://theplayersjournal.wajrock.me/assets/users/${user.profile_picture}`} alt="" className="profile-picture" />
                <div className="profile-content">
                </div>
            </a>
        </div>
      )}
      {!user  && type !== "logotype" &&(
        <div className="header-wrap-content-right">
          <a href="/authentication" className="login-cta">
            <p>Connexion</p>
          </a>
        </div>
      )}
      </div>
    </div>
  );
};

export default Header;
