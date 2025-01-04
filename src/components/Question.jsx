import React from "react";
import styles from './Question.module.css';

const Question = ({ question, currentQuestionIndex, totalQuestions, handleAnswer }) => {
  return (
    <div className={styles.questionSection}>
      <h2>
        Question {currentQuestionIndex + 1} of {totalQuestions}
      </h2>
      <h3 dangerouslySetInnerHTML={{ __html: question.question }} />
      <ul className={styles.answerOptions}>
        {question.answers.map((answer, index) => (
          <li
            key={index}
            onClick={() => handleAnswer(answer)}
            dangerouslySetInnerHTML={{ __html: answer }}
            className={styles.answerOption}
          />
        ))}
      </ul>
    </div>
  );
};

export default Question;
