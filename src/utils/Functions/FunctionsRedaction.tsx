import { fetchArticleContent } from "../Fetchs/FetchsArticle";
import { DataToSend } from "../Types";

export const isRedactionCompleted = (
  id_user: DataToSend,
  dataToSend: DataToSend
):boolean => {
  const articleIsCompleted = !Object.values(dataToSend["article-data"]).some(
    (val) => val === ""
  );

  const articleCoverIsUploaded =
    dataToSend["images-data"]["article-cover"].file !== "";

  const imagesCount = (
    dataToSend["article-data"].content.match(/\{image:here(\d+)\}/g) || []
  ).length;
  const articlesImagesAreCompleted =
    imagesCount === 0
      ? true
      : dataToSend["images-data"]["article-images"].length === imagesCount;

  const gameCoverIsUploaded =
    dataToSend["images-data"]["game-cover"].file !== "";

  const gameIsCompleted = !Object.values(dataToSend["game-data"]).some(
    (val) => val.length === 0 || val === "Catégorie"
  );

  return (
    articleIsCompleted &&
    articleCoverIsUploaded &&
    articlesImagesAreCompleted &&
    gameCoverIsUploaded &&
    gameIsCompleted
  );
};

export const submitRedaction = async(
  id_user: string,
  dataToSend: DataToSend
):Promise<[boolean,string[]]> => {

  const dataAreAdded = {
    "game-data": false,
    "game-cover": false,
    "article-data": false,
    "article-images": false,
    "article-cover": false
  };

  let idGame;
  let idArticle;

  const gameDataRequest = await fetch("https://theplayersjournal.wajrock.me/api/games?type=content", {
    method: "PUT",
    body: JSON.stringify(dataToSend!["game-data"]),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const gameDataResponse = await gameDataRequest.json();

  if (gameDataResponse.status === "sucess") {
    dataAreAdded["game-data"] = true;
    idGame = gameDataResponse.results;
  }

  if (dataAreAdded["game-data"] && idGame) {
    const formData = new FormData();
    formData.append("cover", dataToSend!["images-data"]["game-cover"].file);
    formData.append("id_jeu", idGame);
    const gameCoverRequest = await fetch("https://theplayersjournal.wajrock.me/api/images?type=insert-game-cover", {
      method: "POST",
      body: formData,
    })
  
    const gameCoverResponse = await gameCoverRequest.json();
    if (gameCoverResponse.status === "sucess") {
      dataAreAdded["game-cover"] = true;
      
    }
  }

  if (dataAreAdded["game-cover"]) {
    const articleData = {
    'title' :dataToSend["article-data"].title,
    'id_author':id_user,
    'content':dataToSend["article-data"].content,
    'id_game':idGame}

    const articleDataRequest = await fetch("https://theplayersjournal.wajrock.me/api/article", {
      method: "PUT",
      body: JSON.stringify(articleData),
    })
  
    const articleDataResponse = await articleDataRequest.json();

    if (articleDataResponse.status === "sucess") {
      dataAreAdded["article-data"] = true;
      idArticle = articleDataResponse.results;
    }
        
  }

  if (dataAreAdded["article-data"]) {
    if (dataToSend["images-data"]["article-images"].length > 0){
      const updatedImages = dataToSend["images-data"]["article-images"].filter(
        (image) => image.file !== ""
      );
      const formData = new FormData();
      formData.append("id_jeu", idGame);
      updatedImages.forEach((item, index) => {
        formData.append(`files[${index}]`, item.file);
      });
      
      const articleImagesDataRequest = await fetch("https://theplayersjournal.wajrock.me/api/images?type=insert-article-images", {
        method: "POST",
        body: formData,
      })
  
      const articleImagesDataResponse = await articleImagesDataRequest.json();
      
      if (articleImagesDataResponse.status === "sucess") {
        dataAreAdded["article-images"] = true;
      }
    } else {
      dataAreAdded["article-images"] = true;
    }
    
  }

  if (dataAreAdded["article-images"]){
    const articleCoverData = new FormData();
    articleCoverData.append("cover", dataToSend["images-data"]["article-cover"].file);
    articleCoverData.append("id_jeu", idGame);
    
    const articleCoverRequest = await fetch("https://theplayersjournal.wajrock.me/api/images?type=insert-article-cover", {
      method: "POST",
      body: articleCoverData,
    })
  
    const articleCoverResponse = await articleCoverRequest.json();

    if (articleCoverResponse.status === "sucess") {
      dataAreAdded["article-cover"] = true;
      
    }
  }
    const articleContentResponse = await fetchArticleContent(idArticle);
    const dataArticle = articleContentResponse.status === 'sucess' 
    ? [idArticle,articleContentResponse.results[0].titre] :[]

    return [Object.values(dataAreAdded).every(val=>val),dataArticle];
    ;
};
