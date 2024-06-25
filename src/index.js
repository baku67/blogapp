import { openModal } from './assets/js/modal';
import './index.scss';
import { API_URL } from './utils';


const articlesContainer = document.querySelector('.articles-container')
const categoriesContainer = document.querySelector('.categories')
// Contexte global pour éviter pb de scope
let filter;
let articles = [];


// La fonction ne va pas au meme rythme car elle attend des infos
const fecthArticles = async () => {

    const response = await fetch(API_URL)
    articles = await response.json()

    // Map marche que sur un Array, ducoup on met l'unique element dans un array
    if(!(articles instanceof Array)) {
        articles = [articles]
    }

    createDOMArticles() // affichage initiale sans filtre
    console.log(articles)

    createMenuCategories()
}


// reduce() des categories à partir des articles
const createMenuCategories = () => {

    const categories = articles.reduce((acc, currArticle) => {
        if(acc[currArticle.category]) {
            acc[currArticle.category]++
        } else {
            acc[currArticle.category] = 1
        }
        return acc  // car accolades
    }, {})

    // const categoriesArray = Object.keys(categories).map(category => [category, categories[category]]) //
    const categoriesArray = Object.entries(categories)
    console.log(categoriesArray)

    displayMenuCategories(categoriesArray)
}


const displayMenuCategories = (categoriesArray) => {

    const liElements = categoriesArray.map( (categoryElement) => {

        const li = document.createElement('li')
        li.innerHTML = `${categoryElement[0]} <span>(${categoryElement[1]})</span>`

        li.addEventListener('click', (e) => {

            liElements.forEach((li) => {
                li.classList.remove('active')
            })

            if (filter === categoryElement[0]) {
                // la catégorie est déja selectionné, déselectionner
                filter = null;
            }
            else {
                // Pas de catégorie selectionnée, séléctionne
                li.classList.add('active')
                filter = categoryElement[0]
            }

            createDOMArticles() // recharger le DOM
        })
        return li
    })

    categoriesContainer.innerHTML = ""
    categoriesContainer.append( ... liElements) // spread operator: explose les elements de l'array à l'intérieur
}




const createDOMArticles = () => {

    // map(): Prend un array et le transfomr en nouveau array 
    // Si accolades => return (sinon fleche joue le role de return) (!)
    const articlesDOM = articles
    
        .filter(article => {
            if(filter) {
                return article.category === filter
            }
            else {
                return true // on filtre rien
            }
        })

        .map(article => {

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

            const answer = await openModal("Êtes-vous sûr de vouloir supprimer cet article ?")
            if(answer) {
                await fetch(`${API_URL}/${idArticle}`,
                    {
                        method: "DELETE"
                    }
                )
            }

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