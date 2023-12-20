<!--<template>
    <div class="tab-content">
        <v-dialog />
        <div class="items">
            <div class="sort-module" v-click-outside="hideFilter">
                <div class="filter" @click="slideDown()" v-bind:class="{active: sorted === true}">
                    {{activeFilter}} <img :src="angleDown">
                </div>
                <div class="sort" v-bind:class="{active: sorted === true}">
                    <ul>
                        <li @click="sort(false, 'Все модели')">Все модели</li>
                        <li v-for="category in categoriesModel" :key="category.id" @click="sort(category.id, category.category_name)">{{category.category_name}}</li>
                    </ul>
                </div>
            </div>
            <div class="elements" v-if="gender === 'man'" v-for="category in sortedCategories" :key="category.id">
                <span class="type-header" v-if="category.items.length !== 0 && activeFilter === 'Все модели'">{{category.category_name}}</span>
                <p v-if="category.items.length === 0 && activeFilter !== 'Все модели'">В данной категории нет товаров</p>
                <div class="grid-row">
                    <div class="product"
                    v-for="item in category.items"
                    :key="item.id"
                    v-bind:class="{ active: activeItem === item.id && activeBody === null}"
                    >
                        <div class="product-desc" :style="{ background: 'url(' + infoImage + ') center / contain no-repeat' }" v-bind:class="{active: activeDesc === item.id}" @click="setActiveDesc(item.id)">
                            <div class="desc-tooltip" v-if="activeDesc === item.id" v-click-outside="hideDesc">
                                <div class="product-desc" :style="{ background: 'url(' + infoImage + ') center / contain no-repeat' }"></div>
                                <div class="full-name">
                                    {{item.name}}
                                </div>
                                <span class="short-desc">{{item.short_desc}}</span>
                                <span class="head-name">Описание</span>
                                <p>{{item.desc}}</p>
                                <span class="head-name">Размеры в наличии</span>
                                <div class="sizes">
                                    <div class="size" v-for="(size, i) in item.sizes" :key="i">
                                        {{size.name}}
                                    </div>
                                    <div class="sizes-table">Таблица размеров</div>
                                </div>
                                <div class="price">
                                    Цена: от {{item.start_price}} ₽
                                </div>
                            </div>
                        </div>
                        <div class="product-content">
                            <div class="item-image" :style="{ background: 'url(' + itemImage + ') center / contain no-repeat' }"></div>
                            <span class="name">{{item.short_name}}</span>
                            <span>от {{item.start_price}} ₽</span>
                        </div>
                        <div class="action-buttons">
                            <button @click="toWardrobe(item)">Добавить</button>
                            <button @click="setActive(item)" v-bind:class="{ active: activeItem === item.id }">Примерка</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    async fetch() {
        if (this.$store.getters['catalog/categoriesModel'].length === 0) {
            try {
                await this.$store.dispatch('catalog/getItems')
            } catch(err) {
                console.log(err)
            }
        }
    },
    computed: {
        categoriesModel() {
            return this.$store.getters['catalog/categoriesModel']
        },
        sortedCategories() {
            return this.$store.getters['catalog/sortedCategories']
        },
        activeBody() {
            return this.$store.getters['wardrobe/activeBody']
        },
        lastBody() {
            return this.$store.getters['wardrobe/lastBody']
        },
        gender() {
            return this.$store.getters['wardrobe/gender']
        }
    },
    data () {
        return {
            activeFilter: 'Все модели',
            activeItem: null,
            activeDesc: null,
            angleDown: require('@/assets/media/img/angle_down.svg'),
            itemImage:  require('@/assets/media/img/std_tshirt.png'),
            infoImage:  require('@/assets/media/img/info.svg'),
            sorted: false
        }
    },
    methods: {
        sort:function (catId, name) {
            this.activeFilter = name
            this.$store.commit('catalog/sortItems', catId)
        },
        hideFilter:function () {
            this.sorted = false
        },
        hideDesc:function () {
            this.activeDesc = null
        },
        setActiveDesc(id) {
            if(this.activeDesc === id) {
                this.activeDesc = null
            } else {
                this.activeDesc = id
                console.log(this.activeDesc)
            }
        },
        slideDown:function () {
            this.sorted = !this.sorted
        },
        reloadModel: function(defaultsArray) {
            for (let i = 0; i < defaultsArray.length; i++) {
                this.$eventHub.$emit('dummy:dummy_reload_tshirt', defaultsArray[i]['model_name'], defaultsArray[i]['model_type'], defaultsArray[i]['color'])
            }
        },
        reloadCard: function(defaultsArray) {
            for (let i = 0; i < defaultsArray.length; i++) {
                this.$eventHub.$emit('wardrobe:dummy_reload_tshirt', defaultsArray[i]['model_name'], defaultsArray[i]['model_type'], defaultsArray[i]['color'])
            }
        },
        toWardrobe: function (item) {
            if(this.$store.getters['wardrobe/wardrobe'].length < 5) {
                this.$store.dispatch('wardrobe/addProduct', item)
                this.activeItem = null
            } else {
                this.$modal.show('dialog', {
                    title: 'Достигнут лимит гардероба!',
                    text: 'При добавлении в гардероб был достигнут лимит гардероба, удалите одну или несколько вещей чтобы освободить место',
                    buttons: [
                        {
                            title: 'Понятно',
                            handler: () => {
                                this.$modal.hide('dialog')
                            }
                        },
                    ]
                })
            }
        },
        setActive: function (item) {
            if (this.activeItem === item.id) {
                this.activeItem = null
                if(this.lastBody !== null) {
                    let settings = {
                        type: this.lastBody.type,
                        index: this.lastBody.index
                    }
                    this.$store.commit('wardrobe/setActiveClothes', settings)
                    this.reloadModel(this.lastBody.settings)
                } else {
                    this.$eventHub.$emit('dummy:clean_model')
                }
            } else {
                let settings = {
                    type: item.type,
                    index: null
                }
                this.$store.commit('wardrobe/setActiveClothes', settings)
                this.activeItem = item.id
                this.reloadModel(item.defaults)
            }
        }
    }
}
</script>
-->
<template>
    <div class="tab-content">

        <div class="tooltipDialog" v-if="modal" v-click-outside="hideDesc" :style="{ top: `${tooltipTop}px`, left: `${tooltipLeft}px` }" >
            <div class="tooltipIcon" :style="{ background: 'url(' + infoImage + ') center / contain no-repeat' }" @click="hideDesc()"></div>
            <div class="tooltipContent">
                <div class="full-name">
                    {{tooltipDesc.name}}
                </div>
                <span class="short-desc">
                    {{tooltipDesc.short_desc}}
                </span>
                <span class="head-name">Описание</span>
                <p>{{tooltipDesc.desc}}</p>
                <span class="head-name">Размеры в наличии</span>
                <div class="sizes">
                    <div class="size" v-for="(size, i) in tooltipDesc.sizes" :key="i">
                        {{size.name}}
                    </div>
                    <div class="sizes-table">Таблица размеров</div>
                </div>
                <div class="price">
                    Цена: от {{tooltipDesc.start_price}} ₽
                </div>
            </div>
        </div>

        <v-dialog />
        <div class="items" @scroll="scrollTooltip()" ref="scrollable">
            <div class="sort-module" v-click-outside="hideFilter">
                <div class="filter" @click="slideDown()" v-bind:class="{active: sorted === true}">
                    {{activeFilter}} <img :src="angleDown">
                </div>
                <div class="sort" v-bind:class="{active: sorted === true}">
                    <ul>
                        <li @click="sort(false, 'Все модели')">Все модели</li>
                        <li v-for="category in categoriesModel" :key="category.id" @click="sort(category.id, category.category_name)">{{category.category_name}}</li>
                    </ul>
                </div>
            </div>
            <div class="elements-wrapper" v-if="gender === 'man'">
                <div class="elements" v-for="category in sortedCategories" :key="category.id">
                    <span class="type-header" v-if="category.items.length !== 0 && activeFilter === 'Все модели'">{{category.category_name}}</span>
                    <p v-if="category.items.length === 0 && activeFilter !== 'Все модели'">В данной категории нет товаров</p>
                    <div class="grid-row">
                        <div class="product"
                        v-for="item in category.items"
                        :key="item.id"
                        v-bind:class="{ active: activeItem === item.id && activeBody === null}"
                        >
                            <div class="product-desc" ref="tooltip" :style="{ background: 'url(' + infoImage + ') center / contain no-repeat' }" v-bind:class="{active: activeDesc === item.id}" @click="setActiveDesc(item.id, item)">

                            </div>
                            <div class="product-content">
                                <div class="item-image" :style="{ background: 'url(' + itemImage + ') center / contain no-repeat' }"></div>
                                <span class="name">{{item.short_name}}</span>
                                <span>от {{item.start_price}} ₽</span>
                            </div>
                            <div class="action-buttons">
                                <button @click="toWardrobe(item)">Добавить</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    async fetch() {
        if (this.$store.getters['catalog/categoriesModel'].length === 0) {
            try {
                await this.$store.dispatch('catalog/getItems')
            } catch(err) {
                console.log(err)
            }
        }
    },
    computed: {
        categoriesModel() {
            return this.$store.getters['catalog/categoriesModel']
        },
        sortedCategories() {
            return this.$store.getters['catalog/sortedCategories']
        },
        activeBody() {
            return this.$store.getters['wardrobe/activeBody']
        },
        lastBody() {
            return this.$store.getters['wardrobe/lastBody']
        },
        gender() {
            return this.$store.getters['wardrobe/gender']
        }
    },
    data () {
        return {
            activeFilter: 'Все модели',
            activeItem: null,
            activeDesc: null,
            angleDown: require('@/assets/media/img/angle_down.svg'),
            itemImage:  require('@/assets/media/img/std_tshirt.png'),
            infoImage:  require('@/assets/media/img/info.svg'),
            sorted: false,
            tooltipDesc: {},
            tooltipTop: 0,
            tooltipLeft: 0,
            modal: false
        }
    },
    methods: {
        sort:function (catId, name) {
            this.activeFilter = name
            this.$store.commit('catalog/sortItems', catId)
        },
        hideFilter:function () {
            this.sorted = false
        },
        hideDesc:function () {
            this.modal = false
        },
        setActiveDesc(id, item) {
            this.activeDesc = id
            this.tooltipDesc = item
            setTimeout(() => {
                this.scrollTooltip()
            }, 0)
        },
        scrollTooltip() {
            let el = null
            el = this.$refs.tooltip.find(el => el.className === 'product-desc active')
            if (el) {
                const rect = el.getBoundingClientRect()
                this.tooltipTop = rect.top - 7
                this.tooltipLeft = rect.left - 7
                this.modal = true
            }
        },
        slideDown:function () {
            this.sorted = !this.sorted
        },
        reloadModel: function(defaultsArray) {
            for (let i = 0; i < defaultsArray.length; i++) {
                this.$eventHub.$emit('dummy:dummy_reload_tshirt', defaultsArray[i]['model_name'], defaultsArray[i]['model_type'], defaultsArray[i]['color'])
            }
        },
        toWardrobe: function (item) {
            if(this.$store.getters['wardrobe/wardrobe'].length < 5) {
                this.$store.dispatch('wardrobe/addProduct', item)
                this.reloadModel(item.defaults)
                this.activeItem = null
            } else {
                this.$modal.show('dialog', {
                    title: 'Достигнут лимит гардероба!',
                    text: 'При добавлении в гардероб был достигнут лимит гардероба, удалите одну или несколько вещей чтобы освободить место',
                    buttons: [
                        {
                            title: 'Понятно',
                            handler: () => {
                                this.$modal.hide('dialog')
                            }
                        },
                    ]
                })
            }
        },
        setActive: function (item) {
            if (this.activeItem === item.id) {
                this.activeItem = null
                if(this.lastBody !== null) {
                    let settings = {
                        type: this.lastBody.type,
                        index: this.lastBody.index
                    }
                    this.$store.commit('wardrobe/setActiveClothes', settings)
                    this.reloadModel(this.lastBody.settings)
                } else {
                    this.$eventHub.$emit('dummy:clean_model')
                }
            } else {
                let settings = {
                    type: item.type,
                    index: null
                }
                this.$store.commit('wardrobe/setActiveClothes', settings)
                this.activeItem = item.id
                this.reloadModel(item.defaults)
            }
        }
    }
}
</script>
