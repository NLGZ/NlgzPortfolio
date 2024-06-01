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

var modal1 = document.getElementById("onezip");
var btn1 = document.getElementById("onezipModal");
var span1 = modal1.querySelector(".close");  // 변경: 모달 내부에서만 닫기 버튼을 선택

btn1.onclick = function(event) {
  event.preventDefault();
  modal1.style.display = "block";
}

span1.onclick = function() {
  modal1.style.display = "none";
}

var modal2 = document.getElementById("dawumi");
var btn2 = document.getElementById("dawumiModal");
var span2 = modal2.querySelector(".close");  // 변경: 모달 내부에서만 닫기 버튼을 선택

btn2.onclick = function(event) {
  event.preventDefault();
  modal2.style.display = "block";
}

span2.onclick = function() {
  modal2.style.display = "none";
}

window.onclick = function(event) {
  // 변경: 두 모달 중 열려 있는 모달을 검사하고 닫습니다.
  if (event.target == modal1) {
    modal1.style.display = "none";
  } else if (event.target == modal2) {
    modal2.style.display = "none";
  }
}
