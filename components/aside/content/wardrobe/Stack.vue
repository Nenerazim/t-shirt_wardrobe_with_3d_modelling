<template>
    <div class="stack">
        <div class="stack-content">
            <div class="stack-top">
                <span>Мой гардероб</span>
                <div class="stack-counter">
                    {{wardrobe.length}}/5
                </div>
            </div>
            <client-only>
                <div class="add-model-tip" v-if="wardrobe.length === 0">
                    <img :src="plusImg">
                    <span>Добавьте модель</span>
                </div>
            </client-only>
            <div class="selected-items">
                <div class="selected-item" v-for="item in wardrobe" :key="item.index" v-bind:class="{active: item.index === editedItem}">
                    <div class="main-block">
                        <div class="eye-hidden" v-bind:class="{active: item.type in active && active[item.type] === item.index}"><img src="~/assets/media/img/hidden.svg" alt="Иконка показа товара"></div>
                        <div class="wardrobe-model">
                            <WardrobeCard :settings="item.settings" :id="item.index" />
                        </div>
                        <span class="price">{{item.start_price}} ₽</span>
                        <div class="controls">
                            <div class="control-btn" @click="remove(item)"><img src="~/assets/media/img/close.svg"></div>
                            <div class="control-btn" @click="show(item)"><img src="~/assets/media/img/eye.svg"></div>
                            <div class="control-btn" @click="copy(item)"><img src="~/assets/media/img/copy.svg"></div>
                            <div class="control-btn" @click="toCart(item)"><img src="~/assets/media/img/cart.svg"></div>
                        </div>
                    </div>
                    <div class="action-edit"><button @click="edit(item)">Редактор</button></div>
                </div>
            </div>
        </div>
        <div class="remove-button" v-on:click="removeAll">Удалить все</div> 
    </div>
</template>

<script>
import WardrobeCard from '~/components/WardrobeCard'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
export default {
    name: 'Stack',
    components: {
        WardrobeCard
    },
    data() {
        return {
            itemImage:  require('@/assets/media/img/std_tshirt.png'),
            plusImg : require('@/assets/media/img/plus.png'),
        }
    },
    computed: {
        ...mapState('wardrobe', ['editedItem']),
        ...mapState('wardrobe', ['active']),
        ...mapGetters('wardrobe', ['wardrobe'])
    },
    methods: {        
        remove: function (item) {
            this.$modal.show('dialog', {
                title: 'Подвтержение удаления!',
                text: 'Вы уверены что хотите удалить вещь со всеми её конфигурациями?',
                buttons: [ 
                    { title: 'Нет', handler: () => { this.$modal.hide('dialog') } },
                    { title: 'Да',
                        handler: () => {
                            this.$modal.hide('dialog')

                            this.$store.commit('wardrobe/remove', item)


                            if (this.editedItem === item.index || this.wardrobe.length === 0) {
                                this.$store.commit('wardrobe/stopEditing')
                            }

                        }
                    },
                ]
            }) 
        },
        show: function(item) { //Показ/Скрытие Активного элемента одежды
            let settings = {item: item, clear: false}
            if (item.type in this.active && this.active[item.type] === item.index) {
                settings.clear = true
            }
            this.activeClothes(settings)
        },
        edit: function(item) { //Редактирование элемента гардероба
            this.setEditingItem(item)
        },
        copy: function(item) { //Копирование элемента гардероба
            if(this.wardrobe.length < 5) {
                this.copy(item)
            } else {
                this.$modal.show('dialog', { 
                    title: 'Достигнут лимит гардероба!', 
                    text: 'При копировании достигнут лимит гардероба, удалите одну или несколько вещей чтобы освободить место',
                    buttons: [
                        { title: 'Понятно', handler: () => { this.$modal.hide('dialog') } }
                    ]
                })
            }
        },
        removeAll: function() { //Удаление всех элементов гардероба
            this.$modal.show('dialog', {
                title: 'Подвтержение удаления!',
                text: 'Вы уверены что хотите удалить все вещи со всеми их конфигурациями?',
                buttons: [
                    { title: 'Нет', handler: () => { this.$modal.hide('dialog') } },
                    { title: 'Да',  handler: () => { this.clearAll(), this.$modal.hide('dialog') } }
                ]
            })     
        },
        toCart: function(item) { //Добавление в корзину
            this.add(item)
        },
        ...mapActions('wardrobe', ['clearAll']), //Очистка всего гардероба
        ...mapActions('wardrobe', ['setEditingItem']), //Экшн редактирования элемента гардероба
        ...mapActions('wardrobe', ['activeClothes']), //Активная/Неактивная одежда
        ...mapMutations('wardrobe', ['resetAll']), //Сброс всех настроек
        ...mapMutations('wardrobe', ['copy']), //Мутация копирования товара
        ...mapMutations('cart', ['add']) //Добавление в корзину
    },
    mounted() {
        this.resetAll() //Сброс всех настроек при загрузке страницы
    }
}
</script>