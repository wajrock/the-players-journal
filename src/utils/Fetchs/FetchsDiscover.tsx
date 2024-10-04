import { ResponseAPI } from "../Types";

export const fetchGridContent = async (type: string): Promise<ResponseAPI> => {
  try {
    const response = await fetch(
      `https://theplayersjournal.wajrock.me/api/${type}`
    );
    if (!response.ok) {
      return { status: "error", code: 500, message: "error-servor" };
    }
    return await response.json();
  } catch (error) {
    return {
      status: "error",
      code: 400,
      message:
        error instanceof Error ? error.message : "unknown-error-occurred",
    };
  }
};
