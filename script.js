const BASE_URL = "https://opentdb.com/api.php?amount=11";
const TOTAL_CATEGORIES_URL = "https://opentdb.com/api_category.php";
let index = 0;
let score = 0;

// récupèrer les données de l'API
async function fetchData(url) {
    const response = await fetch(url);
    return response.json();
}

// récupérer la data des categories de API
async function fetchCategoriesFromAPI() {
    const data = await fetchData(TOTAL_CATEGORIES_URL);
    return data.trivia_categories;
}

// récupère les questions de l'API et renvoie un objet contenant les questions et les réponses.
async function fetchQuestionsFromAPI(url) {
    const data = await fetchData(url);
    if (data.response_code === 0) {
        const questions = data.results;
        const list = [];
        questions.forEach(element => {
            const question = {
                question: decodeChars(element.question),
                answers: shuffle(element.incorrect_answers.concat(element.correct_answer)), // il faudra décoder les caractères plus tard
                correct: decodeChars(element.correct_answer)
            }
            list.push(question);
        });
        return list;
    }
    return false;
}

// Algorithme de brassage des tableaux de Fisher-Yates
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i)
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
    return array;
}

// décode les caractères spéciaux HTML
function decodeChars(specialCharacterString) {
    const text = document.createElement('textarea');
    text.innerHTML = specialCharacterString;
    return text.value;
}

// définit le titre de la balise h1
function setTitle(string) {
    const title = document.getElementById('title');
    title.innerText = string;
}

// supprime les boutons de la balise div
function removeButtons() {
    const div = document.getElementById('buttons');
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}

// mettre le numéro de la question en bas du quizz
function setQuestionNumber() {
    let questionNumber = index + 1;
    const h1Element = document.getElementById('question-number');
    h1Element.classList.add('number');
    h1Element.innerText = questionNumber + '/10';
}

// mettre le bouton à chaque question
function setQuestionButtons(list, answers, correct) {
    const div = document.getElementById('buttons');
    setQuestionNumber();
    answers.forEach(element => {
        const button = document.createElement('button');
        const text = document.createTextNode(decodeChars(element)); // décocade des caractères spéciaux
        button.appendChild(text);
        button.classList.add('btn');
        div.appendChild(button);
        button.addEventListener('click', () => questionButtonEventHandler(button, correct, list));
    });
}

// lancement de l'événement lors de l'activation du bouton
function questionButtonEventHandler(button, correctAnswer, list) {
    const pressedButton = button.innerText;
    if (pressedButton === correctAnswer) {
        score++;
        alert('Correct!');
    } else {
        alert('Wrong.\nCorrect Answer: ' + correctAnswer);
    }
    index++;
    removeButtons();
    startQuiz(list);
}

// enlever le numéro de la question en bas
function removeQuestionNumber() {
    const h1Element = document.getElementById('question-number');
    h1Element.classList.remove('number');
    h1Element.innerText = '';
}