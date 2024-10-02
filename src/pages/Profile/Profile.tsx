import { ChangeEvent, FunctionComponent, useEffect, useState } from "react";
import "./Profile.scss";
import { ContentType, uploadCoverProps } from "../../utils/Types";
import Footer from "../../components/Footer/Footer";
import ArticlesSection from "../../components/Section/ArticlesSection";
import ReviewsSection from "../../components/Section/ReviewsSection";
import formatDate from "../../utils/formatDate";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../UserContext";
import EditProfilePopup from "../../components/Popup/EditProfilePopup/EditProfilePopup";
import Header from "../../components/Header/Header";
import HeroBanner from "../../components/HeroBanners/HeroBanner";
import { fetchProfiles, updateUserContext } from "../../utils/Fetchs/FetchsUsers";
import { useAPI } from "../../ApiStatusContext";
import BottomBar from "../../components/BottomBar/BottomBar";
import { useToast } from "../../ToastContext";
import Toast from "../../components/Toast/Toast";

const Profile: FunctionComponent<{
  profileData: ContentType;
}> = ({ profileData }) => {
  
  
  const loc = useLocation();
  const loadTop = loc.state?.loadTop;
  const contentIsUpdated = loc.state?.contentIsUpdated;
  const navigate = useNavigate();
  const { user,logout,setUser,setProfiles } = useUser();
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [isAccount, setIsAccount] = useState<boolean>(
    profileData.id_utilisateur.toString() === user?.id_utilisateur.toString()
  );
  const [profilePicture,setProfilePicture] = useState<uploadCoverProps>({
    "path":profileData.profile_picture,
    "file":"",
    "old-image":""
  });

  const [imageLoaded,setImageLoaded] = useState(()=>{
    var image = new Image();
    image.src = profilePicture ? `https://theplayersjournal.wajrock.me/assets/users/${profilePicture.path}` : "";

    return image.complete;
  });
  const [imageLoading,setImageLoading] = useState<boolean>(false);
  const [imageSrc,setImageSrc] = useState<string>(()=>{
    var image = new Image();
    image.src = profilePicture ?  `https://theplayersjournal.wajrock.me/assets/users/${profilePicture.path}`: "";

    return image.complete ? `https://theplayersjournal.wajrock.me/assets/users/${profilePicture.path}`: ""
  });

  const [imageUploadSrc,setImageUploadSrc] = useState<string>("");

  const {setIsAPIAvailable} = useAPI();
  const {showToast} = useToast();

  useEffect(() => {
    if (!imageLoaded){
      const img = new Image();

      img.onload = () => {
        setImageSrc(img.src);
        setImageLoaded(true);
      }

      img.src = profilePicture.path && `https://theplayersjournal.wajrock.me/assets/users/${profilePicture.path}`;
    
    }
  }, [imageLoaded,profilePicture.path]);


  
  const handleProfilePictureChanged = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageLoading(true);
      const extension = file.name.split(".").pop();
      const newFilename = 
      `${profileData.nom.toLowerCase()}-${(Date.now() * Math.random())
      .toString()
      .slice(0, 5)}.${extension}`

      const newFile = new File([file], newFilename, { type: file.type });

      const reader = new FileReader();
      reader.onload = (event) => {
          setImageUploadSrc(event.target?.result as string)
          setProfilePicture({
            file: newFile,
            path: event.target?.result as string,
            "old-image":profilePicture ? profilePicture.path : ""
          });  

          
                
        
      };
      reader.readAsDataURL(newFile);

      const profilePictureData = new FormData();
      profilePictureData.append('profile-picture',newFile)
      profilePictureData.append('id_user',profileData.id_utilisateur)
      profilePictureData.append('old-image',profileData.profile_picture)

      const fetchData = async() => {
        try {
          const response = await fetch('https://theplayersjournal.wajrock.me/api/users?type=update-profile-picture',{
            method: "POST",
            body: profilePictureData
          })

  
          if (!response.ok) {
            setIsAPIAvailable(false)
          }

          const data = await response.json();
          
          if (data.code === 400){
            showToast("Impossible de modifier la photo de profile","error","Oups...")
            return;
          } else if (data.code === 200){
            const newUser = await updateUserContext(profileData.id_utilisateur)
            if (newUser.code === 200){
              setUser(newUser.results[0]);
              localStorage.setItem("user", JSON.stringify(newUser.results[0]));
            }

            fetchProfiles().then((data) => {
              if (data.code === 200) {
                setProfiles(data.results);
                localStorage.setItem('profiles',JSON.stringify(data.results))
              }
              
            })

            setImageLoading(false);
            navigate(`/@${profileData.identifiant}`,{state:{
              toast: {
                message: "Ta nouvelle photo de profil a été ajouté avec succès",
                type: "success",
                title:'Photo mise à jour !'
              },
              contentIsUpdated:true
              
            }})
          }
            
           
          } catch (error) {
            setIsAPIAvailable(false);
            showToast("Impossible de modifier la photo de profile","error","Oups...")
            return;
        }
      }

      fetchData();

    }
    
  };

  useEffect(()=>{
    setImageSrc(`https://theplayersjournal.wajrock.me/assets/users/${profileData.profile_picture}`)
    
  },[profileData])

  useEffect(() => {
    loadTop === true && window.scrollTo(0, 0);
    
  }, [loadTop]);

  useEffect(() => {
    setIsAccount(
      profileData.id_utilisateur.toString() === user?.id_utilisateur.toString()
    );
  }, [profileData.id_utilisateur, user?.id_utilisateur]);

  useEffect(()=>{
    openPopup ? document.body.style.position = 'fixed' : document.body.style.position = 'initial';
  },[openPopup])


  return (
      <div className="profile-wrap">
      <HeroBanner top left bottom imagePath={"https://theplayersjournal.wajrock.me/assets/main-cover"}/>
      <Header />
     
      <header className="profile-wrap-header">
        <section className="profile-wrap-header-left leftHeader">
          <div className="leftHeader-profile-picture">
            {!imageLoaded ? (<div className="image-loader"></div>) : <img
              src={imageSrc}
              alt={"Avatar de l'utilisateur"}
            />}
            {isAccount && (<label htmlFor="profile-picture" className="leftHeader-profile-picture-change">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                <g clip-path="url(#clip0_474_1090)">
                  <path d="M6 6C6 6 8.25 3.75 12 3.75C17.25 3.75 20.25 9 20.25 9" stroke="currentColor" stroke-width="2.333" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M18 18C18 18 15.75 20.25 12 20.25C6.75 20.25 3.75 15 3.75 15" stroke="currentColor" stroke-width="2.333" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M15.75 9H20.25V4.5" stroke="currentColor" stroke-width="2.333" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8.25 15H3.75V19.5" stroke="currentColor" stroke-width="2.333" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                <defs>
                  <clipPath id="clip0_474_1090">
                    <rect width="24" height="24" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
              <input onChange={handleProfilePictureChanged} title='profile-picture' type="file" name="profile-picture" id="profile-picture" accept="image/*" />
            </label>)}
          </div>
          
          <div className="leftHeader-infos">
            <p className="leftHeader-infos-username">
              @{profileData.identifiant?.toLocaleLowerCase()}
            </p>
            <h1 className="leftHeader-infos-name">
              {profileData.prenom} {profileData.nom}
            </h1>
            {isAccount && (
              <div className="leftHeader-infos-footer">
                <div
                  className="leftHeader-infos-footer-edit-profile"
                  onClick={() => {
                    setOpenPopup(true);
                  }}
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
                        strokeWidth="2.5"
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
                  <p>Modifier mon compte</p>
                </div>

                
              </div>
            )}
          </div>
        </section>
        <section className="profile-wrap-header-right rightHeader">
        {isAccount && (<div
              className="rightHeader-item-logout"
              onClick={logout}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 21"
                    fill="none"
                  >
                    <path
                      d="M7.5 18H4.16667C3.72464 18 3.30072 17.8244 2.98816 17.5118C2.67559 17.1993 2.5 16.7754 2.5 16.3333V4.66667C2.5 4.22464 2.67559 3.80072 2.98816 3.48816C3.30072 3.17559 3.72464 3 4.16667 3H7.5M13.3333 14.6667L17.5 10.5M17.5 10.5L13.3333 6.33333M17.5 10.5H7.5"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <p>Déconnexion</p>
                </div>)}
                
          <div className="rightHeader-item">
            <p className="rightHeader-item-title">
              {profileData.type?.charAt(0).toUpperCase() +
                profileData.type!.slice(1)}{" "}
              depuis le
            </p>
            <p className="rightHeader-item-content">
              {formatDate(profileData.date_creation_compte!)}
            </p>
          </div>

          <div className="rightHeader-item">
            <p className="rightHeader-item-title">Dernière connexion le</p>
            <p className="rightHeader-item-content">
              {formatDate(profileData.date_connexion!)}
            </p>
          </div>

     
        </section>
      </header>

      {profileData.type === "admin" && (
        <ArticlesSection
          title={"Articles rédigés"}
          endpoint={"user"}
          id_user={profileData.id_utilisateur}
        />
      )}
      <ReviewsSection
        title={"Avis postés"}
        endpoint={"user"}
        id_user={profileData.id_utilisateur}
        key={loc.state && (loc.state.reviewsUpdated ? `updated` : (contentIsUpdated ? 'profile-picture-updated' : 'default'))} 
      />
      <Footer />
      <BottomBar type="profile"/>

      {openPopup && (
        <EditProfilePopup
          id_profile={profileData.id_utilisateur}
          openPopupSetter={setOpenPopup}
          popupInputsValues={{
            name:profileData.nom!,
            firstName:profileData.prenom!,
            email:profileData.mail!,
            username:profileData.identifiant!,
          }}
          title="Modifier mon profil"
        />
      )}
       {imageLoading && <Toast imageSrc={imageUploadSrc} message={"Nous chargeons ton image"} type={"loading"} title={"Chargement..."} isAnimate={false}/>}
    </div>
    
  );
};

export default Profile;
