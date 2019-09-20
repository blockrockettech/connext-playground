<template>
    <div class="container-fluid">

        <div id="nav">
            <router-link to="/">Home</router-link>
            |
            <router-link to="/about">About</router-link>
        </div>
        <router-view/>
    </div>
</template>
<script>
    // @ is an alias to /src
    export default {
        name: 'app',
        components: {},
        methods: {},
        created() {
        }
    };
</script>
<style lang="scss">

</style>
