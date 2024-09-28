import React, { createContext, FunctionComponent, ReactNode, useContext, useState } from "react";

interface APIStatusType {
    isAPIAvailable:boolean|null;
    setIsAPIAvailable:React.Dispatch<React.SetStateAction<boolean|null>>,
    checkAPI:()=>void
}
const APIStatusContext = createContext<APIStatusType|null>(null);

export const APIStatusProvider:FunctionComponent<{children:ReactNode}> = ({children}) => {

    const [isAPIAvailable,setIsAPIAvailable] = useState<boolean|null>(true);

    const checkAPI = async():Promise<boolean> => {
        
        try {
            const response = await fetch('https://theplayersjournal.wajrock.me/api/articles?categorie=last-article');
            if (!response.ok){
                setIsAPIAvailable(false)
                        
                return (false);
            } 
            setIsAPIAvailable(true)
            return(true);
        } catch (error){
            setIsAPIAvailable(false)
            return(false);
        }
    }

    return (
        <APIStatusContext.Provider value = {{isAPIAvailable,setIsAPIAvailable,checkAPI}}>
            {children}
        </APIStatusContext.Provider>
    )

}

export const useAPI = () => {
    const context = useContext(APIStatusContext);
    if (!context) throw new Error("useUser must be used within a UserProvider");
    return context;
  };
  