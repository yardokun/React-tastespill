import React, { useEffect, useState } from "react";
import "./App.css";
import autumnList from "./data/Høst.json";

const App = () => {
  const words = autumnList.ord;

  function getRandomWord(wordList) {
    const index = Math.floor(Math.random() * wordList.length);
    return wordList[index];
  }

  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }

  const [userName, setUserName] = useState("");
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [randomWord, setRandomWord] = useState("");
  const [indexWord, setIndexWord] = useState(0);
  const [score, setScore] = useState(0);
  const [remainingTime, setRemainingTime] = useState(120); // 2 minutes in seconds
  const [remainingWords, setRemainingWords] = useState(shuffle([...words]));
  const [deductions, setDeductions] = useState(0);
  const [consecutiveCorrectWords, setConsecutiveCorrectWords] = useState(0);
  const [highscores, setHighscores] = useState([]);

  useEffect(() => {
    const savedHighscores = localStorage.getItem("highscores");
    if (savedHighscores) {
      setHighscores(JSON.parse(savedHighscores));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("highscores", JSON.stringify(highscores));
  }, [highscores]);

  useEffect(() => {
    let timer;

    if (isGameStarted && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (!isGameStarted || remainingTime <= 0) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isGameStarted, remainingTime]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  };

  const handleStartGame = () => {
    if (!userName.trim()) {
      alert("Vennligst skriv inn navnet ditt for å starte spillet!");
      return;
    }
    setIsGameStarted(true);
    setRandomWord(getRandomWord(remainingWords));
  };

  const handleKeyUp = (event) => {
    if (event.key === " " && remainingTime > 0) {
      if (inputValue.trim() === randomWord) {
        setScore((prevScore) => prevScore + 50);
        handleNewWord(true);
      } else {
        handleNewWord(false);
      }
      setInputValue("");
    }
  };

  const handleNameInputKeyUp = (event) => {
    if (event.key === "Enter") {
      handleStartGame();
    }
  };

  const handleNewWord = (correct) => {
    if (correct) {
      setConsecutiveCorrectWords((prev) => prev + 1);
      if (consecutiveCorrectWords + 1 === 3) {
        setScore((prevScore) => prevScore + 100);
        setConsecutiveCorrectWords(0);
      }
    } else {
      setConsecutiveCorrectWords(0);
    }

    if (remainingWords.length > 1) {
      const updatedRemainingWords = remainingWords.filter(
        (word) => word !== randomWord
      );
      setRemainingWords(updatedRemainingWords);
      setIndexWord(0);
      setDeductions(0);
    } else {
      let newShuffledWords = shuffle([...words]);

      while (newShuffledWords[0] === randomWord) {
        newShuffledWords = shuffle([...words]);
      }

      setRemainingWords(newShuffledWords);
    }
  };

  useEffect(() => {
    setScore(0);
  }, []);

  useEffect(() => {
    if (inputValue[indexWord] && randomWord[indexWord] && remainingTime > 0) {
      if (inputValue[indexWord] === randomWord[indexWord]) {
        setScore((prevScore) => prevScore + 1);
      } else {
        if (deductions < 5) {
          setScore((prevScore) => prevScore - 1);
          setDeductions((prevDeductions) => prevDeductions + 1);
        }
      }

      setIndexWord((lastIndex) => lastIndex + 1);
    }
  }, [inputValue, randomWord, indexWord, deductions, remainingTime]);

  useEffect(() => {
    setRandomWord(getRandomWord(remainingWords));
    setIndexWord(0);
    setInputValue("");
    setDeductions(0);
  }, [remainingWords]);

  useEffect(() => {
    if (remainingTime <= 0) {
      setHighscores((prevScores) =>
        [...prevScores, { name: userName, score: score }]
          .sort((a, b) => b.score - a.score)
          .slice(0, 10)
      );
      setIsGameStarted(false);
    }
  }, [remainingTime, userName, score]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (remainingTime <= 0) {
    return (
      <div className="app-wrapper">
        <div className="center-content">
          <h1>Highscoreliste</h1>
          <ol>
            {highscores.map((entry, index) => (
              <li key={index}>
                {entry.name}: {entry.score}
              </li>
            ))}
          </ol>
          <button onClick={() => setRemainingTime(120)}>Spill igjen</button>
        </div>
      </div>
    );
  }

  if (!isGameStarted) {
    return (
      <div className="app-wrapper">
        <div className="center-content">
          <h1 className="welcome-title">Velkommen til Høst-ordspillet!</h1>
          <p className="game-instructions">
            Målet med spillet er å utordre din evne til å skrive raskt og
            nøyaktig, samtidig som du lærer om temaet høst. Du vil bli
            presentert med ord og utrykk knyttet til høsten, og du må skrive dem
            korrekt og raskt innenfor en tidsbegrensning på 2 minutter.
          </p>
          <p className="game-instructions r-u-ready">Er du klar?</p>
          <h2 className="game-instructions-2">
            Skriv inn navnet ditt under og trykk på "Start spillet"!
          </h2>
          <input
            type="text"
            placeholder="Skriv navnet ditt her..."
            value={userName}
            onChange={handleUserNameChange}
            onKeyUp={handleNameInputKeyUp}
          />
          <button className="start-game-btn" onClick={handleStartGame}>
            Start spillet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      <div className="center-content ">
        <h1>Skynd deg, {userName}!</h1>
        <h2>Skriv ordet: </h2>
        <h2>
          <span className="highlighted-word">{randomWord}</span>
        </h2>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyUp={handleKeyUp}
        />
        <p>Tast space når du er ferdig!</p>
        <p>Poengscore: {score}</p>
        <p>Tid: {formatTime(remainingTime)}</p>
      </div>
    </div>
  );
};

export default App;
