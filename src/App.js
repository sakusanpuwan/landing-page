import { RingLoader } from 'react-spinners';
import './App.css';
import React, { useEffect, useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import Background from './assets/1.jpg'


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
    const deadline = new Date(fantasy.events[index].deadline_time);
    return deadline.toLocaleDateString() + " " + deadline.toLocaleTimeString();
  }

  return (
    <div className="App">
      {
        isLoading ? 
          <RingLoader size={50} color='#f1f3f4' loading={isLoading}/>
        :
        <div>
          <img className='background' src={Background}></img>
        <div className='app-container'>
          <div className='div1'>
            <h2 className='orbitron'>{today.toString().slice(0,15)}</h2>
            <h2 className='digital' style={{fontSize:"80px"}}>{today.toString().slice(16,21)}</h2>
          </div>
          <div className='div2'>
          </div>
          <div className='div3'>
            <Carousel className='carousel' indicators={false}>
              {quotes.map((quote) => {
                return (
                  <div className='quote-container'>
                    <h5 style={{fontStyle:"italic",fontSize:"20px",margin:"0"}}>{quote.content}</h5>
                    <h6 style={{fontStyle:"italic",fontSize:"15px",marginTop:"5px",marginBottom:"5px",textDecoration:"overline"}}>{quote.author}</h6>
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
            <h2 className='digital' style={{fontSize:"40px"}}>{getFantasyDeadline()}</h2>
            
          </div>
          <div className='div9'>
            {facts.slice(0,4).map((item) => {
              return (
                <h5>{item.fact}</h5>
              )
            })}
          </div>
          <div className='div10'>
            <h4 style={{fontWeight:"bolder",margin:"0",fontSize:"30px",textDecoration:"underline"}}>{definition[0].word}</h4>
            <h4 style={{fontWeight:"bold",margin:"0",fontSize:"15px",fontStyle:"italic"}}>{definition[0].phonetic}</h4>
            <h4 style={{fontWeight:"bold",margin:"0",fontSize:"10px"}}>{definition[0].meanings[0].partOfSpeech}</h4>
            <h6 style={{fontWeight:"bold",margin:"0",fontSize:"15px",fontStyle:"italic"}}>{definition[0].meanings[0].definitions[0].definition}</h6>
          </div>
          
        </div>
        </div>


      }
    </div>
  );
}

export default App;
