import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './detail.css'
import { API_KEY } from './config';


function RecipeDetail() {
  const { id } = useParams();
  const [recipeData, setRecipeData] = useState(null);

  useEffect(() => {
    async function fetchRecipeData() {
      try {
        const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`);
        setRecipeData(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchRecipeData();
  }, [id]);

  if (!recipeData) {
    return <div>Loading...</div>;
  }
console.log(recipeData);
const extendedIngredients = recipeData.extendedIngredients.map((item) => item.name);
  return (
    <div className='detailView'>
        <h1>{recipeData.title}</h1>
        <img src={recipeData.image}/>
        <div>
            <h2>Ingredients</h2>
            {extendedIngredients.map((fruit, index) => (
                <p> {fruit}</p>
            ))}
        </div>
    </div>
  );
}

export default RecipeDetail;