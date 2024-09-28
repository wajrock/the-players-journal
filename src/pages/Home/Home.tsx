import { FunctionComponent } from "react";
import "./Home.scss";
import Header from "../../components/Header/Header";
import HeroBanner from "../../components/HeroBanners/HomeHeroBanner";
import MainArticleSection from "../../components/Section/MainArticleSection";
import Footer from "../../components/Footer/Footer";
import ArticlesSection from "../../components/Section/ArticlesSection";
import GamesSection from "../../components/Section/GamesSection";
import ContributorsSection from "../../components/Section/ContributorsSection";
import BottomBar from "../../components/BottomBar/BottomBar";

const Home: FunctionComponent = () => {
  return (
    <div className="home-wrap">
      <Header />
      <HeroBanner />
      <main className="home-wrap-content">
        <MainArticleSection />
        <ArticlesSection
          title={"Les derniers articles"}
          endpoint={"latest-articles"}
        />
        <ArticlesSection
          title={"Les plus appréciés"}
          endpoint={"most-popular"}
        />
        <GamesSection title={"Les jeux à l'affiches"} />
        <Footer />
        <BottomBar type="discover"/>
      </main>
    </div>
  );
};

export default Home;
