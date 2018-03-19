exports.hasQuiz = userHasQuiz;
exports.getQuiz = getUserQuiz;
exports.getMostRecentlyFinishedQuiz = getMostRecentlyFinishedQuiz;
exports.getNewDifficulty = getNewDifficulty;
exports.quizBelongsToUser = quizBelongsToUser;

const { Quiz } = require('../models/');
const Op = require('sequelize').Op;

async function quizBelongsToUser(userId, quizId) {
    let quiz = await Quiz.findOne({
        where: {
            id: quizId,
            userId: userId
        }
    });

    return quiz != undefined;
}

async function userHasQuiz(user) {
    let quiz = await getUserQuiz(user);
    return quiz != undefined;
}

async function getUserQuiz(user) {
    return await Quiz.find({
        where: {
            userId: user.id,
            finishedOn: null
        }
    });
}

async function getNewDifficulty(user) {
    let quiz = await getMostRecentlyFinishedQuiz(user);
    
    let newDifficulty = 50;

    if (quiz) {
        // Calculate difficulty of next quiz based on last result and difficulty
        if (quiz.result >= 80) {
            newDifficulty = quiz.difficulty + 25;                
        }
        else if (quiz.result >= 70) {
            newDifficulty = quiz.difficulty + 20;
        }
        else if (quiz.result >= 60) {
            newDifficulty = quiz.difficulty + 10;
        }
        else if (quiz.result <= 20) {
            newDifficulty = quiz.difficulty - 20;
        }
        else if (quiz.result <= 40) {
            newDifficulty = quiz.difficulty - 10;
        }

        if (newDifficulty < 0) {
            newDifficulty = 0;
        }
        if (newDifficulty > 100) {
            newDifficulty = 100;
        }
    }

    return newDifficulty;
}

async function getMostRecentlyFinishedQuiz(user) {    
    return await Quiz.find({
        where: {
            userId: user.id,
            [Op.not]: [
                {finishedOn: null}
            ]
        },
        order: [['finishedOn', 'DESC']]
    });
}