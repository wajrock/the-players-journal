export const fetchGames = async():Promise<any> => {
    try {
      const response = await fetch(`https://theplayersjournal.wajrock.me/api/games`);
      if (!response.ok) {
        return { status: "error", code: "500", message: "error-servor" };
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return { status: "error", code: "500", message: "error-servor" };
    }
  };

export const fetchCategories = async():Promise<any> => {
    try {
      const response = await fetch(`https://theplayersjournal.wajrock.me/api/games?type=categories`);
      if (!response.ok) {
        return { status: "error", code: "500", message: "error-servor" };
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return { status: "error", code: "500", message: "error-servor" };
    }
};

export const fetchPlatforms = async():Promise<any> => {
  try {
    const response = await fetch(`https://theplayersjournal.wajrock.me/api/games?type=platforms`);
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