import React, {
  createContext,
  useState,
  useContext,
  FunctionComponent,
  ReactNode,
  useEffect,
} from "react";
import { ContentType } from "./utils/Types";

interface User {
  id_utilisateur: string;
  profile_picture: string;
  identifiant: string;
  type: string;
}

interface UserContextType {
  user: User | null;
  login: (
    username: string,
    password: string
  ) => Promise<{ status: string; code: number; error: string; results: any[] }>;
  logout: () => void;
  setUser: (user: User) => void;
  signup: (
    userData: any
  ) => Promise<{ status: string; code: number; error: string; results: any[] }>;
  profiles: ContentType[];
  setProfiles: (profiles: ContentType[]) => void;
  articleIsEdited:boolean;
  setArticleIsEdited: (bool:boolean)=> void;
}
const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedData = localStorage.getItem("user");
    return storedData && storedData !== 'undefined' ? JSON.parse(storedData) : null;
  });
  const [profiles, setProfiles] = useState<ContentType[]>(() => {
    const storedData = localStorage.getItem("profiles");
    return storedData && storedData !== 'undefined' ? JSON.parse(storedData) : [];
  });

  const [articleIsEdited, setArticleIsEdited] = useState<boolean>(false);

  const login = async (username: string, password: string) => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    const response = await fetch("https://theplayersjournal.wajrock.me/api/users.php", {
      method: "POST",
      body: formData,
    });

    const data: {
      status: string;
      code: number;
      error: string;
      results: any[];
    } = await response.json();

    return data;
  };

  useEffect(()=>{
    if (user === null){
      localStorage.removeItem("user");
    }
  },[user])

  const signup = async (userData: any) => {
    const response = await fetch("https://theplayersjournal.wajrock.me/api/users.php?type=insert", {
      method: "PUT",
      body: JSON.stringify(userData),
    });

    const data: {
      status: string;
      code: number;
      error: string;
      results: any[];
    } = await response.json();

    return data;
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{ user, login, logout, setUser, signup, profiles, setProfiles, articleIsEdited, setArticleIsEdited }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Créez un hook personnalisé pour utiliser le contexte
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
