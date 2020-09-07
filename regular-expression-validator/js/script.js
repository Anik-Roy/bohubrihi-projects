//ui class
class UI {
    initializeUIElements() {
        let DOMbuttons = [...document.querySelectorAll('.checker')];
        DOMbuttons.forEach(button => {
            if(button.classList.contains('email')) {
                button.addEventListener('click', this.validateEmail);
            }
            else if(button.classList.contains('password')) {
                button.addEventListener('click', this.validatePostcode);
            }
            else if(button.classList.contains('phone')) {
                button.addEventListener('click', this.validatePhone);
            }
        });
    }
    validateEmail() {
        let reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let email = prompt('Enter email: ');

        let msg = '';
        if(reg.test(email)) {
            msg = email+': is valid email';
            let span = document.querySelector('.emailResult');
            let p = document.createElement('p');
            p.innerText = msg;
            p.style.color = 'green';
            p.style.display = 'inline';

            if(span.hasChildNodes()) {
                span.removeChild(span.firstChild);
            }
            span.appendChild(p);
        } else {
            msg = email+': is not valid email';
            let span = document.querySelector('.emailResult');
            let p = document.createElement('p');
            p.innerText = msg;
            p.style.color = 'red';
            p.style.display = 'inline';

            if(span.hasChildNodes()) {
                span.removeChild(span.firstChild);
            }
            span.appendChild(p);
        }
    }
    validatePostcode() {
        let reg = /^[0-9]{4}/
        let postcode = prompt('Enter post code: ');
        let msg = '';
        if(reg.test(postcode)) {
            msg = postcode+': is valid post code';
            let span = document.querySelector('.postcodeResult');
            let p = document.createElement('p');
            p.innerText = msg;
            p.style.color = 'green';
            p.style.display = 'inline';

            if(span.hasChildNodes()) {
                span.removeChild(span.firstChild);
            }
            span.appendChild(p);
        } else {
            msg = postcode+': is not valid postcode';
            let span = document.querySelector('.postcodeResult');
            let p = document.createElement('p');
            p.innerText = msg;
            p.style.color = 'red';
            p.style.display = 'inline';

            if(span.hasChildNodes()) {
                span.removeChild(span.firstChild);
            }
            span.appendChild(p);
        }
    }
    validatePhone() {
        let reg = /^(\+)?(88)?01[0-9]{9}$/;
        let phone = prompt('Enter phone: ');
        let msg = '';
        if(reg.test(phone)) {
            msg = phone+': is valid phone number';
            let span = document.querySelector('.phoneResult');
            let p = document.createElement('p');
            p.innerText = msg;
            p.style.color = 'green';
            p.style.display = 'inline';

            if(span.hasChildNodes()) {
                span.removeChild(span.firstChild);
            }
            span.appendChild(p);
        } else {
            msg = phone+': is not valid phone number';
            let span = document.querySelector('.phoneResult');
            let p = document.createElement('p');
            p.innerText = msg;
            p.style.color = 'red';
            p.style.display = 'inline';

            if(span.hasChildNodes()) {
                span.removeChild(span.firstChild);
            }
            span.appendChild(p);
            
        }
    }
}
document.addEventListener("DOMContentLoaded", ()=>{
    let ui = new UI();
    ui.initializeUIElements();
});