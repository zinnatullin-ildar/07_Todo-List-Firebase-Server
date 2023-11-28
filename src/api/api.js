import {
    get, // фукция для получения данных
    query, // функция для организации сортировки и фильтрации, где первым аргументом идет ref(), а вторым orderByChild()
    orderByChild, // функция производящая упорядочивание по дочернему элементу, принимает соответствующее поле
    ref, // функция предоставляющая ссылку на таблицу в базе данных
    push, // фукция для создания, где первым аргументом идет ref(), а вторым требуемые данные
    set, // фукция для обновления, где первым аргументом идет ref() с указанием конкретного id, а вторым требуемые данные
    remove, // фукция для удаления, где первым аргументом идет ref() с указанием конкретного id
} from "firebase/database";
import { db } from "../firebase";

// CRUD
// Из-за урезанного функционала Firebase на сервере реализована только сортировка, поиск реализован на клиентской стороне.
// В правила Realtime Database вносим следующий код:
// "todos": {
//     ".indexOn": ["id", "title"],
//     },

const todosDbRef = ref(db, "todos");

export const createTodo = (newTodo) =>
    push(todosDbRef, newTodo).then(({ key }) => key); // извлекаем id через свойство key
// аналог метода POST

export const readTodos = (searchPhrase = "", isAlphabetSorting = false) => {
    const sortingField = isAlphabetSorting ? "title" : "id"; // выбор по какому полю будет сортировка

    return get(query(todosDbRef, orderByChild(sortingField))).then(
        (snapshot) => {
            let loadedTodos = []; // соблюдаем получение данных в первоначальном формате массив объектов

            snapshot.forEach((loadedTodo) => {
                const id = loadedTodo.key; // через свойство key находим id
                const { title, completed } = loadedTodo.val(); // с помощью функции val() извлекаем данные todo
                loadedTodos.push({ id, title, completed }); // заполняем массив новым todo
            }); // упорядочевание списка todo и его сортировка

            if (searchPhrase !== "") {
                loadedTodos = loadedTodos.filter(
                    ({ title }) =>
                        title
                            .toLowerCase()
                            .indexOf(searchPhrase.toLowerCase()) >= 0,
                );
            } // регистронезависимый поиск по полю title

            return isAlphabetSorting ? loadedTodos : loadedTodos.reverse();
        },
    );
}; // аналог метода GET

export const updateTodo = (todoData) =>
    set(ref(db, `todos/${todoData.id}`), todoData); // аналог метода PUT, обновляемые данные указываются в полном объеме

export const deleteTodo = (todoId) => remove(ref(db, `todos/${todoId}`)); // аналог метода DELETE
