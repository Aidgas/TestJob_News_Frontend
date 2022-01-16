<template>
    <div class="h-100">
        <div id="header" class="d-flex flex-row align-items-center">
            <h1>Панель администратора</h1>
            <div id="header_panel" class="flex-grow-1 d-flex justify-content-end align-items-center">
                <span @click.stop="logout">Выход</span>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row">
                <div class="fixed d-flex flex-column border-right">
                    <div class="left_menu" :class="{'select': menuSelect == 'news' }">Новости</div>
                </div>
                <div class="col p-3" id="admin_right_content">
                    <CpanelNews v-show="panels.news.show" />
                    <div id="admin_right_content_loading" 
                         v-show="panels.news.process"
                         class="justify-content-center align-items-center">
                        <img src="ajax-loader.gif" />
                    </div>
                </div>
            </div>     
        </div>
    </div>
</template>

<script>
    
export default {
    name: 'Cpanel',
    data() {
        return {
            menuSelect: '',
            panels: {
                news: {
                    show: false
                }
            }
        }
    },
    created() {
        if(process.client) {
            if( ! localStorage.ApiToken ) {
                this.$router.push('/');
            }
        }
        
        this.menuSelect = 'news';
        this.panels.news.show = true;
    },
    
    methods: {
        logout() {
            if(process.client) {
                localStorage.ApiToken = '';
                this.$router.push('/');
            }
        },
        
    }
}
</script>

<style>
    html,body, #__nuxt, #__layout{
        height:100%!important;
        width: 100%!important;
    }
</style>

<style scoped>
    #header {
        height: 50px;
        padding: 10px;
        
        background: #eeeeee;
        background: -moz-linear-gradient(top,  #eeeeee 0%, #eeeeee 100%);
        background: -webkit-linear-gradient(top,  #eeeeee 0%,#eeeeee 100%);
        background: linear-gradient(to bottom,  #eeeeee 0%,#eeeeee 100%);
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#eeeeee', endColorstr='#eeeeee',GradientType=0 );
    }
    #header h1 {
        font-size: 16px;
        margin: 0;
        color: #555;
    }
    #header_panel span {
        font-size: 12px;
        cursor: pointer;
    }
    #header_panel span:hover {
        text-decoration: underline;
    }
    .fixed {
        width: 150px;
    }
    .left_menu {
        font-size: 14px;
        cursor: pointer;
        color: #333;
        padding: 5px 10px;
    }
    .left_menu:hover {
        background-color: #e5e8ea;
    }
    .left_menu.select {
        color: #1d96dc;
        background-color: #e5e8ea;
    }
    
</style>
