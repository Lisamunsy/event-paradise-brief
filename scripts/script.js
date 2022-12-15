const inputs = document.querySelectorAll('input, select, textarea');
const form = document.querySelector('form');
const toast = bootstrap.Toast.getOrCreateInstance('#liveToast', {
    delay: 2500
});


for (let i = 0; i < inputs.length; i++) {
    const element = inputs[i];
    const helpText = document.querySelector(`#${element.id}Help`);
    let message =selectTooltipMessage(element);
    let tooltip = createTooltip(element, message);
    tooltip.disable();

    element.addEventListener('invalid', (e) => {
        e.preventDefault();
        enableTooltip(tooltip,element, helpText)
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
            enableTooltip(tooltip,element, helpText)
            message =selectTooltipMessage(element);
            tooltip.setContent({'.tooltip-inner': message})
            tooltip.show();
        }
    })
}

function handleInputsStyle(element, classToRemove, classtoAdd ){
    element.classList.remove(classToRemove);
    element.classList.add(classtoAdd);
}

// ------------------------------ Tooltip functions

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

function enableTooltip(tooltip, element, helpText) {
    handleInputsStyle(helpText, "text-success", "text-danger")
    handleInputsStyle(element, "is-valid", "is-invalid");
    tooltip.enable();
}

// ------------------------------ Submit event

form.addEventListener('submit', event => {
    event.preventDefault();
    // Vider les champs
    form.reset();
    for (const element of form.elements) {
        // Enlever les styles de validation
        if (element.type != 'submit') {
            element.classList.remove("is-valid");
            const helpText = document.querySelector(`#${element.id}Help`);
            helpText.classList.remove("text-success");
        }
    }
    toast.show()
})