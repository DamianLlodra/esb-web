<template>
  <!-- <div class="mt-2 flex flex-row justify-center">
    <div class="flex flex-col">
      <h4>Ingreso</h4>
      <Notification v-if="error" type="danger" :message="error" />
      <form
        class="m-2 flex flex-col justify-center"
        method="post"
        @submit.prevent="login"
      >
        <div class="object-cover">
          <label>Email</label>
          <div>
            <input
              v-model="email"
              class="border-2 border-green-300 focus:border-green-500"
              type="email"
              name="email"
            />
          </div>
        </div>
        <div>
          <label>Clave</label>
          <div>
            <input
              v-model="password"
              class="border-2 border-green-300 focus:border-green-500"
              type="password"
              name="password"
            />
          </div>
        </div>

        <button class="mt-2" type="submit">Ingresar</button>
      </form>
      <div class="mt-2">
        <p>
          ¿Aun no tiene cuenta?
          <nuxt-link to="/register">Registrese</nuxt-link>
        </p>
        <p>
          <nuxt-link to="/forgot">¿Olvido su clave?</nuxt-link>
        </p>
      </div>
    </div>
  </div> -->

  <div class="w-full h-screen flex items-center justify-center">
    <form class="w-full md:w-1/3 bg-white rounded-lg" @submit.prevent="login">
      <h2 class="text-3xl text-center text-gray-700 mb-4">Ingreso</h2>
      <div class="px-12 pb-10">
        <div class="w-full mb-2">
          <div class="flex items-center">
            <i
              class="ml-3 fill-current text-gray-400 text-xs z-10 fas fa-user"
            ></i>
            <input
              v-model="email"
              type="email"
              placeholder="Email"
              class="
                -mx-6
                px-8
                w-full
                border
                rounded
                px-3
                py-2
                text-gray-700
                focus:outline-none
              "
            />
          </div>
        </div>
        <div class="w-full mb-2">
          <div class="flex items-center">
            <i
              class="ml-3 fill-current text-gray-400 text-xs z-10 fas fa-lock"
            ></i>
            <input
              v-model="password"
              type="text"
              placeholder="Clave"
              class="
                -mx-6
                px-8
                w-full
                border
                rounded
                px-3
                py-2
                text-gray-700
                focus:outline-none
              "
            />
          </div>
        </div>
        <nuxt-link
          to="/auth/forgot"
          class="text-xs text-gray-500 float-right mb-4"
          >¿Olvido su clave?</nuxt-link
        >
        <button
          type="submit"
          class="
            w-full
            py-2
            rounded-full
            bg-green-400
            text-gray-100
            focus:outline-none
          "
        >
          Ingresar
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import Notification from '~/components/Notification.vue';
export default {
  components: {
    Notification,
  },
  data() {
    return {
      email: '',
      password: '',
      error: null,
    };
  },
  methods: {
    async login() {
      this.error = null;
      try {
        await this.$auth.loginWith('local', {
          data: {
            identifier: this.email,
            password: this.password,
          },
        });
        this.$router.push('/catalogue');
      } catch (e) {
        this.error = e.response.data.message[0].messages[0].message;
      }
    },
  },
};
</script>
