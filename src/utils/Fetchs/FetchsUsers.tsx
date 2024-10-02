import { ResponseAPI } from "../Types";

export const fetchUsernamesEmails = async (type: 'usernames' | 'mails'): Promise<ResponseAPI> => {
  try {
    const response = await fetch(`https://theplayersjournal.wajrock.me/api/users.php?type=${type}`);
    if (!response.ok) {
      return { status: "error", code: 500, message: "error-servor" };
    }

    return await response.json();
    // return data.results.map((item: string) => item.toLowerCase());
  } catch (error) {
    return { status: "error", code: 400, message: error instanceof Error ? error.message : "unknown-error-occurred" };
  }
};

export const fetchUserProfile = async (id_profile: string): Promise<ResponseAPI> => {

  try {
    const response = await fetch(
      `https://theplayersjournal.wajrock.me/api/users.php?id=${id_profile}`
    );

    if (!response.ok) {
      return { status: "error", code: 500, message: "error-servor" };
    }
    return await response.json();
  } catch (error) {
    return { status: "error", code: 400, message: error instanceof Error ? error.message : "unknown-error-occurred" };
  }
};

export const updateUser = async (updatedProfile: any): Promise<ResponseAPI> => {
  try {
    const response = await fetch("https://theplayersjournal.wajrock.me/api/users.php?type=update-infos", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProfile),
    });
    if (!response.ok) {
      return { status: "error", code: 500, message: "error-servor" };
    }
    return await response.json();
  } catch (error) {
    return { status: "error", code: 400, message: error instanceof Error ? error.message : "unknown-error-occurred" };
  }
};

export const fetchProfiles = async (): Promise<ResponseAPI> => {
  try {
    const response = await fetch(`https://theplayersjournal.wajrock.me/api/users.php?type=profiles`);
    if (!response.ok) {
      return { status: "error", code: 500, message: "error-servor" };
    }
    return await response.json();
  } catch (error) {
    return { status: "error", code: 400, message: error instanceof Error ? error.message : "unknown-error-occurred" };
  }
};

export const updateUserContext = async (id_user: string): Promise<ResponseAPI> => {
  try {
    const response = await fetch(
      `https://theplayersjournal.wajrock.me/api/users.php?page=profile&id=${id_user}`
    );
    if (!response.ok) {
      return { status: "error", code: 500, message: "error-servor" };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return { status: "error", code: 400, message: error instanceof Error ? error.message : "unknown-error-occurred" };
  }
};
