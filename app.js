

document.addEventListener('DOMContentLoaded', function() {
    customElements.define('hello-world', helloWord);
  });


class helloWord extends HTMLElement{
    constructor(){
        super();
        this.innerHTML= "<h1>HOLA MUNDO DESDE COMPONENTE</h1>"
    }
}


