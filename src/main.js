document.addEventListener('DOMContentLoaded', function() {
  netlifyIdentity.init();

  const loginButton = document.getElementById('login');
  const signupButton = document.getElementById('signup');
  const logoutButton = document.getElementById('logout');
  const chatDiv = document.getElementById('chat');
  const authDiv = document.getElementById('auth');
  const messageInput = document.getElementById('messageInput');
  const sendMessageButton = document.getElementById('sendMessage');
  const messagesDiv = document.getElementById('messages');

  netlifyIdentity.on('init', user => {
    if (user) {
      showChat();
      loadMessages();
    }
  });

  netlifyIdentity.on('login', user => {
    showChat();
    loadMessages();
  });

  netlifyIdentity.on('logout', () => {
    hideChat();
  });

  loginButton.addEventListener('click', () => {
    netlifyIdentity.open('login');
  });

  signupButton.addEventListener('click', () => {
    netlifyIdentity.open('signup');
  });

  logoutButton.addEventListener('click', () => {
    netlifyIdentity.logout();
  });

  sendMessageButton.addEventListener('click', async () => {
    const message = messageInput.value.trim();
    if (message !== '') {
      await sendMessage(message);
      messageInput.value = '';
    }
  });

  function showChat() {
    authDiv.style.display = 'none';
    chatDiv.style.display = 'block';
    logoutButton.style.display = 'block';
  }

  function hideChat() {
    authDiv.style.display = 'block';
    chatDiv.style.display = 'none';
    logoutButton.style.display = 'none';
  }

  async function sendMessage(message) {
    const user = netlifyIdentity.currentUser();
    if (user) {
      const response = await fetch('/.netlify/functions/messages', {
        method: 'POST',
        body: JSON.stringify({ userId: user.id, message }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        loadMessages();
      }
    }
  }

  async function loadMessages() {
    const user = netlifyIdentity.currentUser();
    if (user) {
      const response = await fetch('/.netlify/functions/fetchMessages');
      if (response.ok) {
        const messages = await response.json();
        displayMessages(messages);
      }
    }
  }

  function displayMessages(messages) {
    messagesDiv.innerHTML = '';
    messages.forEach(message => {
      const messageElement = document.createElement('div');
      messageElement.textContent = `${message.userId}: ${message.message}`;
      messagesDiv.appendChild(messageElement);
    });
  }
});
