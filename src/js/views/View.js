import icons from "url:../../img/icons.svg";

export default class View {
  _data;
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const recipeHTML = this._generateHTML();

    if (!render) return recipeHTML;

    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", recipeHTML);
  }

  showSpinner = function () {
    const spinnerHTML = `
        <div class="spinner">
                <svg>
                  <use href="${icons}.svg#icon-loader"></use>
                </svg>
              </div>
        `;
    this._parentEl.innerHTML = "";
    this._parentEl.insertAdjacentHTML("afterbegin", spinnerHTML);
  };

  update(data) {
    this._data = data;
    const newHTML = this._generateHTML();

    const newDOM = document.createRange().createContextualFragment(newHTML);
    const newEl = Array.from(newDOM.querySelectorAll("*"));
    const curEl = Array.from(this._parentEl.querySelectorAll("*"));

    newEl.forEach((El, i) => {
      const currentEl = curEl[i];

      if (
        !El.isEqualNode(currentEl) &&
        El.firstChild?.nodeValue.trim() !== ""
      ) {
        currentEl.textContent = El.textContent;
      }

      if (!El.isEqualNode(currentEl))
        Array.from(El.attributes).forEach((attr) =>
          currentEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  renderError(message = this._errMessage) {
    const errHTML = `
        <div class="error">
                <div>
                  <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                  </svg>
                </div>
                <p>${message}</p>
              </div>
        `;
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", errHTML);
  }

  renderMessage(message = this._message) {
    const html = `
    <div class="message">
                    <div>
                      <svg>
                        <use href="${icons}#icon-smile"></use>
                      </svg>
                    </div>
                    <p>
                      ${message}
                    </p>
                  </div>
    `;
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", html);
  }
  _clear() {
    this._parentEl.innerHTML = "";
  }
}
