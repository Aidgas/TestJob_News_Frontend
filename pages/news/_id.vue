<template>
    <div>
        <Header />
        <NewsOpen :info="info" />
    </div>
</template>

<script>
export default {
    name: 'OpenNews',
    head() {
        return {
            title: this.info.row.title
        };
    },
    async asyncData(context) {
        const res = await context.$axios.$get(`http://127.0.0.1:8001/api/get-news-by-id/${context.params.id}`);
        return { info: res }
    }
}
</script>