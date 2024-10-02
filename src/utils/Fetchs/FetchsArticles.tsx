import { ResponseAPI } from "../Types";

export const fetchArticlesFromCategory = async (cateogorie: string): Promise<ResponseAPI> => {
  try {
    const response = await fetch(
      `https://theplayersjournal.wajrock.me/api/articles.php?categorie=${cateogorie}`
    );
    if (!response.ok) {
      return { status: "error", code: 500, message: "error-servor" };
    }
    return await response.json();;
  } catch (error) {
    return { status: "error", code: 400, message: error instanceof Error ? error.message : "unknown-error-occurred" };
    
  }
};


export const fetchArticlesFromUser = async (id_user: string): Promise<ResponseAPI> => {
    try {
      const response = await fetch(
        `https://theplayersjournal.wajrock.me/api/articles.php?user=${id_user}`
      );
      if (!response.ok) {
        return { status: "error", code: 500, message: "error-servor" };
      }
      return await response.json();;
    } catch (error) {
      return { status: "error", code: 400, message: error instanceof Error ? error.message : "unknown-error-occurred" };
    }
  };
  
