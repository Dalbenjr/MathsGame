$(document).ready(function () {
  var currentQuestion;
  var interval;
  var timeLeft = 10;
  var score = 0;
  var currentScore = 0;

  var updateTimeLeft = function (amount) {
    timeLeft += amount;
    $('#time-left').text(timeLeft);
  };

  var updateScore = function (amount) {
    score += amount;
    $('#score').text(score);
  };

  var highScore = function (score) {
    if (score > currentScore) {
      currentScore = score;
      $('#high-score').text(currentScore);
    }
  };

  var startGame = function () {
    if (!interval) {
      if (timeLeft === 0) {
        updateTimeLeft(10);
        updateScore(-score);
      }
      interval = setInterval(function () {
        updateTimeLeft(-1);
        if (timeLeft === 0) {
          clearInterval(interval);
          interval = undefined;
          highScore(score);
        }
      }, 1000);
    }
  };

  var randomNumberGenerator = function (size) {
    return Math.ceil(Math.random() * size);
  };

  var questionGenerator = function () {
    var question = {};
    var num1 = randomNumberGenerator(10);
    var num2 = randomNumberGenerator(10);

    var sumChecked = $('#sum').is(':checked');
    var minusChecked = $('#minus').is(':checked');
    var timesChecked = $('#times').is(':checked');
    var divideChecked = $('#divide').is(':checked');

    var questionTypes = [];
    if (sumChecked) questionTypes.push('+');
    if (minusChecked) questionTypes.push('-');
    if (timesChecked) questionTypes.push('x');
    if (divideChecked) questionTypes.push('/');

    if (questionTypes.length === 0) {
      questionTypes = ['+'];
    }

    var selectedQuestionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

    if (selectedQuestionType === '+') {
      question.answer = num1 + num2;
      question.equation = num1 + " + " + num2;
    } else if (selectedQuestionType === '-') {
      question.answer = Math.max(num1, num2) - Math.min(num1, num2);
      question.equation = Math.max(num1, num2) + " - " + Math.min(num1, num2);
    } else if (selectedQuestionType === 'x') {
      question.answer = num1 * num2;
      question.equation = num1 + " x " + num2;
    } else if (selectedQuestionType === '/') {
      var divisor = randomNumberGenerator(10);
      var dividend = randomNumberGenerator(10) * divisor;
      question.answer = dividend / divisor;
      question.equation = dividend + " / " + divisor;
    }

    return question;
  };

  var renderNewQuestion = function () {
    currentQuestion = questionGenerator();
    $('#equation').text(currentQuestion.equation);
  };

  var checkAnswer = function (userInput, answer) {
    if (userInput === answer) {
      renderNewQuestion();
      $('#user-input').val('');
      updateTimeLeft(+1);
      updateScore(+1);
      highScore();
    }
  };

  $('#user-input').on('keyup', function () {
    startGame();
    checkAnswer(Number($(this).val()), currentQuestion.answer);
  });

  renderNewQuestion();
});
