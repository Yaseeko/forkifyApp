import icons from "url:../../img/icons.svg";

import previewView from "./previewView.js";
import View from "./View.js";

class BookmarksView extends View {
  _parentEl = document.querySelector(".bookmarks__list");
  _errMessage = "No bookmarks yet. Find a nice recipe and book it😉";
  _message = "";

  addHandlerRender(handler) {
    window.addEventListener("load", handler);
  }
  _generateHTML() {
    return this._data
      .map((result) => previewView.render(result, false))
      .join("");
  }
}

export default new BookmarksView();
