const api = new Api("julia")
const $spinner = document.querySelector("[data-spinner]")//достаем по дата-атрибуту
const $wrapper = document.querySelector("[data-wrapper]")//достаем по дата-атрибуту контейнер для элемента

const $modalShow = document.querySelector("[data-modal-info]")//достаем по дата-атрибуту контейнер для модального окна
const $imgShow = document.querySelector("#image") //достаем картинку по id
const $nameShow = document.querySelector(".cat__name")
const $ageShow = document.querySelector("#age")
const $rageShow = document.querySelector("#rate")
const $likeShow = document.querySelector(".like")

const $modalEdit = document.querySelector("[data-modal-edit]")//достаем по дата-атрибуту контейнер для модального окна

const $closeBtn = document.querySelectorAll("#close-modal")

const $addBtn = document.querySelector("[data-add_button]")
const $modalAdd = document.querySelector("[data-modal]")

const $error = document.querySelector("#error")
const $errorEdit = document.querySelector("#error-edit")



//функция, которая генерит карточки с котами
async function generateCats() {//async-ассинхронная, внутри нее будет происходить ассинхронные действия
    $spinner.classList.remove("hidden")//удаляем класс, спинер показывается

    const response = await api.getCats() //async await-ждем ответ от сервера и заносим в переменную("подожди пока фпи получит всех котов, а потом занести в конс респонс")
    const data = await response.json() //переводим формат json, в привычный js

    $wrapper.innerHTML = null; //перед заполнением контейнера мы его очищаем

    //закрываем модалки для редактирования, когда происходит submit
    $modalEdit.classList.add("hidden")

    //все, что внутри setTimeout выполнится с задержкой 1000милисек.
    setTimeout(() => {
        $spinner.classList.add("hidden")//добавляем класс, спинер скрывается

        data.forEach(element => {
            //insertAdjacentHTML("beforeend") - добавляет элемент в разметку по указанной позиции
            $wrapper.insertAdjacentHTML("beforeend", generateCatHtml(element))//добавляются по функции html-эл с разметкой
        });
    }, 500)

}

generateCats()

//закрытие модалки по крестику
$closeBtn.forEach((elem) => { //проходимося по всем кнопкам
    elem.addEventListener("click", (evt) => { //на каждый элемент вешаем событие по клику
        const modal = evt.target.closest(".modal-wrapper") //находим модальные окна по общему классу
        modal.classList.add('hidden') //вешаем на них класс hidden
    })
})

//функция, которая генерит html-элементы
function generateCatHtml(cat) {
    return `<div data-card_id=${cat.id} class="card mx-2" style="width: 18rem;">
    <img src="${cat.image}" class="card-img-top" alt="${cat.name}">
    <div class="card-body">
      <h5 class="card-title">${cat.name}</h5>
      <button data-action="show" class="btn btn-primary">Show</button>
      <button data-action="delete" class="btn btn-danger">Delete</button>
      <button data-action="edit" class="btn btn-success">Edit</button>
    </div>
    </div>`
}

//открытие модалки "Добавить"
$addBtn.addEventListener("click", () => {
    $modalAdd.classList.remove("hidden")
})

//обработчик события на отправку формы при добавлении новой карточки кота
document.forms.catsForm.addEventListener("submit", (evt) => {
    evt.preventDefault() //по умалчанию при отправке формы происходить перезагрузка страницы, мы отменяем это действие
    //запись, которая преобразует ВСЕ поля форма в объект. КАК ИЗ ФОРМЫ ДОСТАТЬ ВСЕ ЗНАЧЕНИЯ В ОБЪЕКТ
    //Object.fromEntries - создает объект из ключей инпутов
    //new FormData(evt.target).entries()) - достает поля формы в ключи
    const data = Object.fromEntries(new FormData(evt.target).entries());
    //если data.favorite равно "on", то data.favorite - true
    data.favorite = data.favorite === "on";
    data.id = +data.id //в data.id записываем тоже data.id, но в виде числа
    data.rate = +data.rate
    data.age = +data.age
    //вызываю метод добавления кота у апи
    api.postCat(data).then((response) => { //надо подождать, когда отправится новая карточка на сервер и только потом показать на странице
        return response.ok ? generateCats() : response.json(); //если ответ от сервера (response.ok) пришел положительный, иначе возвращаем ответ от сервера
    }).then((error) => {
        $error.innerHTML = error.message; //в поле ошибки (html) добавляем сообщение об ошибке
    })
})


//функция, которая получает инфо о коте по id
async function getCatById(id) {
    const response = await api.getCatId(id) //async await-ждем ответ от сервера и получаем кота по id
    const data = await response.json() //переводим формат json, в привычный js

    return data; //возвращаем данные из функции
}

//вешаем обработчик события на отправку формы (при редактировании)
//если есть форма, то обработчик события нужно вешать не на кнопку, а на саму submit формы. Потому что форма должна соблюсти валидацию,
//если просто будем нажимать на кнопку, то будет отправляться невалидная форма
//НА ВСЕ ОБРАБОТЧИКИ СОБЫТИЙ ПЕРЕДАЕМ EVENT
document.forms.catsFormEdit.addEventListener("submit", (evt) => {
    evt.preventDefault() //по умалчанию при отправке формы происходить перезагрузка страницы, мы отменяем это действие

    const formCatId = document.forms.catsFormEdit.id.value;

    //запись, которая преобразует ВСЕ поля форма в объект. КАК ИЗ ФОРМЫ ДОСТАТЬ ВСЕ ЗНАЧЕНИЯ В ОБЪЕКТ
    //Object.fromEntries - создает объект из ключей инпутов
    //new FormData(evt.target).entries()) - достает поля формы в ключи
    const data = Object.fromEntries(new FormData(evt.target).entries());

    //если data.favorite равно "on", то data.favorite - true
    data.favorite = data.favorite === "on";

    //вызываем метод для обновления информации о коте
    api.updateCat(data, formCatId).then((response) => { //ждем и вызываем функцию, которая генерит всех котов на стр, чтобы увидеть измененных котов
        return response.ok ? generateCats() : response.json();
    }).then((error) => {
        $errorEdit.innerHTML = error.message;
    })

})

//добавляю обработчик собитий по клику
$wrapper.addEventListener("click", (evt) => {
    console.log(evt.target.dataset.action)
    //Конструкция switch заменяет собой сразу несколько if. 
    //Если соответствие установлено – switch начинает выполняться от соответствующей директивы case и далее, до ближайшего break (или до конца switch)
    switch (evt.target.dataset.action) {
        case "delete":
            const currentCard = evt.target.closest('[data-card_id]') //методом closest ищу ближ родителя с указанным классом
            const currentId = currentCard.dataset.card_id
            api.deleteCat(currentId)
            currentCard.remove()//удаляем весь html у текущего кота
            break;
        case "show":
            const currentCardShow = evt.target.closest('[data-card_id]') //методом closest ищу ближ родителя с указанным классом
            const currentIdShow = currentCardShow.dataset.card_id
            $spinner.classList.remove("hidden")//удаляем класс, спинер показывается
            api.getCatId(currentIdShow).then((response) => {//then, как await-ждем ответ от сервера, response - ответ, который должен приходить от Api
                return response.json() //переводим формат json, в привычный js
            })
                .then((data) => { //.then - ждем пока выполнется все то, что было раньше
                    $imgShow.src = data.image
                    $nameShow.innerHTML = data.name
                    $ageShow.innerHTML = data.age
                    $rageShow.innerHTML = data.rate

                    //если дата-favorite это true, то $likeShow показываем, block - это значит показываем, иначе none - скрываем
                    data.favorite ? $likeShow.style.display = "block" : $likeShow.style.display = "none"
                    //все, что внутри setTimeout выполнится с задержкой 1000милисек.
                    setTimeout(() => {
                        $spinner.classList.add("hidden")//добавляем класс, спинер скрывается
                        $modalShow.classList.remove("hidden")//у модалки убираем класс хидем, те показываем
                    }, 500)

                })
            break;
        case "edit":
            console.log("редактировать")
            const currentCardEdit = evt.target.closest('[data-card_id]') //методом closest ищу ближ родителя с указанным классом
            const currentIdEdit = currentCardEdit.dataset.card_id

            $spinner.classList.remove("hidden")//удаляем класс, спинер показывается

            getCatById(currentIdEdit).then((data) => {
                //document.forms- содержит все форма на странице, через точку обращаемся по name формы  и через т очку к ее полю
                document.forms.catsFormEdit.id.value = data.id;
                document.forms.catsFormEdit.name.value = data.name;
                document.forms.catsFormEdit.description.value = data.description;
                document.forms.catsFormEdit.image.value = data.image;
                document.forms.catsFormEdit.age.value = data.age;
                document.forms.catsFormEdit.rate.value = data.rate;
                document.forms.catsFormEdit.favorite.checked = data.favorite;
            })
            setTimeout(() => {
                $spinner.classList.add("hidden")//добавляем класс, спинер скрывается
                $modalEdit.classList.remove("hidden")//у модалки убираем класс хидем, те показываем
            }, 500)
            break;

        default:
            break;
    }

})