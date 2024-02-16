document.addEventListener('DOMContentLoaded', function() {
    loadTasks();

    // Обработчик событий для отображения формы добавления задачи
    document.getElementById('showTaskInformerBtn').addEventListener('click', function() {
        var taskForm = document.getElementById('taskForm');
        if (taskForm.style.display === 'block') {
            taskForm.style.display = 'none';
        } else {
            taskForm.style.display = 'block';
            document.getElementById('taskInput').focus();
        }
    });

    

    // Обработчик событий для добавления новой задачи
    document.getElementById('confirmTaskBtn').addEventListener('click', function() {
        var taskText = document.getElementById('taskInput').value.trim();
        var taskDescription = document.getElementById('taskDescriptionInput').value.trim();
        if (isValidTask(taskText)) {
            addTask(taskText, taskDescription);
            saveTasks();
            document.getElementById('taskForm').style.display = 'none';
            document.getElementById('taskInput').value = '';
            document.getElementById('taskDescriptionInput').value = '';
        }
    });

    // Обработчик событий для отмены добавления задачи
    document.getElementById('cancelTaskBtn').addEventListener('click', function() {
        document.getElementById('taskForm').style.display = 'none';
    });

    // Обработчик событий для поиска по названиям задач
    document.getElementById('searchInput').addEventListener('input', function() {
        var searchQuery = this.value.trim().toLowerCase();
        var taskItems = document.querySelectorAll('.task-list-item');
        taskItems.forEach(function(taskItem) {
            var taskText = taskItem.textContent.trim().toLowerCase();
            if (taskText.includes(searchQuery)) {
                taskItem.style.display = 'block';
            } else {
                taskItem.style.display = 'none';
            }
        });
    });

    // Обработчик событий для раскрытия/скрытия дополнительной информации внутри задачи
    document.addEventListener('click', function(event) {
        var taskItem = event.target.closest('.task-list-item');
        if (taskItem) {
            var allTaskItems = document.querySelectorAll('.task-list-item');
            allTaskItems.forEach(function(item) {
                if (item !== taskItem) {
                    item.setAttribute('data-expanded', 'false');
                }
            });

            var isExpanded = taskItem.getAttribute('data-expanded') === 'true';
            taskItem.setAttribute('data-expanded', isExpanded ? 'false' : 'true');
        }
    });

    // Функция для проверки валидности задачи
    function isValidTask(taskText) {
        if (taskText.length === 0 || taskText.length > 64) {
            alert('Задача должна содержать от 1 до 64 символов.');
            return false;
        }
        if (!/^[а-яА-Яa-zA-Z]/.test(taskText)) {
            alert('Задача должна начинаться с буквы.');
            return false;
        }
        return true;
    }

    // Функция для добавления новой задачи
    function addTask(taskText, taskDescription) {
        var taskList = document.getElementById('taskList');
        var taskItem = document.createElement('div'); // Создаем внешний контейнер
        taskItem.classList.add('task-list-item');
        taskItem.setAttribute('data-expanded', 'false'); // Изначально свернутая задача

        // Создаем элемент для названия задачи
        var title = document.createElement('h6');
        title.classList.add('task-title');
        title.textContent = taskText;

        // Создаем иконку для выполнения задачи
        var checkIcon = document.createElement('i');
        checkIcon.classList.add('bi', 'bi-check2-circle');
        checkIcon.setAttribute('aria-hidden', 'true');

        // Создаем иконку для срочной задачи
        var urgentIcon = document.createElement('i');
        urgentIcon.classList.add('bi', 'bi-exclamation-triangle-fill');
        urgentIcon.setAttribute('aria-hidden', 'true');

        // Добавляем иконки в заголовок
        title.appendChild(checkIcon);
        title.appendChild(urgentIcon);

        // Добавляем заголовок в элемент задачи
        taskItem.appendChild(title);

        // Создаем элемент для описания задачи
        var descriptionPara = document.createElement('p');
        descriptionPara.classList.add('task-description');
        descriptionPara.textContent = taskDescription;
        taskItem.appendChild(descriptionPara);

        // Создаем кнопку удаления
        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить';
        deleteButton.classList.add('delete-task-btn');
        taskItem.appendChild(deleteButton);

        taskList.appendChild(taskItem);
    }

    // Функция для сохранения задач в локальном хранилище
    function saveTasks() {
        var taskItems = document.querySelectorAll('.task-list-item');
        var tasks = [];
        taskItems.forEach(function(taskItem) {
            var taskText = taskItem.querySelector('.task-title').textContent.trim();
            var taskDescription = taskItem.querySelector('.task-description').textContent.trim();
            tasks.push({ text: taskText, description: taskDescription });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Функция для загрузки задач из локального хранилища
    function loadTasks() {
        var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(function(task) {
            addTask(task.text, task.description);
        });
    }

    // Функция для перемещения задачи в раздел выполненных задач
    function moveToCompletedTasks(taskItem) {
        var completedTasksList = document.getElementById('completedTasksList');
        var clonedTaskItem = taskItem.cloneNode(true);

        taskItem.remove();

        clonedTaskItem.classList.add('completed-task');
        completedTasksList.appendChild(clonedTaskItem);
    }

    // Функция для переключения статуса выполнения задачи
    function toggleCompleted(circleBtn) {
        circleBtn.classList.toggle('bi-check2-circle');
        var taskItem = circleBtn.closest('.task-list-item');
        moveToCompletedTasks(taskItem);
    }

    // Обработчик событий для переключения звездочки задачи и выполнения задачи
    document.addEventListener('click', function(event) {
        var starBtn = event.target.closest('.bi-exclamation-triangle-fill');
        var circleBtn = event.target.closest('.bi-check2-circle');

        if (starBtn) {
            toggleStarred(starBtn);
        } else if (circleBtn) {
            toggleCompleted(circleBtn);
        }
    });

    // Функция для переключения звездочки задачи
    function toggleStarred(starBtn) {
        starBtn.classList.toggle('bi-exclamation-triangle-fill-fill');
    }

    // Обработчик событий для добавления задачи
    document.addEventListener('mouseover', function(event) {
        var starBtn = event.target.closest('.bi-exclamation-triangle-fill');
        if (starBtn) {
            starBtn.classList.add('bi-exclamation-triangle-fill-half');
        }
    });

    // Обработчик событий для удаления задачи с подтверждением
    document.addEventListener('click', function(event) {
        var deleteTaskBtn = event.target.closest('.delete-task-btn');
        if (deleteTaskBtn) {
            var modal = new bootstrap.Modal(document.getElementById('deleteTaskModal'));
            modal.show();
            document.getElementById('confirmDeleteTaskBtn').addEventListener('click', function() {
                var taskItem = deleteTaskBtn.closest('.task-list-item');
                taskItem.remove();
                modal.hide();
                saveTasks();
            });
        }
    });

    // Обработчик событий для переключения режима темной темы
    const darkModeToggle = document.getElementById('darkModeToggle');

    darkModeToggle.addEventListener('change', function() {
        const isDarkMode = this.checked;

        const root = document.documentElement;

        if (isDarkMode) {
            root.style.setProperty('--main-bg', "var(--main-bg-dark)");
            root.style.setProperty('--second-bg', "var(--second-bg-dark)");
            root.style.setProperty('--main-bg-line', "var(--main-bg-dark-line)");
            root.style.setProperty('--main-bg-text', "var(--main-bg-text-light)");
            root.style.setProperty('--main-bg-tumbler', "var(--header-color)");
            root.style.setProperty('--main-bg-tumblerborder', "var(--color1)");
            root.style.setProperty('--main-bg-holderss', "var(--second-bg-dark)");
            root.style.setProperty('--main-bg-color2', "var(--second-bg-light)");
            root.style.setProperty('--elements', "var(--main-bg-dark-line2)");

        } else {
            root.style.setProperty('--main-bg', "var(--main-bg-light)");
            root.style.setProperty('--second-bg', "var(--second-bg-light)");
            root.style.setProperty('--main-bg-line', "var(--main-bg-light-line)");
            root.style.setProperty('--main-bg-text', "var(--main-bg-text-dark)");
            root.style.setProperty('--main-bg-tumbler', "var(--second-bg-light)");
            root.style.setProperty('--main-bg-tumblerborder', "var(--main-bg-dark-line)");
            root.style.setProperty('--main-bg-holderss', "var(--second-bg-light)");
            root.style.setProperty('--main-bg-color2', "var(--main-bg-text-dark)");
            root.style.setProperty('--elements', "var(--second-bg-light)");

        }
    });
});
