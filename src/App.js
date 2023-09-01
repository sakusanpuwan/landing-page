import './App.css';
import React, { useEffect, useState } from 'react';


function App() {

  const [news,setNews] = useState([]);
  const [quotes,setQuotes] = useState([]);
  const [facts,setFacts] = useState([]);
  const [weather,setWeather] = useState([]);
  const [fantasy,setFantasy] = useState({});
  const [isLoading, setIsLoading] = useState(true);



  const getNews = async() => {
    try {
      const response = await fetch(`https://api.thenewsapi.com/v1/news/top?api_token=${process.env.REACT_APP_NEWS_API_KEY}&language=en`);
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const getQuotes = async() => {
    try {
      const response = await fetch('https://api.quotable.io/quotes/random?limit=10?tags=famous-quotes');
      const data = await response.json();
      setQuotes(data)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const getFacts = async() => {
    try {
      const response = await fetch('https://api.api-ninjas.com/v1/facts?limit=10',{
        headers:{
          'X-Api-Key': process.env.REACT_APP_FACTS_API_KEY
        }
      });
      const data = await response.json();
      setFacts(data)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  const getWeather = async() => {
    try {
      const response = await fetch(`http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/351996?res=3hourly&key=${process.env.REACT_APP_WEATHER_API_KEY}`);
      const data = await response.json();
      setWeather(data)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


  const getFantasy = async() => {
    try {
      const response = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/')
      // CORS issue - use CORS Unblock extension for personal use
      const data = await response.json();
      setFantasy(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    Promise.all([getNews(), getQuotes(),getFacts(),getWeather(),getFantasy()])
    .then(() => setIsLoading(false))
    .catch((error) => console.error('Error fetching data:', error));
  },[])


  return (
    <div className="App">
        <h1>Landing page</h1>
    </div>
  );
}

export default App;
