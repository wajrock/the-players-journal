import { articleContent } from "../../components/Cards/Articles/ArticleCard";
import { fetchReviewsUsersListFromArticle } from "../Fetchs/FetchsReviews";

export const getReadingTime = (text: string): string => {
  const countWords = text.split(" ").length;
  const readingTime = Math.round(countWords / 200);

  return readingTime < 1 ? "~ 1 min" : `${readingTime} min`;
};

export const formatContentArticle = (content: string, images: string[]) => {
  let formattedText = content.replace(
    /\{image:here(\d+)\}/g,
    (match, index) => {
      const imageUrl = images[parseInt(index, 10) - 1]; // Convert the index to an integer and retrieve URL
      return `<img src="https://theplayersjournal.wajrock.me/assets/articles/${imageUrl}" alt="Image ${index}" />`;
    }
  );

  formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
  formattedText = formattedText.replace(/\*(.*?)\*/, "<i>$1</i>");
  formattedText = formattedText.replace(/\*(.*?)\*/g, "<i>$1</i>");

  formattedText = formattedText.replace(/\[*(.*?)\]/g, "<h2>$1</h2>");
  formattedText = formattedText.replace("*", "");

  formattedText = formattedText.replace(
    /\*\*(.*?)\*\*/g,
    "<strong>$1</strong>"
  );

  return formattedText;
};

export const formatText = (text: string) => {
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, "");
  formattedText = formattedText.replace(/\*(.*?)\*/, "");
  formattedText = formattedText.replace(/\*(.*?)\*/g, "");

  formattedText = formattedText.replace(/\[*(.*?)\]/g, "");
  formattedText = formattedText.replace("*", "");

  formattedText = formattedText.replace(
    /\*\*(.*?)\*\*/g,
    "<strong>$1</strong>"
  );

  return formattedText;
};

export const wichReviewView = (
  article_id: string,
  user: any,
  reviewsLength: number,
  articleData: articleContent,
  viewSetter: (view: string[]) => void
) => {
  fetchReviewsUsersListFromArticle(article_id!)
    .then((data) => {
      const list = data?.results || [];
      const haveReview = list.includes(user?.id_utilisateur);
      const isOwnArticle =
        articleData &&
        user &&
        articleData.id_auteur?.toString() === user?.id_utilisateur?.toString();

      if (user !== null) {
        if (!isOwnArticle) {
          if (reviewsLength === 0) {
            viewSetter(["new-review-first"]);
          } else {
            if (!haveReview) {
              viewSetter(["new-review", "reviews"]);
            } else {
              viewSetter(["reviews"]);
            }
          }
        } else {
          if (reviewsLength !== 0) {
            viewSetter(["reviews"]);
          } else {
            viewSetter(["no-reviews"]);
          }
        }
      } else {
        viewSetter(["login"]);
        if (reviewsLength !== 0) {
          viewSetter(["login", "reviews"]);
        }
      }
    })
    .catch((error) => {
      console.error("Failed to set the view due to fetching issues", error);
      // Optionally set some error view
      viewSetter(["error"]);
    });
};

export const deleteArticle = async (
  idGame:string):Promise<boolean> => {
  const dataAreDeleted = {
    "article-images": false,
    "article-data": false,
    "game-data": false,
  };

  const deleteBody = {
    idGame: idGame
  };

  
  const deleteImagesRequest = await fetch("https://theplayersjournal.wajrock.me/api/images", {
    method: "DELETE",
    body: JSON.stringify(deleteBody),
  });

  const deleteImagesResponse = await deleteImagesRequest.json();

  if (deleteImagesResponse.status === 'sucess'){
    dataAreDeleted["article-images"] = true;
  }

  if (dataAreDeleted["article-images"]){
    const deleteArticleRequest = await fetch("https://theplayersjournal.wajrock.me/api/article", {
      method: "DELETE",
      body: JSON.stringify(deleteBody),
    });
  
    const deleteArticleResponse = await deleteArticleRequest.json();
    
    if (deleteArticleResponse.status === 'sucess'){
      dataAreDeleted["article-data"] = true;
    }
  }
  
  if (dataAreDeleted["article-data"]){
    
    
    const deleteGameRequest = await fetch("https://theplayersjournal.wajrock.me/api/games", {
      method: "DELETE",
      body: JSON.stringify(deleteBody),
    });
  
    const deleteGameResponse = await deleteGameRequest.json();
    if (deleteGameResponse.status === 'sucess'){
      dataAreDeleted["game-data"] = true;
    }
  }

  return Object.values(dataAreDeleted).every(val=>val);
};
