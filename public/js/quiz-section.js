(function () {
    // Upload answers every 5 seconds
    setInterval(uploadAnswers, 5000);
})();

function uploadAnswers() {
    let answers = [];
    
    let answerControls = $('.answer');
    for (let i = 0; i < answerControls.length; i++){
        let ac = answerControls[i];

        if (ac.value) {
            answers.push({
                questionId: ac.id,
                userOutput: ac.value
            });
        }
    }

    if (answers.length > 0) {
        apiCall(answers);
    }
}

function apiCall(answers) {
    $.ajax({
        url: '/quiz/answers/',
        type: 'POST',
        data: {
            sectionNum: sectionNum,
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