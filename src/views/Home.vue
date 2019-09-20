<template>
    <div>
        <div class="row">
            <div class="col">
                <b-button v-on:click="connect">Connect</b-button>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'home',
        components: {
        },
        methods:{
            connect(){
                this.$store.dispatch('connect');
            }
        }
    };
</script>
