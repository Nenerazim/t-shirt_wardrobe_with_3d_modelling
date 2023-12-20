<template>
    <div class="gender-block">
        <label class="checkbox-green">
            <input type="checkbox" v-on:change="sexchange" v-model="sexcheck">
            <span class="checkbox-green-switch" data-label-on="Женщина" data-label-off="Мужчина"></span>
        </label>
    </div>
</template>

<script>
    export default {
        name: 'Gender',
        data () {
            return {
                sexcheck: false,
            }
        },
        methods: {
            sexchange: function () {
                this.$store.commit('wardrobe/changeGender', (this.sexcheck ? 'woman' : 'man'))
            }
        }
    }
</script>