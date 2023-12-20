<template>
    <div class="tab-content">
        <div class="items">
            <div class="colors-block">
                <span class="colors-header" v-if="modelToChange">
                    {{ modelToChange.name }}
                </span>
                <ul class="color-checker">
                    <li v-for="(color, i) in defaultItem.settings.colors" :key="i">
                        <a href="#" v-bind:style="{ 'background-color': color.hex }" v-bind:class="{active: modelToChange.color === color.hex}" :title="color.name" v-on:click="changecolor(color.hex)"></a>
                    </li>
                </ul>
            </div>
            <div class="elements">
                <div class="grid-row variants">
                    <div class="item" v-bind:class="{ active: activeElement === null }" v-on:click="setActive(null, {name: 'Основной', model_name: 'all'})">
                        <img :src="itemImage" width="124" height="122" alt="Основной" class="item-image">
                        <span>Основной</span>
                    </div>
                    <div class="item" v-for="(element, i) in defaultItem.settings.elements" :key="i" v-bind:class="{ active: i === activeElement }" v-on:click="setActive(i, element)">
                        <img :src="itemImage" width="124" height="122" :alt="element.name" class="item-image">
                        <span>{{ element.name }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="reset-button" @click="clearColors">Сбросить цвета</div>
    </div>
</template>

<script>
export default {
    props: {
        defaultItem: Object,
    },
    data () {
        return {
            activeElement: null,
            modelToChange: {
                name: 'Основной',
                model_name: 'all',
                color: null
            },
            itemImage: require('@/assets/media/img/demo-e.png'),
        }
    },
    computed: {
        editedItem() {
            return this.$store.getters['wardrobe/editedItem']
        }
    },
    methods: {
        setActive: function(index, element) {
            this.activeElement = index
            this.modelToChange = element
            let el = this.editedItem.settings.find(setting => setting.model_name === element.model_name)
            if (el !== void 0 && 'color' in el) {
                this.modelToChange.color = el.color
                console.log(this.modelToChange)
            }
        },
        changecolor: function (color) {
            this.modelToChange.color = color
            if (this.modelToChange.model_name === 'all') {
                for (let i = 0; i < this.defaultItem.settings.elements.length; i++) {
                    let settings = {
                        color: color,
                        settingCategory: this.defaultItem.settings.elements[i].model_name,
                    }
                    this.$store.commit('wardrobe/changeColor', settings)
                    this.$eventHub.$emit('dummy:changecolor_tshirt', this.defaultItem.settings.elements[i].model_name, color)
                }
            } else {
                let settings = {
                    color: color,
                    settingCategory: this.modelToChange.model_name,
                }
                this.$store.commit('wardrobe/changeColor', settings)
                this.$eventHub.$emit('dummy:changecolor_tshirt', this.modelToChange.model_name, color)
            }
        },
        clearColors: function () {
            this.$store.commit('wardrobe/removeColors', this.editedItem)
            this.defaultItem.settings.elements.forEach(element => {
                const itemName = element.model_name
                const defaultColor = this.editedItem.defaults.find(item => item.model_name === element.model_name).color
                this.$eventHub.$emit('dummy:changecolor_tshirt', itemName, defaultColor)
            })
        }
    }
}
</script>

<style scoped>

    .elements {
        margin-bottom: 22px;
        cursor: pointer;
    }
    .elements-header {
        font-style: normal;
        font-weight: normal;
        font-size: 18px;
        line-height: 25px;
        padding-left: 30px;
        display: block;
        margin-bottom: 5px;
    }


    .elements_value {
        padding-left: 11px;
        padding-bottom: 11px;
    }

    .elements_value .element {
        width: 187px;
        height: 209px;
        /*background: yellow;*/
        border: 1px solid rgba(96, 93, 89, 0.5);
        border-radius: 10px;
        margin: 11px;
        text-align: center;
        display: inline-block;
    }
    .elements_value .element.active {
        border: 1px solid #419FE3;
    }
    .elements_value .element:not(.active):hover {
        border: 1px solid #202122;
    }
    .elements_value .element img {
        display: block;
        margin: 15px auto 25px;
        width: 124px;
        height: 122px;
    }

    #colors .elements_value .element {
        width: 123px;
        height: 160px;
        margin: 13px 7px;
    }
    #colors .elements_value .element img {
        width: 106px;
        height: 113px;
        margin: 12px auto 7px;
    }

    #colorsblock,
    #menufooter {
        background: #fff;
        filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.25));
    }
    #colorchecker {
        display: block;
        padding-left: 25px;
        width: 100%;
        padding-bottom: 15px;
    }
    #colorchecker li {
        display: inline-block;
        margin-right: 10px;
    }
    #colorchecker li a {
        display: block;
        width: 32px;
        height: 32px;
        background: red;
        border: 1px solid rgba(96, 93, 89, 0.5);
        border-radius: 50%;
    }
    #colorchecker li a.active {
        border: 2px solid #419FE3;
        position: relative;
    }
    #colorchecker li a.active:before {
        content: "";
        display: block;
        width: 11px;
        height: 9px;
        position: absolute;
        top: 10px;
        left: 8px;
        background-image: url('~~/assets/media/img/icon.svg');
        background-size: contain;
    }
</style>