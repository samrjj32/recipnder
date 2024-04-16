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
        <div class="card  mb-3" style="max-width: 18rem;" data-toggle="modal" data-target="#recipeModal" data-recipe-id="${recipe.id}">
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
  getFetchRecipeInstructions(recipe?.id)
  const modalTitle = document.getElementById('recipeModalTitle');
  const modalBody = document.getElementById('recipeModalBody');

  if (!modalTitle || !modalBody) {
    console.error('Modal elements not found');
    return;
  }

  modalTitle.textContent = recipe.title;
  modalBody.innerHTML = `
    <img src="${recipe.image}" class="card-img-top" alt="Recipe Image">
    <div class="d-flex flex-column list">
    <p><strong>Ingredients:</strong></p>
    <ul>
      ${recipe.usedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join('')}
      ${recipe.missedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join('')}
    </ul>
    </div>
    `
    ;
}




// Check for form submission
form.addEventListener("submit", function (event) {
  event.preventDefault();
  const search = document.getElementById("input").value.toLowerCase();
  const dataPromise = getRecipe(search);
  showRecipe(dataPromise);
});





// Function to fetch data from the API
async function fetchRecipeInstructions(id) {
  const recipeId = id;
  const apiUrl = `https://api.spoonacular.com/recipes/${recipeId}/analyzedInstructions?apiKey=${apikey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recipe instructions:', error);
    return null;
  }
}

// Function to display recipe instructions in HTML
function displayRecipeInstructions(instructions) {
  console.log(instructions,"dataaaaa")
  const instructionsContainer = document.getElementById('recipeInstructions');
  if (!instructions || instructions.length === 0) {
    instructionsContainer.innerHTML = '<p>No instructions available.</p>';
    return;
  }

  let html = '';
  instructions.forEach((section, index) => {
    html += `<h2>Section ${index + 1}: ${section.name || 'Main Instructions'}</h2>`;
    section.steps.forEach((step) => {
      html += `<p><strong>Step ${step.number}:</strong> ${step.step}</p>`;
      
      if (step.equipment.length > 0) {
        html += `<p><strong>Equipment:</strong> ${step.equipment.map((equipment) => equipment.name).join(', ')}</p>`;
      }
    });
  });
  instructionsContainer.innerHTML = html;
}

// Fetch and display recipe instructions
function getFetchRecipeInstructions(id){
  fetchRecipeInstructions(id)
  .then(displayRecipeInstructions)
  .catch((error) => {
    console.error('Error:', error);
    document.getElementById('recipeInstructions').innerHTML = '<p>Error fetching instructions.</p>';
  });
}
