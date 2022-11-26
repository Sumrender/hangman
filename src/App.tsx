import { KeyboardEvent, useCallback, useEffect, useState } from "react";
import words from "./wordList.json";
import HangmanDrawing from "./HangmanDrawing";
import HangmanWord from "./HangmanWord";
import Keyboard from "./Keyboard";

function getWord() {
  return words[Math.floor(Math.random() * words.length)];
}

function App() {
  const [wordToGuess, setWordToGuess] = useState(getWord());

  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

  const incorrectLetters = guessedLetters.filter(
    (letter) => !wordToGuess.includes(letter)
  );

  const isLoser = incorrectLetters.length >= 6;
  const isWinner = wordToGuess
    .split("")
    .every((letter) => guessedLetters.includes(letter));

  const addGuessedLetter = useCallback(
    (letter: string) => {
      console.log("addGuessedLetter called", letter);
      if (guessedLetters.includes(letter) || isWinner || isLoser) return;

      console.log(guessedLetters);
      setGuessedLetters((currentLetters) => [...currentLetters, letter]);
      console.log(guessedLetters);
    },
    [guessedLetters, isWinner, isLoser]
  );

  // useEffect for listening keyboard events
  useEffect(() => {
    // here added 'any' on my own $$$$$$
    const handler: any = (e: KeyboardEvent) => {
      const key = e.key;
      if (!key.match(/^[a-z]$/)) return;

      e.preventDefault();
      addGuessedLetter(key);
    };

    document.addEventListener("keypress", handler);

    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, [guessedLetters]);

  // useEffect for refresh
  useEffect(() => {
    const handler: any = (e: KeyboardEvent) => {
      const key = e.key;
      if (key !== "Enter") return;

      e.preventDefault();
      setGuessedLetters([]);
      setWordToGuess(getWord());
    };

    document.addEventListener("keypress", handler);

    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, []);

  return (
    <>
      <div
        style={{
          maxWidth: "800px",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          margin: "0 auto",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: "2rem", textAlign: "center" }}>
          {isWinner && "You Win - Refresh to try again"}
          {isLoser && "You Lose - Refresh to try again"}
        </div>
        <HangmanDrawing numberOfGuesses={incorrectLetters.length} />
        <HangmanWord
          reveal={isLoser}
          wordToGuess={wordToGuess}
          guessedLetters={guessedLetters}
        />
        <div style={{ alignSelf: "stretch" }}>
          <Keyboard
            disabled={isLoser || isWinner}
            activeLetters={guessedLetters.filter((letter) =>
              wordToGuess.includes(letter)
            )}
            inactiveLetters={incorrectLetters}
            addGuessedLetter={addGuessedLetter}
          />
        </div>
        <div style={{ fontSize: 30 }}>Press Enter to change word</div>
      </div>
    </>
  );
}

export default App;
