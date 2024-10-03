import React, { FunctionComponent } from "react";
import "./BottomBar.scss";
import { useUser } from "../../UserContext";
const BottomBar: FunctionComponent<{
  type?:
    | "discover"
    | "articles"
    | "games"
    | "profile"
    | "redaction"
    | "authentication";
}> = ({ type }) => {
  const { user } = useUser();

  return (
    <div className={`bottom-bar-wrap`}>
      <div className="bottom-bar-wrap-content">
        <a
          href="/"
          className={`bottom-bar-wrap-content-item ${
            type === "discover" ? "active" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
          >
            <path
              d="M12.125 22C17.6478 22 22.125 17.5228 22.125 12C22.125 6.47715 17.6478 2 12.125 2C6.60215 2 2.125 6.47715 2.125 12C2.125 17.5228 6.60215 22 12.125 22Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M16.3648 7.76001L14.2448 14.12L7.88477 16.24L10.0048 9.88001L16.3648 7.76001Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <p className="bottom-bar-wrap-content-item-label">Découvrir</p>
        </a>

        <a
          href="/articles"
          className={`bottom-bar-wrap-content-item ${
            type === "articles" ? "active" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="23"
            viewBox="0 0 23 23"
            fill="none"
          >
            <g clip-path="url(#clip0_491_315)">
              <path
                d="M3.83329 21.0833H19.1666C19.675 21.0833 20.1625 20.8814 20.5219 20.5219C20.8814 20.1625 21.0833 19.675 21.0833 19.1666V3.83329C21.0833 3.32496 20.8814 2.83745 20.5219 2.478C20.1625 2.11856 19.675 1.91663 19.1666 1.91663H7.66663C7.15829 1.91663 6.67078 2.11856 6.31134 2.478C5.95189 2.83745 5.74996 3.32496 5.74996 3.83329V19.1666C5.74996 19.675 5.54803 20.1625 5.18858 20.5219C4.82914 20.8814 4.34162 21.0833 3.83329 21.0833ZM3.83329 21.0833C3.32496 21.0833 2.83745 20.8814 2.478 20.5219C2.11856 20.1625 1.91663 19.675 1.91663 19.1666V10.5416C1.91663 9.48746 2.77913 8.62496 3.83329 8.62496H5.74996M17.25 13.4166H9.58329M14.375 17.25H9.58329M9.58329 5.74996H17.25V9.58329H9.58329V5.74996Z"
                stroke="currentColor"
                stroke-width="1.91667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_491_315">
                <rect width="23" height="23" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <p className="bottom-bar-wrap-content-item-label">Articles</p>
        </a>

        <a
          href="/jeux"
          className={`bottom-bar-wrap-content-item ${
            type === "games" ? "active" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="29"
            height="22"
            viewBox="0 0 29 22"
            fill="none"
          >
            <path
              d="M7.24996 9.66663H12.0833M9.66663 7.24996V12.0833M18.125 10.875H18.137M21.75 8.45829H21.762M20.9283 2.41663H8.07163C6.87571 2.4169 5.72237 2.86054 4.83454 3.66177C3.94672 4.463 3.38746 5.56493 3.26488 6.75454C3.25763 6.81738 3.25279 6.87658 3.24433 6.93821C3.14646 7.75263 2.41663 13.8426 2.41663 15.7083C2.41663 16.6697 2.79854 17.5917 3.47836 18.2716C4.15818 18.9514 5.08022 19.3333 6.04163 19.3333C7.24996 19.3333 7.85413 18.7291 8.45829 18.125L10.1669 16.4164C10.62 15.9631 11.2346 15.7084 11.8755 15.7083H17.1245C17.7653 15.7084 18.3799 15.9631 18.833 16.4164L20.5416 18.125C21.1458 18.7291 21.75 19.3333 22.9583 19.3333C23.9197 19.3333 24.8417 18.9514 25.5216 18.2716C26.2014 17.5917 26.5833 16.6697 26.5833 15.7083C26.5833 13.8414 25.8535 7.75263 25.7556 6.93821C25.7471 6.87779 25.7423 6.81738 25.735 6.75575C25.6127 5.56592 25.0536 4.4637 24.1657 3.66222C23.2779 2.86074 22.1244 2.41694 20.9283 2.41663Z"
              stroke="currentColor"
              stroke-width="2.41667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <p className="bottom-bar-wrap-content-item-label">Jeux</p>
        </a>

        {user ? (
          <>
            <a
              href="/redaction"
              className={`bottom-bar-wrap-content-item ${
                type === "redaction" ? "active" : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
              >
                <g clip-path="url(#clip0_491_325)">
                  <path
                    d="M15.5834 2.75001C15.8168 2.47413 16.1056 2.24957 16.4313 2.09064C16.757 1.93171 17.1125 1.8419 17.475 1.82694C17.8376 1.81198 18.1994 1.8722 18.5372 2.00374C18.8751 2.13529 19.1816 2.33529 19.4373 2.59099C19.693 2.84669 19.8923 3.15249 20.0224 3.48888C20.1525 3.82528 20.2106 4.1849 20.1929 4.54483C20.1753 4.90475 20.0824 5.25708 19.92 5.57937C19.7577 5.90165 19.5295 6.18681 19.25 6.41668L6.87504 18.7917L1.83337 20.1667L3.20837 15.125L15.5834 2.75001Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_491_325">
                    <rect width="22" height="22" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <p className="bottom-bar-wrap-content-item-label">Rédiger</p>
            </a>
            <a
              href={`/@${user.identifiant.toLowerCase()}`}
              className={`bottom-bar-wrap-content-item ${
                type === "profile" ? "active" : ""
              }`}
            >
              <img
                src={`https://theplayersjournal.wajrock.me/assets/users/${user.profile_picture}-50.webp`}
                alt=""
                className="profile-picture"
              />
              <p className="bottom-bar-wrap-content-item-label">Profile</p>
            </a>
          </>
        ) : (
          <a
            href="/authentication"
            className={`bottom-bar-wrap-content-item ${
              type === "authentication" ? "active" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 25 24"
              fill="none"
            >
              <path
                d="M7.125 20.662V19C7.125 18.4696 7.33571 17.9609 7.71079 17.5858C8.08586 17.2107 8.59457 17 9.125 17H15.125C15.6554 17 16.1641 17.2107 16.5392 17.5858C16.9143 17.9609 17.125 18.4696 17.125 19V20.662M22.125 12C22.125 17.5228 17.6478 22 12.125 22C6.60215 22 2.125 17.5228 2.125 12C2.125 6.47715 6.60215 2 12.125 2C17.6478 2 22.125 6.47715 22.125 12ZM15.125 10C15.125 11.6569 13.7819 13 12.125 13C10.4681 13 9.125 11.6569 9.125 10C9.125 8.34315 10.4681 7 12.125 7C13.7819 7 15.125 8.34315 15.125 10Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <p className="bottom-bar-wrap-content-item-label">Connexion</p>
          </a>
        )}
      </div>
    </div>
  );
};

export default BottomBar;
