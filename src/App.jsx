import React, { useState, useEffect } from "react";
import axios from "axios";
import Question from "./components/Question";
import Score from "./components/Score";
import Loader from "./components/Loader";
import styles from './App.module.css';
import Header from "./components/Header";

const API_URL = "https://opentdb.com/api.php?amount=10&type=multiple";

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timer, setTimer] = useState(5);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_URL);
      const formattedQuestions = response.data.results.map((question) => ({
        question: question.question,
        answers: shuffleAnswers([
          ...question.incorrect_answers,
          question.correct_answer,
        ]),
        correctAnswer: question.correct_answer,
      }));
      setQuestions(formattedQuestions);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (timer > 0 && !isQuizComplete) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (!isQuizComplete) {
      handleNextQuestion();
    }
  }, [timer, isQuizComplete]);

  const shuffleAnswers = (answers) => answers.sort(() => Math.random() - 0.5);

  const handleAnswer = (answer) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;
    if (isCorrect) setScore(score + 1);

    setUserAnswers([
      ...userAnswers,
      {
        question: currentQuestion.question,
        selected: answer,
        correct: currentQuestion.correctAnswer,
      },
    ]);

    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimer(5);
    } else {
      setIsQuizComplete(true);
    }
  };

  const handleSkipQuestion = () => {
    setUserAnswers([
      ...userAnswers,
      {
        question: questions[currentQuestionIndex].question,
        selected: "Skipped",
        correct: questions[currentQuestionIndex].correctAnswer,
      },
    ]);

    handleNextQuestion();
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setUserAnswers([]);
    setTimer(5);
    setIsQuizComplete(false);
    fetchQuestions();
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isQuizComplete) {
    return (
      <Score
        score={score}
        totalQuestions={questions.length}
        userAnswers={userAnswers}
        restartQuiz={restartQuiz}
      />
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className={styles.quizContainer}>
      <Header />
      <Question
        question={currentQuestion}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        handleAnswer={handleAnswer}
      />
      <p className={styles.timer}>Time Remaining: {timer}s</p>
      <button onClick={handleSkipQuestion} className={styles.skipButton}>
        Skip Question
      </button>
    </div>
  );
}

export default App;
