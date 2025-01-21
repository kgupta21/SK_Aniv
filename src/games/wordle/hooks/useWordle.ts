import { useState, useCallback, useEffect } from 'react';
import { WORD_LENGTH, MAX_ATTEMPTS, LetterStatus } from '../types';
import { getDailyWord, getTimeUntilNextWord } from '../utils/wordSelection';
import { isValidWord } from '../utils/wordLists';

export function useWordle() {
  const [useExpansion, setUseExpansion] = useState(false);
  const [targetWord, setTargetWord] = useState(() => getDailyWord(false));
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [letterStatuses, setLetterStatuses] = useState<Record<string, LetterStatus>>({});
  const [nextWordTime, setNextWordTime] = useState(getTimeUntilNextWord());

  useEffect(() => {
    const timer = setInterval(() => {
      const timeLeft = getTimeUntilNextWord();
      setNextWordTime(timeLeft);
      
      if (timeLeft.includes('23h 59m')) {
        setTargetWord(getDailyWord(useExpansion));
        setGuesses([]);
        setCurrentGuess('');
        setGameOver(false);
        setLetterStatuses({});
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [useExpansion]);

  const toggleExpansion = useCallback(() => {
    setUseExpansion(prev => {
      const newValue = !prev;
      setTargetWord(getDailyWord(newValue));
      setGuesses([]);
      setCurrentGuess('');
      setGameOver(false);
      setLetterStatuses({});
      return newValue;
    });
  }, []);

  const updateLetterStatuses = useCallback((guess: string) => {
    const newStatuses = { ...letterStatuses };
    const targetLetters = [...targetWord];

    [...guess].forEach((letter, i) => {
      if (letter === targetWord[i]) {
        newStatuses[letter] = 'correct';
        targetLetters[i] = '';
      }
    });

    [...guess].forEach((letter, i) => {
      if (letter !== targetWord[i]) {
        const remainingIndex = targetLetters.indexOf(letter);
        if (remainingIndex !== -1) {
          newStatuses[letter] = 'present';
          targetLetters[remainingIndex] = '';
        } else if (!newStatuses[letter]) {
          newStatuses[letter] = 'absent';
        }
      }
    });

    setLetterStatuses(newStatuses);
  }, [targetWord, letterStatuses]);

  const handleKey = useCallback((key: string) => {
    if (gameOver) return;

    if (key === 'enter') {
      if (currentGuess.length === WORD_LENGTH) {
        if (isValidWord(currentGuess, useExpansion)) {
          const newGuesses = [...guesses, currentGuess];
          setGuesses(newGuesses);
          updateLetterStatuses(currentGuess);
          setCurrentGuess('');
          setGameOver(
            currentGuess.toLowerCase() === targetWord ||
            newGuesses.length === MAX_ATTEMPTS
          );
        }
      }
    } else if (key === 'backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < WORD_LENGTH && /^[a-z]$/.test(key)) {
      setCurrentGuess(prev => prev + key);
    }
  }, [currentGuess, gameOver, guesses, targetWord, updateLetterStatuses, useExpansion]);

  return {
    targetWord,
    guesses,
    currentGuess,
    gameOver,
    letterStatuses,
    nextWordTime,
    handleKey,
    useExpansion,
    toggleExpansion
  };
}