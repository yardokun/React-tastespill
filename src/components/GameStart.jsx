const GameStart = ({
  userName,
  handleNameInputKeyUp,
  handleStartGame,
  setUserName,
}) => {
  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  };

  return (
    <div className="app-wrapper">
      <div className="center-content">
        <h1 className="title">Velkommen til Høst-ordspillet!</h1>
        <p className="game-instructions">
          Målet med spillet er å utordre din evne til å skrive raskt og
          nøyaktig, samtidig som du lærer om temaet høst. Du vil bli presentert
          med ord og utrykk knyttet til høsten, og du må skrive dem korrekt og
          raskt innenfor en tidsbegrensning på 2 minutter.
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
};

export default GameStart;
