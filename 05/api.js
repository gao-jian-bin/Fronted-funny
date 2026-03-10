function loginAPI(username) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (username === 'gaojianbin') {
                resolve({
                    message: 'Login successful',
                    user: {
                        username: 'gaojianbin',
                        nickname: '你彬爷爷',
                    },
                });
                return;
            }

            reject(new Error('Login failed: username not found'));
        }, 500);
    });
}

export default loginAPI;
