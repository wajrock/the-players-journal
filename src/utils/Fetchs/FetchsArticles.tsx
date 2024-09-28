export const fetchArticlesFromCategory = async (cateogorie: string): Promise<any> => {
  try {
    const response = await fetch(
      `https://theplayersjournal.wajrock.me/api/articles.php?categorie=${cateogorie}`
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


export const fetchArticlesFromUser = async (id_user: string): Promise<any> => {
    try {
      const response = await fetch(
        `https://theplayersjournal.wajrock.me/api/articles.php?user=${id_user}`
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
  
