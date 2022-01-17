<template>
    <div>
        <Header />
        <NewsList :list="list" />
    </div>
</template>

<script>
export default {
    name: 'IndexPage',
    head() {
        return {
          title: "Главна страница"
        };
    },
    async asyncData(context) {
        const res = await context.$axios.$get('http://127.0.0.1:8001/api/get-news');
        return { list: res.list }
    }
}
</script>
