export class ListItemContainer extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        console.log('the element is in the DOM');
    }    

    // disconnectedCallback() {
    //     console.log('the element is out the DOM');
    // }    
    
    // attributeChangedCallback(name, oldValue, newValue){
    //     console.log(name, oldValue, newValue);
    // }
}


customElements.define('list-item-container', ListItemContainer)