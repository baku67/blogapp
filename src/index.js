import './index.scss';
import { API_URL } from './utils';


const articlesContainer = document.querySelector('.articles-container')

// La fonction ne va pas au meme rythme car elle attend des infos
const fecthArticles = async () => {

    
    const response = await fetch(API_URL)
    let articles = await response.json()

    // Map marche que sur un Array, ducoup on met l'unique element dans un array
    if(!(articles instanceof Array)) {
        articles = [articles]
    }

    createDOMArticles(articles)
    console.log(articles)
}


const createDOMArticles = (articles) => {

    // map(): Prend un array et le transfomr en nouveau array 
    // Si accolades => return (sinon fleche joue le role de return) (!)
    const articlesDOM = articles.map(article => {

        const articleNode = document.createElement('div')
        articleNode.classList.add('article')
        articleNode.innerHTML = 
        `
            <img src=${article.image.startsWith('http') ? article.image : "assets/images/default_profil.png"} alt="photo">
            <h2>${article.title}</h2>
            <p class="article-author">${article.author} - <span>${
                new Date(article.createdAt).toLocaleDateString('fr-FR')
            }</span></p>
            <p class="article-content">${article.content}</p>
            <div class="article-actions">
                <button class="btn btn-danger" data-id=${article._id}>Supprimer</button>
                <button class="btn btn-primary" data-id=${article._id}>Editer</button>
            </div>
        `
        return articleNode
    })

    articlesContainer.innerHTML = '' // évite cumul
    articlesContainer.append(...articlesDOM) // On 'explose' articlesDOM dans appendChild



    // Suppr boutons:
    const deleteButtons = articlesContainer.querySelectorAll('.btn-danger')

    deleteButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const idArticle = e.target.dataset.id

            // const response = await fetch(`${API_URL}/${idArticle}`,
            await fetch(`${API_URL}/${idArticle}`,
                {
                    method: "DELETE"
                }
            )
            fecthArticles()
        })
    });



    // Edit Buttons:
    const editButtons = articlesContainer.querySelectorAll('.btn-primary')

    editButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // On passe l'id en query-string dans l'URL
            const idArticle = e.target.dataset.id
            location.assign(`/form.html?id=${idArticle}`)
        })
    })
}



fecthArticles()