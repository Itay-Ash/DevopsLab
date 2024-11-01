async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await axios.post('http://localhost:5000/login', { username, password });
        document.getElementById('message').innerText = response.data.message;
        localStorage.setItem('token', response.data.token);
    } catch (error) {
        document.getElementById('message').innerText = 'Invalid credentials';
    }
}
