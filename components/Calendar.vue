<template>
    <div id="calendar">
        <div id="calendar-panel">
            <div class="calendar-panel-item">
                <div class="calendar-btn-left" @click.stop="monthDown"></div>
                <div class="calendar-panel-value calendar-panel-value-month-name noselect">{{ calendarMonth }}</div>
                <div class="calendar-btn-rigth" @click.stop="monthUp"></div>
            </div>
            <div class="calendar-panel-item-sep"></div>
            <div class="calendar-panel-item">
                <div class="calendar-btn-left" @click.stop="yearDown"></div>
                <div class="calendar-panel-value noselect">{{ calendarYear }}</div>
                <div class="calendar-btn-rigth" @click.stop="yearUp"></div>
            </div>
        </div>
        <div id="calendar-header">
            <div
                v-for="(name, index) in daysNames"
                :key="index"
                class="header-days-names noselect"
                >{{ daysNames[index] }}</div>
        </div>
        <div id="calendar-month">
            <div
                v-for="(row, index) in calendar"
                :key="index"
                class="header-week-row"
                >
                <div
                    v-for="(day, index) in row"
                    :key="index"
                    class="header-week-row-day"
                    :class="{ 
                      'header-week-row-day-current-day': day.currentDay
                    , 'header-week-row-day-select': selectDaySaved == day.date_str
                    , 'header-week-row-day-not-thisMonth': ! day.isThisMonth }"
                    @click.stop="selectDay(day)"
                    >{{ day.name }}</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Calendar',
        emits: ["selectDay"],
        props: {
            selectDate:      { type: String, default: '' },
            indexField:      { type: [String, Object], default: null },
        },
        
        data() {
            return {
                date: null,
                monthNames: [],
                daysNames: [],
                calendar: [],
                calendarMonthIndex: null,
                calendarMonth: '',
                calendarYear: '',
                
                selectDaySaved: '',
            }
        },
        watch: {
            '$i18n.locale': function() {
                this.buildMonthsNames();
                this.buildDayNames();
                
                if(this.calendarMonthIndex) {
                    this.calendarMonth = this.monthNames[ this.calendarMonthIndex ];
                }
            }
        },
        created() {
            if(this.date == null) {
                this.date = new Date();
            }
            
            this.buildMonthsNames();
            this.buildDayNames();
            
            this.nowDate = new Date();
            this.nowDate.setMinutes(0);
            this.nowDate.setSeconds(0);
            this.nowDate.setMilliseconds(0);
            
            if( this.selectDate == '' || this.selectDate == null ) {
                this.dateCalendar = new Date();
            }
            else {
                let dateParts = this.selectDate.split(".");
                this.dateCalendar  = new Date(dateParts[2], dateParts[1] - 1);
                
                this.selectDaySaved = this.$dateToString(new Date(dateParts[2], dateParts[1] - 1, dateParts[0]))
            }
            
            this.dateCalendar.setMinutes(0);
            this.dateCalendar.setSeconds(0);
            this.dateCalendar.setMilliseconds(0);
            
            this.render(this.dateCalendar.getFullYear(), this.dateCalendar.getMonth());
        },
        methods: {
            buildDayNames() {
                this.daysNames = [
                      this.$t('Mo')
                    , this.$t('Tu')
                    , this.$t('We')
                    , this.$t('Th')
                    , this.$t('Fr')
                    , this.$t('Sa')
                    , this.$t('Su')
                ];
            },
            buildMonthsNames() {
                this.monthNames = [
                      this.$t('january')
                    , this.$t('february')
                    , this.$t('march')
                    , this.$t('april')
                    , this.$t('may')
                    , this.$t('june')
                    , this.$t('july')
                    , this.$t('august')
                    , this.$t('september')
                    , this.$t('october')
                    , this.$t('november')
                    , this.$t('december')
                ];
            },
            /**
            * получить номер дня недели для date, от 0(пн) до 6(вс)
            * @param date
            */
            getDay(date) { //
                var day = date.getDay();
                if (day == 0) day = 7;
                return day - 1;
            },
            /**
            * Генерирует таблицу для календаря заданного месяца/года
            * @param year
            * @param month
            */
            render(year, month) {
                this.calendar = [[]];
                
                this.calendarMonthIndex  = month;
                this.calendarMonth       = this.monthNames[ month ];
                this.calendarYear        = year;
                
                let d = new Date(year, month);
                let d2 = new Date(year, month);
                
                d.setMinutes(0);
                d.setSeconds(0);
                d.setMilliseconds(0);
                
                d2.setMinutes(0);
                d2.setSeconds(0);
                d2.setMilliseconds(0);
                
                let curentDateStr = this.$dateToString(this.nowDate);
                
                let index = 0;
                let countBackDays = this.getDay(d);
                d2.setDate( d2.getDate() - countBackDays );
                
                for (let i = 0; i < countBackDays; i++) {
                    this.calendar[index].push({ 
                          name: d2.getDate()
                        , date_str: this.$dateToString(d2)
                        , currentDay: curentDateStr == this.$dateToString(d2)
                        , isThisMonth: false
                    });
                    d2.setDate( d2.getDate() + 1 );
                }
                
                // ячейки календаря с датами
                while(d.getMonth() == month) {
                    this.calendar[index].push({ 
                          name: d.getDate()
                        , date_str: this.$dateToString(d)
                        , currentDay: curentDateStr == this.$dateToString(d)
                        , isThisMonth: true
                    });

                    if (this.getDay(d) % 7 == 6) { // вс, последний день - перевод строки
                        index += 1;
                        this.calendar.push([]);
                    }

                    d.setDate( d.getDate() + 1 );
                }

                // добить таблицу пустыми ячейками, если нужно
                if (this.getDay(d) != 0) {
                    for (let i = this.getDay(d); i < 7; i++) {
                      this.calendar[index].push({ 
                            name: d.getDate()
                          , date_str: this.$dateToString(d)
                          , currentDay: curentDateStr == this.$dateToString(d)
                          , isThisMonth: false
                      });
                      d.setDate( d.getDate() + 1 );
                    }
                }
            },
            selectDay(day) {
                this.selectDaySaved = day.date_str;
                this.$emit("selectDay", day.date_str, this.indexField);
            },
            monthDown() {
                this.dateCalendar.setMonth(  this.dateCalendar.getMonth() - 1);
                this.render(this.dateCalendar.getFullYear(), this.dateCalendar.getMonth());
            },
            monthUp() {
                this.dateCalendar.setMonth(  this.dateCalendar.getMonth() + 1);
                this.render(this.dateCalendar.getFullYear(), this.dateCalendar.getMonth());
            },
            yearDown() {
                this.dateCalendar.setFullYear(  this.dateCalendar.getFullYear() - 1);
                this.render(this.dateCalendar.getFullYear(), this.dateCalendar.getMonth());
            },
            yearUp() {
                this.dateCalendar.setFullYear(  this.dateCalendar.getFullYear() + 1);
                this.render(this.dateCalendar.getFullYear(), this.dateCalendar.getMonth());
            }
        }
    }
</script>

<style scoped>
    .header-days-names {
        width: 30px;
        height: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 500;
        font-size: 12px;
        color: #7890A0;
        cursor: default;
    }
    #calendar-header {
        display: flex;
        margin-bottom: 3px;
        border-bottom: 1px solid #CCC;
    }
    .header-week-row {
        display: flex;
    }
    .header-week-row-day {
        width: 30px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 500;
        font-size: 12px;
        cursor: pointer;
        color: #636363;
    }
    .header-week-row-day-select,
    .header-week-row-day:hover {
        background: #3b74c1;
        color: white !important;
    }
    .calendar-btn-left {
        cursor: pointer;
        background: url(/calendar_arrow_left.svg) no-repeat center;
        background-size: 10px 10px;
        width: 12px;
        height: 12px;
        opacity: 0.5;
        padding: 0 3px;
    }
    .calendar-btn-rigth {
        cursor: pointer;
        background: url(/calendar_arrow_right.svg) no-repeat center;
        background-size: 10px 10px;
        width: 12px;
        height: 12px;
        opacity: 0.5;
        padding: 0 3px;
    }
    .calendar-btn-left:hover,
    .calendar-btn-rigth:hover {
        opacity: 0.9;
    }
    
    .calendar-panel-item {
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }
    .calendar-panel-value {
        font-weight: 500;
        font-size: 12px;
        color: #636363;
        padding: 0 5px;
        text-align: center;
    }
    #calendar-panel {
        margin-top: 5px;
        margin-bottom: 10px;
        display: flex;
    }
    .calendar-panel-item-sep {
        flex-grow: 1;
    }
    .header-week-row-day-current-day {
        color: red;
    }
    .header-week-row-day-not-thisMonth {
        color: #7890A0;
    }
    .calendar-panel-value-month-name {
        min-width: 70px;
        padding-bottom: 2px;
    }
</style>