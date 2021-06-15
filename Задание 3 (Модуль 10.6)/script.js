/* Задание 3
Реализовать чат на основе эхо-сервера wss://echo.websocket.org/
Интерфейс состоит из input, куда вводится текст сообщения, и кнопки «Отправить».

При клике на кнопку «Отправить» сообщение должно появляться в окне переписки.
Добавить в чат механизм отправки гео-локации:
При клике на кнопку «Гео-локация» необходимо отправить данные серверу и в чат 
вывести ссылку на https://www.openstreetmap.org/ с вашей гео-локацией. Сообщение, которое отправит обратно эхо-сервер, не выводить.
*/


const chatWindow = document.querySelector('.container')
const messageOut = document.querySelector('.messages');
const buttonSend = document.querySelector('.buttonSend');
const buttonGeo = document.querySelector('.buttonGeo');
const messageInput = document.querySelector('.message');
let websocket = new WebSocket('wss://echo.websocket.org/');
chatWindow.ondragstart = () => false;
chatWindow.addEventListener('mousedown', function(e) {
    
    chatWindow.style.position = 'absolute';
    let offX = e.offsetX;
    let offY = e.offsetY;
  
    function moveWindow(event) {
        chatWindow.style.left = event.pageX - offX + 'px';
        chatWindow.style.top = event.pageY - offY + 'px';
    }
    function endMovement() {
        document.body.removeEventListener('mousemove', moveWindow);
        document.body.removeEventListener('mouseup', endMovement);
    }
    document.body.addEventListener('mouseup', endMovement);
    let isContainer = e.target.classList.value.includes('container');
    if(isContainer) {
        document.body.addEventListener('mousemove', moveWindow);
    }
});
class Message {
    constructor(type) {
        this.type = type,
        this.content = {},
        this.timestamp = new Date().getTime();
    }
}

function printMessage(msg, direction) {
    const p = document.createElement('P');
    p.classList.add(direction);
    const span = document.createElement('SPAN');
    span.textContent = msg;
    p.appendChild(span);
    messageOut.appendChild(p);
}
function getLocation() {
    return new Promise(function(resolve, reject){
        const geo = navigator.geolocation;
        geo.getCurrentPosition( position => resolve(position), err => reject(console.log(new Error(err))) );
    });
}

function sendLocation(location) {
    let lat = location.coords.latitude;
    let long = location.coords.longitude;
    let position = new Message('geolocation');
    position.content = {
        latitude: lat,
        longitude: long,
        accuracy: location.coords.accuracy,
    }
    let json = JSON.stringify(position);
    let a = document.createElement('A');
    a.href = `https://www.openstreetmap.org/#map=16/${lat}/${long}`;
    a.textContent = 'Я здесь!';
    a.target = '_blank';
    a.style.textDecoration = 'none';
    a.style.color = '#1684DF';
    let span = document.createElement('SPAN');
    span.appendChild(a)
    let p = document.createElement('P');
    p.classList.add('myMessage');
    p.appendChild(span);
    messageOut.appendChild(p);
   
    websocket.send(json);
}

function sendMessage(msgText) {
    let message = new Message('text');
    if(typeof msgText === 'string') {
        message.content.text = msgText;
        printMessage(msgText, 'myMessage');
        websocket.send(JSON.stringify(message));
    } else console.log('This type of content is not supported yet');
}
function receiveMessage(msgJSON) {
    let message = JSON.parse(msgJSON);
    if (message.type === 'text') {
        let text = message.content.text;
        printMessage(text, 'oppMessage');
    }
}
websocket.onopen = function () {
    console.log('websocket open');
    buttonSend.addEventListener('click', () => {
        let message = messageInput.value;
        messageInput.value = '';
        if (message) sendMessage(message);
    });
}
    buttonGeo.addEventListener('click', async () => {
        let location = await getLocation();
        sendLocation(location);
    });
    websocket.onmessage = function(msg) {
        receiveMessage(msg.data);
    }
    websocket.onerror = function(event) {
        console.log('Error: ' + event.data);
    }