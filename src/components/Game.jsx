const Game = ({
  userName,
  handleKeyUp,
  handleInputChange,
  randomWord,
  inputValue,
  score,
  remainingTime,
}) => {
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="app-wrapper">
      <div className="center-content ">
        <h1 className="title">Skynd deg, {userName}!</h1>
        <h2 className="write-the-word">Skriv ordet: </h2>
        <h2>
          <span className="highlighted-word">{randomWord}</span>
        </h2>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyUp={handleKeyUp}
        />
        <p className="game-instructions-2">Tast space når du er ferdig!</p>
        <p className="game-info">
          Poengscore: <span className="highlighted-word-2">{score}</span>
        </p>
        <p className="game-info">
          Tid:{" "}
          <span className="highlighted-word-2">
            {formatTime(remainingTime)}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Game;
