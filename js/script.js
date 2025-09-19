document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todo-form');
    const taskInput = document.getElementById('task-input');
    const dateInput = document.getElementById('date-input');
    const todoList = document.getElementById('todo-list');
    const filterSelect = document.getElementById('filter-select');

    let todos = [];
    let editIndex = -1; // Menyimpan index tugas yang sedang diedit

    function renderTodos() {
        todoList.innerHTML = '';

        const filter = filterSelect.value;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const filteredTodos = todos.filter(todo => {
            const todoDate = new Date(todo.date);
            todoDate.setHours(0, 0, 0, 0);

            switch (filter) {
                case 'all':
                    return true;
                case 'today':
                    return todoDate.getTime() === today.getTime();
                case 'past': // Semua tanggal sebelum hari ini
                    return todoDate.getTime() < today.getTime();
                case 'upcoming': // Semua tanggal setelah hari ini
                    return todoDate.getTime() > today.getTime();
                default:
                    return true;
            }
        });

        if (filteredTodos.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'Tidak ada tugas.';
            li.style.textAlign = 'center';
            li.style.color = '#777';
            todoList.appendChild(li);
            return;
        }

        filteredTodos.forEach(todo => {
            const index = todos.indexOf(todo);

            const li = document.createElement('li');
            li.className = 'todo-item';

            // Checkbox untuk checklist
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = todo.completed || false;
            checkbox.addEventListener('change', () => {
                toggleCompleted(index);
            });

            // Span untuk teks tugas
            const taskSpan = document.createElement('span');
            taskSpan.className = 'todo-text';
            taskSpan.textContent = todo.task;
            if (todo.completed) {
                taskSpan.style.textDecoration = 'line-through';
                taskSpan.style.color = '#777';
            } else {
                taskSpan.style.textDecoration = 'none';
                taskSpan.style.color = '#000';
            }

            const dateSpan = document.createElement('span');
            dateSpan.className = 'todo-date';
            dateSpan.textContent = new Date(todo.date).toLocaleDateString('id-ID');

            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => {
                startEditTodo(index);
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Hapus';
            deleteBtn.addEventListener('click', () => {
                deleteTodo(index);
            });

            // Susun elemen dalam li
            li.appendChild(checkbox);
            li.appendChild(taskSpan);
            li.appendChild(dateSpan);
            li.appendChild(editBtn);
            li.appendChild(deleteBtn);

            todoList.appendChild(li);
        });
    }

    function addTodo(task, date) {
        todos.push({ task, date, completed: false });
        renderTodos();
    }

    function updateTodo(index, task, date) {
        // Jangan ubah completed saat update tugas
        todos[index] = { ...todos[index], task, date };
        renderTodos();
    }

    function deleteTodo(index) {
        todos.splice(index, 1);
        renderTodos();
    }

    function toggleCompleted(index) {
        todos[index].completed = !todos[index].completed;
        renderTodos();
    }

    function validateInput(task, date) {
        const maxLength = 150; // batas karakter yang cukup longgar
        if (!task.trim()) {
            alert('Tugas tidak boleh kosong!');
            return false;
        }
        if (task.length > maxLength) {
            alert(`Tugas maksimal ${maxLength} karakter.`);
            return false;
        }
        if (!date) {
            alert('Tanggal harus diisi!');
            return false;
        }
        return true;
    }

    function startEditTodo(index) {
        const todo = todos[index];
        taskInput.value = todo.task;
        dateInput.value = todo.date;
        editIndex = index;
        form.querySelector('button').textContent = 'Update';
    }

    function resetForm() {
        taskInput.value = '';
        dateInput.value = '';
        editIndex = -1;
        form.querySelector('button').textContent = 'Tambah';
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const task = taskInput.value;
        const date = dateInput.value;

        if (!validateInput(task, date)) return;

        if (editIndex === -1) {
            addTodo(task, date);
        } else {
            updateTodo(editIndex, task, date);
        }

        resetForm();
    });

    filterSelect.addEventListener('change', () => {
        renderTodos();
    });

    renderTodos();
});