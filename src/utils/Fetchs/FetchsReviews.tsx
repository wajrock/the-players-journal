import { ResponseAPI } from "../Types";

export const addReview = async (reviewData: any): Promise<ResponseAPI> => {
  try {
    const response = await fetch("https://theplayersjournal.wajrock.me/api/reviews.php", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    });
    if (!response.ok) {
      return { status: "error", code: 500, message: "error-servor" };
    }
    const data:ResponseAPI = await response.json();
    localStorage.setItem(`reviews-article-${reviewData.id_article}`,data.results);
    return data;
  } catch (error) {
    return { status: "error", code: 400, message: error instanceof Error ? error.message : "unknown-error-occurred" };
  }
};

export const deleteReview = async (reviewData: any): Promise<ResponseAPI> => {
  try {
    const response = await fetch("https://theplayersjournal.wajrock.me/api/reviews.php", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    });
    if (!response.ok) {
      return { status: "error", code: 500, message: "error-servor" };
    }
    return await response.json();;
  } catch (error) {
    return { status: "error", code: 400, message: error instanceof Error ? error.message : "unknown-error-occurred" };
  }
};

export const fetchReviewsUsersListFromArticle = async (
  id_article: string
): Promise<ResponseAPI> => {
  try {
    const response = await fetch(
      `https://theplayersjournal.wajrock.me/api/reviews.php?article=${id_article}&type=users`
    );
    if (!response.ok) {
      return { status: "error", code: 500, message: "error-servor" };
    }
    return await response.json();;
  } catch (error) {
    return { status: "error", code: 400, message: error instanceof Error ? error.message : "unknown-error-occurred" };
  }
};

export const fetchReviewsFromUser = async (id_user: string): Promise<ResponseAPI> => {
  try {
    const response = await fetch(
      `https://theplayersjournal.wajrock.me/api/reviews.php?user=${id_user}`
    );
    if (!response.ok) {
      return { status: "error", code: 500, message: "error-servor" };
    }
    return await response.json();;
  } catch (error) {
    return { status: "error", code: 400, message: error instanceof Error ? error.message : "unknown-error-occurred" };
  }
};


export const fetchReviewsFromArticle = async (id_article: string): Promise<ResponseAPI> => {
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
  


export {};