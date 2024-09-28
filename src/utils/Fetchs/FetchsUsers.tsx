export const fetchUsernamesEmails = async (type: 'usernames' | 'mails'): Promise<string[]> => {
  try {
    const response = await fetch(`https://theplayersjournal.wajrock.me/api/users.php?type=${type}`);
    if (!response.ok) {
      throw new Error(`Error fetching reviews: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results.map((item: string) => item.toLowerCase());
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const fetchUserProfile = async (id_profile: string): Promise<any> => {

  try {
    const response = await fetch(
      `https://theplayersjournal.wajrock.me/api/users.php?id=${id_profile}`
    );

    if (!response.ok) {
      throw new Error(`Error fetching reviews: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results[0];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const updateUser = async (updatedProfile: any): Promise<any> => {
  const response = await fetch("https://theplayersjournal.wajrock.me/api/users.php?type=update-infos", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedProfile),
  });
  return await response.json();
};

export const fetchProfiles = async (): Promise<any> => {
  try {
    const response = await fetch(`https://theplayersjournal.wajrock.me/api/users.php?type=profiles`);
    if (!response.ok) {
      return { status: "error", code: "500", message: "error-servor" };
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    return { status: "error", code: "500", message: "error-servor" };
  }
};

export const updateUserContext = async (id_user: string): Promise<any> => {
  try {
    const response = await fetch(
      `https://theplayersjournal.wajrock.me/api/users.php?page=profile&id=${id_user}`
    );
    if (!response.ok) {
      return { status: "error", code: "500", message: "error-servor" };
    }
    const data = await response.json();
    localStorage.setItem("user", JSON.stringify(data.results[0]));
    return data.results[0];
  } catch (error) {
    return { status: "error", code: "500", message: "error-servor" };
  }
};

export {};
