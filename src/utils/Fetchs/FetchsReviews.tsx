export const addReview = async (reviewData: any): Promise<any> => {
  try {
    const response = await fetch("https://theplayersjournal.wajrock.me/api/reviews.php", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    });
    if (!response.ok) {
      return { status: "error", code: "500", message: "error-servor" };
    }
    const data = await response.json();
    localStorage.getItem(`reviews-article-${reviewData.id_article}`);
    return data;
  } catch (error) {
    return { status: "error", code: "500", message: "error-servor" };
  }
};

export const deleteReview = async (reviewData: any): Promise<any> => {
  try {
    const response = await fetch("https://theplayersjournal.wajrock.me/api/reviews.php", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    });
    if (!response.ok) {
      return { status: "error", code: "500", message: "error-servor" };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return { status: "error", code: "500", message: "error-servor" };
  }
};

export const fetchReviewsUsersListFromArticle = async (
  id_article: string
): Promise<any> => {
  try {
    const response = await fetch(
      `https://theplayersjournal.wajrock.me/api/reviews.php?article=${id_article}&type=users`
    );
    if (!response.ok) {
      throw new Error(`Error fetching reviews: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const fetchReviewsFromUser = async (id_user: string): Promise<any> => {
  try {
    const response = await fetch(
      `https://theplayersjournal.wajrock.me/api/reviews.php?user=${id_user}`
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


export const fetchReviewsFromArticle = async (id_article: string): Promise<any> => {
    try {
      const response = await fetch(
        `https://theplayersjournal.wajrock.me/api/reviews.php?article=${id_article}`
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