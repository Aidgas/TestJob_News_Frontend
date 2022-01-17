<template>
    <b-container>
        <div class="d-flex flex-column list">
            <NuxtLink v-for="(item, index) in list"
                 :key="index"
                 :to="'/news/' + item.id"
                 class="new_item">
                <div class="new_item_datetime">{{ $timeConverter(item.tms_datetime_public) }}</div>
                <div class="d-flex align-items-start">
                    <img class="new_item_img" :src="hostApi + 'images/' + item.main_img" />
                    <div class="new_item_title">{{ item.title }}</div>
                </div>
                
            </NuxtLink>
        </div>
    </b-container>
</template>

<script>
export default {
    name: 'MainPage',
    head() {
        return {
          title: "Главна страница"
        };
    },
    data() {
        return {
            list: null
        }
    },
    computed: {
        hostApi() {
          return process.env.host;
        },
    },
    created() {
        
    },
    mounted() {
        this.$axios.get('/api/get-news')
            .then((response) => {
                if(response.data.success) {
                    this.list = response.data.list;
                }
            })
            .catch((e) => {
                console.log('FAILURE!!', e);
            });
    }
}
</script>

<style scoped>
    .new_item_datetime {
        margin-bottom: 10px;
        color: grey;
        font-style: italic;
    }
    .new_item_img {
        max-height: 250px;
        max-width: 250px;
        display: inline-block;
        margin-right: 15px;
    }
    .new_item_title {
        font-size: 22px;
        font-weight: bold;
        color: #468be8;
    }
    .list {
        margin: 25px 0;
    }
    .new_item {
        text-decoration: none;
        margin-bottom: 5px;
    }
    .new_item:hover {
        background-color: #f7f7f7;
    }
</style>