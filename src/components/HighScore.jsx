const HighScore = ({ highscores, setRemainingTime }) => {
    return (
      <div className="app-wrapper">
        <div className="center-content">
          <h1 className="title">Highscoreliste</h1>
          <ol>
            {highscores.map((entry, index) => (
              <li key={index}>
                {entry.name}: {entry.score}
              </li>
            ))}
          </ol>
          <button onClick={setRemainingTime}>Spill igjen</button>
        </div>
      </div>
    );
  };
  
  export default HighScore;
  