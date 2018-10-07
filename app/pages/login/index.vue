<script>
  import loginForm from '~/components/forms/login.vue'

  export default {
    'transition': 'fade-zoom',
    'components': {
      loginForm,
    },
    data () {
      return {
        'loginData': {
          'username': '',
          'password': '',
        },
      }
    },
    'methods': {
      async login () {
        try {
          await this.$store.dispatch('session/login', this.loginData)
          this.$router.push('/')
        } catch (error) {
          console.error(error)
          this.$toast.error(error.message, 'Error')
        }
      },
    },
    mounted () {
      if (this.viewer) {
        this.$router.push({
          'path': '/',
        })
      }
    },
  }
</script>

<style lang="scss" scoped>
  .ouc-centered {
    margin: 0 auto;
  }
</style>

<template lang="pug">
  div.ouc-route-root
    .section(slot="form").ouc-form-section
      .container(style="max-width: 500px;").ouc-centered
        .box.ouc-form-box
          h3 Log in to OpenUserCSS
          hr
          login-form(:submit="login", v-model="loginData")
</template>
