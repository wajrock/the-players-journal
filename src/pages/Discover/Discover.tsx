import React, { ChangeEvent, FunctionComponent, useEffect, useState } from 'react'
import './Discover.scss'
import { ContentType } from "../../utils/Types";
import ArticleCard from '../../components/Cards/Articles/ArticleCard';
import Dropdown from '../../components/Dropdown/Dropdown';
import Footer from '../../components/Footer/Footer';
import { useLocation } from 'react-router-dom';
import GameCard from '../../components/Cards/Games/GameCard';
import Header from '../../components/Header/Header';
import { useAPI } from '../../ApiStatusContext';
import BottomBar from '../../components/BottomBar/BottomBar';
import SkeletonCard from '../../components/Cards/Skeletons/SkeletonCard';
import { fetchGridContent } from '../../utils/Fetchs/FetchsDiscover';
;

const Discover:FunctionComponent<{type:string}> = ({type}) => {
  const loc = useLocation();
  const filter = loc.state?.filter;
  const loadTop = loc.state?.loadTop;

  const [dataContent, setDataContent] = useState<ContentType[] | null>(() => {
    const storedData = localStorage.getItem(type);
    return storedData && storedData !== 'undefined' ? JSON.parse(storedData) : null;
  });
   
    
  const [searchValue,setSearchValue] = useState<string>("");
  const [categoryValue,setCategoryValue] = useState<string>("Catégorie");
  const [sortValue,setSortValue] = useState<string>("Les plus récents");
  const [filteredArticles,setFilteredArticles] = useState<ContentType[]|null>(dataContent || null);
  const [baseFilteredArticles, setBaseFilteredArticles] = useState<ContentType[]>(dataContent! || null);

  const [alreadyLoad,setAlreadyLoad] = useState<boolean>(false);

  const {setIsAPIAvailable} = useAPI();
  
  useEffect(()=>{
    loadTop && window.scroll(0,0);
  },[loadTop])
  useEffect(() => {
    
    if (!dataContent || !alreadyLoad){
      fetchGridContent(type).then(data => {
        if (data.code === 500){
          setIsAPIAvailable(false)
        } else {
          setDataContent(data.results);
          localStorage.setItem(type,JSON.stringify(data.results))
        }
      })
     setAlreadyLoad(true);
    }
  }, [dataContent,type,alreadyLoad]);

  useEffect(() => {
    switch (filter) {
      case 'aventure':
        setCategoryValue('Aventure');
        break;
      case 'horror':
        setCategoryValue('Horreur');
        break;
      case 'most-popular':
        setSortValue('Les mieux notés');
        break;
      case 'latest-articles':
        setSortValue('Les plus récents');
        break;
      default:
        break;
    }
  }, [filter]);


  useEffect(() => {
    let newDataContent = [...(dataContent || [])];
  
      if (categoryValue && categoryValue !== 'Catégorie'){
        newDataContent = newDataContent.filter((article) =>
          article.categorie.toLowerCase() === categoryValue.toLowerCase()
        );
      }
      
  
    switch (sortValue) {
      case 'Les mieux notés':
        newDataContent.sort((a, b) => parseFloat(b.note) - parseFloat(a.note));
        break;
      case 'Les plus récents':
        type === "articles" && newDataContent.sort((a, b) => 
          new Date(b.date_creation).getTime() - new Date(a.date_creation).getTime()
        );

        type === "games" && newDataContent.sort((a, b) => 
          new Date(b.date_sortie!).getTime() - new Date(a.date_sortie!).getTime()
        );
        break;
      case 'Les plus anciens':
        type === "articles" && newDataContent.sort((a, b) => 
          new Date(a.date_creation).getTime() - new Date(b.date_creation).getTime()
        );

        type === "games" && newDataContent.sort((a, b) => 
          new Date(a.date_sortie!).getTime() - new Date(b.date_sortie!).getTime()
        );
        break;
      default:
        break;
    }

    setFilteredArticles(newDataContent);
    setBaseFilteredArticles(newDataContent);
  }, [categoryValue, type,sortValue, dataContent]);
  


  const handleChangeSearch = (event:ChangeEvent<HTMLInputElement>)=>{
    const currentValue = event.target.value;
    setSearchValue(currentValue);
    
    let newDataContent = [...(baseFilteredArticles || [])];
    
      if (currentValue !== "") {
        if (type === 'articles') {
          newDataContent = newDataContent.filter((article) =>
            'titre' in article && article.titre.toLowerCase().includes(currentValue.toLowerCase())
          );
        } else if (type === 'games') {
          newDataContent = newDataContent.filter((game) =>
            game.nom.toLowerCase().includes(currentValue.toLowerCase())
          );
        }
      }
      setFilteredArticles(newDataContent);
    
}
  
  return (
    <div className={`discover-wrap ${type}`}>
      <Header/>
      <div className="discover-wrap-header">
        {type === 'articles' && (<h1 className="discover-wrap-header-title">Découvrez tout nos <span>captivants articles ✍</span></h1>)}
        {type === 'games' && (<h1 className="discover-wrap-header-title">Découvrez tout nos <span>jeux analysés 🎮</span></h1>)}
        <div className="discover-wrap-header-actionbar actionbar">

          <label htmlFor='search' className="actionbar-searchbar">
            <div className="actionbar-searchbar-button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="none">
                <path d="M15.6675 15.6673L12.4823 12.4821M14.1858 8.25991C14.1858 11.5327 11.5327 14.1858 8.25991 14.1858C4.98711 14.1858 2.33398 11.5327 2.33398 8.25991C2.33398 4.98711 4.98711 2.33398 8.25991 2.33398C11.5327 2.33398 14.1858 4.98711 14.1858 8.25991Z" stroke="currentColor" stroke-width="1.48148" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <input type="text" title="search" value={searchValue} name='search' onChange={handleChangeSearch} placeholder='Rechercher un article...'/>
            
          </label>

          <Dropdown defaultValue="Catégorie" value={categoryValue} valueSetter={setCategoryValue}  options={['Horreur','MMORPG','Sport','Aventure','FPS','Party','MOBA']}/>
          <Dropdown defaultValue="Les plus récents" value={sortValue} valueSetter={setSortValue}  options={['Les plus récents', 'Les mieux notés','Les plus anciens']}/>

        </div>
        
        
      </div>
        <div className={`discover-wrap-grid ${type}`}>
            {type === "articles" && (
              filteredArticles ? filteredArticles.map((article) => (
                <ArticleCard articleCardData={article} key={article.id_article}/>
              )) : Array(6).fill('').map((index) => (
                <SkeletonCard type={'article-card'} key={index}/>
              ))
            )}

            {type === "games" && (
              filteredArticles ? filteredArticles.map((game) => (
                <GameCard gameCardData={game} key={game.id_article}/>
              )) : Array(8).fill('').map((index) => (
                <SkeletonCard type={'game-card'} key={index}/>
              ))
            )}

        </div>
        <Footer/>
        <BottomBar type={type === 'articles' ? 'articles': 'games'}/>
    </div>
  )
}

export default Discover