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

        message = selectTooltipMessage(element)
        tooltip = createTooltip(element, message);
        const firstInvalid = form.querySelector(':invalid');

        if (element === firstInvalid) {
            tooltip.show();
            element.focus()
        } 
    });
    
    element.addEventListener('change', (e) => {
        element.checkValidity();
        if (element.validity) {
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

function selectTooltipMessage(element ){
    if (element.validity.valueMissing) {         
        return "Champ obligatoire";
    } else if (element.value < element.min && element.type === "number"){
        return "Doit être positif";
    } else if (element.type === "date") {
        return "Doit être égale ou supérieure à aujourd'hui";
    }
}

function createTooltip(element, message) {

    return (new bootstrap.Tooltip(element, {
        title : message,
        placement : "bottom",
        trigger: "manual"
    }));
}

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
})