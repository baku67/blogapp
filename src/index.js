import './index.scss';
import { API_URL } from './utils';


const articlesContainer = document.querySelector('.articles-container')

// La fonction ne va pas au meme rythme car elle attend des infos
const fecthArticles = async () => {

    // Pas d'arguments = GET (codé comme ça en backend !)
    const response = await fetch(API_URL)
    const articles = await response.json()

    // Map marche que sur un Array, ducoup on met l'unique element dans un array
    if(!(articles instanceof Array)) {
        articles = [articles]
    }

    createDOMArticles(articles)
    console.log(articles)
}


const createDOMArticles = (articles) => {

    // Prend un array et le transfomr en nouveau array avec un callback
    // Si accolades => return (sinon fleche joue le role de return) (!)
    const articlesDOM = articles.map(article => {

        const articleNode = document.createElement('div')
        articleNode.classList.add('article')
        articleNode.innerHTML = 
        `
            <img src=${article.image.startsWith('http') ? article.image : "assets/images/default_profil.png"} alt="photo">
            <h2>${article.title}</h2>
            <p class="article-author">${article.author}</p>
            <p class="article-content">${article.content}</p>
            <div class="article-actions">
                <button class="btn btn-danger">Supprimer</button>
                <button class="btn btn-primary">Editer</button>
            </div>
        `
        return articleNode
    })

    articlesContainer.innerHTML = '' // évite cumul
    articlesContainer.append(...articlesDOM) // On 'explose' articlesDOM dans appendChild
}

fecthArticles()