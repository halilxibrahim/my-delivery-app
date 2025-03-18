<template>
    <div class="login-container">
      <h1>Login</h1>
      <form @submit.prevent="login">
        <InputText v-model="username" placeholder="Username" />
        <Password v-model="password" placeholder="Password" />
        <Button type="submit" label="Login" />
      </form>
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
  .login-container { padding: 20px; }
  </style>