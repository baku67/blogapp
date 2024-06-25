const body = document.body
let calc;
let modal;

let cancelBtn;
let confirmBtn;


export function openModal(question) {
    createCalc()
    createModal(question)
    calc.append(modal)
    body.append(calc)

    // Fonction "executrice" avec 2 fonctions: si reussi ou echec
    return new Promise((resolve, reject) => {
        calc.addEventListener('click', () => {
            resolve(false)
            calc.remove()
        })

        cancelBtn.addEventListener('click', () => {
            resolve(false)
            calc.remove()
        })

        confirmBtn.addEventListener('click', () => {
            resolve(true)
            calc.remove()
        })
    })
}


function createCalc() {
    calc = document.createElement('div')
    calc.classList.add('calc')
}

function createModal(question) {
    modal = document.createElement('div')
    modal.classList.add('modal')
    modal.innerHTML = `<p>${question}</p>`

    cancelBtn = document.createElement('button')
    cancelBtn.classList.add('btn', 'btn-secondary')
    cancelBtn.innerText = 'Annuler'

    confirmBtn = document.createElement('button')
    confirmBtn.classList.add('btn', 'btn-danger')
    confirmBtn.innerText = 'Confirmer'

    // Stop propagation
    modal.addEventListener('click', (e) => {
        e.stopPropagation()
    })

    modal.append(cancelBtn, confirmBtn)
}

