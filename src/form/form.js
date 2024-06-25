
import './form.scss';
import { API_URL } from '../utils';
import { openModal } from '../assets/js/modal';

const form = document.querySelector('form')
const errorList = document.getElementById('errors')

const cancelButton = document.querySelector('.btn-secondary')
// cancelButton.addEventListener('click', () => location.assign('/') )

// idArticle déclarée dans le contexte global
let idArticle;



// *** EDIT
const initForm = async () => {

    // Récupération de l'id article dans l'URL si edit
    const params = new URL(location.href)
    console.log(params)
    // searchParams = lazyObject (il donne rien tant qu'on demande pas)
    idArticle = params.searchParams.get('id')

    if(idArticle) {
        const response = await fetch(`${API_URL}/${idArticle}`)
        const article = await response.json()
        fillForm(article)
        console.log(article)
    }
}
initForm()

const fillForm = (article) => {
    const formFields = form.querySelectorAll('input, select, textarea')
    // juste besoin de 'name' et 'value':
    console.log(formFields)
    formFields.forEach((field) => {
        field.value = article[field.name]    
    })
}


cancelButton.addEventListener('click', async () => {

    const answer = await openModal("Voulez-vous vraiment annuler ?")
    if(answer) {
        location.assign('/')
    }

})


// *** ADD ou EDIT
// async est la fonction qui contient le await
form.addEventListener('submit', async (event) => {

    event.preventDefault()

    const formData = new FormData(form)
    const entries = formData.entries()

    const article = Object.fromEntries(entries)
    console.log(article)

    if(formIsValid(article)) {

        const json = JSON.stringify(article)
        let response

        if(idArticle) {
            // Lors du survol sur fetch() on voit <promesse> donc il faut mettre await
            response = await fetch(`${API_URL}/${idArticle}`, {
                method: "PUT", // ou PATCH pour modifier juste les données qui changent
                headers: {'Content-Type': 'application/json'},
                body: json,
            })
        } else {
            // Lors du survol sur fetch() on voit <promesse> donc il faut mettre await
            response = await fetch(API_URL, {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: json,
            })
        }


        // await car json = <Promise>
        const body = await response.json();
        console.log(body)

        
        // redirect accueil après si success
        if(response.status < 300) {
            location.assign('/')
        }
    }
})




const formIsValid = (article) => {

    let errors = []

    if(!article.author || !article.title || !article.image || !article.content) {
        errors.push('Vous devez renseigner tout les champs')
    }

    if(article.title.length < 5 || article.content.length < 5) {
        errors.push('Les titre/contenu doivent faire plus de 5 caractères')
    }

    if(errors.length) {

        let errorHtml = ''

        errors.forEach(error => {
            errorHtml += `<li>${error}</li>`
        })

        // rempli la liste d'erreur et renvoi le bool de validation
        errorList.innerHTML = errorHtml
        return false
    }
    // else {
        // rempli la liste d'erreur et renvoi le bool de validation
        errorList.innerHTML = ''
        return true
    // }
}