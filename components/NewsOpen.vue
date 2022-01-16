<template>
    <div>
        <div v-show="showContent">
            <b-container class="d-flex flex-column">
                <div class="date_and_time">{{ date_time }} - <span>{{ user_email }}</span></div>
                <div class="date_and_title">{{ title }}</div>
                <img class="date_and_img" :src="hostApi + 'images/' + main_img" />
                <div class="date_and_text" v-html="text"></div>
            </b-container>
        </div>
        <div v-show="!showContent" id="loadingFade">
            <img src="/ajax-loader.gif" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'MainPage',
    head() {
        return {
          title: ""
        };
    },
    data() {
        return {
            id: null,
            date_time: '',
            user_email: '',
            title: '',
            text: '',
            main_img: '',
            showContent: false,
        }
    },
    computed: {
        hostApi() {
          return process.env.host;
        },
    },
    created() {
        this.id = this.$route.params.id;
    },
    mounted() {
        this.$axios.get('/api/get-news-by-id/' + this.id)
            .then((response) => {
                if(response.data.success) {
                    this.date_time = this.$timeConverter(response.data.row.tms_datetime_public);
                    this.title = response.data.row.title;
                    this.text = response.data.row.description;
                    this.main_img = response.data.row.main_img;
                    this.user_email = response.data.user_info.email;
                    document.title = this.title;
                    this.showContent = true;
                }
            })
            .catch((e) => {
                console.log('FAILURE!!', e);
            });
    }
}
</script>

<style scoped>
    .date_and_time {
        color: #ccc;
        font-style: italic;
        font-size: 12px;
        margin-bottom: 10px;
        margin-top: 30px;
    }
    .date_and_time > span {
        display: inline-block;
        color: #333;
    }
    .date_and_title {
        font-weight: bold;
        font-size: 20px;
        margin-bottom: 10px;
    }
    .date_and_img {
        margin-bottom: 20px;
    }
    .date_and_text {
        margin-bottom: 100px;
    }
    #loadingFade {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(120, 120, 120, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>