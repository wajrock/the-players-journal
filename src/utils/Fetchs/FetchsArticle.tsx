export const fetchArticleContent = async (id_article: string): Promise<any> => {
  try {
    const response = await fetch(
      `https://theplayersjournal.wajrock.me/api/article.php?id=${id_article}`
    );
    if (!response.ok) {
      return { status: "error", code: "500", message: "error-servor" };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return { status: "error", code: "500", message: "error-servor" };
  }
};

export const fetchArticleReviews = async (id_article: string): Promise<any> => {
  try {
    const response = await fetch(
      `https://theplayersjournal.wajrock.me/api/reviews.php?article=${id_article}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching article reviews:", error);
    return null; // You can return null or handle it however you'd like
  }
};

export const fetchArticleGameDetails = async (
  id_article: string
): Promise<any> => {
  try {
    const response = await fetch(
      `https://theplayersjournal.wajrock.me/api/games.php?article=${id_article}`
    );
    if (!response.ok) {
      return { status: "error", code: "500", message: "error-servor" };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return { status: "error", code: "500", message: "error-servor" };
  }
};

export {};
