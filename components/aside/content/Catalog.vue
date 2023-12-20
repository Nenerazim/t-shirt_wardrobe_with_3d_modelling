<template>
    <ItemDetails v-if="panel"/>
    <ItemList v-else />
</template>

<script>
import ItemDetails from './catalog/ItemDetails'
import ItemList from './catalog/ItemList'
import { mapState } from 'vuex'

export default {
    components: {
        ItemDetails,
        ItemList
    },
    computed: {
        ...mapState('wardrobe', ['panel'])
    }
}
</script>