function uploadAnswers() {
    let answers = [];
    
    let answerControls = $('.answer');
    for (let i = 0; i < answerControls.length; i++){
        let ac = answerControls[i];

        if (ac.value) {
            answers.push({
                questionId: ac.id,
                userAnswer: ac.value
            });
        }
    }

    apiCall(answers);
}

function apiCall(answers) {
    $.ajax({
        url: '/quiz/answers/',
        type: 'POST',
        data: {
            answers: answers
        },
        success: (result) => {
            console.log('Success:'+result);
        },
        error: (err) => {
            console.log(err);
        }
    });
}