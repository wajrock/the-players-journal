import { FunctionComponent } from 'react'
import HerroBanner from '../../components/HeroBanners/HeroBanner'
import './ErrorsPage.scss'
import { useNavigate } from 'react-router-dom'

const ErrorsPage:FunctionComponent<{error:number}> = ({error}) => {
  const navigate = useNavigate();

  return (
    <div className='errors-page-wrap'>
        <HerroBanner imagePath={"https://theplayersjournal.wajrock.me/assets/main-cover"} top left bottom/>
        <div className="errors-page-wrap-card card-error">
            <h1 className="card-error-number">{error}</h1>
            <h2 className="card-error-title">
              {error === 404 && "Page introuvable !"}
              {error === 500 && "Erreur serveur !"}
            </h2>
            <p className="card-error-message">
              {error === 404 && "La page que vous recherchez n'existe pas. Veuillez vérifier l'URL ou revenir à la page d'accueil."}
              {error === 500 && "Une erreur est survenue sur le serveur. Veuillez réessayer plus tard."}
            </p>
            <div onClick={()=>navigate(0)} className="card-error-cta">
              <p>Rafraichir</p>
            </div>
        </div>
    </div>
  )
}

export default ErrorsPage