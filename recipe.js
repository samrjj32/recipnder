const apikey = '9041fdff59e7495ba9ae0d5607683c20'; 
const result = document.querySelector("#results");
const form = document.querySelector("form");

// Cleaning user input and then making request to the API
async function getRecipe(value) {
  result.innerHTML = `<h4>Loading...</h4>`;

  const valueArray = value.split(",");
  const trimmedArray = valueArray.map((ingredient) => ingredient.trim());
  const newValue = trimmedArray.join(",");

  const url = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${apikey}&ingredients=${newValue}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    result.innerHTML = `<h4 style="color:red;"> An error occurred. Please try again later. </h4>`;
    console.error('Error fetching data:', error);
  }
}

// Display API return value
function showRecipe(dataPromise) {
  dataPromise.then((data) => {
    const result = document.getElementById('results');
    if (data.length === 0) {
      result.innerHTML = `<h4 style="color:red;"> No match found in our database </h4>`;
      return;
    }

    let html = '<div class="card-container d-flex flex-wrap">';
    data.forEach((recipe) => {
      html += `
        <div class="card mb-3" style="max-width: 18rem;" data-toggle="modal" data-target="#recipeModal" data-recipe-id="${recipe.id}">
          <img src="${recipe.image}" class="card-img-top" alt="Recipe Image">
          <div class="card-body">
            <h5 class="card-title">${recipe.title}</h5>
          </div>
        </div>`;
    });
    html += '</div>';
    result.innerHTML = html;

    // Event listener for each card
    const cards = document.querySelectorAll('.card');
    cards.forEach((card) => {
      card.addEventListener('click', function() {
        const recipeId = this.getAttribute('data-recipe-id');
        console.log("clickkk11",recipeId)

        const selectedRecipe = data.find(recipe => recipe.id == recipeId);
        displayRecipeDetails(selectedRecipe);
      });
    });
  });
}

// Function to display recipe details in modal
function displayRecipeDetails(recipe) {
  console.log(recipe,"kkk")
  const modalTitle = document.getElementById('recipeModalTitle');
  const modalBody = document.getElementById('recipeModalBody');

  if (!modalTitle || !modalBody) {
    console.error('Modal elements not found');
    return;
  }

  modalTitle.textContent = recipe.title;
  modalBody.innerHTML = `
    <img src="${recipe.image}" class="card-img-top" alt="Recipe Image">
    <p><strong>Ingredients:</strong></p>
    <ul>
      ${recipe.usedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join('')}
      ${recipe.missedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join('')}
    </ul>`;
}

// Check for form submission
form.addEventListener("submit", function (event) {
  event.preventDefault();
  const search = document.getElementById("input").value.toLowerCase();
  const dataPromise = getRecipe(search);
  showRecipe(dataPromise);
});