async function getRandomMeal() {
  try {
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    const data = await res.json();
    const meal = data.meals[0];

    const mealContainer = document.getElementById("mealContainer");

    let ingridientsList = "";
    for(let i = 1; i <= 20; i++) {
        const ingridient = meal[`strIngredient${i}`]; 
        const measure = meal[`strMeasure${i}`]; 
        
       
        if(ingridient && ingridient.trim() !== "") {
            ingridientsList += `<li>${ingridient} - ${measure}</li>`;
        }
    }

    mealContainer.innerHTML = `
      <h2>${meal.strMeal}</h2>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" width="300" />
      <p><strong>Category:</strong> ${meal.strCategory}</p>
      <p><strong>Area:</strong> ${meal.strArea}</p>
      <p><strong>Instructions:</strong> ${meal.strInstructions}</p>
      <h3>Ingredients:</h3>
      <ul>${ingridientsList}</ul>
    `;

  } catch (error) {
    console.error("Error fetching meal:", error);
  }
}

document.getElementById("getMealBtn").addEventListener("click", getRandomMeal);