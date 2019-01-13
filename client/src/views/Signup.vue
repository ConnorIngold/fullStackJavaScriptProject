<template>
  <section>
    <h1>Sign up</h1>
    <div v-if="signingUp">
      <img src="../assets/loading.svg" alt="">
    </div>
    <div v-if="errorMessage" class="alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>
    <form v-if="!signingUp" @submit.prevent="signup">
      <div class="form-group form-row">
        <label for="Username">Username</label>
        <input
          v-model="user.username"
          type="text"
          class="form-control"
          id="Username"
          aria-describedby="usernameName"
          required
          placeholder="Enter a username"
        >
        <small
          id="usernameHelp"
          class="form-text text-muted"
        >Username must be longer than 2 charaters and shorter than 30.</small>
      </div>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="password">Password</label>
          <input
            v-model="user.password"
            type="password"
            class="form-control"
            id="password"
            aria-describedby="password"
            required
            placeholder="Password"
          >
          <small
            id="passwordHelp"
            class="form-text text-muted"
          >Password must be longer than 8 charaters</small>
        </div>
        <div class="form-group col-md-6">
          <label for="confirmPassword">Confirm Password</label>
          <input
            v-model="user.confirmPassword"
            type="password"
            class="form-control"
            id="confirmPassword"
            aria-describedby="confirmPassword"
            required
            placeholder="Confirm Password"
          >
          <small id="passwordPasswordHelp" class="form-text text-muted">Please confirm password</small>
        </div>
      </div>
      <button type="submit" class="btn btn-primary">Signup</button>
    </form>
  </section>
</template>


<script>
import Joi from "joi";

const SIGNUP_URL = "http://localhost:3000/auth/signup";

const schema = Joi.object().keys({
  username: Joi.string()
    .regex(/(^[a-zA-Z0-9_]+$)/)
    .min(2)
    .max(30)
    .required(),
  password: Joi.string()
    .trim()
    .min(10)
    .required(),
  confirmPassword: Joi.string()
    .trim()
    .min(10)
    .required()
});

export default {
  data: () => ({
    signingUp: false,
    errorMessage: "",
    user: {
      username: "",
      password: "",
      confirmPassword: ""
    }
  }),
  watch: {
    user: {
      handler() {
        this.errorMessage = "";
      },

      deep: true
    }
  },
  methods: {
    signup() {
      if (this.validUser()) {
        const body = {
          username: this.user.username,
          password: this.user.password
        };
        this.signingUp = true;
        fetch(SIGNUP_URL, {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "content-type": "application/json"
          }
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            }

            reponse.json().then(error => {
              throw new Error(error.message);
            });
          })
          .then(() => {
            setTimeout(() => {
              this.signUp = false;
              this.$router.push('/login');
            }, 1000);
            this.signingUp = false;
            this.$router.push("/login");
          })
          .catch(error => {
            setTimeout(() => {
              this.signUp = false;
              this.$router.push('/login');
            }, 1000);
            this.signingUp = false;
            this.errorMessage = error.message;
          });
      }
    },
    validUser() {
      if (this.user.password !== this.user.confirmPassword) {
        this.errorMessage = "Passwords do not match";
        return false;
      }

      const result = Joi.validate(this.user, schema);
      if (result.error === null) {
        return true;
      }
      if (result.error.message.includes("username")) {
        this.errorMessage = "username is invalid";
      } else {
        this.errorMessage = "password error";
      }
      return false;
    }
  }
};
</script>
