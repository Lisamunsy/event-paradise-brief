// Fill the select options
const locationUrl ="http://localhost:8080/locations";
const locationSelect = document.querySelector('#location');
const themeSelect = document.querySelector('#theme');
const themeUrl ="http://localhost:8080/themes";
const optionsGET ={
    method : "GET"
}

window.onload=(e)=>{
    getSelectOptions(locationUrl, locationSelect);
    getSelectOptions(themeUrl, themeSelect);
}

function getSelectOptions(url, selectElement) {
    fetch(url, optionsGET).then((response)=>{
        return response.json();
    }).then((data)=>{
        for (const optiondata of data) {
            const option = document.createElement('option');
            option.value = `${optiondata.id}`;
            option.text =`${optiondata.name}`;
            selectElement.add(option, null)
        }
    }
    ).catch((error)=>{
        console.warn('Something went wrong.', error);
    })
}

// Handle client-side validation

const form = document.querySelector('form');
const inputs = document.querySelectorAll('input, select, textarea');
const toastElement =document.querySelector('#liveToast');
const toast = new bootstrap.Toast(toastElement, {
    delay: 5000
});

for (let i = 0; i < inputs.length; i++) {
    const element = inputs[i];
    const helpText = document.querySelector(`#${element.id}Help`);
    let message =selectTooltipMessage(element);
    let tooltip = createTooltip(element, message);
    tooltip.disable();

    // Gérer le comportement lorsqu'un champ devient invalide
    element.addEventListener('invalid', (e) => {
        e.preventDefault();
        helpText.classList.add("text-danger");
        element.classList.add( "is-invalid");
        tooltip.enable()
        // Afficher seulement le premier champ invalide
        const firstInvalid = form.querySelector(':invalid');
        if (element === firstInvalid ) {
            element.focus();
        } 
    });
    
    // Gérer le comportement lorsqu'on change un champ
    element.addEventListener('change', () => {
        if (element.validity.valid) {
            handleInputsStyle(helpText, "text-danger", "text-success")
            handleInputsStyle(element, "is-invalid", "is-valid");
            if (tooltip != null) {
                tooltip.hide()
                tooltip.disable();
            }
        } else {
            handleInputsStyle(helpText, "text-success", "text-danger")
            handleInputsStyle(element, "is-valid", "is-invalid");
            message =selectTooltipMessage(element);
            tooltip.setContent({'.tooltip-inner': message})
            tooltip.enable();
            tooltip.show();
        }
    })
}

function handleInputsStyle(element, classToRemove, classtoAdd ){
    element.classList.remove(classToRemove);
    element.classList.add(classtoAdd);
}

function selectTooltipMessage(element ){
    if (element.validity.valueMissing) {         
        return "Champ obligatoire";
    } else if (element.validity.rangeUnderflow && element.type === "number"){
        return "Doit être positif";
    } else if (element.type === "date") {
        return "Doit être égale ou supérieure à aujourd'hui";
    }
}

function createTooltip(element, message) {
    const newTooltip = bootstrap.Tooltip.getOrCreateInstance(element, {
        title : message,
        placement : "top"
    });
    return newTooltip;
}

form.addEventListener('submit', event => {
    event.preventDefault();
    const url="http://localhost:8080/events";
    const options ={
        method : "POST",
        headers : {
            "Content-Type": "application/json",
        }
    }
    // Récuperer les données du formulaire
    const data= {};
    for (let i = 0; i < inputs.length; i++) {
        data[inputs[i].name] = inputs[i].value;
    }
    options.body = JSON.stringify(data);

    fetch(url, options).then((response)=> {
        const headers = response.headers;
        // Vérifier si il a une réponse. Si il y a une réponse, c'est qu'il y a une erreure côté serveur
        if (headers.get("Content-Type") == "application/json") {
            // Déclancher la validation
            form.checkValidity()
            return  response.json(); //  json string;
        } else {
            form.reset();
            for (const element of form.elements) {
                if (element.type != 'submit') {
                    element.classList.remove("is-valid");
                    const helpText = document.querySelector(`#${element.id}Help`);
                    helpText.classList.remove("text-success");
                }
            }
            toast.show();
        }
    }).catch((error)=>{
        console.error('Il y a eu une erreur lors de la soumission du formulaire',error);
    })
})
