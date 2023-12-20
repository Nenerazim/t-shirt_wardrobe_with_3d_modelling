<template>
    <header class="navbar">
        <div class="logo-section" @click="showMenu()" v-click-outside="hideMenu">
            <div class="branding">
                Студия
            </div>
        </div>
        <div class="right-side">
            <div class="cart" v-click-outside="hideCart" @click="showCart()">
                <div class="cart-total">
                    <div class="cart-total-label">
                        Стоимость корзины:
                    </div>
                    <div class="cart-total-price" v-bind:class="{active: cart === true}">
                        {{totalPrice}} ₽<img style="margin-left:5px; margin-bottom: 1px;" src="~/assets/media/img/angle_bottom_white.svg">
                    </div>
                </div>
                <div class="cart-open">
                    <div class="open-link">
                        <img style="margin-top: 1px; margin-right:5px;" src="~/assets/media/img/cart_right.svg">
                        <div class="link-button">Перейти</div>
                    </div>
                    <div class="open-icon">
                        <img src="~/assets/media/img/cart_btn.svg" />
                    </div>
                </div>
                <Cart :active="cart"/>
            </div>
        </div>
    </header>
</template>

<script>
import Cart from '~/components/aside/Cart'
import { mapGetters } from 'vuex'
export default {
    components: {
        Cart
    },
    data() {
        return {
            cart: false,
            menu: false
        }
    },
    methods: {
        showCart: function () {
            this.cart = !this.cart
        },
        hideCart: function (e) {
            this.cart = false
        },
        showMenu: function () {
            this.menu = !this.menu
        },
        hideMenu: function (e) {
            this.menu = false
        }
    },
    computed: {
        ...mapGetters('cart', ['totalPrice'])
    }
}
</script>

