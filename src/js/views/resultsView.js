import icons from "url:../../img/icons.svg";

import previewView from "./previewView.js";
import View from "./View.js";

class ResultsView extends View {
  _parentEl = document.querySelector(".results");
  _errMessage = "No recepies from your request... Please, try another one🥺";
  _message = "";

  _generateHTML() {
    return this._data
      .map((result) => previewView.render(result, false))
      .join("");
  }
}

export default new ResultsView();
