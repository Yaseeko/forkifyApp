import View from "./View.js";
import icons from "url:../../img/icons.svg";

class AddRecipeView extends View {
  _parentEl = document.querySelector(".upload");
  _message = "Recipe saved🥳";
  _window = document.querySelector(".add-recipe-window");
  _overlay = document.querySelector(".overlay");
  _btnOpen = document.querySelector(".nav__btn--add-recipe");
  _btnClose = document.querySelector(".btn--close-modal");

  constructor() {
    super();
    this._addHandlerDisplayWindow();
    this._addHandlerHideWindow();
  }

  _windowToggle() {
    this._overlay.classList.toggle("hidden");
    this._window.classList.toggle("hidden");
  }

  _addHandlerDisplayWindow() {
    this._btnOpen.addEventListener("click", this._windowToggle.bind(this));
  }
  _addHandlerHideWindow() {
    this._btnClose.addEventListener("click", this._windowToggle.bind(this));
    this._overlay.addEventListener("click", this._windowToggle.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentEl.addEventListener("submit", function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  _generateHTML() {}
}

export default new AddRecipeView();
