<template>
    <div class="aside-content">
        <Wardrobe />
        <Catalog />
    </div>
</template>

<script>
import Wardrobe from "./content/Wardrobe"
import Catalog from "./content/Catalog"

export default {
    components: {
        Wardrobe,
        Catalog
    }
}
</script>