<template>
    <div id="news">
        <div id="news_cpanel" class="sub_cpanel" v-show="showCpanel">
            <button class="btn btn-primary btn-sm" @click.stop="news_openFormAddEdit">+ Добавить новость</button>
        </div>
        <div id="news_list_c" v-show="showCpanel">
            <div v-if="list" class="table_row table_row_header">
                <span>Название</span>
                <span>Дата публикации</span>
                <span></span>
            </div>
            <div v-for="(item, index) in list"
                 :key="index"
                 class="table_row"
                 >
                <span>{{ item.title }}</span>
                <span>{{ $timeConverter(item.tms_datetime_public) }}</span>
                <span class="news_list_item_btns d-flex justify-content-end align-items-center">
                    <img src="/edit.svg" title="редактировать" @click.stop="news_edit(item)" />
                    <img src="/delete.svg" title="удалить" @click.stop="news_delete(item.id)" />
                </span>
            </div>

        </div>
        <div id="news_form_add_edit" 
             class="flex-column"
             v-show="showFormAddEdit">
            <div class="d-flex justify-content-end">
                <div class="form_close btn btn-primary btn-sm d-inline-flex flex-row justify-content-center align-items-center"
                     @click.stop="news_closeFormAddEdit">
                    <div class="form_close_icon"></div>
                    Закрыть форму
                </div>
            </div>
            <div class="form_title">{{ title }}</div>
            <input type="text"
                   placeholder="Заголовок новости"
                   v-model="formAddEditTitle"
                   maxlength="255"
                   id="news_form_title_news" />
            <div id="news_from_date_time_public">
                <div id="news_from_date_time_public_setDate" class="d-flex justify-content-start align-items-center">

                    <input readonly="" 
                           placeholder="Дата публикации"
                           v-model="selectDateTime.valueDate"
                           @click.stop="selectDateTime.showCalendar = ! selectDateTime.showCalendar" />
                    <div class="popup-caledar"
                        :class="{'popup-caledar-show': selectDateTime.showCalendar }">
                        <Calendar 
                                 v-if="selectDateTime.showCalendar" 
                                :selectDate="selectDateTime.value" 
                                :indexField="'DATE_PUBLIC_NEWS'"
                                @selectDay="news_setDateInCalendar" />
                    </div>
                    <vue-timepicker :minute-interval="5"
                                    ref="news_form_add_timepicker"
                                    v-model="selectDateTime.valueTime"></vue-timepicker>
                </div>
            </div>
            <div id="news_form_add_main_image">
                <label>
                    <span id="news_form_add_main_image_btn" class="btn btn-info btn-sm d-flex justify-content-center align-items-center">
                        <img src="/add-image.svg" />
                        Добавить изображение</span>
                        <input type="file" v-on:change="news_formAddEditChooseFile"
                               accept="image/png, image/jpeg, image/webp" />
                </label>
                <img ref="news_form_add_main_image_selected_file_img" id="news_form_add_main_image_selected_file_img" />
                <div id="news_form_add_main_image_selected_file_info" 
                     class="d-flex justify-content-start align-items-center"
                     v-if="formAddEditFile">
                    <span>{{ formAddEditFile.type }}</span>
                    <span>{{ formAddEditFile.name }}</span>
                    <span>{{ $humanFileSize(formAddEditFile.size) }}</span>
                </div>
            </div>
            <div id="news_form_add_edit_descr_c">
                <tinymce id="news_form_add_edit_descr" 
                         v-model="formAddEditDescr"
                         :other_options="{height: 400}"
                         ></tinymce>
            </div>
            <div id="news_formAddEditError">{{ formAddEditErrorForm }}</div>
            <div class="d-flex justify-content-end">
                <button class="btn btn-primary btn-sm" @click.stop="newsSave">Сохранить</button>
            </div>

        </div>
    </div>
</template>

<script>
export default {
    name: 'CpanelNews',
    data() {
        return {
            title: '',
            showCpanel: true,
            showFormAddEdit: false,
            formAddEditTitle: '',
            formAddEditDescr: '',
            formAddEditFile: null,
            currentEditId: null,
            formAddEditErrorForm: '',
            process: false,
            list: null,
            selectDateTime: {
                showCalendar: false,
                valueDate: '',
                valueTime: ''
            }
        }
    },
    mounted() {
        if(process.client) {
            if( localStorage.ApiToken ) {
                this.news_get();
            }
        }
    },
    methods: {
        news_resetForm() {
            this.formAddEditTitle = '';
            this.formAddEditDescr = '';
            this.formAddEditFile  = null;
            this.currentEditId    = null;
            this.formAddEditErrorForm = '';
            this.selectDateTime.showCalendar = false;
            this.selectDateTime.valueDate = '';
            this.selectDateTime.valueTime = '';
            this.$refs.news_form_add_timepicker.clearTime();
            this.$refs.news_form_add_main_image_selected_file_img.src = '';
        },
        news_openFormAddEdit() {
            this.showCpanel = false;
            this.showFormAddEdit = true;
            this.title = 'Добавить новость';
        },
        news_closeFormAddEdit() {
            this.showFormAddEdit = false;
            this.showCpanel = true;
            
            if(this.currentEditId != null) {
                this.news_resetForm();
            }
        },
        news_formAddEditChooseFile(event) {
            if(event.target.files.length > 0) {
                this.formAddEditFile = event.target.files[0];
                
                console.log(this.formAddEditFile);
                
                if (FileReader && this.formAddEditFile) {
                    var fr = new FileReader();
                    fr.onload = () => {
                        this.$refs.news_form_add_main_image_selected_file_img.src = fr.result;
                    }
                    fr.readAsDataURL(this.formAddEditFile);
                }
            }
        },
        newsSave() {
            this.formAddEditErrorForm = '';
            
            if( this.formAddEditTitle.length < 5) {
                this.formAddEditErrorForm = 'Не указан заголовок новости';
                return;
            }
            
            if( 
                         this.selectDateTime.valueDate.length == 0
                    || ! /\d\d.\d\d.\d{4}/.test(this.selectDateTime.valueDate)
              ) 
            {
                this.formAddEditErrorForm = 'Не указана дата публикации';
                return;
            }
            
            if( 
                         this.selectDateTime.valueTime.length == 0
                    || ! /\d\d:\d\d/.test(this.selectDateTime.valueTime)
              ) 
            {
                this.formAddEditErrorForm = 'Не указана время публикации';
                return;
            }
            
            if( this.currentEditId == null && this.formAddEditFile == null) {
                this.formAddEditErrorForm = 'Не выбрано изображение';
                return;
            }
            
            if( this.$stripTags(this.formAddEditDescr).length < 10) {
                this.formAddEditErrorForm = 'Не указано описание';
                return;
            }
            
            let formData = new FormData();
            formData.append('id', this.currentEditId);
            formData.append('title', this.formAddEditTitle);
            formData.append('img', this.formAddEditFile);
            formData.append('descr', this.formAddEditDescr);
            formData.append('date_time', this.selectDateTime.valueDate + ' ' + this.selectDateTime.valueTime + ':00');
            
            this.$axios.post( '/api/save-news',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'X-Token-Secure': localStorage.ApiToken
                    }
                }
            ).then((response) => {
                if(response.data.success) {
                    this.news_closeFormAddEdit();
                    this.news_get();
                    this.news_resetForm();
                }
                else {
                    if(response.data.key === 'error-validation') {
                        this.formAddEditErrorForm = 'Ошибка ввода данных';
                    }
                }
            })
            .catch((e) => {
                console.log('FAILURE!!', e);
            });
        },
        news_get() {
            this.$axios.get( '/api/admin-get-news',
                {
                    headers: {
                        'X-Token-Secure': localStorage.ApiToken
                    }
                }
            ).then((response) => {
                if(response.data.success) {
                    this.list = response.data.list;
                }
            })
            .catch((e) => {
                console.log('FAILURE!!', e);
            });
        },
        news_delete(id) {
            if(! confirm('Удалить новость?')) {
                return;
            }
            
            console.log('ok');
            
            this.$axios.post( '/api/remove-news',
                {
                    id: id
                },
                {
                    headers: {
                        'X-Token-Secure': localStorage.ApiToken
                    }
                }
            ).then((response) => {
                if(response.data.success) {
                    this.news_get();
                }
                else {
                    if(response.data.key === 'error-validation') {
                        this.formAddEditErrorForm = 'Ошибка ввода данных';
                    }
                }
            })
            .catch(function(){
                console.log('FAILURE!!');
            });
        },
        news_setDateInCalendar(dayStr, key) {
            this.selectDateTime.valueDate = dayStr;
            this.selectDateTime.showCalendar = false;
        },
        news_edit(item) {
            console.log(item);
            this.news_resetForm();
            this.news_openFormAddEdit();
            this.currentEditId = item.id;
            
            this.formAddEditTitle = item.title;
            this.formAddEditDescr = item.description;
            this.formAddEditFile  = null;
            this.selectDateTime.showCalendar = false;
            this.selectDateTime.valueDate = this.$timeConverterOnlyDate(item.tms_datetime_public);
            this.selectDateTime.valueTime = this.$timeConverterOnlyTime(item.tms_datetime_public);
            //this.$refs.news_form_add_timepicker.clearTime();
            this.$refs.news_form_add_main_image_selected_file_img.src = process.env.host + 'images/' + item.main_img;
        }
    }
}
</script>

<style scoped>
    .sub_cpanel {
        margin-bottom: 12px;
    }
    #news_form_add_edit {
        display: flex;
        position: relative;
        padding-top: 10px;
    }
    .form_title {
        margin-bottom: 15px;
        font-size: 16px;
        font-weight: bold;
    }
    .form_close_icon {
        background: url('static/close-form-2.svg') no-repeat center;
        width: 12px;
        height: 12px;
        cursor: pointer;
        opacity: 0.9;
        display: inline-block;
        margin-right: 7px;
    }
    .form_close_icon:hover {
        opacity: 1;
    }
    #news_form_add_edit_descr_c {
        margin: 10px 0;
    }
    #news_form_add_main_image {
        margin: 15px 0 10px 0;
    }
    #news_form_add_main_image input {
        display: none;
    }
    #news_form_add_main_image_btn img {
        height: 16px;
        width: auto;
        display: inline-block;
        margin-right: 5px;
    }
    #news_form_add_main_image_selected_file_info span {
        display: inline-block;
        margin-right: 10px;
    }
    #news_form_add_main_image_selected_file_img {
        max-width: 130px;
        max-height: 130px;
        display: block;
    }
    #news_formAddEditError {
        color: red;
        margin: 10px 0;
    }
    #news_form_title_news {
        padding: 5px;
    }
    #admin_right_content {
        position: relative;
    }
    #admin_right_content_loading {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 999;
        background: rgba(100, 100, 100, 0.05);
        display: flex;
    }
    .news_list_item {
        padding: 5px;
    }
    .news_list_item:hover {
        background: #f7f7f7;
    }
    .news_list_item > span {
        display: inline-block;
        margin-right: 15px;
    }
    .news_list_item_btns > img {
        height: 18px;
        width: auto;
        cursor: pointer;
        display: inline-block;
        opacity: 0.7;
        margin-left: 8px;
    }
    .news_list_item_btns > img:hover {
        opacity: 1;
    }
    #news_from_date_time_public {
        margin: 15px 0 5px 0;
    }
    #news_from_date_time_public input {
        padding: 3px;
    }
    
    .popup-caledar {
        position: absolute;
        z-index: 999;
        top: 35px;
        border-radius: 10px;
        background: #FFF;
        border: 1px solid #C7D5E1;
        padding: 6px 10px;
        display: none;
        transition: opacity 1s ease-out;
        opacity: 0;
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
    }
    .popup-caledar-show {
        opacity: 1;
        display: block;
    }
    #news_from_date_time_public_setDate {
        position: relative;
    }
    .table_row {
        display: grid;
        grid-template-columns: 1fr 1fr 5fr;
    }
    .table_row:hover {
        background-color: #fcfadb;
    }
    .table_row_header {
        margin-bottom: 5px;
        color: #CCC;
    }
</style>