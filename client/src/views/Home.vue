<template>
  <div class="home text-center">
    <div class="jumbotron">
      <h1 class="display-3">Hello, world!</h1>
      <p class="lead">
        This is a simple hero unit.
      </p>
      <hr class="my-4">
      <p>
        It uses utility classes for typography and spacing to
      </p>
      <p class="lead">
        <router-link class="btn btn-primary btn-lg"
        :to="{ name:'signup' }"
        role="button">Sign up</router-link>
      </p>
    </div>
  </div>
</template>
 <!-- should match the name in the router -->
<script>
// @ is an alias to /src


</script>

<style>
</style>
