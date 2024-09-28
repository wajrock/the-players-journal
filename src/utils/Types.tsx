export interface ContentType {
    id_article:string,
    categorie: string;
    contenu: string;
    cover_article: string;
    date_modification: string;
    date_creation: string;
    date_sortie?:string;
    nom: string;
    note: string;
    prenom: string;
    profile_picture: string;
    titre: string;
    cover: string;
    nb_articles: number;
    texte:string
    identifiant?:string;
    id_utilisateur:string;
    date_connexion?:string;
    date_creation_compte?:string;
    type?:string;
    mail?:string;
    username?:string;
    id_avis?:string;
    title_article?:string;
  }

  export interface ArticleCardType {
    "id_article":string,
    "cover_article":string,
    "note":string,
    "contenu":string,
    "profile_picture":string,
    "nom":string,
    "prenom":string,
    "date_creation":string,
    "titre":string,
  }

  export interface uploadCoverProps {
    path: string;
    file: File | string;
    "old-image"?: string;
  }
  
  export interface DataToSend {
    "article-data": {
      "id_article"?:string,
      title: string;
      content: string;
    };
    "images-data": {
      "article-cover": uploadCoverProps;
      "game-cover": uploadCoverProps;
      "article-images": uploadCoverProps[];
    };
    "game-data": {
      "id_article"?:string,
      name: string;
      category: string;
      grade: string;
      date: string;
      price: string;
      synopsis: string;
      platforms: string[];
    };
  }