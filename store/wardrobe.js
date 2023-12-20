const state = () => ({
    gender: 'man',
    wardrobe: [],
    womanWardrobe: [],
    baseItem: {},
    panel: false,
    editedItem: null,
    activeBody: null,
    lastBody: null,
    activeLegs: null,
    lastLegs: null,
    active: {
        body: null,
        legs: null
    }
})

const getters = {
    wardrobe: (state) => {
        if(state.gender === 'man') {
            return state.wardrobe
        } else {
            return state.womanWardrobe
        }
    },
    baseItem: (state) => {
        return state.baseItem
    },
    editedItem: (state) => {
        let item = state.wardrobe.find(product => product.index === state.editedItem)
        if(item !== void 0)  {
            return item
        } else {
            return null
        }

    },
    editedItemIndex: (state) => {
        return state.editedItem
    },
    panel: (state) => {
        return state.panel
    },
    activeBody: (state) => {
        return state.activeBody
    },
    activeLegs: (state) => {
        return state.activeLegs
    },
    lastBody: (state) => {
        let item = state.wardrobe.find(product => product.index === state.lastBody)
        if(item !== void 0)  {
            return item
        } else {
            return null
        }
    },
    gender: (state) => {
        return state.gender
    }
}

function reloadModel(settings) { //Перезагрузить одежду на модели
    for (let i = 0; i < settings.length; i++) {
        $nuxt.$eventHub.$emit('dummy:dummy_reload_tshirt', settings[i]['model_name'], settings[i]['model_type'], settings[i]['color'])
    }
}

function reloadCard(settings, id) { //Перезагрузить карточку с товаром
    $nuxt.$eventHub.$emit('wardrobe:dummy_reload_tshirt', settings, id)
}

function clearItemOnModel(settings) { //Снять определенную одежду
    for (let i = 0; i < settings.length; i++) {
        $nuxt.$eventHub.$emit('dummy:clean_model_by_type', settings[i]['model_name'], settings[i]['model_type'], settings[i]['color'])
    }
}

function clearModel() { //Снять всю одежду с модели
    $nuxt.$eventHub.$emit('dummy:clean_model')
}

const mutations = {
    add(state, item) {
        item.settings = item.defaults
        item.index = state.wardrobe.length === 0 ? 1 : state.wardrobe[state.wardrobe.length - 1].index + 1
        item.activeSize = "L"
        state.wardrobe.push(item)
        this._vm.$set(state.active, item.type, item.index)
        reloadModel(item.settings)
        reloadCard(item.settings, item.index)
    },

    change(state, {settingCategory, newSetting} = settings) {
        let newSettings = {
            model_name: settingCategory,
            model_type: newSetting.model_type
        }
        state.wardrobe = state.wardrobe.map(element => {
            if (element.index === state.editedItem) {
                let isAddedCategory = element.settings.find(type => type.model_name === newSettings.model_name)
                if (isAddedCategory === undefined) {
                    return {...element, settings: [...element.settings, { ...newSettings }]}
                } else {
                    let elemSet = element.settings.map((el, i) => {
                        if (element.settings[i].model_name === isAddedCategory.model_name) {
                            newSettings.color = element.settings[i].color
                            return newSettings
                        }
                        return el
                    })
                    return {...element, settings: elemSet}
                }
            } else {
                return element
            }
        })
    },
    reset(state, item) {
        state.wardrobe = state.wardrobe.map(element => {
            if (element.model_name === item.model_name) {
                return {...element, settings: [...item.defaults]}
            }
            return element
        })
    },
    changeColor(state, {color, settingCategory} = settings) {
        state.wardrobe = state.wardrobe.map(element => {
            if (element.index === state.editedItem) {
                return {...element, settings: [...element.settings.map((el) => {
                    if (el.model_name === settingCategory) {
                        return {...el, color: color}
                    }
                    return el
                })]}
            }
            return element
        })
    },
    setSize(state, size) {
        for (let i = 0; i < state.wardrobe.length; i++) {
            if (state.wardrobe[i].index === state.editedItem) {
                state.wardrobe[i].activeSize = size.name
            }
        }
    },
    copy(state, item) { //Копирует выбранный элемент гардероба
        let copyItem = { ...state.wardrobe.find(product => product.index === item.index) }
        copyItem.index = state.wardrobe[state.wardrobe.length - 1].index + 1
        state.wardrobe.push(copyItem)
        reloadCard(copyItem.settings, copyItem.index)
    },
    setActiveClothes(state, item) { //Выставляет текущий видимый элемент каждого типа в гардеробе
        this._vm.$set(state.active, item.type, item.index)
        reloadModel(item.settings)
    },
    unsetActiveClothes(state, item) { //Снимает текущий видимый элемент каждого отдельного типа в гардеробу
        state.active[item.type] = null
        clearItemOnModel(item.settings)
    },
    edit(state, items) { // Начало редактирования
        state.panel = true
        state.baseItem = items.currentItem
        state.editedItem = items.editedItem
    },
    stopEditing(state) { // Прекращение редактирования
        state.panel = false
        state.editedItem = null
    },
    clear(state) { //Очистка гардероба, + раздевание модели
        state.wardrobe = []
        clearModel()
    },
    removeColors(state) {
        state.wardrobe = state.wardrobe.map(element => {
            return {...element, settings: element.defaults}
        })
    },
    remove(state, item) { //Удаление товара
        state.wardrobe = state.wardrobe.filter(product => product.index !== item.index)

        if(state.active[item.type] === null) {
            if(state.wardrobe.length === 0) {
                clearModel()
            }
        } else {
            if (state.active[item.type] === item.index) {
                let active = state.wardrobe.filter(product => product.type === item.type)
                if (active !== undefined && state.wardrobe.length !== 0) {
                    let lastActive = active[active.length - 1]
                    if (lastActive !== undefined) {
                        this._vm.$set(state.active, lastActive.type, lastActive.index)
                        reloadModel(lastActive.settings)
                    } else {
                        clearModel()
                    }
                } else {
                    clearModel()
                }
            } else {
                let active = state.wardrobe.find(product => product.index === state.active[item.type])
                reloadModel(active.settings)
            }
        }
    },
    changeGender(state, gender) {
        state.gender = gender
        $nuxt.$eventHub.$emit('sexchecker', gender);
        state.activeBody = null
        state.activeLegs = null
        state.panel = false
        state.editedItem = null
        state.active = {
            body: null,
            legs: null
        }
    },
    resetGender(state) {
        state.gender = 'man'
        state.activeBody = null
        state.activeLegs = null
        state.lastBody = null
        state.active = {
            body: null,
            legs: null
        }
    },
    resetAll(state) {
        state.gender = 'man'
        state.active = {
            body: null,
            legs: null
        }
        state.activeBody = null
        state.activeLegs = null
        state.lastBody = null
        state.panel = false
        state.editedItem = null
    }
}


const actions = {
    async addProduct({ commit }, item) {
        commit('add', {...item})
    },
    async setEditingItem({ commit }, editingItem) { //Вызывается при редактировании элемента гардероба, получается по id оригинальный товар
        //Тут будем по id товара получать все его парметры, либо просто весь товар с параметрами, но пока из мока вылавливаем конкретный
        const item = await this.$axios.get('http://localhost:3000/mock/items.json')
        const itemDefault = item.data.find(product => product.id === editingItem.id)
        const items = {
            currentItem: itemDefault,
            editedItem: editingItem.index
        }
        commit('edit', items)
        commit('setActiveClothes', editingItem)
    },
    async activeClothes({ commit }, settings) {
        if (settings.clear) {
            commit('unsetActiveClothes', settings.item)
        } else {
            commit('setActiveClothes', settings.item)
        }
    },
    async clearAll({ commit }) { //Кнопка очистки гардероба
        commit('clear')
        commit('stopEditing')
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
