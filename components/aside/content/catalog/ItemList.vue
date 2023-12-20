<template>
    <div class="items-list">
        <ul class="items-list-head">
            <li v-bind:class="{ active: activeTab === 'Base' }" v-on:click="setTabActive('Base')">Базовые модели</li>
            <li v-bind:class="{ active: activeTab === 'Set' }" v-on:click="setTabActive('Set')">Готовые образы</li>
        </ul>
        <LazyNuxtDynamic
            v-if="dynamicComponent" 
            :is="dynamicComponent"
        />
    </div>
</template>

<script>
    export default {
        name: 'ItemDetails',
        data () {
            return {
                dynamicComponent: null,
                activeTab: 'Base'
            }
        },
        mounted() {
            this.dynamicComponent = () => import(`./item_list/${this.activeTab}.vue`)
        },
        methods: {            
            setTabActive: function (tab) {
                this.activeTab = tab
                this.dynamicComponent = () => import(`./item_list/${this.activeTab}.vue`)
            }
        }
    }
</script>