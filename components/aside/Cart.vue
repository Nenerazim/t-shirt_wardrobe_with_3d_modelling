<template>
    <client-only>
        <div class="cart-opened" v-bind:class="{active: active === true}">
            <div class="items">
                <p class="empty-bin" v-if="cartItems.length === 0">В вашей корзине нет товаров...</p>
                <div class="item" v-for="(item, key) in cartItems" :key="key">
                    <span class="delete-btn" @click="deleteItem(item)"><img src="~/assets/media/img/trash.png" alt="Удалить товар"></span>
                    <div class="description">
                        <span>{{item.short_name}}</span>
                        <span>{{item.start_price}} ₽</span>
                    </div>
                    <div class="last-block">
                        <div class="image-slider">
                            <div class="image" :style="{ background: 'url(' + itemImage + ') center / contain no-repeat'}"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="cart-footer">
                <div class="delete-all" @click="deleteAll()">Очистить</div>
                <div class="payment">Оплатить</div>
            </div>
        </div>
    </client-only>
</template>

<script>
    export default {
        props: {
            active: Boolean
        },
        data() {
            return {
                itemImage:  require('@/assets/media/img/std_tshirt.png')
            }
        },
        computed: {
            cartItems: function () {
                return this.$store.getters['cart/cartItems']
            }
        },
        methods: {
            plusCart(item) {
                this.$store.commit('cart/plusCart', item.index)
            },
            minusCart(item) {
                this.$store.commit('cart/minusCart', item.index)
            },
            deleteItem: function (item) {
                this.$store.commit('cart/remove', item)
            },
            deleteAll: function () {
                this.$store.commit('cart/removeAll')
            }
        }
    }
</script>
