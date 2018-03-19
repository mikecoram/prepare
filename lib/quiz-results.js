exports.getLatestQuizResult = getLatestQuizResult;
exports.getFinishedQuizzes = getFinishedQuizzes;
exports.getUsersWithResultInfo = getUsersWithResultInfo;

const { Quiz, User } = require('../models/');
const USER_ROLE = require('../constants').USER_ROLE.USER;
const QuizUser = require('./quiz-user');
const Op = require('sequelize').Op;
const DateHelper = require('./date-helper');

async function getLatestQuizResult(user) {
    let quiz = await QuizUser.getMostRecentlyFinishedQuiz(user);
    return quiz.result;  
}

async function getFinishedQuizzes(user) {
    let quizzes = await Quiz.findAll({
        where: {
            userId: user.id,
            [Op.not]: [
                {finishedOn: null}
            ]
        },
        order: [['finishedOn', 'DESC']]
    });

    return quizzes;
}

async function getUsersWithResultInfo() {
    let users = await User.findAll({
        where: {
            role: USER_ROLE
        },
        include: [{
            model: Quiz,
            as: 'quizzes',
            where: {
                [Op.not]: {
                    finishedOn: null
                }
            }
        }]
    });

    return formatUserData(users);
}

function formatUserData(rawUsers) {
    let formattedUsers = [];

    for (let user of rawUsers) {
        let mrFinished, mrResult, mrDifficulty;
        let numQuizzes = 0;

        if (user.quizzes) {
            let mostRecentQuiz = user.quizzes.sort((a, b) => { 
                return a.finishedOn > b.finsihedOn; 
            })[user.quizzes.length - 1];

            mrFinished = mostRecentQuiz.finishedOn;
            mrResult = mostRecentQuiz.result;
            mrDifficulty = mostRecentQuiz.difficulty;
            numQuizzes = user.quizzes.length;
        }

        formattedUsers.push({
            id: user.id,
            emailAddress: user.emailAddress,
            numQuizzes: numQuizzes,
            mostRecentQuizFinishedDate: DateHelper.format(mrFinished),
            mostRecentQuizDifficulty: mrDifficulty,
            mostRecentQuizResult: mrResult
        });
    }

    return formattedUsers;
}