import './Footer.scss'
import { useUser } from '../../UserContext'

const Footer = () => {
    const {user} = useUser();
  return (
    <div className="footer-wrap">
        <main className="footer-wrap-content">
            <div className="footer-wrap-content-texts">
                <h1 className="footer-wrap-content-texts-title">The Players Journal</h1>
                <h1 className="footer-wrap-content-texts-slogan">Plongez dans des analyses captivantes ✍ de vos jeux préférés. 🎮</h1>
            </div>

            <nav className="footer-wrap-content-links">
                <a href={'/articles'}  className="footer-wrap-content-links-item">Articles</a>
                <a href={'/jeux'} className="footer-wrap-content-links-item">Jeux</a>
                {user === null ? (<a href={'/authentication'} className="footer-wrap-content-links-item">Nous rejoindre</a>):(<a href={'/redaction'} className="footer-wrap-content-links-item">Rédiger un article</a>)}
            </nav>
        </main>

        <footer className="footer-wrap-footer">
            <p>The Players Journal 2024 - Tous droits réservés</p>
            <p>Site imaginé et conçu par <a href='https://github.com/wajrock' target='blank'>Thibaud Wajrock</a></p>
        </footer>
    </div>
  )
}

export default Footer