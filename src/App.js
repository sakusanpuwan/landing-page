import { RingLoader } from 'react-spinners';
import './App.css';
import React, { useEffect, useState } from 'react';
import Carousel from 'react-material-ui-carousel';


function App() {
  
  const [news,setNews] = useState([]);
  const [quotes,setQuotes] = useState([]);
  const [facts,setFacts] = useState([]);
  const [weather,setWeather] = useState([]);
  const [fantasy,setFantasy] = useState({});
  const [word, setWord] = useState();
  const [definition, setDefinition] = useState([]);

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
      setFacts(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const getWeather = async() => {
    try {
      const response = await fetch(`http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/351996?res=3hourly&key=${process.env.REACT_APP_WEATHER_API_KEY}`);
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


  const getFantasy = async() => {
    try {
      const response = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/');
      // CORS issue - use CORS Unblock extension for personal use
      const data = await response.json();
      setFantasy(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const getWord = async() => {
    let isDefined = false;
    let count = 0;
    let definitionData;

    do {
      try {
        const wordResponse = await fetch('https://random-word-api.herokuapp.com/word');
        const wordData = await wordResponse.json();
        const randomWord = wordData[0];
        setWord(randomWord);

        const definitionResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord}`)
        count ++;

        if (definitionResponse.status === 200) {
          definitionData = await definitionResponse.json();
          isDefined = true;
        }

      } catch (error) {
          console.error('Error fetching data:', error);
      }
    } while (!isDefined && count < 10);

    return definitionData;
  }

  const getDefinition = async() => {
    const definitionData = await getWord();
    setDefinition(definitionData);
  }

  useEffect(() => {
    Promise.all([ getQuotes(),getFacts(),getWeather(),getFantasy(),getDefinition()])
    .then(() => {
      setTimeout(() => {
        setIsLoading(false)
      },2000)
    })
    .catch((error) => console.error('Error fetching data:', error));
  },[])

  let today = new Date();

  const getFantasyDeadline = () => {
    const index = fantasy.events.findIndex((gameweek) => gameweek.finished === false);
    const deadline = fantasy.events[index].deadline_time;
    return deadline;
  }

  return (
    <div className="App">
      {
        isLoading ? 
          <RingLoader size={50} color='#f1f3f4' loading={isLoading}/>
        :
        <div className='app-container'>
          <div className='div1'>
            <h2>{today.toString().slice(0,15)}</h2>
            <h2>{today.toString().slice(16,21)}</h2>
          </div>
          <div className='div2'>
          </div>
          <div className='div3'>
            <Carousel className='carousel' indicators={false}>
              {quotes.map((quote) => {
                return (
                  <div className='quote-container'>
                    <h5>{quote.content}</h5>
                    <h6>{quote.author}</h6>
                  </div>
                )
              })}
            </Carousel>
          </div>
          <div className='div4'>
          </div>
          <div className='div5'>
            <a href='https://en.wikipedia.org/wiki/Special:RandomInCategory/Good_articles'><img src='https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/1200px-Wikipedia-logo-v2.svg.png' height={50}></img></a>
          </div>
          <div className='div6'>
          </div>
          <div className='div7'>
          </div>
          <div className='div8'>
            <h2>{getFantasyDeadline()}</h2>
            
          </div>
          <div className='div9'>
            {facts.slice(0,4).map((item) => {
              return (
                <h5>{item.fact}</h5>
              )
            })}
          </div>
          <div className='div10'>
            <h4>{definition[0].word}</h4>
            <h6>{definition[0].meanings[0].definitions[0].definition}</h6>
          </div>
          
        </div>


      }
    </div>
  );
}

export default App;
