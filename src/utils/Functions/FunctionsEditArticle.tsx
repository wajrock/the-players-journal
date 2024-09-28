import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { DataToSend, uploadCoverProps } from "../Types";
import { articleContent } from "../../components/Cards/Articles/ArticleCard";
import { Game } from "../../components/GameDetails/GameDetails";
import {
  fetchArticleContent,
  fetchArticleGameDetails,
} from "../Fetchs/FetchsArticle";
import { fetchGames } from "../Fetchs/FetchsGames";

export const handleInputChange = (
  event: ChangeEvent<any>,
  setter: (value: string) => void
) => {
  setter(event.target.value);
};

export const handleTogglePlatforms = (dataToSend:DataToSend,setterDataToSend: Dispatch<SetStateAction<DataToSend>>,platform: string) => {
  const prevPlatforms = dataToSend!["game-data"].platforms;

  const newPlatforms = prevPlatforms.includes(platform)
    ? prevPlatforms.filter((p: string) => p !== platform)
    : [...prevPlatforms, platform];

  setterDataToSend((prevData: DataToSend) => ({
    ...prevData,
    "game-data": {
      ...prevData["game-data"],
      "platforms": newPlatforms,
    },
  }));
};

export const updateDataToSend = (
  setterDataToSend: React.Dispatch<React.SetStateAction<DataToSend>>,
  categoryToEdit: "article-data" | "images-data" | "game-data",
  attributeToEdit: string,
  event?: ChangeEvent<any> | ProgressEvent<FileReader>,
  newValue?: string | string[] | uploadCoverProps | uploadCoverProps[]
) => {
  const valueToInsert = event ? event.target.value : newValue;

  setterDataToSend((prevData: DataToSend) => ({
    ...prevData,
    [categoryToEdit]: {
      ...prevData[categoryToEdit],
      [attributeToEdit]: valueToInsert,
    },
  }));
};

export const initializeValues = (
  article_id: string,
  articleImages: uploadCoverProps[],
  articleData: articleContent,
  gameData: Game,
  setterDefaultValues: (val: DataToSend) => void,
  setterDataToSend: (val: DataToSend) => void
) => {
  
  
  const defaultValues: DataToSend = {
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

  setterDefaultValues(defaultValues);
  setterDataToSend(defaultValues);
};

export const areDatasUpdated = (
  defaultValues: DataToSend,
  dataToSend: DataToSend,
  section:
    | "article"
    | "article-cover"
    | "article-images"
    | "game"
    | "game-cover"
): boolean => {
  switch (section) {
    case "article":
      return (
        defaultValues["article-data"].title !==
          dataToSend["article-data"].title ||
        defaultValues["article-data"].content !==
          dataToSend["article-data"].content
      );

    case "article-cover":
      return (
        defaultValues["images-data"]["article-cover"].file !==
        dataToSend["images-data"]["article-cover"].file
      );

    case "article-images":
      if (defaultValues["images-data"]["article-images"].length !== dataToSend["images-data"]["article-images"].length){
        return true;
      }
      return defaultValues["images-data"]["article-images"].some(
        (defaultImage, index) => {
          return (
            defaultImage.file !==
            dataToSend["images-data"]["article-images"][index].file
          );
        }
      );

    case "game":
      return (
        defaultValues["game-data"].name !== dataToSend["game-data"].name ||
        defaultValues["game-data"].category !==
          dataToSend["game-data"].category ||
        defaultValues["game-data"].grade !== dataToSend["game-data"].grade ||
        defaultValues["game-data"].price !== dataToSend["game-data"].price ||
        defaultValues["game-data"].date !== dataToSend["game-data"].date ||
        defaultValues["game-data"].synopsis !==
          dataToSend["game-data"].synopsis ||
        defaultValues["game-data"].platforms !==
          dataToSend["game-data"].platforms
      );

    case "game-cover":
      return (
        defaultValues["images-data"]["game-cover"].file !==
        dataToSend["images-data"]["game-cover"].file
      );
    default:
      return false;
  }
};

export const submitEdits = async(
  article_id: string,
  defaultValues: DataToSend,
  dataToSend: DataToSend,
  navigate: (path: string,options?: { replace?: boolean }) => void
):Promise<boolean> => {
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
      ? areDatasUpdated(defaultValues, dataToSend, "article-images")
      : false;
  const gameIsEdited =
    defaultValues && dataToSend!
      ? areDatasUpdated(defaultValues, dataToSend!, "game")
      : false;
  const gameCoverIsEdited =
    defaultValues && dataToSend!
      ? areDatasUpdated(defaultValues, dataToSend!, "game-cover")
      : false;

  const dataAreUpdated = {
    "article-data": !articleIsEdited,
    "article-cover": !articleCoverIsEdited,
    "article-images": !articleImagesAreEdited,
    "game-data": !gameIsEdited,
    "game-cover": !gameCoverIsEdited,
  };

  
  
  
  if (articleImagesAreEdited) {
    const updatedImages = dataToSend["images-data"]["article-images"].filter(
      (image) => image.file !== ""
    );
    const formData = new FormData();
    formData.append("id_article", article_id);
    updatedImages.forEach((item, index) => {
      formData.append(`files[${index}]`, item.file);
      formData.append(`old-images[${index}]`, item["old-image"]!);
    });

    const updateImagesRequest = await fetch("https://theplayersjournal.wajrock.me/api/images?type=update-article-images", {
      method: "POST",
      body: formData,
    })

    const updateImagesReponse = await updateImagesRequest.json();

    if (updateImagesReponse.status === 'sucess'){
      localStorage.removeItem(`content-formatted-article-${article_id}`);
      dataAreUpdated["article-images"] = true;
    }
  }

  if (gameIsEdited) {
    const updateGameRequest = await fetch("https://theplayersjournal.wajrock.me/api/games?type=content", {
      method: "POST",
      body: JSON.stringify(dataToSend!["game-data"]),
    })

    const updateGameReponse = await updateGameRequest.json();
    dataAreUpdated["game-data"] = updateGameReponse.status === 'sucess';

  }

  if (articleIsEdited) {
    const updateArticleRequest = await fetch("https://theplayersjournal.wajrock.me/api/article?type=content", {
      method: "POST",
      body: JSON.stringify(dataToSend!["article-data"]),
    })

    const updateArticleResponse = await updateArticleRequest.json();

    if (updateArticleResponse.status === 'sucess'){
      localStorage.removeItem(`content-formatted-article-${article_id}`);
      dataAreUpdated["article-data"] = updateArticleResponse.status === 'sucess';
    }
  }

  if (articleCoverIsEdited) {
    const formData = new FormData();
    formData.append("cover", dataToSend["images-data"]["article-cover"].file);
    formData.append("id_article", article_id!);
    formData.append(
      "old-image",
      dataToSend!["images-data"]["article-cover"]["old-image"]!
    );

    const updateArticleCoverRequest = await fetch("https://theplayersjournal.wajrock.me/api/images?type=update-article-cover", {
      method: "POST",
      body: formData,
    })

    const updateArticleCoverResponse = await updateArticleCoverRequest.json();
    
    dataAreUpdated["article-cover"] = updateArticleCoverResponse.status === 'sucess';
    

  }

  if (gameCoverIsEdited) {
    const formData = new FormData();
    formData.append("cover", dataToSend!["images-data"]["game-cover"].file);
    formData.append("id_article", article_id!);
    formData.append(
      "old-image",
      dataToSend!["images-data"]["game-cover"]["old-image"]!
    );

    const updateGameCoverRequest = await fetch("https://theplayersjournal.wajrock.me/api/images?type=update-game-cover", {
      method: "POST",
      body: formData,
    })

    const updateGameCoverResponse = await updateGameCoverRequest.json();

    if (updateGameCoverResponse.status === 'sucess'){
      const fetchGamesResponse = await fetchGames();
      
      if (fetchGamesResponse.status === 'sucess'){
        localStorage.setItem('games',JSON.stringify(fetchGamesResponse.results));
        dataAreUpdated["game-cover"] = true;
      } else {
        dataAreUpdated["game-cover"] = false;
      }
 
    }
  }

  if (
    (articleImagesAreEdited && dataAreUpdated["article-images"]) ||
    (articleCoverIsEdited && dataAreUpdated["article-cover"]) ||
    (articleIsEdited && dataAreUpdated["article-data"])
  ){
    
    const fetchArticleContentResponse = await fetchArticleContent(article_id!);

      localStorage.setItem(
        `data-article-${article_id}`,
        JSON.stringify(fetchArticleContentResponse.results[0])
      );
  }

  if (
    (gameCoverIsEdited && dataAreUpdated["game-cover"]) ||
    (gameIsEdited && dataAreUpdated["game-data"])
  ){
    const fetchGameDetailsResponse = await fetchArticleGameDetails(article_id!);

      localStorage.setItem(
        `article-games-details-${article_id}`,
        JSON.stringify(fetchGameDetailsResponse.results[0])
      );
  }
  return Object.values(dataAreUpdated).every((val)=>val);
};


export const adjustTextAreaHeight = (textareaRef:React.RefObject<HTMLTextAreaElement>) => {
  if (textareaRef.current) {
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }
};