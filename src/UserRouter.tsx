import React, { useEffect, useState, Suspense } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Article from "./pages/Article/Article";
import Authentication from "./pages/Authentication/Authentication";
import Discover from "./pages/Discover/Discover";
import Profile from "./pages/Profile/Profile";
import { useUser } from "./UserContext"; // Accédez au contexte utilisateur
import { fetchProfiles } from "./utils/Fetchs/FetchsUsers";
import ErrorsPage from "./pages/Errors/ErrorsPage";
import EditArticle from "./pages/EditArticle/EditArticle";
import WriteArticle from "./pages/WriteArticle//WriteArticle";
import { useAPI } from "./ApiStatusContext";

const UserRouter = () => {
  const { profiles, setProfiles, user } = useUser();
  const { isAPIAvailable,setIsAPIAvailable } = useAPI();
  const navigate = useNavigate();
  const [alreadyLoad,setAlreadyLoad] = useState(false);

  useEffect(() => {
      if ((isAPIAvailable === true || !alreadyLoad) && profiles.length === 0) {
        fetchProfiles().then((data) => {
          if (data.status === 'error'){
            setIsAPIAvailable(false)
          } else {
            setProfiles(data);
            localStorage.setItem('profiles',JSON.stringify(data))
          }
          
        });
        setAlreadyLoad(true);
      } 
      
      if (isAPIAvailable === false){
        navigate("/", { replace: true });
      }
    
  }, [setProfiles, navigate,isAPIAvailable,setIsAPIAvailable,alreadyLoad,profiles.length]);

  
  return (
    <Suspense fallback={<div className="loader">Chargement...</div>}>
    <Routes>
      {isAPIAvailable === true && (
        <>
          <Route path="/" element={<Home />} />
          <Route
            path="/article/:article_id/:article_name"
            element={<Article />}
          />
          {user !== null && (
            <Route path="/edition/:article_id" element={<EditArticle />} />
          )}
          {user !== null && user.type === 'admin' && (
            <Route path="/redaction" element={<WriteArticle />} />
          )}
          <Route path="/authentication" element={<Authentication />} />
          <Route path="/articles" element={<Discover type="articles" />} />
          <Route path="/jeux" element={<Discover type="games" />} />
          <Route path="/créateurs" element={<Discover type="creators" />} />
          

          {/* Routes dynamiques pour les profils */}
          {profiles.map((profile, index) => (
            <Route
              key={index}
              path={`/@${profile.identifiant!.toLowerCase()}`}
              element={
                <Profile
                  profileData={profile}
                />
              }
            />
          ))}
          <Route path="*" element={<ErrorsPage error={404} />} />
        </>
      )}
      {isAPIAvailable === false && (
        <Route path="/" element={<ErrorsPage error={500} />} />
      )}
    </Routes>
    </Suspense>
  );
};

export default UserRouter;
