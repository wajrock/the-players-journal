import React, {FunctionComponent, useEffect, useRef, useState } from "react";
import "./EditProfilePopup.scss";
import Input from "../../Input/Input";
import { ContentType } from "../../../utils/Types";
import { validateEmail } from "../../../utils/validateEmail";
import { validatePassword } from "../../../utils/validatePassword";

import { fetchUsernamesEmails,updateUser,fetchProfiles,updateUserContext } from "../../../utils/Fetchs/FetchsUsers";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../UserContext";

interface PopupInputsValues {
  name:string,
  firstName:string,
  email:string,
  username:string,
}

interface PopupType {
  title: string;
  openPopupSetter: (open: boolean) => void;
  id_profile: string;
  popupInputsValues:PopupInputsValues
}

const EditProfilePopup: FunctionComponent<PopupType> = ({
  title,
  openPopupSetter,
  id_profile,
  popupInputsValues
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  
  
  const [nom, setNom] = useState(popupInputsValues.name);
  const [prenom, setPrenom] = useState(popupInputsValues.firstName);
  const [emailInput, setEmailInput] = useState(popupInputsValues.email);
  const [usernameInput, setUsernameInput] = useState(popupInputsValues.username);
  const [password, setPassword] = useState("");

  const [mailsList, setMailsList] = useState<string[]>([]);
  const [usernamesList, setUsernamesList] = useState<string[]>([]);

  const [stateLastNameInput, setStateLastNameInput] = useState<string[]>([]);
  const [stateFirstNameInput, setStateFirstNameInput] = useState<string[]>([]);
  const [stateEmailInput, setStateEmailInput] = useState<string[]>([]);
  const [stateUsernameInput, setStateUsernameInput] = useState<string[]>([]);
  const [statePasswordInput, setStatePasswordInput] = useState<string[]>([]);
  const navigate = useNavigate();

  const {setUser,setProfiles} = useUser();

 

  useEffect(() => {
    fetchUsernamesEmails('mails').then(setMailsList);
    fetchUsernamesEmails('usernames').then(setUsernamesList);
  }, [id_profile]);

  const handleClickOutsidePopup = (event: React.MouseEvent<HTMLDivElement>) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      openPopupSetter(false);
    }
  };

  const handleSubmit = () => {
    
    
    if (
      stateLastNameInput.length === 0 &&
      stateFirstNameInput.length === 0 &&
      stateEmailInput.length === 0 &&
      statePasswordInput.length === 0 &&
      stateUsernameInput.length === 0
    ) {
        
      const updatedProfile = {
        id_profile:id_profile,
        username: usernameInput,
        last_name: nom,
        first_name: prenom,
        mail: emailInput,
        ...(password && { password }), // Only include password if provided
      };
      
      updateUser(updatedProfile).then((data) => {
        
        if (data.status === 'sucess'){
            if (password === ""){
                if (usernameInput !== popupInputsValues.username){
                    navigate(`/@${usernameInput}`,{state:{ toast: {
                      message: "Toutes les informations sont à jour",
                      type: "success",
                      title:'Profil modifié'
                    }}})
                }
                openPopupSetter(false);
                fetchProfiles().then(data => setProfiles(data));
                updateUserContext(id_profile).then(user => 
                  setUser(user)
                )
            } else {
                navigate('/authentication',{state:{ toast: {
                  message: "Reconnectes toi pour accèder à ton compte",
                  type: "success",
                  title:'Profil modifié'
                }}})
            }
            
        }
      })
}
  };

  

  return (
    <div className="overlay-wrap" onClick={handleClickOutsidePopup}>
      <main className="popup-edit-wrap" ref={popupRef}>
        <header className="popup-edit-wrap-header">
        <h1 className="popup-edit-wrap-header-title">{title}</h1>

          <div className="popup-edit-wrap-header-actions">
            <div
              className="popup-edit-wrap-header-actions-close"
              onClick={() => {
                openPopupSetter(false);
              }}
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
          </div>
          
          
          
        </header>
        <section className="popup-edit-wrap-content">
          <Input
            id={"nom"}
            label={"Nom"}
            value={nom}
            setValue={setNom}
            defaultValue={popupInputsValues.name}
            state={stateLastNameInput}
            validator={(state:string)=>{
              console.log(nom);
              if (state === ""){
                setStateLastNameInput(["error","Champ requis"])
              } else {
                setStateLastNameInput([]);
              }
            }}
          />
          <Input
            id={"prenom"}
            label={"Prénom"}
            value={prenom}
            setValue={setPrenom}
            defaultValue={popupInputsValues.firstName}
            state={stateFirstNameInput}
            
            validator={(state:string)=>{
              
              
              if (state === ""){
                setStateFirstNameInput(["error","Champ requis"])
              } else {
                setStateFirstNameInput([])
              }
            }}
          />
          <Input
            id="email"
            label="Adresse e-mail"
            type="email"
            value={emailInput}
            setValue={setEmailInput}
            state={stateEmailInput}
            defaultValue={popupInputsValues.email}
            validator={(state:string) => {
              const isEmailValid = validateEmail(state);
              if (!isEmailValid && state !== '') {
                setStateEmailInput(["error", "Format incorrect"]);
              } else if (
                state !== popupInputsValues.email &&
                mailsList.includes(state)
              ) {
                setStateEmailInput(["error", "Email déjà utilisée"]);
              } else {
                setStateEmailInput([]);
              }
            }}
          />
          <Input
            id="username"
            label="Identifiant"
            value={usernameInput}
            setValue={setUsernameInput}
            state={stateUsernameInput}
            defaultValue={popupInputsValues.username}
            validator={(state:string) => {
              if (
                state !== popupInputsValues.username &&
                usernamesList.includes(state)
              ) {
                setStateUsernameInput(["error", "Identifiant déjà utilisé"]);
              } else {
                setStateUsernameInput([]);
              }
            }}
          />
          <Input
            id="password"
            label="Mot de passe"
            type="password"
            value={password}
            setValue={setPassword}
            state={statePasswordInput}
            validator={(state:string) => {
              if (!validatePassword(state) && state !== '') {
                setStatePasswordInput(["error", "Mot de passe trop faible"]);
              } else {
                setStatePasswordInput([]);
              }
            }}
            placeholder="**********"
          />
        </section>
        { (nom !== popupInputsValues.name ||
              prenom !== popupInputsValues.firstName ||
              emailInput !== popupInputsValues.email ||
              usernameInput !== popupInputsValues.username ||
              password !== ""

            ) ? (
          <div className="popup-edit-wrap-validate" onClick={handleSubmit}>
            <p>Modifier</p>
          </div>) : (<div className="popup-edit-wrap-validate disabled">
            <p>Modifer</p>
          </div>)}
      </main>
    </div>
  );
};

export default EditProfilePopup;
