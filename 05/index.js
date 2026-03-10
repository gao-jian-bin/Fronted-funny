import loginAPI from './api.js';

const loginButton = document.querySelector('#loginBtn');
const usernameInput = document.querySelector('#usernameInput');
const statusText = document.querySelector('#statusText');

function setStatus(message, type = 'default') {
    statusText.textContent = message;
    statusText.dataset.state = type;
}

async function handleUserLogin() {
    const username = usernameInput.value.trim();

    if (!username) {
        setStatus('Please enter a username.', 'error');
        usernameInput.focus();
        return;
    }

    loginButton.disabled = true;
    setStatus('Logging in...', 'loading');

    try {
        const result = await loginAPI(username);
        setStatus(
            `${result.message}. Welcome, ${result.user.nickname}.`,
            'success'
        );
    } catch (error) {
        setStatus(error.message, 'error');
        console.error(error);
    } finally {
        loginButton.disabled = false;
    }
}

loginButton.addEventListener('click', handleUserLogin);

usernameInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleUserLogin();
    }
});
