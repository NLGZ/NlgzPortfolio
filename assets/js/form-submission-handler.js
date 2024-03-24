(function() {
    function getFormData(form) {
        const elements = form.elements;
        let honeypot;
        const fields = Object.keys(elements).filter(k => {
            if (elements[k].name === "honeypot") {
                honeypot = elements[k].value;
                return false;
            }
            return true;
        }).map(k => elements[k].name || (elements[k].length > 0 ? elements[k].item(0).name : null))
          .filter((item, pos, self) => self.indexOf(item) == pos && item);

        const formData = {};
        fields.forEach(name => {
            const element = elements[name];
            if (element.length) {
                const data = [];
                for (const item of element) {
                    if (item.checked || item.selected) {
                        data.push(item.value);
                    }
                }
                formData[name] = data.join(', ');
            } else {
                formData[name] = element.value;
            }
        });

        formData.formDataNameOrder = JSON.stringify(fields);
        formData.formGoogleSheetName = form.dataset.sheet || "responses";
        formData.formGoogleSendEmail = form.dataset.email || "";

        return { data: formData, honeypot: honeypot };
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const { data, honeypot } = getFormData(form);

        if (honeypot) return false;

        disableAllButtons(form);
        const xhr = new XMLHttpRequest();
        xhr.open('POST', form.action);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                form.reset();
                const formElements = form.querySelector(".form-elements");
                if (formElements) formElements.style.display = "none";
                const thankYouMessage = form.querySelector(".thankyou_message");
                if (thankYouMessage) {
                    thankYouMessage.style.display = "block";
                    alert("메일 전송에 성공했습니다. 확인 후 회신드리겠습니다.");
                }
            }
        };

        const encoded = Object.keys(data).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`).join('&');
        xhr.send(encoded);
    }

    function loaded() {
        const forms = document.querySelectorAll("form.gform");
        for (const form of forms) {
            form.addEventListener("submit", handleFormSubmit, false);
        }
    }

    document.addEventListener("DOMContentLoaded", loaded);

    function disableAllButtons(form) {
        const buttons = form.querySelectorAll("button");
        for (const button of buttons) {
            button.disabled = true;
        }
    }
})();
