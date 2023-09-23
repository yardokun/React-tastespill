import eikenottImage from "../assets/eikenott.png";

const HighScore = ({ highscores, setRemainingTime }) => {
  return (
    <div className="app-wrapper">
      <div className="center-content">
        <h1 className="title">Highscoreliste</h1>
        <ol>
          {highscores.map((entry, index) => (
            <li key={index}>
              <div className="score-wrapper">
                <div>
                  <img
                    className="eikenott"
                    src={eikenottImage}
                    alt="Eikenøtt"
                  />
                </div>
                <div className="style-name">{entry.name}:</div>
                <div className="style-score">{entry.score}</div>
              </div>
            </li>
          ))}
        </ol>
        <button className="start-game-btn" onClick={setRemainingTime}>
          Spill igjen
        </button>
      </div>
    </div>
  );
};

export default HighScore;
