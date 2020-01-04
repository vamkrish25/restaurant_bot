
window.onload = () => {
    // createErrorResponse('Welcome to Andy’s. I am your virtual Assistant and can help you book a table. Would you like to proceed. <Yes> / <No>')
    receiveResponseMessage('hello');
}
let userCategory, responseCategory = 'initial';
let validations = (message) => {
    const regex = /(guests|date|time)/gi;
    let match = responseCategory.match(regex);
    if (match) {
        let valid;
        switch (match[0]) {
            case 'guests':
                valid = message < 9 && message > 0 ? true : false;
                return valid;
            case 'time':
                let timeMatch = /([89][:.])(00|15|30|45)/
                valid = message.match(timeMatch) ? true : false;
                return valid;
            case 'date':
                let match = (/(?<date>\d{1,2})\/(?<month>\d{1,2})\/(?<year>\d{2,4})/gi).exec(message)
                if(match){
                    const date = new Date();
                    if(date.getDate() <= match.groups.date && (match.groups.date - date.getDate() ) < 3 && (date.getMonth()+ 1) == match.groups.month && date.getFullYear() == match.groups.year){
                        return true
                    }
                    return false
                }
                let date = new Date(new Date(message).setFullYear('2020'));
                console.log('enterred date ::: ', date)
                let currDate = new Date();
                console.log('diff of days  ::: ', Math.ceil((date.getTime() - currDate.getTime()) / (1000 * 3600 * 24)))
                valid = date && Math.ceil((date.getTime() - currDate.getTime()) / (1000 * 3600 * 24)) < 3 && Math.ceil((date.getTime() - currDate.getTime()) / (1000 * 3600 * 24)) >= 0 ? true : false
                return valid;
            default:
                return true;
        }
    } else {
        return true
    }
}

let createElement = (end, str) => {
    let container = document.createElement('div');
    container.classList.add(`${end}-container`);
    let element = document.createElement('div');
    let message = document.createElement('p');
    element.classList.add(`${end}-message`);
    message.textContent = str;
    element.appendChild(message);
    container.appendChild(element);
    console.log(message);
    return container;
};

let messagesFrame = document.getElementById('messages');
let input = document.getElementById('input');
let mainContainer = document.getElementById('main-container');
input.focus();
let receiveResponseMessage = (userMessage) => {
    let element;
    let obj = { "question": userMessage };

    let response = fetch(`http://localhost:3000/getAns`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({ "question": userMessage }),
    }).then(response => {
        return response.json();
    }).then(data => {
        console.log('data::', data);
        responseCategory = data;
        element = createElement('response', data);
        messagesFrame.appendChild(element);
        mainContainer.scrollTop = mainContainer.scrollHeight;
    });
};

function createErrorResponse(message) {
    element = createElement('response', message);
    messagesFrame.appendChild(element);
    mainContainer.scrollTop = mainContainer.scrollHeight;
}

let createUserMessage = () => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
    let element;
    element = createElement('user', input.value);
    messagesFrame.appendChild(element);
    if (validations(input.value)) {
        receiveResponseMessage(input.value);
    } else if (input.value.includes('tonight') || input.value.includes('today')) {
        let date = new Date()
        console.log(`${date.getDate()} ${monthNames[date.getMonth()]} user sent`)
        receiveResponseMessage(`${date.getDate()} ${monthNames[date.getMonth()]}`)
    } else if (input.value.includes('tomorrow')) {
        let currDate = new Date();
        currDate.setDate(currDate.getDate() + 1)
        console.log(`${currDate.getDate()} ${monthNames[currDate.getMonth()]} user sent`)
        receiveResponseMessage(`${currDate.getDate()} ${monthNames[currDate.getMonth()]}`)
    } else {
        createErrorResponse('Invalid input. Please enter the correct value')
    }
    input.value = "";
    input.focus();
};
let sendAction = document.getElementById('send');
sendAction.addEventListener('click', () => {
    createUserMessage();
});

input.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        sendAction.click();
    }
});
console.log('messages Frame:: ', messagesFrame)
