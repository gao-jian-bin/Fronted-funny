const todoInput = document.querySelector('#todoInput');
const addButton = document.querySelector('#addBtn');
const searchInput = document.querySelector('#searchInput');
const clearCompletedButton = document.querySelector('#clearCompletedBtn');
const todoList = document.querySelector('#todoList');
const summaryText = document.querySelector('#summaryText');
const detailText = document.querySelector('#detailText');
const statusText = document.querySelector('#statusText');

// 给新任务分配唯一 id，避免出现重复项
let nextId = 3;

// 这是页面真正的数据源
// 页面上显示的列表内容，都是根据这个数组渲染出来的
let todos = [
    { id: 1, title: '复习 querySelector 和 addEventListener', completed: true },
    { id: 2, title: '自己新增一条待办事项', completed: false },
];

// 搜索条件也是状态的一部分
let keyword = '';

// 更新顶部提示文字，并顺便切换提示状态
function setStatus(message, type = 'default') {
    statusText.textContent = message;
    statusText.dataset.state = type;
}

function getFilteredTodos() {
    const normalizedKeyword = keyword.trim().toLowerCase();

    if (!normalizedKeyword) {
        return todos;
    }

    // filter 的意思是：从原数组里“筛出”符合条件的项
    // 这里的条件就是标题里包含搜索关键字
    return todos.filter((todo) => todo.title.toLowerCase().includes(normalizedKeyword));
}

// 统计当前任务总数、已完成数和未完成数
function updateSummary() {
    const completedCount = todos.filter((todo) => todo.completed).length;
    const remainingCount = todos.filter((todo) => !todo.completed).length;

    summaryText.textContent = `当前一共有 ${todos.length} 条待办。`;
    detailText.textContent = `已完成 ${completedCount} 条，还剩 ${remainingCount} 条未完成。`;
}

// 根据 todos 数组，重新生成整个列表区域
// 核心思路：先改数据，再统一渲染页面
function renderTodos() {
    const visibleTodos = getFilteredTodos();

    // 没有任何任务，显示空状态
    if (todos.length === 0) {
        todoList.innerHTML = '<li class="empty">当前没有待办事项，先添加一条。</li>';
        updateSummary();
        return;
    }

    // 有任务，但搜索条件下没有命中结果
    if (visibleTodos.length === 0) {
        todoList.innerHTML = '<li class="empty">没有找到匹配的待办，试试别的关键词。</li>';
        updateSummary();
        return;
    }

    // map: 把数组里的每一项任务，转换成一段 HTML
    const todoHTML = visibleTodos.map((todo) => {
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
    const targetTodo = todos.find((todo) => todo.id === todoId);

    if (!targetTodo) {
        setStatus('没有找到要删除的待办。', 'error');
        return;
    }

    const shouldDelete = window.confirm(`确定删除这条待办吗？\n\n${targetTodo.title}`);

    if (!shouldDelete) {
        setStatus('已取消删除。');
        return;
    }

    // filter 会保留“不等于这个 id”的项
    // 也就是把目标项从数组里移除
    todos = todos.filter((todo) => todo.id !== todoId);
    renderTodos();
    setStatus('待办已删除。', 'success');
}

function clearCompletedTodos() {
    const completedCount = todos.filter((todo) => todo.completed).length;

    if (completedCount === 0) {
        setStatus('当前没有已完成的待办可以清空。', 'error');
        return;
    }

    todos = todos.filter((todo) => !todo.completed);
    renderTodos();
    setStatus(`已清空 ${completedCount} 条已完成待办。`, 'success');
}

function handleSearch() {
    keyword = searchInput.value;
    renderTodos();

    if (keyword.trim()) {
        setStatus(`正在搜索：${keyword.trim()}`);
        return;
    }

    setStatus('已清除搜索条件。');
}

// 点击“添加按钮”时，执行添加逻辑
addButton.addEventListener('click', addTodo);

// 在输入框按 Enter 时，也执行添加逻辑
todoInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addTodo();
    }
});

searchInput.addEventListener('input', handleSearch);
clearCompletedButton.addEventListener('click', clearCompletedTodos);

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
