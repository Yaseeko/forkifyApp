import { async } from "regenerator-runtime";
import { API_URL, PAGE_RESULTS, KEY } from "./config.js";
import { getJSON, sendJSON } from "./helper.js";

export const state = {
  recipe: {},
  search: {
    request: "",
    result: [],
    page: 1,
    resultsPerPage: PAGE_RESULTS,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipeData = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some((b) => b.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearch = async function (request) {
  try {
    state.search.request = request;
    const data = await getJSON(`${API_URL}?search=${request}&key=${KEY}`);

    state.search.result = data.data.recipes.map((rec) => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const firstPage = (page - 1) * state.search.resultsPerPage;
  const lastPage = page * state.search.resultsPerPage;

  return state.search.result.slice(firstPage, lastPage);
};

export const updateServings = function (newServ) {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServ) / state.recipe.servings;
  });

  state.recipe.servings = newServ;
};

const saveBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBockmark = function (recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  saveBookmarks();
};

export const removeBookmark = function (id) {
  const index = state.bookmarks.findIndex((el) => el.id === id);
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;

  saveBookmarks();
};

const init = function () {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

export const saveRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map((ing) => {
        const ingArr = ing[1].split(",").map((el) => el.trim());

        if (ingArr.length !== 3)
          throw new Error("Please, use the correct format 😉");
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBockmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
//
