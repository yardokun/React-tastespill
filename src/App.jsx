import React, { useEffect, useState } from "react";
import "./App.css";
import autumnList from "./data/Høst.json";
import HighScore from "./components/HighScore";
import Game from "./components/Game";
import GameStart from "./components/GameStart";

const App = () => {
  const words = autumnList.ord;

  const getRandomWord = (wordList) => {
    const index = Math.floor(Math.random() * wordList.length);
    return wordList[index];
  };

  const shuffle = (array) => {
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
  };

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

  if (remainingTime <= 0) {
    return (
      <HighScore
        highscores={highscores}
        setRemainingTime={() => setRemainingTime(120)}
      />
    );
  }

  if (!isGameStarted) {
    return (
      <GameStart
        userName={userName}
        handleNameInputKeyUp={handleNameInputKeyUp}
        handleStartGame={handleStartGame}
        setUserName={(e) => setUserName(e)}
      />
    );
  }

  return (
    <Game
      userName={userName}
      handleKeyUp={handleKeyUp}
      handleInputChange={handleInputChange}
      randomWord={randomWord}
      inputValue={inputValue}
      score={score}
      remainingTime={remainingTime}
    />
  );
};

export default App;
