// import Pasoonate from "./pasoonate";

const CalendarView = (($) => {

    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */

    const NAME = 'calendarView'
    const VERSION = '1.0.0'
    const DATA_KEY = 'bs.calendar-view'
    const EVENT_KEY = `.${DATA_KEY}`
    const DATA_API_KEY = '.data-api'
    const JQUERY_NO_CONFLICT = $.fn[NAME]

    const Event = {
        CHANGE: `change${EVENT_KEY}`,
        CLICK_DATA_API: `click${EVENT_KEY}${DATA_API_KEY}`,
        OVER_DATA_API: `mouseenter${EVENT_KEY}${DATA_API_KEY}`,
        SELECT: `select${EVENT_KEY}`,
        OVER: `over${EVENT_KEY}`
    }

    const ClassName = {
        CALENDAR_VIEW: 'calendar-view',
        MONTH_VIEW: 'calendar-month-view',
        WEEK_VIEW: 'calendar-week-view',
        DAY_VIEW: 'calendar-day-view',
        DAY_VIEW_TODAY: 'calendar-day-view-today',
        DAY_VIEW_INFOCUS: 'calendar-day-view-infocus',
        DAY_VIEW_OUTFOCUS: 'calendar-day-view-outfocus',
        DAY_VIEW_SELECTED: 'calendar-day-view-selected',
        DAY_VIEW_START: 'calendar-day-view-start',
        DAY_VIEW_END: 'calendar-day-view-end',
        DAY_VIEW_BETWEEN: 'calendar-day-view-between',
        DAY_VIEW_DISABLED: 'calendar-day-view-disabled',
    }

    const Selector = {
        CALENDAR_VIEW: `.${ClassName.CALENDAR_VIEW}`,
        MONTH_VIEW: `tbody.${ClassName.MONTH_VIEW}`,
        DAY_VIEW: `.${ClassName.DAY_VIEW}`
    }

    /**
    * ------------------------------------------------------------------------
    * Class Definition
    * ------------------------------------------------------------------------
    */

    class CalendarView {
        constructor(element) {
            this._element = element;
            this._calendar = 'jalali';
            this._current = Pasoonate.make()[this._calendar]();
            this.beforeRenderDayAction = (date) => { return date.getDay(); };

            this.render();
            $(this._element).trigger($.Event(Event.CHANGE, {
                current: Pasoonate.make(this._current.getTimestamp())[this._calendar]()
            }));
        }
        
        // Public
        
        render() {
            this._goto();
        }

        beforeRenderDay([action]) {
            if(typeof action === 'function') {
                this.beforeRenderDayAction = action;
                this._renderMonthView();
            }
        }

        goto([year, month, day]) {
            this._goto(year, month, day);
        }

        nextMonth() {
            let date = Pasoonate.make(this._current.getTimestamp())[this._calendar]();
            date.addMonth(1);

            this._goto(date.getYear(), date.getMonth());
        }

        prevMonth() {
            let date = Pasoonate.make(this._current.getTimestamp())[this._calendar]();
            date.subMonth(1);

            this._goto(date.getYear(), date.getMonth());
        }

        selectDay([date]) {
            $(this._element)
                .find(`${Selector.DAY_VIEW}[data-gregorian-date=${date}]`)
                .addClass(ClassName.DAY_VIEW_SELECTED);
        }

        clearSelection([date]) {
            if(date) {
                $(this._element).find(`${Selector.DAY_VIEW}[data-gregorian-date=${date}]`).removeClass(ClassName.DAY_VIEW_SELECTED);
            } else {
                $(this._element).find(Selector.DAY_VIEW).removeClass(ClassName.DAY_VIEW_SELECTED);
            }
        }

        selectRange([start, end]) {
            const [startYear, startMonth, startDay] = String(start).split('-');
            const day = Pasoonate.make().gregorian().setDate(Number(startYear), Number(startMonth), Number(startDay));
            
            $(this._element)
                .find(`${Selector.DAY_VIEW}[data-gregorian-date=${start}]`)
                .addClass(ClassName.DAY_VIEW_START);

            $(this._element)
                .find(`${Selector.DAY_VIEW}[data-gregorian-date=${end}]`)
                .addClass(ClassName.DAY_VIEW_END);
            
            day.addDay(1);
            
            while(day.format('yyyy-mm-dd') !== end) {
                $(this._element)
                    .find(`${Selector.DAY_VIEW}[data-gregorian-date=${day.format('yyyy-mm-dd')}]`)
                    .addClass(ClassName.DAY_VIEW_BETWEEN);

                day.addDay(1);
            } 
        }

        clearRange() {
            $(this._element)
                .find(Selector.DAY_VIEW)
                .removeClass([ClassName.DAY_VIEW_START, ClassName.DAY_VIEW_END, ClassName.DAY_VIEW_BETWEEN]);
        }

        startDay([date]) {
            $(this._element)
                .find(`${Selector.DAY_VIEW}[data-gregorian-date=${date}]`)
                .addClass(ClassName.DAY_VIEW_START);
        }

        endDay([date]) {
            $(this._element)
                .find(`${Selector.DAY_VIEW}[data-gregorian-date=${date}]`)
                .addClass(ClassName.DAY_VIEW_END);
        }

        disableDay([date]) {
            $(this._element)
                .find(`${Selector.DAY_VIEW}[data-gregorian-date=${date}]`)
                .addClass(ClassName.DAY_VIEW_DISABLED);
        }

        enableDay([date]) {
            $(this._element)
                .find(`${Selector.DAY_VIEW}[data-gregorian-date=${date}]`)
                .removeClass(ClassName.DAY_VIEW_DISABLED);
        }

        addClass([date, className]) {
            $(this._element)
                .find(`${Selector.DAY_VIEW}[data-gregorian-date=${date}]`)
                .addClass(className);
        }

        removeClass([date, className]) {
            $(this._element)
                .find(`${Selector.DAY_VIEW}[data-gregorian-date=${date}]`)
                .removeClass(className);
        }

        hasClass([date, className, has]) {
            has.value = $(this._element)
                .find(`${Selector.DAY_VIEW}[data-gregorian-date=${date}]`)
                .hasClass(className);   
        }

        getFirstAndLastDay([range]) {
            const $days = $(this._element).find(`${Selector.DAY_VIEW}`);

            if($days.length) {
                range.first = Number($days[0].dataset['pick']);
                range.last = Number($days[$days.length - 1].dataset['pick']);
            }
        }

        // Private

        _renderMonthView() {
            let $monthView = $(this._element).find(Selector.MONTH_VIEW);
            let firstOfMonth = Pasoonate.make()[this._calendar]();
            let firstOfWeek;

            $monthView.empty();

            firstOfMonth.setTimestamp(this._current.getTimestamp()).setDay(1);

            firstOfWeek = firstOfMonth.subDay(firstOfMonth.dayOfWeek());

            for(let i = 1; i <= 6; i++) {
                $monthView.append(this._renderWeekView(firstOfWeek, i));

                firstOfWeek.addDay(7);
            }
        }

        _renderWeekView(from, week) {
            let $week = $('<tr>');
            let day = Pasoonate.make(from.getTimestamp())[this._calendar]();
            
            $week.addClass(ClassName.WEEK_VIEW).addClass('week-' + week);

            for(let i = 0; i < 7; i++) {
                $week.append(this._renderDayView(day));
                day.addDay(1);
            }

            return $week;
        }

        _renderDayView(day) {
            let content = this.beforeRenderDayAction(day);
            let $day = $('<td role="presentation">');
            let today = Pasoonate.make()[this._calendar]();

            $day.addClass(ClassName.DAY_VIEW);
            $day.attr('data-pick', day.getTimestamp());
            $day.attr('data-gregorian-date', Pasoonate.make(day.getTimestamp()).gregorian().format('yyyy-mm-dd'));
            
            if(day.getMonth() === this._current.getMonth()) {
                $day.attr('data-day', day.getDay());
                $day.addClass(ClassName.DAY_VIEW_INFOCUS);
            }
            else {
                $day.addClass(ClassName.DAY_VIEW_OUTFOCUS);
            }

            if(day.format('yyyy-mm-dd') === today.format('yyyy-mm-dd')) {
                $day.addClass(ClassName.DAY_VIEW_TODAY);
            }

            $day.html(content);

            return $day;
        }

        _goto(year, month, day) {
            
            let old = Pasoonate.make(this._current.getTimestamp())[this._calendar]();
            let isChange = false;

            isChange = (year && year != this._current.getYear()) | (month && month != this._current.getMonth()) | (day && day != this._current.getDay());

            if(isChange) {
                this._current.setYear(parseInt(year) || this._current.getYear());
                this._current.setMonth(parseInt(month) || this._current.getMonth());
                this._current.setDay(parseInt(day) || this._current.getDay());

                const changeEvent = $.Event(Event.CHANGE, {
                    old: old,
                    current: Pasoonate.make(this._current.getTimestamp())[this._calendar]()
                })

                $(this._element).trigger(changeEvent);
                
                if (changeEvent.isDefaultPrevented()) {
                    this._current.setTimestamp(old.getTimestamp());
                    return;
                }
            } 

            this._renderMonthView();
        }

        // Static

        static _jQueryInterface(method, ...args) {
            return this.each(function () {
                const $this = $(this)
                let data = $this.data(DATA_KEY)

                if (!data) {
                    data = new CalendarView(this)
                    $this.data(DATA_KEY, data)
                }

                if (typeof method === 'string') {
                    if (typeof data[method] === 'undefined') {
                        throw new TypeError(`No method named "${method}"`)
                    }
                    data[method](args)
                }
            })
        }
    }

    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */

    $(document)
        .on(Event.CLICK_DATA_API, `${Selector.DAY_VIEW}:not(${Selector.DAY_VIEW_DISABLED})`, function () {
            $(this)
                .closest(Selector.CALENDAR_VIEW)
                .trigger(
                    $.Event(Event.SELECT, {
                        relatedTarget: this
                    })
                );
        })
        .on(Event.OVER_DATA_API, `${Selector.DAY_VIEW}:not(${Selector.DAY_VIEW_DISABLED})`, function () {
            $(this)
                .closest(Selector.CALENDAR_VIEW)
                .trigger(
                    $.Event(Event.OVER, {
                        relatedTarget: this
                    })
                );
        })

    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */

    $.fn[NAME] = CalendarView._jQueryInterface;
    $.fn[NAME].Constructor = CalendarView;
    $.fn[NAME].noConflict = function () {
        $.fn[NAME] = JQUERY_NO_CONFLICT;
        return CalendarView._jQueryInterface;
    }

    return CalendarView;
})($);

// export default CalendarView;
// import $ from 'jquery';
// import Pasoonate from './pasoonate';
// import CalendarView from './calendar-view';

const DatePicker = (($) => {
    
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */

    const NAME = 'datePicker';
    const VERSION = '1.0.0';
    const DATA_KEY = 'bs.date-picker';
    const EVENT_KEY = `.${DATA_KEY}`;
    const DATA_API_KEY = '.data-api';
    const JQUERY_NO_CONFLICT = $.fn[NAME];

    const Event = {
        HIDE: `hide${EVENT_KEY}`,
        HIDDEN: `hidden${EVENT_KEY}`,
        SHOW: `show${EVENT_KEY}`,
        SHOWN: `shown${EVENT_KEY}`,
        FOCUS_CHANGE: `focus-change${EVENT_KEY}`,
        CHANGE: `change${EVENT_KEY}`,
        CLICK_DATA_API: `click${EVENT_KEY}${DATA_API_KEY}`,
        OVER_DATA_API: `mouseover${EVENT_KEY}${DATA_API_KEY}`,
    };

    const ClassName = {
        DATE_PICKER: 'date-picker',
        DISABLED: 'disabled',
        FADE: 'fade',
        SHOW: 'show',
        DAY_NUMBER: 'date-picker-day-number',
        DAY_DISABLED: 'date-picker-day-disabled',
        DAY_START: 'date-picker-day-start',
        DAY_END: 'date-picker-day-end',
        DAY_BETWEEN: 'date-picker-day-between',
        BTN_NEXT_MONTH: 'date-picker-btn-next-month',
        BTN_PREV_MONTH: 'date-picker-btn-prev-month',
        YEAR_MONTH: 'date-picker-year-month',
        LOCK_DAY: 'calendar-day-view-lock',
        SELECTABLE_DAY: 'calendar-day-view-selectable',
    };

    const Selector = {
        DATE_PICKER: '.date-picker',
        INPUT: 'input[type=date]',
        DISABLED: '.disabled',
        DATA_TOGGLE: '[data-toggle="date-picker"]',
        DAY_NUMBER: '.date-picker-day-number',
        BTN_NEXT_MONTH: '.date-picker-btn-next-month',
        BTN_PREV_MONTH: '.date-picker-btn-prev-month',
        YEAR_MONTH: '.date-picker-year-month',
        CALENDAR_VIEW: '.calendar-view'
    };

    class DatePicker {

        constructor(element) {
            this._element = element;
            this._options = {};
            this._startDay = null;
            this._endDay = null;
            this._focusOn = 'start';

            this._render();
        }

        // Public

        show() {
            if (this._element.parentNode &&
                this._element.parentNode.nodeType === Node.ELEMENT_NODE &&
                $(this._element).hasClass(ClassName.DISABLED)) {
                return;
            }

            const datePicker = $(this._element.parentNode).find(Selector.DATE_PICKER)[0];
            
            const showEvent = $.Event(Event.SHOW, {
                relatedTarget: this._element
            });

            $(this._element).trigger(showEvent);

            if (showEvent.isDefaultPrevented()) {
                return;
            }

            const complete = () => {
                const shownEvent = $.Event(Event.SHOWN, {
                    relatedTarget: this._element
                })

                $(this._element).trigger(shownEvent)
            };

            $(datePicker).addClass(ClassName.SHOW);

            complete();
        }

        hide() {
            if (this._element.parentNode &&
                this._element.parentNode.nodeType === Node.ELEMENT_NODE &&
                $(this._element).hasClass(ClassName.DISABLED)) {
                return;
            }

            const datePicker = $(this._element.parentNode).find(Selector.DATE_PICKER)[0];
            
            const hideEvent = $.Event(Event.HIDE, {
                relatedTarget: this._element
            });

            $(this._element).trigger(hideEvent);

            if (hideEvent.isDefaultPrevented()) {
                return;
            }

            const complete = () => {
                const hiddenEvent = $.Event(Event.HIDDEN, {
                    relatedTarget: this._element
                })

                $(this._element).trigger(hiddenEvent)
            };

            $(datePicker).removeClass(ClassName.SHOW);

            complete();
        }

        toggle() {
            if (this._element.parentNode &&
                this._element.parentNode.nodeType === Node.ELEMENT_NODE &&
                $(this._element).hasClass(ClassName.DISABLED)) {
                return;
            }

            const datePicker = $(this._element.parentNode).find(Selector.DATE_PICKER)[0];

            if($(datePicker).hasClass(ClassName.SHOW)) {
                this.hide();
            }
            else {
                this.show();
            }
        }
        
        dispose() {
            $.removeData(this._element, DATA_KEY)
            this._element = null
        }

        clear() {
            this._startDay = null;
            this._endDay = null;
            this._focusOn = 'start';
            $(this._element).parent().find(Selector.CALENDAR_VIEW).calendarView('clearRange');

            this._autoUnlockDays();
            
            const changeEvent = $.Event(Event.CHANGE, {
                startDay: this._startDay,
                endDay: this._endDay
            });

            $(this._element).trigger(changeEvent);
        }

        options([options]) {
            for(let key in options) {
                this._options[key] = options[key];
            }

            this.refresh();
        }

        focusOn([type]) {
            if(type === 'start') {
                this._focusOn = type;
            } else if(type === 'end') {
                if(this._startDay === null) {
                    this._focusOn = 'start';

                    const focusChangeEvent = $.Event(Event.FOCUS_CHANGE, {
                        relatedTarget: this._element,
                        focusOn: this._focusOn
                    });
        
                    $(this._element).trigger(focusChangeEvent);
                } else {
                    this._focusOn = type;
                }
            }
        }

        refresh() {
            const $calendarView = $(this._element.parentNode).find(Selector.CALENDAR_VIEW);
            const data = this._dataKeyByDay();

            $calendarView.calendarView('render');
            
            for(const date in data) {
                if(data[date].disabled) {
                    $calendarView.calendarView('disableDay', date);
                }
            }

            if(this._startDay) {
                $calendarView.calendarView('startDay', this._startDay);
            }

            if(this._endDay) {
                $calendarView.calendarView('endDay', this._endDay);
            }

            if(this._startDay && this._endDay) {
                $calendarView.calendarView('clearRange');
                $calendarView.calendarView('selectRange', this._startDay, this._endDay);
            }

            this._assignSelectableDays();
            this._autoUnlockDays();
            this._autoLockDays();
        }

        nextMonth() {
            const $calendarView = $(this._element.parentNode).find(Selector.CALENDAR_VIEW);
            const data = this._dataKeyByDay();
            
            $calendarView.calendarView('nextMonth');
            
            for(const date in data) {
                if(data[date].disabled) {
                    $calendarView.calendarView('disableDay', date);
                }
            }

            if(this._startDay) {
                $calendarView.calendarView('startDay', this._startDay);
            }

            if(this._endDay) {
                $calendarView.calendarView('endDay', this._endDay);
            }

            if(this._startDay && this._endDay) {
                $calendarView.calendarView('clearRange');
                $calendarView.calendarView('selectRange', this._startDay, this._endDay);
            }

            this._assignSelectableDays();
            this._autoUnlockDays();
            this._autoLockDays();
        }

        prevMonth() {
            const $calendarView = $(this._element.parentNode).find(Selector.CALENDAR_VIEW);
            const data = this._dataKeyByDay();
            
            $calendarView.calendarView('prevMonth');
            
            for(const date in data) {
                if(data[date].disabled) {  
                    $calendarView.calendarView('disableDay', date);
                }
            }

            if(this._startDay) {
                $calendarView.calendarView('startDay', this._startDay);
            }

            if(this._endDay) {
                $calendarView.calendarView('endDay', this._endDay);
            }

            if(this._startDay && this._endDay) {
                $calendarView.calendarView('clearRange');
                $calendarView.calendarView('selectRange', this._startDay, this._endDay);
            }

            this._assignSelectableDays();
            this._autoUnlockDays();
            this._autoLockDays();
        }

        // Private

        _render() {
            if (this._element.parentNode &&
                this._element.parentNode.nodeType === Node.ELEMENT_NODE &&
                ($(this._element).hasClass(ClassName.DISABLED) ||
                 this._element.hasAttribute('disabled'))) {
                return;
            }
            
            let target = this._element;
            let parent = target.parentNode;

            let $picker = $(`<div class="${ClassName.DATE_PICKER}">`);
            let $calendarView = $('<table class="calendar-view table table-borderless">');
            let $calendarHeader = $('<thead>')
                .html(
                    $('<tr class="calendar-nav">').html(
                        $('<th class="p-1" colspan="7">').html(
                            '<div class="d-flex">' +
                                `<div class="col-auto px-1"><button type="button" class="btn btn-link btn-sm ${ClassName.BTN_PREV_MONTH}"><i class="icon icon-16 icon-arrow-right-muted">قبل</i></button></div>`+
                                `<div class="col"><span class="${ClassName.YEAR_MONTH}"></span></div>`+
                                `<div class="col-auto px-1"><button type="button" class="btn btn-link btn-sm ${ClassName.BTN_NEXT_MONTH}"><i class="icon icon-16 icon-arrow-left-muted">بعد</i></button></div>`+
                            '</div>'
                        )
                    )
                )
                .append(
                    $('<tr class="calendar-weekdays">').html(
                        '<th class="calendar-weekday" scope="col">ش</th>' + 
                        '<th class="calendar-weekday" scope="col">ی</th>' + 
                        '<th class="calendar-weekday" scope="col">د</th>' + 
                        '<th class="calendar-weekday" scope="col">س</th>' + 
                        '<th class="calendar-weekday" scope="col">چ</th>' + 
                        '<th class="calendar-weekday" scope="col">پ</th>' + 
                        '<th class="calendar-weekday" scope="col">ج</th>'
                    )
                );
            let $calendarBody = $('<tbody class="calendar-month-view">');
            let $calendarFooter = $('<tfoot>');
            $calendarFooter.html($('<tr>').html($('<td colspan="7" class="px-0 pb-0 text-left">').html($('<button type="button" class="btn btn-outline-secondary">').text('پاک کردن').click(() => {
                this.clear();
                this.hide();
            }))));

            $calendarView.append($calendarHeader).append($calendarBody).append($calendarFooter);
            $picker.append($calendarView);
            $picker.data('target', target);

            $(parent).append($picker).css('position', 'relative');

            $calendarView.calendarView('beforeRenderDay', (date) => {
                let classNames = '';
                let text = '&nbsp;';
                let day;
                let data = this._dataKeyByDay();

                if(day = data[date.gregorian().format('yyyy-mm-dd')]) {
                    classNames = day.class;
                    text = day.text;
                }

                let $day = $(`<div class="${ClassName.DAY_NUMBER} ${classNames}}">`);
    
                $day.html(`<div>${date.jalali().getDay()}</div><div>${text}</div>`);
                
                return $day;
            });

            $calendarView.on('select.bs.calendar-view', (event) => {
                const selectedDay = event.relatedTarget.dataset.gregorianDate;
                const days = this._dataKeyByDay();
                const [year, month, day] = selectedDay.split('-');
                const pasoonate = Pasoonate.make();
                pasoonate.gregorian().setDate(Number(year), Number(month), Number(day));

                let isSelectableDay = {};
                $calendarView.calendarView('hasClass', selectedDay, ClassName.SELECTABLE_DAY, isSelectableDay);
                isSelectableDay = isSelectableDay.value;

                const isLockDay = {};
                $calendarView.calendarView('hasClass', selectedDay, ClassName.LOCK_DAY, isLockDay);
                if(isLockDay.value && !isSelectableDay) {
                    return;
                }

                if(this._focusOn === 'start') {
                    
                    if(this._startDay === selectedDay) {
                        return true;
                    }
                    
                    if(this._startDay) {

                        this._startDay = selectedDay;
                        if(this._endDay === null) {
                            //Check Disables
                            if(days[selectedDay] && days[selectedDay].disabled) {
                                return true;
                            }

                            $($calendarView)
                                .calendarView('clearRange')
                                .calendarView('startDay', this._startDay);

                        } else if(this._endDay > selectedDay){
                            //Check Disables
                            if(days[selectedDay] && days[selectedDay].disabled) {
                                return true;
                            }
        
                            while(pasoonate.gregorian().format('yyyy-mm-dd') !== this._endDay) {
                                pasoonate.addDay(1);
                                const d = pasoonate.gregorian().format('yyyy-mm-dd');
                                if(days[d] && days[d].disabled && d !== this._endDay) {
                                    return true;
                                }
                            }

                            $($calendarView)
                                .calendarView('clearRange')
                                .calendarView('selectRange', this._startDay, this._endDay);

                        } else if(this._endDay < selectedDay){
                            //Check Disables
                            if(days[selectedDay] && days[selectedDay].disabled) {
                                return true;
                            }

                            $($calendarView)
                                .calendarView('clearRange')
                                .calendarView('startDay', this._startDay);
                            this._endDay = null;
                        }
                    } 
                    else {
                        //Check Disabled day
                        if(days[selectedDay] && days[selectedDay].disabled) {
                            return true;
                        }

                        this._startDay = selectedDay;
                        $($calendarView)
                            .calendarView('clearRange')
                            .calendarView('startDay', this._startDay);

                        this._focusOn = 'end';
                        
                        const focusChangeEvent = $.Event(Event.FOCUS_CHANGE, {
                            relatedTarget: this._element,
                            focusOn: this._focusOn
                        });
            
                        $(this._element).trigger(focusChangeEvent);
                    }
                }
                
                else if(this._focusOn === 'end') {
                    
                    if(this._endDay === selectedDay) {
                        return true;
                    }
                    
                    if(this._endDay) {
                        this._endDay = selectedDay;

                        if(this._startDay === null) {
                            this._focusOn = 'start';

                            const focusChangeEvent = $.Event(Event.FOCUS_CHANGE, {
                                relatedTarget: this._element,
                                focusOn: this._focusOn
                            });
                
                            $(this._element).trigger(focusChangeEvent);

                            return true;
                        } else if(this._startDay < selectedDay){
                            //Check Disables
                            if(days[selectedDay] && days[selectedDay].disabled && !isSelectableDay) {
                                return true;
                            }
        
                            while(pasoonate.gregorian().format('yyyy-mm-dd') !== this._startDay) {
                                pasoonate.subDay(1);
                                const d = pasoonate.gregorian().format('yyyy-mm-dd');
                                if(days[d] && days[d].disabled) {
                                    return true;
                                }
                            }

                            $($calendarView)
                                .calendarView('clearRange')
                                .calendarView('selectRange', this._startDay, this._endDay);
                        } else if(this._startDay > selectedDay){
                            //Check Disables
                            if(days[selectedDay] && days[selectedDay].disabled) {
                                return true;
                            }

                            $($calendarView)
                                .calendarView('clearRange')
                                .calendarView('startDay', this._endDay);
                            this._startDay = this._endDay;
                            this._endDay = null;
                        }
                    } 
                    else {
                        //Check Disables
                        if(days[selectedDay] && days[selectedDay].disabled && !isSelectableDay) {
                            return true;
                        }
    
                        while(pasoonate.gregorian().format('yyyy-mm-dd') !== this._startDay) {
                            pasoonate.subDay(1);
                            const d = pasoonate.gregorian().format('yyyy-mm-dd');
                            if(days[d] && days[d].disabled) {
                                return true;
                            }
                        }

                        this._endDay = selectedDay;
                        $($calendarView)
                            .calendarView('clearRange')
                            .calendarView('selectRange', this._startDay, this._endDay);
                    }
                }

                const changeEvent = $.Event(Event.CHANGE, {
                    startDay: this._startDay,
                    endDay: this._endDay
                });
    
                $(this._element).trigger(changeEvent);

                this._autoUnlockDays();
                this._autoLockDays();

                this.hide();
            });

            $calendarView.on('over.bs.calendar-view', (event) => {
                const date = event.relatedTarget.dataset.gregorianDate;
                const days = this._dataKeyByDay();
                const [year, month, day] = date.split('-');
                const pasoonate = Pasoonate.make();
                pasoonate.gregorian().setDate(Number(year), Number(month), Number(day));

                if(this._startDay == date) {
                    return true;
                } 
                
                if(this._startDay === null || this._startDay > date) {
                    return true;
                }

                if(this._startDay && this._endDay === null) {
                    //Check Disables
                    if(days[date] && days[date].disabled) {
                        return true;
                    }

                    while(pasoonate.gregorian().format('yyyy-mm-dd') !== this._startDay) {
                        pasoonate.subDay(1);
                        const d = pasoonate.gregorian().format('yyyy-mm-dd');
                        if(days[d] && days[d].disabled) {
                            return true;
                        }
                    }

                    $($calendarView)
                        .calendarView('clearRange')
                        .calendarView('selectRange', this._startDay, date);
                } 
            });
        }

        _dataKeyByDay() {
            let data = {};

            if(this._options.data === undefined) {
                return data;
            }

            for(const item of this._options.data) {
                data[item.day] = item;
            }
            
            return data;
        }

        _autoLockDays() {
            const $calendarView = $(this._element.parentNode).find(Selector.CALENDAR_VIEW);
            const days = this._dataKeyByDay();
            const range = {};
            
            $calendarView.calendarView('getFirstAndLastDay', range);
                
            if(this._startDay) {
                const [year, month, day] = this._startDay.split('-');
                const pasoonate = Pasoonate.make();
                pasoonate.gregorian().setDate(Number(year), Number(month), Number(day));

                let findDisabled = false;
                while(pasoonate.getTimestamp() <= range.last) {
                    pasoonate.gregorian().addDay(1);
                    
                    const d = pasoonate.gregorian().format('yyyy-mm-dd');

                    if(!findDisabled && days[d] && days[d].disabled) {
                        findDisabled = true;
                    }

                    if(findDisabled) {
                        $($calendarView).calendarView('addClass', d, ClassName.LOCK_DAY)
                    }
                }

                findDisabled = false;
                pasoonate.gregorian().setDate(Number(year), Number(month), Number(day));
                while(pasoonate.getTimestamp() >= range.first) {
                    pasoonate.gregorian().subDay(1);
                    
                    const d = pasoonate.gregorian().format('yyyy-mm-dd');

                    if(!findDisabled && days[d] && days[d].disabled) {
                        findDisabled = true;
                    }

                    if(findDisabled) {
                        $($calendarView).calendarView('addClass', d, ClassName.LOCK_DAY)
                    }
                }
            }
        }

        _autoUnlockDays() {
            const $calendarView = $(this._element.parentNode).find(Selector.CALENDAR_VIEW);
            const range = {};

            $calendarView.calendarView('getFirstAndLastDay', range);
            
            const firstDay = Pasoonate.make(range.first);

            while(firstDay.getTimestamp() <= range.last) {
                firstDay.gregorian().addDay(1);
                $calendarView.calendarView('removeClass', firstDay.gregorian().format('yyyy-mm-dd'), ClassName.LOCK_DAY);
            }
        }

        _assignSelectableDays() {
            const $calendarView = $(this._element.parentNode).find(Selector.CALENDAR_VIEW);
            const days = this._dataKeyByDay();
            const range = {};

            $calendarView.calendarView('getFirstAndLastDay', range);
            
            const pasoonate = Pasoonate.make(range.first);
            let selectableDay = 0;

            while(pasoonate.getTimestamp() <= range.last) {
                const temp = pasoonate.gregorian().format('yyyy-mm-dd');
                
                if(days[temp] && days[temp].disabled) {
                    selectableDay = selectableDay === 0 ? 1 : 2;
                } else {
                    selectableDay = 0;
                }

                if(selectableDay === 1) {
                    $($calendarView).calendarView('addClass', temp, ClassName.SELECTABLE_DAY);
                }

                pasoonate.addDay(1);
            }
        }

        // Static

        static get VERSION() {
            return VERSION
        }

        static _jQueryInterface(config, ...args) {
            
            return this.each(function () {
                const $this = $(this);
                let data = $this.data(DATA_KEY);
                
                if (!data) {
                    data = new DatePicker(this);
                    $this.data(DATA_KEY, data);
                }

                if (typeof config === 'string') {
                    if (typeof data[config] === 'undefined') {
                        throw new TypeError(`No method named "${config}"`);
                    }
                    data[config](args);
                }
            })
        }
    }

    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */
    
    $(document)
        .on(Event.CLICK_DATA_API, Selector.BTN_NEXT_MONTH, function (event) {
            $(this).closest(Selector.DATE_PICKER).parent().find(Selector.DATA_TOGGLE).datePicker('nextMonth');
        })
        .on(Event.CLICK_DATA_API, Selector.BTN_PREV_MONTH, function (event) {
            $(this).closest(Selector.DATE_PICKER).parent().find(Selector.DATA_TOGGLE).datePicker('prevMonth');
        })
        .on('change.bs.calendar-view', `${Selector.DATE_PICKER} ${Selector.CALENDAR_VIEW}`, function (event) {
            $(this).find(Selector.YEAR_MONTH).html(Pasoonate.trans(`jalali.month_name.${event.current.getMonth()}`) + ' ' + event.current.getYear()); 
        })
        .on('click', function (event) {
            let $activeDatePicker = $('.date-picker.show');
            
            if($activeDatePicker.length) {
                let $myElements = $activeDatePicker.parent().find($(event.target));

                if($myElements.length) {
                    return true;
                }
            }

            $activeDatePicker.datePicker('hide');
        });

    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */

    $.fn[NAME] = DatePicker._jQueryInterface;
    $.fn[NAME].Constructor = DatePicker;
    $.fn[NAME].noConflict = function () {
        $.fn[NAME] = JQUERY_NO_CONFLICT
        return DatePicker._jQueryInterface
    };

    return DatePicker;    
})($);

// export default DatePicker;