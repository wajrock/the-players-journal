import { ResponseAPI } from "../Types";

export const fetchArticleContent = async (id_article: string): Promise<ResponseAPI> => {
  try {
    const response = await fetch(
      `https://theplayersjournal.wajrock.me/api/article.php?id=${id_article}`
    );
    if (!response.ok) {
      return { status: "error", code: 500, message: "error-servor" };
    }
    return await response.json();;
  } catch (error) {
    return { status: "error", code: 400, message: error instanceof Error ? error.message : "unknown-error-occurred" };
  }
};

export const fetchArticleReviews = async (id_article: string): Promise<ResponseAPI> => {
  try {
    const response = await fetch(
      `https://theplayersjournal.wajrock.me/api/reviews.php?article=${id_article}`
    );

    if (!response.ok) {
      return { status: "error", code: 500, message: "error-servor" };
    }

    return await response.json();;
  } catch (error) {
    return { status: "error", code: 400, message: error instanceof Error ? error.message : "unknown-error-occurred" };
  }
};

export const fetchArticleGameDetails = async (
  id_article: string
): Promise<ResponseAPI> => {
  try {
    const response = await fetch(
      `https://theplayersjournal.wajrock.me/api/games.php?article=${id_article}`
    );
    if (!response.ok) {
      return { status: "error", code: 500, message: "error-servor" };
    }
    return await response.json();;
  } catch (error) {
    return { status: "error", code: 400, message: error instanceof Error ? error.message : "unknown-error-occurred" };
  }
};

export {};
