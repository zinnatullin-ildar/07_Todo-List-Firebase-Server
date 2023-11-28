// 3. Переделать приложение из второго пункта, используя Firebase (без использования JSON Server):
// зарегистрироваться на платформе Firebase;
// создать базу данных и использовать её в приложении;
// выполнить deploy и проверить работу приложения.

import { useState, useEffect } from "react";
import styles from "../toDoList.module.css";
import { Todo } from "../todo/todo";
import { ControlPanel } from "../controlPanel/controlPanel";
import { createTodo, readTodos, updateTodo, deleteTodo } from "../../api"; // CRUD для сервера
import {
    addTodoInTodos,
    setTodoInTodos,
    removeTodoInTodos,
    findTodo,
} from "../../utils"; // CRUD для стейта состояния
import { NEW_TODO_ID } from "../../constants";

export const ToDoListFirebaseServer = () => {
    const [todos, setTodos] = useState([]);
    const [searchPhrase, setSearchPhrase] = useState(""); // состояние для поиска
    const [isAlphabetSorting, setIsAlphabetSorting] = useState(false); // флаг для сортировки

    // Создание нового дела или сохранение дела после редактирования
    const onTodoAdd = () => {
        setTodos(addTodoInTodos(todos));
    };

    const onTodoSave = (todoId) => {
        const { title, completed } = findTodo(todos, todoId) || {};

        if (todoId === NEW_TODO_ID) {
            createTodo({ title, completed }).then((id) => {
                let updatedTodos = setTodoInTodos(todos, {
                    id: NEW_TODO_ID,
                    isEditing: false,
                });
                updatedTodos = removeTodoInTodos(updatedTodos, NEW_TODO_ID);
                updatedTodos = addTodoInTodos(updatedTodos, {
                    id,
                    title,
                    completed,
                });
                setTodos(updatedTodos);
            });
        } else {
            updateTodo({ id: todoId, title, completed }).then(() => {
                setTodos(
                    setTodoInTodos(todos, { id: todoId, isEditing: false }),
                );
            });
        }
    };
    // После успешного ответа сервера:
    // - если на создание в базе данных, то создаем новое todo в начале массива
    // todos;
    // если на обновление в базе данных, то меняем title для нужного id и
    // полученными данными обновляем стейт состояния.

    // Редактирование дела
    const onTodoEdit = (id) => {
        setTodos(setTodoInTodos(todos, { id, isEditing: true }));
    };

    const onTodoTitleChange = (id, newTitle) => {
        setTodos(setTodoInTodos(todos, { id, title: newTitle }));
    };

    // Смена статуса у законченного дела
    const onTodoCompletedChange = (id, newCompleted) => {
        const { title } = findTodo(todos, id) || {};

        updateTodo({ id, title, completed: newCompleted }).then(() => {
            setTodos(setTodoInTodos(todos, { id, completed: newCompleted }));
        });
    };

    // Удаление дела
    const onTodoRemove = (id) => {
        deleteTodo(id).then(() => setTodos(removeTodoInTodos(todos, id)));
    };
    // После успешного ответа сервера на удаление в базе данных удаляем todo
    // по нужного id и полученными данными обновляем стейт состояния.

    // Получение todos
    useEffect(() => {
        readTodos(searchPhrase, isAlphabetSorting).then((loadedTodos) =>
            setTodos(loadedTodos),
        );
    }, [searchPhrase, isAlphabetSorting]);
    // При изменении в массиве зависимостей будет срабатывать хук useEffect() и
    // будут заново считываться и выводится данные с сервера

    return (
        <>
            <h2>Список дел</h2>
            <div className={styles.app}>
                <ControlPanel
                    onTodoAdd={onTodoAdd}
                    onSearch={setSearchPhrase}
                    onSorting={setIsAlphabetSorting}
                />
                {todos.map(({ id, title, completed, isEditing = false }) => (
                    <Todo
                        key={id}
                        id={id}
                        title={title}
                        completed={completed}
                        isEditing={isEditing} // флаг для редактирования
                        onEdit={() => onTodoEdit(id)}
                        onTitleChange={(newTitle) =>
                            onTodoTitleChange(id, newTitle)
                        }
                        onCompletedChange={(newCompleted) =>
                            onTodoCompletedChange(id, newCompleted)
                        }
                        onSave={() => onTodoSave(id)}
                        onRemove={() => onTodoRemove(id)}
                    />
                ))}
            </div>
        </>
    );
};
