<template>
    <div class="items-catalog">
        <v-dialog />
        <Sizes />
        <div class="catalog-head">
            <div class="name">{{defaultItem.name}}</div>
            <span class="material">{{defaultItem.short_desc}}</span>
            <div @click="close()" class="back-button">
                <img src="~/assets/media/img/back.svg" alt="Назад">
            </div>
        </div>
        <div class="catalog-full-desc">
            <div class="heading">Описание</div>
            <div v-if="defaultItem.desc">
                <p v-if="defaultItem.desc.length < 100">{{defaultItem.desc}}</p>
                <p v-else>{{setDescription(defaultItem.desc)}}... <span class="all" @click="showFullDesc(defaultItem.desc)">Показать все описание</span></p>
            </div>
            <div class="heading">Размеры в наличии</div>
            <div class="sizes">
                <div class="size" v-for="(size, i) in defaultItem.sizes" :key="i" v-bind:class="{active: size.name === editedItem.activeSize}" @click="setActiveSize(size)">
                    {{size.name}}
                </div>
                <div class="sizes-table" @click="() => this.$modal.show('sizes-table')">Таблица размеров</div>
            </div>
            <div class="to-cart">
                Цена:
                <div class="price-block">
                    <span class="price">{{defaultItem.start_price}} Р</span>
                    <button @click="toCart(editedItem)">Добавить в корзину</button>
                </div>
            </div>
        </div>
        <ul class="customize-tabs">
            <li v-bind:class="{ active: activeTab === 'Variants' }" v-on:click="setTabActive('Variants')">Элементы</li>
            <li v-bind:class="{ active: activeTab === 'Colors' }" v-on:click="setTabActive('Colors')">Цвет</li>
        </ul>
        <LazyNuxtDynamic
            v-if="dynamicComponent"
            :is="dynamicComponent"
            :defaultItem="defaultItem"
        />
    </div>
</template>

<script>
import Sizes from './item_details/Sizes'
export default {
    name: 'ItemDetails',
    components: {
        Sizes
    },
    data () {
        return {
            dynamicComponent: null,
            activeTab: 'Variants',
        }
    },
    computed: {
        defaultItem() {
            return this.$store.getters['wardrobe/baseItem']
        },
        editedItem() {
            return this.$store.getters['wardrobe/editedItem']
        }
    },
    mounted() {
        this.dynamicComponent = () => import(`./item_details/${this.activeTab}.vue`)
    },
    methods: {
        setTabActive: function (tab) {
            this.activeTab = tab
            this.dynamicComponent = () => import(`./item_details/${this.activeTab}.vue`)
        },
        setDescription(desc) {
            let description = desc.substr(0, 100)
            return description
        },
        showFullDesc(desc) {
            this.$modal.show('dialog', {
                title: 'Описание',
                text: desc,
                buttons: [
                    {
                        title: 'Закрыть',
                        handler: () => {
                            this.$modal.hide('dialog')
                        }
                    },
                ]
            })
        },
        setActiveSize: function (size) {
            this.$store.commit('wardrobe/setSize', size)
        },
        toCart: function (item) {
            this.$store.commit('cart/add', item)
        },
        close: function () {
            this.$store.commit('wardrobe/stopEditing')
        }
    }
}
</script>
