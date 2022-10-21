function checkBox() {
    const inputs = document.getElementsByTagName("input");

    for (let index = 0; index < inputs.length; index++) {
        const input = inputs[index];

        if (input.type === "checkbox") {
            input.addEventListener("change", () => {
                console.log(input.checked)

                if (input.checked) input.value = true;
                else input.value = false;
            });
        }
    }
}

checkBox();