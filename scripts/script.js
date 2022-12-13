const inputs = document.querySelectorAll('input, select, textarea');
const form = document.querySelector('form');
const toastElement =document.querySelector('#liveToast');
const toast = new bootstrap.Toast(toastElement, {
    delay: 5000
});

for (let i = 0; i < inputs.length; i++) {
    const element = inputs[i];
    const helpText = document.querySelector(`#${element.id}Help`);
    let message ="";
    let tooltip = null;

    element.addEventListener('invalid', (e) => {
        e.preventDefault();
        helpText.classList.add("text-danger");
        element.classList.add( "is-invalid");
        const firstInvalid = form.querySelector(':invalid');
        message =selectTooltipMessage(element);
        element.setAttribute("title", message);
        tooltip = createTooltip(element, message);
        if (element === firstInvalid) {
            element.focus();
        } 
    });
    
    element.addEventListener('change', (e) => {
        const validity =element.checkValidity();
        const tooltips =document.querySelectorAll(".tooltip");
        tooltips.forEach(element => {
            element.remove();
        });
        if (validity) {
            helpText.classList.remove("text-danger");
            helpText.classList.add("text-success");
            element.classList.remove("is-invalid");
            element.classList.add("is-valid");
        } else{
            element.classList.remove("is-valid");
            element.classList.add("is-invalid");
            tooltip.show()
            element.focus()
        }
    })
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
    let position = "bottom";
    if(element.tagName === "SELECT"){
        position ="top";
    }
    return (new bootstrap.Tooltip(element, {
        title : message,
        placement : position,
        trigger: "focus"
    }));
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
    const data= {
        name : inputs[0].value,
        date: inputs[1].value+"T21:34:55",
        location : inputs[2].value,
        theme : inputs[3].value,
        rate: inputs[4].value,
        description : inputs[5].value
    };
    if (data != null) {
        options.body = JSON.stringify(data);
    }
    fetch(url, options).then((response)=> {

        const headers = response.headers;
        if (headers.get("Content-Type") == "application/json") {
            return  response.json(); //  json string;
        }
    }).then(()=>{  
        form.reset();
        formElements= form.elements;
        for (const element of form.elements) {
            if (element.type != 'submit') {
                element.classList.remove("is-valid");
                const helpText = document.querySelector(`#${element.id}Help`);
                helpText.classList.remove("text-success");
            }
        }
        toast.show();
    }).catch((error)=>{
        console.warn('Something went wrong.', error);
    })
})