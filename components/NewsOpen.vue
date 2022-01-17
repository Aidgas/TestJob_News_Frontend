<template>
    <div>
        <div>
            <b-container class="d-flex flex-column">
                <div class="date_and_time">{{ $timeConverter(info.row.tms_datetime_public) }} - <span>{{ info.user_info.email }}</span></div>
                <div class="date_and_title">{{ info.row.title }}</div>
                <img class="date_and_img" :src="hostApi + 'images/' + info.row.main_img" />
                <div class="date_and_text" v-html="info.row.description"></div>
            </b-container>
        </div>
        <!--<div v-show="!showContent" id="loadingFade">
            <img src="/ajax-loader.gif" />
        </div>-->
    </div>
</template>

<script>
export default {
    name: 'MainPage',
    props: ['info'],
    data() {
        return {
            /*id: null,
            date_time: '',
            user_email: '',
            title: '',
            text: '',
            main_img: '',
            showContent: true,*/
        }
    },
    computed: {
        hostApi() {
          return process.env.host;
        },
    },
    created() {
        //this.id = this.$route.params.id;
        
    },
    mounted() {
        //document.title = this.info.title;
    }
    /*async fetch() {
        let data = await fetch(
          'http://127.0.0.1:8001/api/get-news-by-id/' + this.id
        ).then(res => res.json());
        
        if(data.success) {
            this.date_time = this.$timeConverter(data.row.tms_datetime_public);
            this.title = data.row.title;
            this.text = data.row.description;
            this.main_img = data.row.main_img;
            this.user_email = data.user_info.email;
            document.title = this.title;
            this.showContent = true;
        }
    },*/
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