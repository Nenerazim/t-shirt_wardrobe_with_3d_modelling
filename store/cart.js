const state = () => ({
    cartItems: []
})
 
const getters = {
    cartItems: (state) => {
        return state.cartItems
    },
    totalPrice: (state) => {
        let price = 0
        for (let i = 0; i < state.cartItems.length; i++) {
            price = price + parseInt(state.cartItems[i]['start_price']) * parseInt(state.cartItems[i]['cart_count'])
        }
        return price
    }
}

const mutations = {
    add(state, item) {
        let isAdded = state.cartItems.find(product => product.index === item.index)
        if (isAdded !== void 0 && 'cart_count' in isAdded && isAdded.settings === item.settings) {
            state.cartItems = state.cartItems.filter(product => product.index !== item.index)
            isAdded.cart_count = parseInt(isAdded.cart_count) + 1
            state.cartItems.push(isAdded)
        } else {
            item.cart_count = 1
            state.cartItems.push(item)
        }
    },
    remove(state, item) {
        state.cartItems = state.cartItems.filter(product => product.index !== item.index)
    },
    removeAll(state) {
        state.cartItems = []
    },
    plusCart(state, index) {
        for (let i = 0; i < state.cartItems.length; i++) {
            if (state.cartItems[i].index === index) {
                state.cartItems[i].cart_count++
            }
        }
    },
    minusCart(state, index) {
        for (let i = 0; i < state.cartItems.length; i++) {
            if (state.cartItems[i].index === index && state.cartItems[i].cart_count > 1) {
                state.cartItems[i].cart_count--
            }
        }
    }
}


export default  {
    namespaced: true,
    state,
    getters,
    mutations
}