<template>
    <div id="root">
        <div id="header">
            <NuxtLink to="/" ><img id="header_logo" src="/logo.svg" /></nuxtlink>
            <div id="header_right">
                <span v-show="showHeader" @click.stop="openAuthForm">{{ userName }}</span>
            </div>
        </div>
        <AuthForm v-show="showAuthForm" 
                  @close="showAuthForm = false"
                  @registration="refresh"
                  @login="refresh"
                  />
    </div>
</template>

<script>
export default {
    name: 'Header',
    data() {
        return {
            userName: 'Войти',
            showAuthForm: false,
            showHeader: false,
        }
    },
    created() {
        if(process.client) {
            if( localStorage.ApiToken ) {
                this.userName = localStorage.Email;
            }
        }
        
        
    },
    mounted() {
        this.showHeader = true;
    },
    methods: {
        openAuthForm() {
            if(process.client) {
                if( localStorage.ApiToken ) {
                    this.$router.push('/cpanel');
                    return;
                }
            }
            
            this.showAuthForm = true;
        },
        refresh() {
            this.showAuthForm = false;
            if(process.client) {
                if( localStorage.ApiToken ) {
                    this.userName = localStorage.Email;
                }
            }
        }
    }
}
</script>

<style scoped>
    #root {
        position: relative;
    }
    #header {
        height: 40px;
        background: #7aa7d2;
        padding: 10px 12px;
        align-items: center;
        justify-content: flex-start;
        display: flex;
    }
    #header_right {
        flex-grow: 1;
        display: flex;
        justify-content: flex-end;
    }
    #header span {
        cursor: pointer;
        font-size: 14px;
        color: #333;
    }
    #header span:hover {
        color: #f00;
    }
    #header_logo {
        height: 32px;
        width: auto;
    }
</style>