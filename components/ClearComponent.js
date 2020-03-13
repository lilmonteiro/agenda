export class ClearComponent extends HTMLElement {
    constructor() {
        super();
        console.log("hei")
    }

    connectedCallback() {
        console.log('the element is in the DOM');
    }    

    disconnectedCallback() {
        console.log('the element is out the DOM');
    }    
    
    attributeChangedCallback(name, oldValue, newValue){
        console.log(name, oldValue, newValue);
    }
}


customElements.define('clear-component', ClearComponent)