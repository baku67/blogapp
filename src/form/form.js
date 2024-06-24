import './form.scss';
import { API_URL } from '../utils';

const form = document.querySelector('form')
const errorList = document.getElementById('errors')



// async est la fonction qui contient le await
form.addEventListener('submit', async (event) => {

    event.preventDefault()

    const formData = new FormData(form)
    const entries = formData.entries()

    const article = Object.fromEntries(entries)
    console.log(article)

    if(formIsValid(article)) {

        const json = JSON.stringify(article)

        // Lors du survol sur fetch() on voit <promesse> donc il faut mettre await
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: json,
        })


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