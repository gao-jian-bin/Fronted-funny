const todoInput = document.querySelector('#todoInput');
const addButton = document.querySelector('#addBtn');
const todoList = document.querySelector('#todoList');
const summaryText = document.querySelector('#summaryText');
const statusText = document.querySelector('#statusText');

// 给新任务分配唯一 id，避免出现重复项
let nextId = 3;

// 这是页面真正的数据源
// 页面上显示的列表内容，都是根据这个数组渲染出来的
let todos = [
    { id: 1, title: '复习 querySelector 和 addEventListener', completed: true },
    { id: 2, title: '自己新增一条待办事项', completed: false },
];

// 更新顶部提示文字，并顺便切换提示状态
function setStatus(message, type = 'default') {
    statusText.textContent = message;
    statusText.dataset.state = type;
}

// 统计当前任务总数和已完成数
function updateSummary() {
    const completedCount = todos.filter((todo) => todo.completed).length;
    summaryText.textContent = `当前一共有 ${todos.length} 条待办，已完成 ${completedCount} 条。`;
}

// 根据 todos 数组，重新生成整个列表区域
// 核心思路：先改数据，再统一渲染页面
function renderTodos() {
    // 如果没有任何任务，显示空状态
    if (todos.length === 0) {
        todoList.innerHTML = '<li class="empty">当前没有待办事项，先添加一条。</li>';
        updateSummary();
        return;
    }

    // map: 把数组里的每一项任务，转换成一段 HTML
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

    // 一次性更新页面里的列表内容
    todoList.innerHTML = todoHTML;
    updateSummary();
}

// 添加任务
// 触发时机：
// 1. 点击“添加按钮”
// 2. 在输入框按 Enter
function addTodo() {
    // trim() 会去掉首尾空格，防止输入空白字符也被添加进去
    const title = todoInput.value.trim();

    // 没有输入有效内容，就提示并结束
    if (!title) {
        setStatus('请输入待办内容后再添加。', 'error');
        todoInput.focus();
        return;
    }

    // 先把新任务对象准备好
    const newTodo = {
        id: nextId,
        title,
        completed: false,
    };

    // 再更新数据源
    nextId += 1;
    todos.push(newTodo);

    // 最后刷新页面和提示信息
    todoInput.value = '';
    renderTodos();
    setStatus(`已添加待办：${title}`, 'success');
    todoInput.focus();
}

// 切换某一项的完成状态
function toggleTodo(todoId) {
    // map 会返回一个新数组
    // 如果 id 对上了，就把 completed 反过来；其余项原样返回
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

// 删除某一项任务
function deleteTodo(todoId) {
    // filter 会保留“不等于这个 id”的项
    // 也就是把目标项从数组里移除
    todos = todos.filter((todo) => todo.id !== todoId);
    renderTodos();
    setStatus('待办已删除。', 'success');
}

// 点击“添加按钮”时，执行添加逻辑
addButton.addEventListener('click', addTodo);

// 在输入框按 Enter 时，也执行添加逻辑
todoInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addTodo();
    }
});

// 给整个列表容器绑定一次点击事件
// 这叫事件委托：由父元素统一处理子元素按钮的点击
todoList.addEventListener('click', (event) => {
    const target = event.target.closest('button');

    // 如果点到的不是按钮，就不处理
    if (!target) {
        return;
    }

    // 从按钮上的 data-* 属性中，取出当前点击的任务 id 和动作类型
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

// 页面首次加载时，先按照默认数据渲染一遍
renderTodos();
