import React, { FunctionComponent, useEffect, useState } from "react";
import "./Section.scss";
import "./ContributorsSection.scss"
import { ContentType } from "../../utils/Types";
import ContributorCard from "../Cards/Contributors/ContributorCard";
import { fetchContributors } from "../../utils/Fetchs/FetchsContributors";
import { useAPI } from "../../ApiStatusContext";

const ContributorsSection: FunctionComponent<{title:string}> = ({title}) => {

  const [dataContributors, setDataContributors] = useState<ContentType[] | null>(() => {
      const storedData = localStorage.getItem(`contributors`);
      return storedData && storedData !== 'undefined' ? JSON.parse(storedData) : null;
  });

  const [alreadyLoad,setAlreadyLoad] = useState(false);

  const {setIsAPIAvailable} = useAPI();

  useEffect(()=>{
    if (!dataContributors || !alreadyLoad){
      fetchContributors().then(data => {
        
        if (data.status === 'error'){
          setIsAPIAvailable(false);
        } else {
          setDataContributors(data.results);
          localStorage.setItem(`contributors`,JSON.stringify(data.results));
        }
      })
      setAlreadyLoad(true);
    }
    
  },[dataContributors,alreadyLoad])

  return (
    <div className="section-wrap contributors">
      <div className="section-wrap-header">
        <h1 className="section-wrap-header-title">{title}</h1>
      </div>

      <div className={"section-wrap-content"} >
        {dataContributors && dataContributors.sort((a,b)=>b.nb_articles - a.nb_articles).map((contributor) => (
            <ContributorCard dataContributor={contributor} key={contributor.id_utilisateur}/>
        ))}
      </div>
    </div>
  );
};

export default ContributorsSection;
