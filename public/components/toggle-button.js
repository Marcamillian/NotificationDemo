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
    background-color: goldenrod;
    height:100%;
    width:50%;
    left:0%;

    transition: left 1s ease;
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

    this.addEventListener('click', this.clickHandler.bind(this))
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

  clickHandler(event){
    event.preventDefault()
    console.log("Button has been clicked")
    let checkbox = this.shadowRoot.querySelector('input[type="checkbox"]')

    // toggle checked
    checkbox.checked = !checkbox.checked
  }

}