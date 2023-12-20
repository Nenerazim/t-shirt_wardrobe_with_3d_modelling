export const state = () => ({
    token: null
})

export const actions = {
    nuxtServerInit({ dispatch, commit }) {
        dispatch('catalog/getItems')
    },
    login({commit}) {
        commit('setToken', 'truetoken')
    },
    logout({commit}) {
        commit('clearToken')
    }
}

export const getters = {
    hasToken: s => !!s.token
}
