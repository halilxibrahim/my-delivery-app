<template>
  <div class="login-container">
    <div class="bento-box">
      <div class="login-header">
        <h1>Hoş Geldiniz</h1>
        <p>Devam etmek için lütfen giriş yapın</p>
      </div>
      
      <form @submit.prevent="login" class="login-form">
        <div class="form-group">
          <label>Kullanıcı Adı</label>
          <InputText 
            v-model="username" 
            placeholder="Kullanıcı adınızı girin"
            class="p-inputtext-lg" />
        </div>
        
        <div class="form-group">
          <label>Şifre</label>
          <Password 
            v-model="password" 
            placeholder="Şifrenizi girin"
            class="p-password-lg"
            :feedback="false" />
        </div>

        <div class="form-footer">
          <Button 
            type="submit" 
            label="Giriş Yap" 
            class="login-button" />
          <a href="#" class="forgot-password">Şifremi unuttum?</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';

export default {
  components: { InputText, Password, Button },
  setup() {
    const username = ref('');
    const password = ref('');
    const store = useStore();
    const router = useRouter();

    const login = () => {
      if (username.value === 'admin' && password.value === 'password') {
        store.dispatch('login', { username: username.value });
        router.push('/home');
      } else {
        alert('Invalid credentials');
      }
    };

    return { username, password, login };
  },
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.bento-box {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 40px;
  width: 100%;
  max-width: 480px;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    inset 0 2px 4px rgba(255, 255, 255, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header h1 {
  font-size: 2.5rem;
  color: #1a1a1a;
  margin-bottom: 8px;
  font-weight: 700;
}

.login-header p {
  color: #666;
  font-size: 1.1rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 0.95rem;
  color: #4a5568;
  font-weight: 500;
}

:deep(.p-inputtext),
:deep(.p-password input) {
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
  font-size: 1rem;
}

:deep(.p-inputtext:focus),
:deep(.p-password input:focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

:deep(.p-password) {
  width: 100%;
}

.form-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
}

.login-button {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  color: white;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.login-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.forgot-password {
  color: #6b7280;
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s ease;
}

.forgot-password:hover {
  color: #3b82f6;
}

@media (max-width: 640px) {
  .bento-box {
    padding: 24px;
  }
  
  .login-header h1 {
    font-size: 2rem;
  }
}
</style>