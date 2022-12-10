const inputs = document.querySelectorAll('input, select, textarea');
const form = document.querySelector('form');
const toastElement =document.querySelector('#liveToast');
const toast = new bootstrap.Toast(toastElement, {
    delay: 5000
});

form.addEventListener('submit', event => {
    event.preventDefault();
    form.reset();
    formElements= form.elements;
    for (const element of form.elements) {
        if (element.type != 'submit') {
            element.classList.remove("is-valid");
            const helpText = document.querySelector(`#${element.id}Help`);
            helpText.classList.remove("text-success");
        }
    }
    toast.show()
    console.log("implement and toaster")  ;  
})

handleValidation();


function handleValidation() {
    for (let i = 0; i < inputs.length; i++) {
        const element = inputs[i];
        let message ="";
        let tooltip = null;
        element.addEventListener('invalid', (e) => {
            e.preventDefault();

            const helpText = document.querySelector(`#${e.target.id}Help`);
            helpText.classList.add("text-danger");
            e.target.classList.add( "is-invalid");
    
            
            if (e.target.validity.valueMissing) {         
                message ="Champ obligatoire";
            } else if (e.target.value < e.target.min && e.target.type === "number"){
                message ="Doit être positif";
            } else if (e.target.type === "date") {
                message ="Doit être égale ou supérieure à aujourd'hui";
            }

            tooltip = createTooltip(element, message);
            let firstInvalid = form.querySelector(':invalid');
            
            console.log(firstInvalid);
            if (element === firstInvalid) {
               tooltip.show();
               element.focus()
            } 
        });
        
        element.addEventListener('change', (e) => {
            element.checkValidity();
            if (element.validity) {
                const helpText = document.querySelector(`#${element.id}Help`);
                helpText.classList.remove("text-danger");
                helpText.classList.add("text-success");
                element.classList.remove("is-invalid");
                element.classList.add("is-valid");
                if (tooltip != null) {
                    const tooltips =document.querySelectorAll(".tooltip");
                    tooltips.forEach(element => {
                        element.remove();
                    });
                    tooltip.dispose();
                } 
            }
        })
    }
}

function createTooltip(element, message) {

    return (new bootstrap.Tooltip(element, {
        title : message,
        placement : "bottom",
        trigger: "manual"
    }));
}