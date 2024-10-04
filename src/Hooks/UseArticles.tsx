// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useEffect, useState } from "react";
import { ContentType, ResponseAPI } from "../utils/Types";
import {
  fetchArticlesFromUser,
  fetchArticlesFromCategory,
} from "../utils/Fetchs/FetchsArticles";
import { useAPI } from "../ApiStatusContext";
import { fetchGridContent } from "../utils/Fetchs/FetchsDiscover";

const getFromStorage = (type: string, id_user?: string): ContentType[] | null => {
    if (type === "user" && id_user) {
      const storedData = localStorage.getItem(`articles-user-${id_user}`);
      return storedData ? JSON.parse(storedData) : null;
    } else if (type === "latest-articles" || type === "most-popular") {
      const storedData = localStorage.getItem(`articles-${type}`);
      return storedData ? JSON.parse(storedData) : null;
    } else if (type === "all-articles") {
      const storedData = localStorage.getItem(`articles`);
      return storedData ? JSON.parse(storedData) : null;
    }
    return null;
  };

const pushOnStorage = (type: string, data: ContentType[], id_user?: string) => {
    if (type === "user" && id_user) {
      localStorage.setItem(`articles-user-${id_user}`, JSON.stringify(data));
    } else if (type === "latest-articles" || type === "most-popular") {
      localStorage.setItem(`articles-${type}`, JSON.stringify(data));
    } else if (type === "all-articles") {
      localStorage.setItem(`articles`, JSON.stringify(data));
    }
  };

const useArticles = (
  type?: "latest-articles" | "most-popular" | "all-articles" | "user",
  id_user?: string
) => {
  const { setIsAPIAvailable } = useAPI();
  const [alreadyLoad,setAlreadyLoad] = useState(false);
  const [dataArticles, setDataArticles] = useState<ContentType[] | null>(() => getFromStorage(type || "",id_user));

  const handleResponse = (type: "latest-articles" | "most-popular" | "all-articles" | "user",data:ResponseAPI,id_user?:string) => {
    if (data.code === 500) {
      setIsAPIAvailable(false);
    } else {
      setDataArticles(data.results);
      type && pushOnStorage(type, data.results, id_user);
    }
  };

  const updateArticles = (
    type: "latest-articles" | "most-popular" | "all-articles" | "user",
    id_user?: string
  ) => {
    if (type === "user" && id_user) {
      fetchArticlesFromUser(id_user).then((data) => handleResponse(type,data,id_user,));
    } else if (type === "latest-articles" || type === "most-popular") {
      fetchArticlesFromCategory(type).then((data)=>handleResponse(type,data,undefined));
    } else if (type === "all-articles") {
      fetchGridContent("articles").then((data) => handleResponse(type,data,undefined));
    }
  };

  const updateAllArticles = (id_user:string) => {
    console.log(id_user);
    
    updateArticles("latest-articles");
    updateArticles("most-popular");
    updateArticles("all-articles");
    updateArticles("user",id_user);
  }

  useEffect(()=>{

    if (!dataArticles || !alreadyLoad){
        type && updateArticles(type,id_user || undefined);
        setAlreadyLoad(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[alreadyLoad,type,id_user,dataArticles])

  return { dataArticles, updateArticles,updateAllArticles };
};

export default useArticles;
