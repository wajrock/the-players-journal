export const fetchContributors = async():Promise<any> => {
    try {
      const response = await fetch(`https://theplayersjournal.wajrock.me/api/contributors`);
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