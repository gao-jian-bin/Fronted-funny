const todoInput = document.querySelector('#todoInput');
const addButton = document.querySelector('#addBtn');
const todoList = document.querySelector('#todoList');
const summaryText = document.querySelector('#summaryText');
const statusText = document.querySelector('#statusText');

let nextId = 3;

let todos = [
    { id: 1, title: '复习 querySelector 和 addEventListener', completed: true },
    { id: 2, title: '自己新增一条待办事项', completed: false },
];

function setStatus(message, type = 'default') {
    statusText.textContent = message;
    statusText.dataset.state = type;
}

function updateSummary() {
    const completedCount = todos.filter((todo) => todo.completed).length;
    summaryText.textContent = `当前一共有 ${todos.length} 条待办，已完成 ${completedCount} 条。`;
}

function renderTodos() {
    if (todos.length === 0) {
        todoList.innerHTML = '<li class="empty">当前没有待办事项，先添加一条。</li>';
        updateSummary();
        return;
    }

    const todoHTML = todos.map((todo) => {
        const tagText = todo.completed ? '已完成' : '进行中';
        const toggleText = todo.completed ? '设为未完成' : '设为完成';

        return `
            <li class="todo-item ${todo.completed ? 'completed' : ''}">
                <span class="todo-title">${todo.title}</span>
                <span class="tag">${tagText}</span>
                <div class="actions">
                    <button class="action-btn" data-action="toggle" data-id="${todo.id}" type="button">
                        ${toggleText}
                    </button>
                    <button class="action-btn delete" data-action="delete" data-id="${todo.id}" type="button">
                        删除
                    </button>
                </div>
            </li>
        `;
    }).join('');

    todoList.innerHTML = todoHTML;
    updateSummary();
}

function addTodo() {
    const title = todoInput.value.trim();

    if (!title) {
        setStatus('请输入待办内容后再添加。', 'error');
        todoInput.focus();
        return;
    }

    const newTodo = {
        id: nextId,
        title,
        completed: false,
    };

    nextId += 1;
    todos.push(newTodo);
    todoInput.value = '';
    renderTodos();
    setStatus(`已添加待办：${title}`, 'success');
    todoInput.focus();
}

function toggleTodo(todoId) {
    todos = todos.map((todo) => {
        if (todo.id === todoId) {
            return {
                ...todo,
                completed: !todo.completed,
            };
        }

        return todo;
    });

    renderTodos();
    setStatus('待办状态已更新。', 'success');
}

function deleteTodo(todoId) {
    todos = todos.filter((todo) => todo.id !== todoId);
    renderTodos();
    setStatus('待办已删除。', 'success');
}

addButton.addEventListener('click', addTodo);

todoInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addTodo();
    }
});

todoList.addEventListener('click', (event) => {
    const target = event.target.closest('button');

    if (!target) {
        return;
    }

    const todoId = Number(target.dataset.id);
    const action = target.dataset.action;

    if (action === 'toggle') {
        toggleTodo(todoId);
        return;
    }

    if (action === 'delete') {
        deleteTodo(todoId);
    }
});

renderTodos();
