/* Задание 2
Сверстайте кнопку, клик на которую будет выводить данные о размерах экрана с помощью alert.
*/

const btn = document.querySelector('.btn');

btn.addEventListener('click', () => {
  alert(`Высота вашего экрана (с учётом полосы прокрутки) ${window.innerHeight}, а Ширина ${window.innerWidth}`)
})
