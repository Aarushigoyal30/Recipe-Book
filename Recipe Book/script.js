const search = document.querySelector(".search");
const searchBtn = document.querySelector(".searchBtn");
const recipeContainer = document.querySelector(".recipe-container");
const filter = document.querySelector(".filter");

const popup = document.querySelector(".recipe-popup");
const popupContent = document.querySelector(".recipe-details-content");
const closeBtn = document.querySelector(".close-btn");

closeBtn.addEventListener("click", () => {
  popup.style.display = "none";
});

const isVegCategory = (category) => {
  const vegCategories = ["Vegetarian", "Vegan"];
  return vegCategories.includes(category);
};

const fetchRecipes = async (query) => {
  const bgImage = document.querySelector(".fullscreen-image");
  if (bgImage) bgImage.remove();

  document.querySelector("main").style.backgroundImage = "none";
  recipeContainer.innerHTML = "";

  const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
  const response = await data.json();

  if (!response.meals) {
    recipeContainer.innerHTML = `<h2>No recipes found for "${query}".</h2>`;
    return;
  }

  const selectedFilter = filter.value;

  const filteredMeals = response.meals.filter(meal => {
    if (selectedFilter === "veg") return isVegCategory(meal.strCategory);
    if (selectedFilter === "nonveg") return !isVegCategory(meal.strCategory);
    return true;
  });

  if (filteredMeals.length === 0) {
    recipeContainer.innerHTML = `<h2>No ${selectedFilter} recipes found for "${query}".</h2>`;
    return;
  }

  filteredMeals.forEach(meal => {
    const recipeDiv = document.createElement('div');
    recipeDiv.classList.add('recipe');
    recipeDiv.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <h3>${meal.strMeal}</h3>
      <p><span>${meal.strArea}</span> Dish</p>
      <p>Belongs to <span>${meal.strCategory}</span> Category</p>
      <button class="view-btn">View Recipe</button>
    `;

    const viewBtn = recipeDiv.querySelector(".view-btn");
    viewBtn.addEventListener("click", () => {
      let ingredients = '';
      for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients += `<li>${ingredient} - ${measure}</li>`;
  }
}

popupContent.innerHTML = `
  <h2>${meal.strMeal}</h2>
  <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="width: 100%; border-radius: 10px; margin: 15px 0;" />
  <p><strong>Category:</strong> ${meal.strCategory}</p>
  <p><strong>Area:</strong> ${meal.strArea}</p>
  <h3>Ingredients:</h3>
  <ul style="padding-left: 20px;">${ingredients}</ul>
  <h3>Instructions:</h3>
  <p>${meal.strInstructions}</p>
`;

      popup.style.display = "flex";
    });

    recipeContainer.appendChild(recipeDiv);
  });
};

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const searchInput = search.value.trim();
  if (searchInput) {
    fetchRecipes(searchInput);
  }
});
