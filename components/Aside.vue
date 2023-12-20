<template>
    <aside>
        <Header />
        <Content />
        <Footer />
    </aside>
</template>

<script>
import Header from "./aside/Header"
import Content from "./aside/Content"
import Footer from "./aside/Footer"
export default {
    components: {
        Header,
        Content,
        Footer
    }
}
</script>