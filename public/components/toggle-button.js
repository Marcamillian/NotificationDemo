const template = document.createElement('template');
template.innerHTML=`
<style>
  :host{
    height:50px;
    width:100px;
  }

  input[type=checkbox]{
    display:none;
  }

  input[type="checkbox"]:checked+label .slide-nub{
    left:50%;
    background-color:goldenrod;
  }

  .slide-container, .slide-nub{
    border-radius: 50px;
  }

  .slide-container{
    display:inline-block;
    height:inherit;
    width:inherit;
    background-color: grey;
    border:2px solid lightblue;
  }

  .slide-nub{
    position: relative;
    background-color: #a9a9a9;
    height:100%;
    width:50%;
    left:0%;

    transition: left 1s ease, background-color 1s ease-out;
  }
</style>

<input type="checkbox">
<label class="slide-container">
    <div class="slide-nub"></div>
</label>

`

export default class ToggleButton extends HTMLElement{
  constructor(){
    super();
    
    this.tabIndex = 1;
    this.addEventListener('click',  this.clickHandler.bind(this))
    this.addEventListener('keydown', this.keyboardHandler.bind(this))
  }

  /*
  render(){

  }
  */

  connectedCallback(){
    let shadowRoot = this.attachShadow({mode:'open'});

    let instance = template.content.cloneNode(true);
    this.shadowRoot.appendChild(instance)

  }

  toggleButton(){
    let checkbox = this.shadowRoot.querySelector('input[type="checkbox"]')
    checkbox.checked = !checkbox.checked
  }

  clickHandler(event){
    event.preventDefault()
    this.toggleButton()
  }

  getState(){
    return this.shadowRoot.querySelector('input[type="checkbox"]').checked
  }

  setState(isChecked){
    this.shadowRoot.querySelector('input[type="checkbox"]').checked = isChecked;
  }

  keyboardHandler(event){
    
    switch(event.keyCode){
      case 13:
        event.preventDefault();
        this.toggleButton()
      break;
      default:
        console.log(event.keyCode)
      break;
    }
  }

}