import { ResponseAPI } from "../Types";

export const fetchContributors = async():Promise<ResponseAPI> => {
    try {
      const response = await fetch(`https://theplayersjournal.wajrock.me/api/contributors`);
      if (!response.ok) {
        return { status: "error", code: 500, message: "error-servor" };
      }
      return await response.json();;
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