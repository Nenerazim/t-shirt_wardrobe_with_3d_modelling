const state = () => ({
    categoriesModel: [],
    sortedCategories: [],
    sets: []
})

const getters = {
    categoriesModel: (state) => {
        return state.categoriesModel
    },
    sortedCategories: (state) => {
        return state.sortedCategories
    }
}

const mutations = {
    setCategoriesModel(state, items) {
        state.categoriesModel = items
        state.sortedCategories = items
    },
    sortItems(state, id) {
        state.sortedCategories = id ? state.categoriesModel.filter(category => category.id === id) : state.categoriesModel
    }
}

const actions = {
    async getItems({ commit }) {
        const items = await this.$axios.get('http://localhost:3000/mock/categories_model.json')
        commit('setCategoriesModel', items.data)
        return items.data
    }
}

export default  {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
