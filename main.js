function showLoading(){
    const mealContainer = document.getElementById("mealContainer"); 
    mealContainer.innerHTML = `<div class="loading">
    <p>Finding a perfect meal for you...</p>
    <div class="spinner"></div>
    </div>`;
}

function showError(message){ 
    const mealContainer = document.getElementById("mealContainer"); 
    mealContainer.innerHTML = `<div class="error">
    <p>${message}</p>
    <button onclick="getRandomMeal()">Try Again</button>
    </div>`;
}

async function getRandomMeal() {
  try {
    showLoading();
    const categorySelect = document.getElementById("mealCategory");
    const category = categorySelect.value;
    
    let meal; 
    
    if (category) {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
      if (!res.ok){
        throw new Error(`HTTP error! status: ${res.status}`); 
      }
      const data = await res.json();
      
      if (!data.meals) {
        showError(`No meals found for category: ${category}`);
        return;
      }
      
      const meals = data.meals;
      const randomMeal = meals[Math.floor(Math.random() * meals.length)];
      const detailRes = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${randomMeal.idMeal}`);
      
      if (!detailRes.ok) { 
        throw new Error(`HTTP error! status: ${detailRes.status}`);
      }
      
      const detailData = await detailRes.json();
      meal = detailData.meals[0];
    } else {
      const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
      
      if (!res.ok) { 
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      meal = data.meals[0];
    }
    
    
    const mealContainer = document.getElementById("mealContainer");

    let ingredientsList = ""; 
    for(let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];  
        const measure = meal[`strMeasure${i}`]; 
        
        if(ingredient && ingredient.trim() !== "") { 
            ingredientsList += `<li>${ingredient} - ${measure}</li>`;
        }
    }

    mealContainer.innerHTML = `
      <h2>${meal.strMeal}</h2>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" width="300" />
      <p><strong>Category:</strong> ${meal.strCategory}</p>
      <p><strong>Area:</strong> ${meal.strArea}</p>
      <p><strong>Instructions:</strong> ${meal.strInstructions}</p>
      <h3>Ingredients:</h3>
      <ul>${ingredientsList}</ul> <!-- Fixed typo -->
      <button id="fvrtBtn" data-meal='${JSON.stringify(meal)}'>Add to Favorites</button>
      ${meal.strYoutube ? `<p><a href="${meal.strYoutube}" target="_blank">Watch on YouTube</a></p>` : ""}
    `;

    document.getElementById("fvrtBtn").addEventListener("click", function() {
        const mealData = JSON.parse(this.getAttribute('data-meal'));
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        const exists = favorites.find(item => item.idMeal === mealData.idMeal);
        
        if(!exists) {
            favorites.push(mealData);
            localStorage.setItem("favorites", JSON.stringify(favorites));
            alert("Added to favorites!");
        } else {
            alert("Already in favorites!");
        }
    });

  } catch (error) {
    console.error("Error fetching meal:", error);
    showError(`Failed to load meal: ${error.message}`); 
  }
}
function viewFavorites() {
    const favoritesContainer = document.getElementById("favoritesContainer");
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    
    if(favorites.length === 0){
        favoritesContainer.innerHTML = "<p>No favorites added yet.</p>";
        return;
    }
    
    
    let favoritesHTML = "";
    favorites.forEach(meal => {
        favoritesHTML += `
        <div style="margin-bottom:20px; border:1px solid #ddd; padding:10px;">
            <h3>${meal.strMeal}</h3>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" width="200" />
            <p><strong>Category:</strong> ${meal.strCategory}</p>
            <p><strong>Area:</strong> ${meal.strArea}</p>
             <p><strong>Instructions:</strong> ${meal.strInstructions}</p>

        </div>
        `;
    });
    
    favoritesContainer.innerHTML = favoritesHTML;
}


document.getElementById("getMealBtn").addEventListener("click", getRandomMeal);
document.getElementById("viewFavouritesBtn").addEventListener("click", viewFavorites);