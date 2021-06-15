/* Задание 1
Сверстайте кнопку, которая будет содержать в себе icon_01 (как в примере в последнем видео). 
При клике на кнопку иконка должна меняться на icon_02. Повторный клик меняет иконку обратно. */

function pageLoaded(){
    const button = document.querySelector('.button');
    const buttonTurnOn = document.querySelector('#icon_one');
    const buttonTurnOff = document.querySelector('#icon_two');
    let iconChange = true;

    button.addEventListener('click', function(){
        if (iconChange = !iconChange){
            buttonTurnOn.style.display = 'inline';
            buttonTurnOff.style.display = 'none';
        } else {
            buttonTurnOn.style.display = 'none';
            buttonTurnOff.style.display = 'inline';
            }

            return iconChange;
    });

        }

document.addEventListener("DOMContentLoaded",pageLoaded);