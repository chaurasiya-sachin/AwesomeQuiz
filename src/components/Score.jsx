import React from "react";
import styles from './Score.module.css';

function Score({ score, totalQuestions, userAnswers, restartQuiz }) {
  return (
    <div className={styles.quizComplete}>
      <h1>Quiz Complete!</h1>
      <p className={styles.score}>Your Score: {score} / {totalQuestions}</p>
      <div className={styles.answersReview}>
        {userAnswers.map((answer, index) => (
          <div key={index} className={styles.answerItem}>
            <h3>Question {index + 1}:</h3>
            <p dangerouslySetInnerHTML={{ __html: answer.question }} />
            <p>
              <strong>Your Answer:</strong>{" "}
              <span
                style={{
                  color: answer.selected === answer.correct ? "green" : "red",
                }}
              >
                {answer.selected}
              </span>
            </p>
            <p>
              <strong>Correct Answer:</strong> {answer.correct}
            </p>
          </div>
        ))}
      </div>
      <button onClick={restartQuiz}>Restart Quiz</button>
    </div>
  );
}

export default Score;
