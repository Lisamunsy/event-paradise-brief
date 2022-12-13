const inputs = document.querySelectorAll('input, select, textarea');
const form = document.querySelector('form');

for (let i = 0; i < inputs.length; i++) {
    const element = inputs[i];
    const helpText = document.querySelector(`#${element.id}Help`);
    let message ="";
    let tooltip = null;

    element.addEventListener('invalid', (e) => {
        e.preventDefault();
        helpText.classList.add("text-danger");
        element.classList.add( "is-invalid");
        message =selectTooltipMessage(element);
        tooltip = createTooltip(element, message);
        const firstInvalid = form.querySelector(':invalid');
        if (element === firstInvalid ) {
            element.focus();
        } 
    });
    
    element.addEventListener('change', (e) => {
        const validity =element.checkValidity();
        if (validity) {
            helpText.classList.remove("text-danger");
            helpText.classList.add("text-success");
            element.classList.remove("is-invalid");
            element.classList.add("is-valid");
            if (tooltip != null) {
                tooltip.disable();
            }
        } else if(!validity){
            if(tooltip != null){
                tooltip.enable();
                message =selectTooltipMessage(element);
                tooltip.setContent({'.tooltip-inner': message})
                tooltip.show();
            }
            element.focus();
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
    const tooltipTest = bootstrap.Tooltip.getOrCreateInstance(element, {
        title : message,
        placement : "top"
    });
    return tooltipTest;
}

form.addEventListener('submit', event => {
    event.preventDefault();
    form.reset();
    formElements= form.elements;
    for (const element of form.elements) {
        if (element.type != 'submit') {
            element.classList.remove("is-valid");
            helpText.classList.remove("text-success");
            const helpText = document.querySelector(`#${element.id}Help`);
        }
    }
    const toast = bootstrap.Toast.getOrCreateInstance('#liveToast', {
        delay: 2500
    });
    toast.show()
})