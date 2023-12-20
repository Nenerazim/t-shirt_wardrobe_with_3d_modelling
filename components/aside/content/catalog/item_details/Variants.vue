<template>
    <div class="tab-content">
        <div class="items">
            <div class="elements" v-for="(element, i) in defaultItem.settings.elements" :key="i">
                <span class="type-header">{{element.name}}</span>
                <div class="grid-row variants">
                    <div class="item" v-for="(item, i) in element.options" :key="i" v-on:click="saveSettings(element.model_name, item)">
                        <img :src="itemImage" width="124" height="122" :alt="item.name" class="item-image">
                        <span>{{item.name}}</span>
                    </div>
                </div>
                <!--<a href="#" class="show-btn" v-on:click="showMore">+ Показать все</a>-->
            </div>
        </div>
        <a href="#" class="reset-button" v-on:click="resetSettings">Сбросить элементы</a>
    </div>
</template>

<script>
export default {
    props: {
        defaultItem: Object,
    },
    data () {
        return {
            activeItem: null,
            itemImage: require('@/assets/media/img/demo-e.png'),
        }
    },
    computed: {
        editedItem() {
            return this.$store.getters['wardrobe/editedItem']
        }
    },
    methods: {
        reloadModel: function(defaultsArray) {
            for (let i = 0; i < defaultsArray.length; i++) {
                this.$eventHub.$emit('dummy:dummy_reload_tshirt', defaultsArray[i]['model_name'], defaultsArray[i]['model_type'], defaultsArray[i]['color'])
            }
        },
        reloadCard: function(defaultsArray) {
            for (let i = 0; i < defaultsArray.length; i++) {
              this.$eventHub.$emit('wardrobe:dummy_reload_tshirt', defaultsArray[i])
            }
        },
        saveSettings: function(type, item) {
            let settings = {newSetting: item, settingCategory: type}
            this.$store.commit('wardrobe/change', settings)
            this.reloadModel(this.editedItem.settings)
        },
        resetSettings: function () {
            this.$store.commit('wardrobe/reset', this.editedItem)
            this.reloadModel(this.editedItem.settings)
            this.reloadCard(this.editedItem.settings)
        }
    }
}
</script>
