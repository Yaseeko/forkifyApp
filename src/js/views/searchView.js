class SearchView {
  _parentEl = document.querySelector(".search");

  getRequest() {
    const request = this._parentEl.querySelector(".search__field").value;
    this._clearInput();
    return request;
  }

  _clearInput() {
    this._parentEl.querySelector(".search__field").value = "";
  }

  addHandlerSearch(handler) {
    this._parentEl.addEventListener("submit", function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
