"use strict";

import * as model from "./model.js";
import { MODAL_CLOSE_SEC } from "./config.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";

import "core-js/stable";
import "regenerator-runtime/runtime";
import { async } from "regenerator-runtime";

if (module.hot) {
  module.hot.accept();
}

// const recipeContainer = document.querySelector(".recipe");

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const renderRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.showSpinner();

    resultsView.update(model.getSearchResultsPage());

    await model.loadRecipeData(id);
    recipeView.render(model.state.recipe);
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
  }
};

const giveSearchResults = async function () {
  try {
    resultsView.showSpinner();
    const request = searchView.getRequest();
    if (!request) return;
    await model.loadSearch(request);
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const switchPages = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

const changeServings = function (newServing) {
  model.updateServings(newServing);

  recipeView.update(model.state.recipe);
};

const createBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBockmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
};

const bookmarksSaved = function () {
  bookmarksView.render(model.state.bookmarks);
};

const submitAddRecipe = async function (newRecData) {
  try {
    addRecipeView.showSpinner();

    await model.saveRecipe(newRecData);

    recipeView.render(model.state.recipe);
    addRecipeView.renderMessage();
    bookmarksView.render(model.state.bookmarks);

    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    setTimeout(function () {
      addRecipeView._windowToggle();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(bookmarksSaved);
  recipeView.addHandlerRender(renderRecipes);
  recipeView.addHandlerUpdateServings(changeServings);
  recipeView.addHandlerAddBookmark(createBookmark);
  searchView.addHandlerSearch(giveSearchResults);
  paginationView.addHandlerClick(switchPages);
  addRecipeView.addHandlerUpload(submitAddRecipe);
};
init();
