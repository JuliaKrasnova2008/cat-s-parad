class Api {
    constructor(name) {//по имени привязывается база данных
        this.url = "https://cats.petiteweb.dev/api/single/" //тело запроса, которое никогда не меняется
        this.name = name;
    }
    //описываем метод Get
    getCats() {
        return fetch(`${this.url}${this.name}/show`) //fetch-запрос позволяет делать запрос на сервер(типо как в Постмен), по умолчанию работает как get-запрос
    }

    //описываем метод Post для добавления кота
    postCat(obj) {
        return fetch(`${this.url}${this.name}/add`, {//fetch-запрос позволяет делать запрос на сервер(типо как в Постмен),
            // по умолчанию работает как get-запрос, поэтому нужно вторым параметром передать объект с конфигурацией - method, headers, body
            //прописываем то, что добавляли в постман
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj) //нужно передать объект в формате json (строка), делаем методом JSON.stringify()
        })
    }

    //метод для удаления кота
    deleteCat(id) {
        //fetch-запрос позволяет делать запрос на сервер(типо как в Постмен), по умолчанию работает как get-запрос
        return fetch(`${this.url}${this.name}/delete/${id}`, {
            method: "DELETE"
        })
    }

    //метод, который получает информацию о котах по id
    getCatId(id) {
        return fetch(`${this.url}${this.name}/show/${id}`)
    }

    //метод для обновления информации о коте
    updateCat(obj, id) {
        return fetch(`${this.url}${this.name}/update/${id}`, {//fetch-запрос позволяет делать запрос на сервер(типо как в Постмен),
            // по умолчанию работает как get-запрос, поэтому нужно вторым параметром передать объект с конфигурацией - method, headers, body
            //прописываем то, что добавляли в постман
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj) //нужно передать объект в формате json (строка), делаем методом JSON.stringify()
        })
    }
}