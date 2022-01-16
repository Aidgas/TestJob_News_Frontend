<template>
    <div>
        <div id="fade"></div>
        <div id="form">
            <div id="form-close" @click.stop="closeForm"></div>
            <div id="form-tabs">
                <span :class="{'selected': seletedTab == 1 }" @click.stop="showPage(1)">Авторизация</span>
                <span :class="{'selected': seletedTab == 2 }" @click.stop="showPage(2)">Регистрация</span>
            </div>
            <div id="form-page-1" v-show="seletedTab == 1">
                <input placeholder="Email" 
                       maxlength="255"
                       :class="{ 'error-input': formAuth.errorInput_Email }"
                       v-model="formAuth.email"
                       :disabled="formAuth.process" />
                <input placeholder="Пароль" type="password"
                       maxlength="255"
                       :class="{ 'error-input': formAuth.errorInput_Password }"
                       v-model="formAuth.password"  
                       :disabled="formAuth.process" />
                <span class="form-warning-text" v-html="formAuth.textWarning"></span>
                <button class="btn btn-primary mt-3 d-flex flex-row justify-content-center align-items-center"
                        ref="form_page_1_btn"
                        :disabled="formAuth.process"
                        @click.stop="sendLogin">
                    <img src="/loading_ajax.svg" class="mr-1" v-show="formAuth.process" />
                    <span class="mr-1">Войти</span>
                </button>
            </div>
            <div id="form-page-2" v-show="seletedTab == 2">
                <input placeholder="Email" 
                       maxlength="255"
                       :class="{ 'error-input': formReg.errorInput_Email }"
                       v-model="formReg.email"
                       :disabled="formReg.process" />
                <input placeholder="Пароль" type="password"
                       maxlength="255"
                       :class="{ 'error-input': formReg.errorInput_Password }"
                       v-model="formReg.password"  
                       :disabled="formReg.process" />
                <input placeholder="Пароль ещё раз" type="password"
                       maxlength="255"
                       :class="{ 'error-input': formReg.errorInput_Password_2 }"
                       v-model="formReg.password_2"  
                       :disabled="formReg.process" />
                <span class="form-warning-text" v-html="formReg.textWarning"></span>
                <button class="btn btn-primary mt-3 d-flex flex-row justify-content-center align-items-center"
                        ref="form_page_2_btn"
                        :disabled="formReg.process"
                        @click.stop="sendReg">
                    <img src="/loading_ajax.svg" class="mr-1" v-show="formReg.process" />
                    <span class="mr-1">Регистрация</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AuthForm',
    data() {
        return {
            seletedTab: 1,
            formAuth: {
                email: '',
                password: '',
                textWarning: '',
                process: false,
                errorInput_Email: false,
                errorInput_Password: false,
            },
            formReg: {
                email: '',
                password: '',
                password_2: '',
                textWarning: '',
                process: false,
                errorInput_Email: false,
                errorInput_Password: false,
                errorInput_Password_2: false,
            }
        }
    },
    methods: {
        closeForm() {
            this.$emit("close");
        },
        showPage(index) {
            this.seletedTab = index;
        },
        sendLogin() {
            this.formAuth.errorInput_Email = false;
            this.formAuth.errorInput_Password = false;
            this.formAuth.textWarning = '';
            this.formAuth.password = this.formAuth.password.trim();
            
            if(! this.$validateEmail(this.formAuth.email)) {
                this.formAuth.errorInput_Email = true;
                return;
            }
            
            if( this.formAuth.password.length < 6 ) {
                this.formAuth.textWarning = 'Минимальная длинна пароля - 6 символов';
                this.formAuth.errorInput_Password = true;
                return;
            }
            
            this.formAuth.process = true;
            
            this.$axios.post('/api/login', {
                email: this.formAuth.email,
                password: this.formAuth.password 
            })
            .then((response) => {
                if(response.data.success) {
                    if(process.client) {
                        localStorage.ApiToken = response.data.api_token;
                        localStorage.ApiTokenExipe = (new Date()).getTime() + response.data.expire_api_token_in_sec * 1000;
                        localStorage.Email = this.formAuth.email;
                        
                        this.$emit("login");
                    }
                }
                else {
                    if(response.data.key === 'user-not-found') {
                        this.formAuth.textWarning = 'Введен неверный логин или пароль';
                    }
                    else if(response.data.key === 'error-validation') {
                        this.formAuth.textWarning = 'Ошибка ввода данных';
                    }
                }
                this.formAuth.process = false;
            })
            .catch((error) => {
                console.log(error);
                this.formAuth.process = false;
            });
        },
        sendReg() {
            this.formReg.errorInput_Email = false;
            this.formReg.errorInput_Password = false;
            this.formReg.errorInput_Password_2 = false;
            this.formReg.textWarning = '';
            this.formReg.password = this.formReg.password.trim();
            
            if(! this.$validateEmail(this.formReg.email)) {
                this.formReg.errorInput_Email = true;
                return;
            }
            
            if( this.formReg.password.length < 6 ) {
                this.formReg.textWarning = 'Минимальная длинна пароля - 6 символов';
                this.formReg.errorInput_Password = true;
                return;
            }
            
            if( this.formReg.password != this.formReg.password_2 ) {
                this.formReg.textWarning = 'Пароли не совпадают';
                this.formReg.errorInput_Password = true;
                this.formReg.errorInput_Password_2 = true;
                return;
            }
            
            this.$axios.post('/api/registration', {
                email: this.formReg.email,
                password: this.formReg.password 
            })
            .then((response) => {
                if(response.data.success) {
                    if(process.client) {
                        localStorage.ApiToken = response.data.api_token;
                        localStorage.ApiTokenExipe = (new Date()).getTime() + response.data.expire_api_token_in_sec * 1000;
                        localStorage.Email = this.formReg.email;
                        
                        this.$emit("registration");
                    }
                }
                else {
                    if(response.data.key === 'error-validation') {
                        this.formAuth.textWarning = 'Ошибка ввода данных';
                    }
                    else if(response.data.key === 'user-exist') {
                        this.formAuth.textWarning = 'Пользователь с таким email, уже существует';
                    }
                }
                this.formAuth.process = false;
            })
            .catch((error) => {
                console.log(error);
                this.formAuth.process = false;
            });
        }
    }
}
</script>

<style scoped>
    #fade {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background: rgba(0.5, 0.5, 0.5, 0.5);
    }
    #form {
        position: absolute;
        padding: 20px;
        background: #FFF;
        border-radius: 15px;
        left: 0; 
        right: 0; 
        margin-left: auto; 
        margin-right: auto; 
        width: 350px;
    }
    #form-tabs {
        display: flex;
        border-bottom: 2px solid #777;
    }
    #form-tabs > span {
        cursor: pointer;
        color: #CCC;
        display: inline-block;
        margin-right: 5px;
        padding: 5px;
    }
    #form-tabs > span.selected {
        color: #333;
    }
    #form-close {
        background: url('static/close-form.svg') no-repeat center;
        width: 16px;
        height: 16px;
        cursor: pointer;
        position: absolute;
        right: 15px;
        top: 15px;
        opacity: 0.9;
    }
    #form-close:hover {
        opacity: 1;
    }
    #form-page-1,
    #form-page-2 {
        display: flex;
        flex-direction: column;
        padding-top: 20px;
    }
    #form input {
        background: #FFF;
        padding: 5px;
        color: #333;
        border: 1px solid #CCC;
        display: inline-block;
        margin-bottom: 15px;
        border-radius: 3px;
    }
    .form-footer-btn {
        margin: 20px 0 10px 0;
    }
    #form .btn img {
        height: 18px;
        width: auto;
    }
    .form-warning-text {
        color: red;
        font-size: 14px;
        text-align: center;
    }
    .error-input {
        border-color: red !important;
    }
    .error-input:focus {
        outline: none !important;
        border:2px solid red;
    }
</style>