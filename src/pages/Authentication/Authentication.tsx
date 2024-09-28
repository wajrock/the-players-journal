import React, { FunctionComponent, useEffect, useState } from "react";
import "./Authentication.scss";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Input from "../../components/Input/Input";
import { useUser } from "../../UserContext";
import Footer from "../../components/Footer/Footer";
import {
  fetchUsernamesEmails,
  fetchProfiles,
  updateUserContext,
} from "../../utils/Fetchs/FetchsUsers";
import { validateEmail } from "../../utils/validateEmail";
import { validatePassword } from "../../utils/validatePassword";
import { ContentType } from "../../utils/Types";
import HeroBanner from "../../components/HeroBanners/HeroBanner";
import BottomBar from "../../components/BottomBar/BottomBar";

const Authentication: FunctionComponent = () => {
  const [mailsList, setMailsList] = useState<string[]>([]);
  const [usernamesList, setUsernamesList] = useState<string[]>([]);

  const [defaultUsernameEmail, setDefaultUsernameEmail] = useState("");

  const [usernameEmailSignin, setUsernameEmailSignin] = useState("");
  const [passwordSignin, setPasswordSignin] = useState("");

  const [lastNameSignup, setLastNameSignup] = useState("");
  const [firstNameSignup, setFirstNameSignup] = useState("");

  const [birthdateSignup, setBirthdaySignup] = useState("");
  const [usernameSignup, setUsernameSignup] = useState("");

  const [emailSignup, setEmailSignup] = useState("");
  const [passwordSignup, setPasswordSignup] = useState("");

  const [stateEmailUsernameSigninInput, setStateEmailUsernameSigninInput] =
    useState<string[]>([]);
  const [statePasswordSigninInput, setStatePasswordSigninInput] = useState<
    string[]
  >([]);

  const [stateBirthdateInput, setStateBirthdateInput] = useState<string[]>([]);
  const [stateEmailSignupInput, setStateEmailSignupInput] = useState<string[]>(
    []
  );
  const [stateUsernameSignupInput, setStateUsernameSignupInput] = useState<
    string[]
  >([]);
  const [statePasswordSignupInput, setStatePasswordSignupInput] = useState<
    string[]
  >([]);

  const { login, setUser, signup, setProfiles } = useUser();
  const navigate = useNavigate();

  const [page, setPage] = useState("default");

  useEffect(() => {
    fetchUsernamesEmails("mails").then((data) => {
      setMailsList(data);
      
    });
    fetchUsernamesEmails("usernames").then((data) => setUsernamesList(data));
  }, []);

  const handleResetForm = () => {
    setPage("default");
    setLastNameSignup("");
    setFirstNameSignup("");
    setBirthdaySignup("");
    setUsernameSignup("");
    setEmailSignup("");
    setPasswordSignup("");
    setPasswordSignin("");
    setUsernameEmailSignin("");
  };

  const checkFieldIsValid = (currentValue: string): boolean => {
    return currentValue !== "" && currentValue !== undefined;
  };

  const handleSigninResponse = async () => {
    const response = await login(usernameEmailSignin, passwordSignin);

    if (response.status === "sucess") {
      localStorage.setItem("user", JSON.stringify(response.results[0]));
      setUser(response.results[0]);

      navigate("/")
    } else {
      if (response.error === "wrong-password") {
        setStatePasswordSigninInput(["error", "Mot de passe incorrect"]);
      } else if (response.error === "unknow user") {
        setStateEmailUsernameSigninInput(["error", "Compte introuvable"]);
      }
    }
  };

  const handleSignupResponse = async () => {
    const userData = {
      username: usernameSignup,
      password: passwordSignup,
      last_name: lastNameSignup,
      first_name: firstNameSignup,
      mail: emailSignup,
      birthdate: birthdateSignup,
    };

    const response = await signup(userData);

    if (response.status === "sucess") {
      setUser(response.results[0]);
      const fetchProfilesRequest = await fetchProfiles().then((data: ContentType[]) => setProfiles(data));
      updateUserContext(response.results[0].id_utilisateur).then((user) =>
        setUser(user)
      );
      localStorage.setItem("user", JSON.stringify(response.results[0]));

      navigate(`/@${response.results[0].identifiant}`,{state:{
        toast: {
          message: "Ton compte a été créé avec succès",
          type: "success",
          title:'Bienvenue'
        }
      }});
    } else {
      console.log(response.error);
    }
  };

  const handleSwitchView = async (type: "next" | "previous") => {
    switch (page) {
      case "default":
        if (type === "next") {
          if (defaultUsernameEmail !== ""){
            if (
              (mailsList.includes(defaultUsernameEmail) ||
              usernamesList.includes(defaultUsernameEmail)) && stateEmailUsernameSigninInput.length === 0
            ) {
              setPage("signin");
              setUsernameEmailSignin(defaultUsernameEmail);
            } else {
              setPage("signup-1");
              if (validateEmail(defaultUsernameEmail)) {
                setEmailSignup(defaultUsernameEmail);
              } else {
                setUsernameSignup(defaultUsernameEmail);
              }
            }
          } else {
            setStateEmailUsernameSigninInput(['error','Champs requis'])
          }
          
        }
        break;

      case "signin":
        type === "next" ? handleSigninResponse() : setPage("default");
        break;

      case "signup-1":
        if(type === "next"){
          (firstNameSignup !== "" && lastNameSignup !== "") && setPage("signup-2")
        } else {
          setPage('default')
          handleResetForm()
        }
         
        break;

      case "signup-2":
        if (type === "next") {
          if (
            checkFieldIsValid(birthdateSignup) &&
            checkFieldIsValid(usernameSignup)
          ) {
            setPage("signup-3");
          } else {
            if (!checkFieldIsValid(birthdateSignup)) {
              setStateBirthdateInput(["error", "Champ requis"]);
            }

            if (!checkFieldIsValid(usernameSignup)) {
              setStateUsernameSignupInput(["error", "Champ requis"]);
            }
          }
        } else {
          setPage("signup-1");
        }

        break;

      case "signup-3":
        if (type === "next") {
          if (
            emailSignup !== "" &&
            passwordSignup !== "" &&
            stateBirthdateInput.length === 0 &&
            stateUsernameSignupInput.length === 0 &&
            stateEmailSignupInput.length === 0 &&
            statePasswordSignupInput.length === 0
          ) {
            handleSignupResponse();
          }
        } else {
          setPage("signup-2");
        }

        break;
      default:
        break;
    }
  };
  return (
    <div className="authentication-wrap">
      <HeroBanner top left bottom imagePath={"https://theplayersjournal.wajrock.me/assets/main-cover"} />
      <Header type="logotype" />
      <main className="authentication-wrap-content">
        <section className="authentication-wrap-card">
          <header className="authentication-wrap-card-header">
            {page === "default" && (
              <h1 className="authentication-wrap-card-header-title">
                Accèdes à <span>ton espace</span> ou rejoins{" "}
                <span>la communauté !✍🎮</span>
              </h1>
            )}
            {page === "signin" && (
              <h1 className="authentication-wrap-card-header-title">
                Accèdes à <span>ton espace ! ✍🎮</span>
              </h1>
            )}
            {(page === "signup-1" ||
              page === "signup-2" ||
              page === "signup-3") && (
              <>
                <div className={`authentication-wrap-card-header-progress`}>
                  <div
                    className={`authentication-wrap-card-header-progress-bar ${
                      page === "signup-1"
                        ? "first"
                        : page === "signup-2"
                        ? "second"
                        : "third"
                    }`}
                  ></div>
                </div>
                <h1 className="authentication-wrap-card-header-title">
                  Rejoins<span> la communauté !✍🎮</span>
                </h1>
              </>
            )}
          </header>
          {page === "default" && (
            <div className="authentication-wrap-card-content">
              <Input
                id="username"
                label="Identifiant / E-mail"
                type="text"
                value={defaultUsernameEmail}
                setValue={setDefaultUsernameEmail}
                state={stateEmailUsernameSigninInput}
                setState={setStateEmailUsernameSigninInput}
                validator={(state: string) => {
                  
                  const isEmailValid = validateEmail(state);
                    if (state.includes("@") && !isEmailValid) {
                      setStateEmailUsernameSigninInput([
                        "error",
                        "Format incorrect",
                      ]);
                    } else {
                      setStateEmailUsernameSigninInput([]);
                    }
                 
                }}
                placeholder="marc.dupont@gmail.com"
              />
            </div>
          )}

          {page === "signin" && (
            <div className="authentication-wrap-card-content signin">
              <Input
                id="username"
                label="Identifiant / E-mail"
                type="text"
                value={usernameEmailSignin}
                state={stateEmailUsernameSigninInput}
                setState={setStateEmailUsernameSigninInput}
                validator={() => null}
                disable
                onClick={() => setPage("default")}
                placeholder="marc.dupont@gmail.com"
              />

              <Input
                id="password"
                label="Mot de passe"
                type="password"
                value={passwordSignin}
                state={statePasswordSigninInput}
                setState={setStatePasswordSigninInput}
                setValue={setPasswordSignin}
                validator={() => null}
                placeholder="**********"
              />
            </div>
          )}

          {page === "signup-1" && (
            <div className="authentication-wrap-card-content signup">
              <Input
                id="nom"
                label="Nom"
                value={lastNameSignup}
                setValue={setLastNameSignup}
                validator={(state: string) => {
                  if (usernamesList.includes(state)) {
                    setStateUsernameSignupInput([
                      "error",
                      "Identifiant déjà utilisé",
                    ]);
                  } else {
                    setStateUsernameSignupInput([]);
                  }
                }}
                placeholder="Dupont"
              />

              <Input
                id="prenom"
                label="Prénom"
                value={firstNameSignup}
                setValue={setFirstNameSignup}
                validator={() => null}
                placeholder="Marc"
              />
            </div>
          )}

          {page === "signup-2" && (
            <div className="authentication-wrap-card-content signup">
              <Input
                id="birthdate"
                label="Date de naissance"
                type="date"
                value={birthdateSignup}
                setValue={setBirthdaySignup}
                state={stateBirthdateInput}
                validator={(state: string) => {
                  const today = new Date();
                  const birthdate = new Date(state);

                  let age = today.getFullYear() - birthdate.getFullYear();
                  const mois = today.getMonth() - birthdate.getMonth();
                  const jour = today.getDate() - birthdate.getDate();

                  if (mois < 0 || (mois === 0 && jour < 0)) {
                    age--;
                  }

                  if (
                    birthdate.getFullYear() > 1920 &&
                    birthdate.getFullYear() <= today.getFullYear() &&
                    state !== "" &&
                    state.length <= 10
                  ) {
                    if (age < 18) {
                      setStateBirthdateInput(["error", "Il faut être majeur"]);
                    } else {
                      setStateBirthdateInput([]);
                    }
                  } else {
                    setStateBirthdateInput([
                      "error",
                      "Entrez une date correct",
                    ]);
                  }
                }}
                placeholder="yyyy-mm-dd"
              />

              <Input
                id="username"
                label="Identifiant"
                value={usernameSignup}
                state={stateUsernameSignupInput}
                setValue={setUsernameSignup}
                validator={(state: string) => {
                  if (usernamesList.includes(state)) {
                    setStateUsernameSignupInput([
                      "error",
                      "Identifiant déjà utilisé",
                    ]);
                  } else {
                    setStateUsernameSignupInput([]);
                  }
                }}
                placeholder="mdupont5"
              />
            </div>
          )}

          {page === "signup-3" && (
            <div className="authentication-wrap-card-content signup">
              <Input
                id="mail"
                label="E-mail"
                type="email"
                value={emailSignup}
                state={stateEmailSignupInput}
                setValue={setEmailSignup}
                validator={(state: string) => {
                  const isEmailValid = validateEmail(state);
                  if (!isEmailValid && state !== "") {
                    setStateEmailSignupInput(["error", "Format incorrect"]);
                  } else if (mailsList.includes(state)) {
                    setStateEmailSignupInput(["error", "Email déjà utilisée"]);
                  } else {
                    setStateEmailSignupInput([]);
                  }
                }}
                placeholder="marc.dupont@mail.com"
              />

              <Input
                id="password"
                label="Mot de passe"
                type="password"
                value={passwordSignup}
                state={statePasswordSignupInput}
                setValue={setPasswordSignup}
                validator={(state: string) => {
                  if (!validatePassword(state) && state !== "") {
                    setStatePasswordSignupInput([
                      "error",
                      "Mot de passe trop faible",
                    ]);
                  } else {
                    setStatePasswordSignupInput([]);
                  }
                }}
                placeholder="**********"
              />
            </div>
          )}

          <div className="authentication-wrap-card-footer">
            {page !== "default" && (
              <button
                className="authentication-wrap-card-footer-back"
                type="button"
                onClick={() => {
                  handleSwitchView("previous");
                }}
              >
                Retour
              </button>
            )}
            <button
              className="authentication-wrap-card-footer-submit"
              onClick={() => handleSwitchView("next")}
              type="button"
            >
              {page === "signup-3"
                ? "Rejoindre"
                : page === "signin"
                ? "Accèder"
                : "Suivant"}
            </button>
          </div>
        </section>
      </main>

      <Footer />
      <BottomBar type={'authentication'}/>
    </div>
  );
};

export default Authentication;
