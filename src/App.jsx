import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Routes, Route } from 'react-router-dom';
import './App.css';
import RecipeDetail from './RecipeDetail';
import { API_KEY } from './config';
import Chart from 'chart.js/auto';

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [vegetarian, setVegetarian] = useState(false);
  const [ketogenic, setKetogenic] = useState(false);
  const [glutenFree, setGlutenFree] = useState(false);
  const [detailedData, setDetailedData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [vegetarian, ketogenic, glutenFree]);

  useEffect(() => {
    async function fetchDetailedData() {
      try {
        const promises = data.map((item) =>
          axios.get(`https://api.spoonacular.com/recipes/${item.id}/information?apiKey=${API_KEY}`)
        );
        const responses = await Promise.all(promises);
        const detailedData = responses.map((response) => response.data);
        setDetailedData(detailedData);
      } catch (error) {
        console.log(error);
      }
    }
    fetchDetailedData();
  }, [data]);


  async function fetchData() {
    let url = 'https://api.spoonacular.com/recipes/complexSearch?number=10&apiKey=' + API_KEY;
    if (vegetarian) {
      url += '&diet=vegetarian';
    }
    if (ketogenic) {
      url += '&diet=ketogenic';
    }
    if (glutenFree) {
      url += '&diet=gluten+free';
    }
    try {
      const response = await axios.get(url);
      setData(response.data.results);
      setFilteredData(response.data.results);
    } catch (error) {
      console.log(error);
    }
  }

  function handleSearch(event) {
    setSearchTerm(event.target.value);
    const newFilteredData = data.filter((item) =>
      item.title.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredData(newFilteredData);
  }

  function handleVegetarianChange(event) {
    setVegetarian(event.target.checked);
  }

  function handleKetogenicChange(event) {
    setKetogenic(event.target.checked);
  }

  function handleGlutenFreeChange(event) {
    setGlutenFree(event.target.checked);
  }


  return (
    <div className="container">
      <div className="header">
        <h1>Recipe Search</h1>
        <input
          type="text"
          placeholder="Search for a recipe..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <div>
          <input type="checkbox" id="vegetarian" checked={vegetarian} onChange={handleVegetarianChange} />
          <label htmlFor="vegetarian">Vegetarian</label>
        </div>
        <div>
          <input type="checkbox" id="ketogenic" checked={ketogenic} onChange={handleKetogenicChange} />
          <label htmlFor="ketogenic">Ketogenic</label>
        </div>
        <div>
          <input type="checkbox" id="gluten-free" checked={glutenFree} onChange={handleGlutenFreeChange} />
          <label htmlFor="gluten-free">Gluten Free</label>
        </div>
      </div>
      <main>
        <Routes>
          <Route path="/" element={<div className="card-container">{filteredData.map((item, index) => (
            <Link to={`/recipes/${item.id}`} key={item.id} className="card">
              <h2>{item.title}</h2>
              <p>{item.summary}</p>
              <p>Cooking Time (minutes): {detailedData[index]?.readyInMinutes}</p>
              <p>Servings: {detailedData[index]?.servings}</p>
              <p>Prive Per Serving: ${(detailedData[index]?.pricePerServing/50).toFixed(2)}</p>
              <img src={item.image} alt={item.title} />
            </Link>
          ))}</div>} />
          <Route path="/recipes/:id" Component={RecipeDetail} />
        </Routes>
      </main>
    </div>
  );  
}

export default App;
