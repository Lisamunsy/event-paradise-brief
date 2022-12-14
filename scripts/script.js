const inputs = document.querySelectorAll('input, select, textarea');
const form = document.querySelector('form');

for (let i = 0; i < inputs.length; i++) {
    const element = inputs[i];
    const helpText = document.querySelector(`#${element.id}Help`);
    let message ="";
    let tooltip = null;
    message =selectTooltipMessage(element);
    tooltip = createTooltip(element, message);
    tooltip.disable();

    element.addEventListener('invalid', (e) => {
        e.preventDefault();
        helpText.classList.add("text-danger");
        element.classList.add( "is-invalid");
        tooltip.enable()
        const firstInvalid = form.querySelector(':invalid');
        if (element === firstInvalid ) {
            element.focus();
        } 
    });
    
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