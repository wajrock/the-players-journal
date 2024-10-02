import { ResponseAPI } from "../Types";

export const fetchGames = async():Promise<ResponseAPI> => {
    try {
      const response = await fetch(`https://theplayersjournal.wajrock.me/api/games`);
      if (!response.ok) {
        return { status: "error", code: 500, message: "error-servor" };
      }
      return await response.json();
    } catch (error) {
      return { status: "error", code: 400, message: error instanceof Error ? error.message : "unknown-error-occurred" };
    }
  };

export const fetchCategories = async():Promise<ResponseAPI> => {
    try {
      const response = await fetch(`https://theplayersjournal.wajrock.me/api/games?type=categories`);
      if (!response.ok) {
        return { status: "error", code: 500, message: "error-servor" };
      }
      return await response.json();
    } catch (error) {
      return { status: "error", code: 400, message: error instanceof Error ? error.message : "unknown-error-occurred" };
    }
};

export const fetchPlatforms = async():Promise<ResponseAPI> => {
  try {
    const response = await fetch(`https://theplayersjournal.wajrock.me/api/games?type=platforms`);
    if (!response.ok) {
      return { status: "error", code: 500, message: "error-servor" };
    }
    return await response.json();
  } catch (error) {
    return { status: "error", code: 400, message: error instanceof Error ? error.message : "unknown-error-occurred" };
  }
};


export {};