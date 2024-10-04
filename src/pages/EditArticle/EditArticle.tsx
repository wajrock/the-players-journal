import React, {
  ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./EditArticle.scss";
import Footer from "../../components/Footer/Footer";
import {
  fetchArticleContent,
  fetchArticleGameDetails,
} from "../../utils/Fetchs/FetchsArticle";
import Dropdown from "../../components/Dropdown/Dropdown";
import { fetchCategories } from "../../utils/Fetchs/FetchsGames";
import TextareaAutosize from "react-textarea-autosize";
import Input from "../../components/Input/Input";
import EditorTab from "../../components/EditorTab/EditorTab";
import HeroBanner from "../../components/HeroBanners/HeroBanner";
import { useOnScreen } from "../../utils/OnScreen";
import StarsNotation from "../../components/StarsNotation/StarsNotation";
import { uploadCoverProps, DataToSend } from "../../utils/Types";
import {
  adjustTextAreaHeight,
  areDatasUpdated,
  handleTogglePlatforms,
  initializeValues,
  submitEdits,
  updateDataToSend,
} from "../../utils/Functions/FunctionsEditArticle";
import BottomBar from "../../components/BottomBar/BottomBar";
import useArticles from "../../Hooks/UseArticles";

const EditArticle = () => {
  const { article_id } = useParams<string>();
  const navigate = useNavigate();
  const location = useLocation();
  const {updateAllArticles} = useArticles()
  

  const contentArticleTextareaRef = useRef<HTMLTextAreaElement>(null);
  const synopsisGameTextareaRef = useRef<HTMLTextAreaElement>(null);

  const imagesGridRef = useRef<HTMLDivElement>(null);
  const imagesGridIsVisible = useOnScreen(contentArticleTextareaRef);

  const [articleData, setArticleData] = useState(() => {
    const storedData = localStorage.getItem(`data-article-${article_id}`);
    if (storedData && storedData !== 'undefined'){
      return JSON.parse(storedData)
    }
    return location.state.dataArticle || null
  });
  
  
  const [gameData, setGameData] = useState(() => {
    const storedData = localStorage.getItem(`article-games-details-${article_id}`);
    return storedData && storedData !== 'undefined' ? JSON.parse(storedData) : null;
  });

  const [isFirstRender, setIsFirstRender] = useState(true);

  const [categories, setCategories] = useState<string[]>([]);

  const articleImages = useMemo(() => {
    return (
      articleData ? articleData.images.map((image: string) => ({
        path: image !== "" ? image : "",
        file: "",
        "old-image": "",
      })) || [] : []
    );
  }, [articleData]);

  const [cursorPosition, setCursorPosition] = useState<number[]>([0, 0]);
 
  const emptyValues: DataToSend = {
    "article-data": {
      id_article: "",
      title: "",
      content: "",
    },
    "images-data": {
      "article-cover": {
        path: "",
        file: "",
        "old-image": "",
      },
      "game-cover": {
        path: "",
        file: "",
        "old-image": "",
      },
      "article-images": [],
    },
    "game-data": {
      id_article: "",
      name:"",
      category: "",
      grade: Number(0).toString(),
      date: "",
      price: "",
      synopsis: "",
      platforms: [],
    },
}

  const originalValues: DataToSend | undefined = useMemo(() => {
    if (articleData && gameData && article_id) {
      return {
        "article-data": {
          id_article: article_id,
          title: articleData.titre,
          content: articleData.contenu,
        },
        "images-data": {
          "article-cover": {
            path: `https://theplayersjournal.wajrock.me/assets/articles/${articleData.cover_article}`,
            file: "",
            "old-image": "",
          },
          "game-cover": {
            path: `https://theplayersjournal.wajrock.me/assets/games_cover/${gameData.cover}`,
            file: "",
            "old-image": "",
          },
          "article-images": articleImages,
        },
        "game-data": {
          id_article: article_id,
          name: gameData.nom,
          category: gameData.categorie,
          grade: gameData.note.toString(),
          date: gameData.date_sortie,
          price: gameData.prix,
          synopsis: gameData.synopsis,
          platforms: gameData.plateformes,
        },
      };
    } else {
      return undefined;
    }
  }, [articleData, gameData, articleImages, article_id]);

  const [defaultValues, setDefaultValues] = useState<DataToSend>(
    originalValues!
  );

  const [loaderCta,setLoaderCta] = useState<boolean>(false);

  const [dataToSend, setDataToSend] = useState<DataToSend>(originalValues!);

  const articleIsEdited =
    defaultValues && dataToSend!
      ? areDatasUpdated(defaultValues, dataToSend!, "article")
      : false;
  const articleCoverIsEdited =
    defaultValues && dataToSend!
      ? areDatasUpdated(defaultValues, dataToSend!, "article-cover")
      : false;
  const articleImagesAreEdited =
    defaultValues && dataToSend!
      ? areDatasUpdated(defaultValues, dataToSend!, "article-images")
      : false;
  const gameIsEdited =
    defaultValues && dataToSend!
      ? areDatasUpdated(defaultValues, dataToSend!, "game")
      : false;
  const gameCoverIsEdited =
    defaultValues && dataToSend!
      ? areDatasUpdated(defaultValues, dataToSend!, "game-cover")
      : false;

  

  const handleUpdateCategory = (newValue: string) => {
    updateDataToSend(
      setDataToSend,
      "game-data",
      "category",
      undefined,
      newValue
    );
  };

  const handleUpdateReleaseDate = (newValue: string) => {
    updateDataToSend(
      setDataToSend,
      "game-data",
      "date",
      undefined,
      newValue
    );
  };

  const handleImagesUpload = (
    e: ChangeEvent<HTMLInputElement>,
    type: "jaquette" | "cover" | "",
    indexImage?: number
  ) => {
    
    
    const file = e.target.files?.[0];
    if (file && gameData) {

      const newFilename = 
      `${dataToSend["game-data"].name
      .toLowerCase()
      .replaceAll(" ", "-")}${indexImage !== undefined ? '' : `-${type}`}-${(Date.now() * Math.random())
      .toString()
      .slice(0, 5)}`

      const newFile = new File([file], newFilename, { type: file.type });

      const reader = new FileReader();
      reader.onload = (event) => {
        if (indexImage !== undefined){
          
          const currentUploadedImages = dataToSend["images-data"]["article-images"];
          const newUploadedImages = [...(currentUploadedImages || [])];

          newUploadedImages[indexImage] = {
            file: newFile,
            path: event.target?.result as string,
            "old-image":currentUploadedImages[indexImage].path !== '' ? currentUploadedImages[indexImage].path : ''
          };

          updateDataToSend(setDataToSend,'images-data','article-images',undefined,newUploadedImages);
        } else {
          const newValue = {
            path: event.target?.result as string,
            file: newFile,
            "old-image":
              type === "jaquette" ? gameData.cover : articleData!.cover_article,
          };
  
          updateDataToSend(
            setDataToSend!,
            "images-data",
            type === "jaquette" ? "game-cover" : "article-cover",
            undefined,
            newValue
          );
        }
        
      };
      reader.readAsDataURL(newFile);
    }
  };

  const handleSubmit = async() => {
    setLoaderCta(true);
    if (await submitEdits(article_id!, defaultValues, dataToSend, navigate)){
      updateAllArticles(articleData.id_auteur)
      navigate(
        `/article/${article_id}/${dataToSend["article-data"].title}`,
        { replace : true,state:{
          toast: {
            message: "Toutes les informations sont à jour",
            type: "success",
            title:'Article édité'
          }
        }}
      );
    } else {
      setLoaderCta(false);
      navigate(
        `/article/${article_id}/${dataToSend["article-data"].title}`,
        { replace : true, state:{
          toast: {
            message: "Une erreur est survenue lors de l'édition de l'article",
            type: "error",
            title:'Erreur d\'édition'
          }
        }}
      );
    }
  };

  useEffect(() => {
    
    if (dataToSend &&
      dataToSend["article-data"].content &&
      dataToSend["game-data"].synopsis &&
      contentArticleTextareaRef.current &&
      synopsisGameTextareaRef.current
    ) {
      adjustTextAreaHeight(contentArticleTextareaRef);
      adjustTextAreaHeight(synopsisGameTextareaRef);
    }

    if (isFirstRender) {
      location.state?.loadTop && window.scrollTo(0, 0);
      location.state?.scrollVal && window.scrollTo(0, location.state.scrollVal);
      setIsFirstRender(false);
    }

    !articleData && fetchArticleContent(article_id!).then((data) => {
        const fetchedArticle = data.results[0];
        setArticleData(fetchedArticle);
        localStorage.setItem(
          `data-article-${article_id}`,
          JSON.stringify(fetchedArticle)
        );
      });

    !gameData && fetchArticleGameDetails(article_id!).then((data) => {
        const fetchedGame = data.results[0];
        setGameData(fetchedGame);
        localStorage.setItem(
          `article-games-details-${article_id}`,
          JSON.stringify(fetchedGame)
        );
      });

      articleData && fetchCategories().then((data) => setCategories(data.results));
      
      (dataToSend === emptyValues && articleData && gameData) && initializeValues(
        article_id!,
        articleImages,
        articleData,
        gameData,
        setDefaultValues,
        setDataToSend!
      );
  }, [
    article_id,
    originalValues,
    articleData,
    articleImages,
    dataToSend,
    gameData,
    isFirstRender,
    location.state,
  ]);

  useEffect(() => {
    if (
      cursorPosition[0] !== 0 &&
      cursorPosition[1] !== 0 &&
      contentArticleTextareaRef.current
    ) {
      contentArticleTextareaRef.current.focus();
      contentArticleTextareaRef.current.setSelectionRange(
        cursorPosition[0],
        cursorPosition[1]
      );
    }
  }, [cursorPosition]);

  useEffect(() => {
    if (dataToSend && dataToSend["article-data"].content) {
      const imagesCount = (
        dataToSend["article-data"].content.match(/\{image:here(\d+)\}/g) || []
      ).length;
      const currentImages = dataToSend["images-data"]["article-images"];
      if (imagesCount >= currentImages.length) {
      
      
        setDataToSend((prevData)=> {
          const updatedData = {
            ...prevData,
            'images-data': {
              ...prevData['images-data'],
              'article-images': currentImages.slice(0,imagesCount),
            }
          };
  
          if (JSON.stringify(updatedData) !== JSON.stringify(prevData)){
            return updatedData;
          }
  
          return prevData;
        })
      }

      
      const newImages = (): uploadCoverProps[] => {
        if (currentImages.length !== imagesCount) {
          
          if (imagesCount < currentImages.length) {
            
            
            return currentImages.slice(0, imagesCount);
          } else {
            const newImages = new Array(
              imagesCount - currentImages.length
            ).fill({'path':'',file:'','old-image':''});
            return [...currentImages, ...newImages];
          }
        }


        return currentImages;
      };

      setDataToSend((prevData)=> {
        const updatedData = {
          ...prevData,
          'images-data': {
            ...prevData['images-data'],
            'article-images': newImages(),
          }
        };

        if (JSON.stringify(updatedData) !== JSON.stringify(prevData)){
          return updatedData;
        }

        return prevData;
      })
    }
  }, [defaultValues,dataToSend]);

  useEffect(()=>{
    if (dataToSend && dataToSend["article-data"].content){
      adjustTextAreaHeight(contentArticleTextareaRef);

    }
  },[dataToSend])

  return (
    <>{dataToSend && (
    
    <div className="edition-wrap">
      <HeroBanner
        top
        bottom
        left
        imagePath={dataToSend!["images-data"]["article-cover"].path}
        isResponsive={false}
      />
      <div className="edition-actions">
        <div
          className="edition-actions-item cancel-edition-article"
          onClick={() => {
            navigate(`/article/${article_id}/${articleData!.titre}`, {
              state: { loadTop: true },
              replace: true
            });
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="19"
            viewBox="0 0 19 19"
            fill="none"
          >
            <path
              d="M4 4L15 15"
              stroke="currentColor"
              stroke-width="2.20014"
              stroke-linecap="round"
            />
            <path
              d="M15 4L4 15"
              stroke="currentColor"
              stroke-width="2.20014"
              stroke-linecap="round"
            />
          </svg>
          <p>Fermer</p>
        </div>

        <div
          className="edition-actions-item validate-edition-article"
          onClick={() =>
            articleIsEdited ||
            articleCoverIsEdited ||
            gameCoverIsEdited ||
            articleImagesAreEdited ||
            gameIsEdited
              ? handleSubmit()
              : navigate(`/article/${article_id}/${articleData!.titre}`)
          }
        >
          {!loaderCta ? (<>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 18 19"
              fill="none"
            >
              <path
                d="M15 5L6.75 13.25L3 9.5"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <p>Valider</p>
          </>): (<div className="loader-cta"></div>)}
          
        </div>
      </div>
      <section className="article-content">
        <div className="article-content-header">
          <div className="article-content-header-infos infos">
            <label htmlFor="cover-article" className="infos-edit-cover">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 26 27"
                fill="none"
              >
                <path
                  d="M20.9213 6.02899V5.97001H20.8623H5.92157H5.86259V6.02899V20.9422V21.0846L5.96327 20.9839L16.3687 10.5785C16.7263 10.221 17.2113 10.0202 17.7169 10.0202C18.2225 10.0202 18.7075 10.221 19.0651 10.5785L20.8206 12.334L20.9213 12.4347V12.2923V6.02899ZM9.18846 20.928L9.08778 21.0287H9.23016H20.8623H20.9213V20.9697V15.6284V15.604L20.904 15.5867L17.7586 12.4413L17.7169 12.3996L17.6752 12.4413L9.18846 20.928ZM5.52839 3.7289H21.2555C21.7612 3.7289 22.2463 3.9298 22.6039 4.28742C22.9615 4.64504 23.1624 5.13007 23.1624 5.63581V21.3629C23.1624 21.8687 22.9615 22.3537 22.6039 22.7113C22.2463 23.0689 21.7612 23.2698 21.2555 23.2698H5.52839C5.02264 23.2698 4.53761 23.0689 4.18 22.7113C3.82238 22.3537 3.62148 21.8687 3.62148 21.3629V5.63581C3.62148 5.13007 3.82238 4.64504 4.18 4.28742C4.53761 3.9298 5.02264 3.7289 5.52839 3.7289ZM8.33961 10.3539C8.33961 9.97679 8.45145 9.60811 8.66098 9.29452C8.87052 8.98093 9.16834 8.73652 9.51678 8.59219C9.86522 8.44786 10.2486 8.4101 10.6185 8.48367C10.9884 8.55725 11.3282 8.73887 11.5949 9.00556C11.8616 9.27224 12.0432 9.61202 12.1168 9.98193C12.1904 10.3518 12.1526 10.7352 12.0083 11.0837C11.864 11.4321 11.6195 11.73 11.3059 11.9395C10.9924 12.149 10.6237 12.2609 10.2465 12.2609C9.74078 12.2609 9.25575 12.06 8.89813 11.7023C8.54052 11.3447 8.33961 10.8597 8.33961 10.3539Z"
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-width="0.117953"
                />
              </svg>
              <p>Modifier la couverture</p>
              <input
                type="file"
                name="cover-article"
                id="cover-article"
                onChange={(e) =>
                  handleImagesUpload(e, "cover")
                }
              />
            </label>
            <TextareaAutosize
              className="infos-title-area"
              onChange={(event) => {
                updateDataToSend(
                  setDataToSend!,
                  "article-data",
                  "title",
                  event
                );
              }}
              value={dataToSend!["article-data"].title}
            />
            {dataToSend["article-data"].title.length > 60 && (
              <p className="infos-title-error">Le titre est trop long</p>
            )}
            <div className="infos-footer">
              <Dropdown
                options={categories}
                value={dataToSend!["game-data"].category}
                defaultValue={"Catégorie"}
                valueSetter={handleUpdateCategory}
              />
            </div>
          </div>
        </div>

        <div className="game-details-wrap">
          <label htmlFor="game-cover" className="game-details-wrap-cover">
            <img src={dataToSend["images-data"]["game-cover"].path} alt="" />
            <input
              type="file"
              name="game-cover"
              id="game-cover"
              onChange={(e) =>
                handleImagesUpload(e, "jaquette")
              }
              title="game-cover"
            />
          </label>

          <div className="game-details-wrap-texts texts">
            <TextareaAutosize
              className="texts-title-area"
              value={dataToSend!["game-data"].name}
              onChange={(event) => {
                updateDataToSend(setDataToSend!, "game-data", "name", event);
              }}
            />
            <div className="texts-dateprice">
              <Input
                id={"date-sortie-jeu"}
                type={"date"}
                label={""}
                value={dataToSend["game-data"].date}
                setValue={handleUpdateReleaseDate}
                validator={() => null}
              />

              <TextareaAutosize
                className="texts-dateprice-price-area"
                value={dataToSend!["game-data"].price}
                onChange={(event) => {
                  updateDataToSend(setDataToSend!, "game-data", "price", event);
                }}
              />
            </div>

            <TextareaAutosize
              className="texts-synopsis-area"
              ref={synopsisGameTextareaRef}
              value={dataToSend!["game-data"].synopsis}
              onChange={(event) => {
                updateDataToSend(
                  setDataToSend!,
                  "game-data",
                  "synopsis",
                  event
                );
                synopsisGameTextareaRef.current!.style.height = `${
                  synopsisGameTextareaRef.current!.scrollHeight
                }px`;
              }}
            />

            <div className="texts-footer">
              <div className="texts-footer-platforms">
                <div
                  className={`texts-footer-platforms-item xbox ${
                    dataToSend!["game-data"].platforms.includes("XBOX X")
                      ? "active"
                      : ""
                  }`}
                  onClick={() => handleTogglePlatforms(dataToSend,setDataToSend,"XBOX X")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M5.42 19.528A9.96 9.96 0 0 0 12 22a9.97 9.97 0 0 0 6.585-2.472c1.564-1.594-3.597-7.258-6.585-9.515c-2.985 2.257-8.15 7.921-6.582 9.515m9.3-12.005c2.083 2.467 6.236 8.594 5.063 10.76A9.95 9.95 0 0 0 22 12.002a9.96 9.96 0 0 0-2.975-7.113s-.023-.018-.068-.035a.7.7 0 0 0-.234-.038c-.494 0-1.655.362-4.005 2.706M5.045 4.855c-.048.017-.068.034-.072.035A9.96 9.96 0 0 0 2 12.003c0 2.379.832 4.561 2.217 6.278C3.051 16.11 7.201 9.988 9.285 7.523C6.935 5.178 5.772 4.818 5.28 4.818a.6.6 0 0 0-.234.039zM12 4.959S9.546 3.523 7.63 3.455c-.753-.027-1.213.246-1.268.282C8.15 2.539 10.05 2 11.988 2H12c1.945 0 3.838.538 5.638 1.737c-.056-.038-.512-.31-1.266-.282c-1.917.068-4.372 1.5-4.372 1.5z"
                    />
                  </svg>
                </div>

                <div
                  className={`texts-footer-platforms-item ps5 ${
                    dataToSend!["game-data"].platforms.includes("PS5")
                      ? "active"
                      : ""
                  }`}
                  onClick={() => handleTogglePlatforms(dataToSend,setDataToSend,"PS5")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.585 17.011c-.43.543-1.483.93-1.483.93l-7.832 2.817V18.68l5.764-2.057c.654-.234.754-.566.223-.74s-1.492-.125-2.147.111l-3.84 1.354v-2.155l.221-.076s1.11-.393 2.67-.566c1.561-.172 3.472.024 4.972.593c1.69.535 1.88 1.323 1.452 1.866m-8.57-3.537V8.162c0-.624-.115-1.198-.7-1.36c-.447-.144-.725.272-.725.895V21l-3.583-1.139V4c1.523.283 3.743.953 4.936 1.355c3.035 1.043 4.064 2.342 4.064 5.267c0 2.851-1.758 3.932-3.992 2.852m-11.583 4.99c-1.736-.49-2.025-1.51-1.234-2.097c.731-.542 1.975-.95 1.975-.95l5.138-1.83v2.086l-3.698 1.325c-.653.234-.753.566-.223.74c.532.175 1.493.125 2.147-.11l1.774-.644v1.865l-.354.06c-1.774.29-3.663.169-5.525-.445"
                    />
                  </svg>
                </div>

                <div
                  className={`texts-footer-platforms-item switch ${
                    dataToSend!["game-data"].platforms.includes("SWITCH")
                      ? "active"
                      : ""
                  }`}
                  onClick={() => handleTogglePlatforms(dataToSend,setDataToSend,"SWITCH")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M14.176 24h3.674c3.376 0 6.15-2.774 6.15-6.15V6.15C24 2.775 21.226 0 17.85 0H14.1c-.074 0-.15.074-.15.15v23.7c-.001.076.075.15.226.15m4.574-13.199c1.351 0 2.399 1.125 2.399 2.398c0 1.352-1.125 2.4-2.399 2.4c-1.35 0-2.4-1.049-2.4-2.4c-.075-1.349 1.05-2.398 2.4-2.398M11.4 0H6.15C2.775 0 0 2.775 0 6.15v11.7C0 21.226 2.775 24 6.15 24h5.25c.074 0 .15-.074.15-.149V.15c.001-.076-.075-.15-.15-.15M9.676 22.051H6.15a4.194 4.194 0 0 1-4.201-4.201V6.15A4.194 4.194 0 0 1 6.15 1.949H9.6zM3.75 7.199c0 1.275.975 2.25 2.25 2.25s2.25-.975 2.25-2.25c0-1.273-.975-2.25-2.25-2.25s-2.25.977-2.25 2.25"
                    />
                  </svg>
                </div>

                <div
                  className={`texts-footer-platforms-item pc ${
                    dataToSend!["game-data"].platforms.includes("PC")
                      ? "active"
                      : ""
                  }`}
                  onClick={() => handleTogglePlatforms(dataToSend,setDataToSend,"PC")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="m3.001 5.479l7.377-1.016v7.127H3zm0 13.042l7.377 1.017v-7.04H3zm8.188 1.125L21.001 21v-8.502h-9.812zm0-15.292v7.236h9.812V3z"
                    />
                  </svg>
                </div>
              </div>

              <div className="texts-footer-grade">
                <input
                  type="range"
                  value={dataToSend!["game-data"].grade}
                  onChange={(event) => {
                    updateDataToSend(
                      setDataToSend!,
                      "game-data",
                      "grade",
                      event
                    );
                  }}
                  name=""
                  id=""
                  min={0}
                  max={10}
                  title="note"
                />

                <StarsNotation note={parseInt(dataToSend["game-data"].grade)} />
              </div>
            </div>
          </div>
        </div>

        <div className="article-content-images" ref={imagesGridRef}>
          {dataToSend["images-data"]["article-images"].length > 0 &&
            dataToSend["images-data"]["article-images"].map((image, index) => (
              <label
                htmlFor={`upload-image-${index}`}
                className="article-content-images-item uploaded"
              >
                {image.path !== "" && !image.path.includes('data') && (
                  <img
                    src={`https://theplayersjournal.wajrock.me/assets/articles/${image.path}`}
                    alt=""
                  />
                )}
                {image.path !== "" && image.path.includes('data') && (
                  <img
                    src={`${image.path}`}
                    alt=""
                  />
                )}
                <div className="article-content-images-item-message">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="52"
                    height="52"
                    viewBox="0 0 52 52"
                    fill="none"
                  >
                    <path
                      d="M8.99938 32.1127C7.42059 30.4997 6.22958 28.5485 5.51658 26.407C4.80357 24.2654 4.58725 21.9897 4.88402 19.7522C5.18078 17.5147 5.98285 15.3741 7.22945 13.4925C8.47606 11.6109 10.1345 10.0376 12.0792 8.89189C14.0239 7.74617 16.2038 7.05802 18.4539 6.87957C20.7039 6.70112 22.965 7.03706 25.066 7.86192C27.167 8.68679 29.0527 9.97895 30.5803 11.6405C32.1079 13.3021 33.2374 15.2896 33.8831 17.4523H37.6869C39.7386 17.4521 41.736 18.1118 43.384 19.3339C45.032 20.556 46.2432 22.2758 46.8388 24.2392C47.4343 26.2026 47.3826 28.3054 46.6912 30.2371C45.9998 32.1689 44.7055 33.827 42.9994 34.9666M25.9997 25.9523V45.0773M25.9997 25.9523L34.4997 34.4523M25.9997 25.9523L17.4997 34.4523"
                      stroke="currentColor"
                      stroke-width="5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <p>Importer une image</p>
                  <input
                    type="file"
                    title="upload-image"
                    onChange={(e) => handleImagesUpload(e,'',index)}
                    name={`upload-image-${index}`}
                    id={`upload-image-${index}`}
                  />
                </div>
              </label>
            ))}
        </div>

        <div className="article-content-textarea">
          <textarea
            title="contenu-article"
            value={dataToSend["article-data"].content}
            ref={contentArticleTextareaRef}
            onChange={(event) => {
              updateDataToSend(
                setDataToSend!,
                "article-data",
                "content",
                undefined,
                event.target.value
              );
            }}
            onClick={(event: any) => {
              setCursorPosition([
                event.target.selectionStart,
                event.target.selectionEnd,
              ]);
            }}
            onBlur={() => setCursorPosition([0, 0])}
          />

          {imagesGridIsVisible && (
            <EditorTab
              textareaRef={contentArticleTextareaRef}
              cursorPosition={cursorPosition}
              setterCursorPosition={setCursorPosition}
              setterDataToSend={setDataToSend}
              countImages={dataToSend["images-data"]["article-images"].length}
            />
          )}
        </div>
      </section>

      <Footer />
      <BottomBar/>
    </div>)}
    </>
  );
};

export default EditArticle;
