

const CalendarView = (($) => {

    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */

    const NAME = 'calendarView'
    const VERSION = '1.0.6'
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
        MONTH_VIEW: `.${ClassName.MONTH_VIEW}`,
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
            this._weekViewElement = '<tr>';
            this._dayViewElement = '<td>';
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

        weekViewElement([element]) {
            if(typeof element === 'function') {
                this._weekViewElement = element();
            } else {
                this._weekViewElement = element;
            }
        }

        dayViewElement([element]) {
            if(typeof element === 'function') {
                this._dayViewElement = element();
            } else {
                this._dayViewElement = element;
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
            
            while(day.format('yyyy-MM-dd') !== end) {
                $(this._element)
                    .find(`${Selector.DAY_VIEW}[data-gregorian-date=${day.format('yyyy-MM-dd')}]`)
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
            let $week = $(this._weekViewElement);
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
            let $day = $(this._dayViewElement);
            let today = Pasoonate.make()[this._calendar]();

            $day.addClass(ClassName.DAY_VIEW);
            $day.attr('data-pick', day.getTimestamp());
            $day.attr('data-gregorian-date', Pasoonate.make(day.getTimestamp()).gregorian().format('yyyy-MM-dd'));
            
            if(day.getMonth() === this._current.getMonth()) {
                $day.attr('data-day', day.getDay());
                $day.addClass(ClassName.DAY_VIEW_INFOCUS);
            }
            else {
                $day.addClass(ClassName.DAY_VIEW_OUTFOCUS);
            }

            if(day.format('yyyy-MM-dd') === today.format('yyyy-MM-dd')) {
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
                const $this = $(this);
                let data = $this.data(DATA_KEY);

                if (!data) {
                    data = new CalendarView(this);
                    $this.data(DATA_KEY, data);
                }

                if (typeof method === 'string') {
                    if (typeof data[method] === 'undefined') {
                        throw new TypeError(`No method named "${method}"`);
                    }
                    data[method](args);
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






const DatePicker = (($) => {
    
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */

    const NAME = 'datePicker';
    const VERSION = '1.3.6';
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
        MONTH_CHANGE: `month-change${EVENT_KEY}`,
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
        CALENDAR_VIEW: '.calendar-view',
        NOTICE: '.date-picker-notice',
        INPUT_CHECKIN: '.date-picker-header #datePickerInputCheckin',
        INPUT_CHECKOUT: '.date-picker-header #datePickerInputCheckout',
        BTN_CLOSE: '.date-picker-header .date-picker-close'
    };

    class DatePicker {

        constructor(element) {
            this._element = element;
            this._parent = element.parentNode;
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

            this._unlockCurrentDays();
            this._lockDays(this._options.lockBefore, this._options.lockAfter);

            $(this._parent).find(Selector.INPUT_CHECKIN).removeClass('focus').html('ورود');
            $(this._parent).find(Selector.INPUT_CHECKOUT).removeClass('focus').html('خروج');
            
            const changeEvent = $.Event(Event.CHANGE, {
                startDay: this._startDay,
                endDay: this._endDay
            });

            $(this._element).trigger(changeEvent);
        }

        options([options]) {
            options.data = this._updateDataOption(options.data);

            Object.assign(this._options, options);
            
            this.refresh();
        }

        focusOn([type]) {
            $(this._parent).find(Selector.INPUT_CHECKIN).removeClass('focus');
            $(this._parent).find(Selector.INPUT_CHECKOUT).removeClass('focus');

            if(type === 'start') {
                this._focusOn = type;
                $(this._parent).find(Selector.INPUT_CHECKIN).addClass('focus');
            } else if(type === 'end') {
                if(this._startDay === null) {
                    this._focusOn = 'start';
                    $(this._parent).find(Selector.INPUT_CHECKIN).addClass('focus');

                    const focusChangeEvent = $.Event(Event.FOCUS_CHANGE, {
                        relatedTarget: this._element,
                        focusOn: this._focusOn
                    });
        
                    $(this._element).trigger(focusChangeEvent);
                } else {
                    this._focusOn = type;
                    $(this._parent).find(Selector.INPUT_CHECKOUT).addClass('focus');
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

            this._assignSelectableDays();
            this._unlockCurrentDays();
            this._autoLockDays();
            this._lockDays(this._options.lockBefore, this._options.lockAfter);

            $(this._parent).find(Selector.INPUT_CHECKIN).html('ورود');
            $(this._parent).find(Selector.INPUT_CHECKOUT).html('خروج');

            if(this._options.startDay) {
                this._startDay = this._options.startDay;
                this._options.startDay = undefined;
            }

            if(this._options.endDay) {
                this._endDay = this._options.endDay;
                this._options.endDay = undefined;
            }

            if(this._startDay) {
                $calendarView.calendarView('startDay', this._startDay);
                $(this._parent).find(Selector.INPUT_CHECKIN).html(Pasoonate.make().gregorian(this._startDay).jalali().format('yyyy/MM/dd'));
            }

            if(this._endDay) {
                $calendarView.calendarView('endDay', this._endDay);
                $(this._parent).find(Selector.INPUT_CHECKOUT).html(Pasoonate.make().gregorian(this._endDay).jalali().format('yyyy/MM/dd'));
            }

            if(this._startDay && this._endDay) {
                $calendarView.calendarView('clearRange');
                $calendarView.calendarView('selectRange', this._startDay, this._endDay);
            }

            $calendarView.find(Selector.NOTICE).empty();
            if(this._options.notice) {
                $calendarView.find(Selector.NOTICE).html(this._options.notice);
            }
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
            this._unlockCurrentDays();
            this._autoLockDays();
            this._lockDays(this._options.lockBefore, this._options.lockAfter);

            //#region Month Change Event
            let monthRange = {};
            $calendarView.calendarView('getFirstAndLastDay', monthRange);      
            
            const firstDay = Pasoonate.make(monthRange.first);
            const lastDay = Pasoonate.make(monthRange.last);
            const newMonth = Pasoonate.make(monthRange.first).jalali().addDay(15).getMonth();
            const oldMonth = Pasoonate.make(monthRange.first).jalali().addDay(15).subMonth(1).getMonth();
            
            const monthChangeEvent = $.Event(Event.MONTH_CHANGE, {
                relatedTarget: this._element,
                newMonth: newMonth,
                oldMonth: oldMonth,
                firstDay: firstDay.gregorian().format('yyyy-MM-dd'),
                lastDay: lastDay.gregorian().format('yyyy-MM-dd')
            });

            $(this._element).trigger(monthChangeEvent);
            //#endregion
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
            this._unlockCurrentDays();
            this._autoLockDays();
            this._lockDays(this._options.lockBefore, this._options.lockAfter);

            //#region Month Change Event
            let monthRange = {};
            $calendarView.calendarView('getFirstAndLastDay', monthRange);      
            
            const firstDay = Pasoonate.make(monthRange.first);
            const lastDay = Pasoonate.make(monthRange.last);
            const newMonth = Pasoonate.make(monthRange.first).jalali().addDay(15).getMonth();
            const oldMonth = Pasoonate.make(monthRange.first).jalali().addDay(15).addMonth(1).getMonth();
            
            const monthChangeEvent = $.Event(Event.MONTH_CHANGE, {
                relatedTarget: this._element,
                newMonth: newMonth,
                oldMonth: oldMonth,
                firstDay: firstDay.gregorian().format('yyyy-MM-dd'),
                lastDay: lastDay.gregorian().format('yyyy-MM-dd')
            });

            $(this._element).trigger(monthChangeEvent);
            //#endregion
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
            let $calendarView = $('<div class="calendar-view">');
            let $calendarHeader = $('<header>');
            let $calendarBody = $('<div class="calendar-month-view">');
            let $calendarFooter = $('<footer>');
            let $pickerHeader = $('<div class="date-picker-header">');

            $pickerHeader.append(
                $('<div class="date-picker-title-bar">').html(
                    '<span>تاریخ ورود و خروج</span>' +
                    '<button type="button" class="btn date-picker-close"></button>'
                )
            );
            $pickerHeader.append(
                $('<div class="date-picker-inputs">').html(
                    '<div class="form-control" id="datePickerInputCheckin" >ورود</div>' +
                    '<span>-</span>' +
                    '<div class="form-control" id="datePickerInputCheckout">خروج</div>' 
                )
            );

            $calendarHeader.append(
                $('<div class="calendar-nav">').html(
                    `<div class="col-auto px-1"><button type="button" class="btn btn-link btn-sm ${ClassName.BTN_PREV_MONTH}"><i class="arrow-right"></i></button></div>`+
                    `<div class="col"><span class="${ClassName.YEAR_MONTH}"></span></div>`+
                    `<div class="col-auto px-1"><button type="button" class="btn btn-link btn-sm ${ClassName.BTN_NEXT_MONTH}"><i class="arrow-left"></i></button></div>`
                )
            );
            $calendarHeader.append(
                $('<div class="calendar-weekdays">').html(
                    '<div class="calendar-weekday">ش</div>' + 
                    '<div class="calendar-weekday">ی</div>' + 
                    '<div class="calendar-weekday">د</div>' + 
                    '<div class="calendar-weekday">س</div>' + 
                    '<div class="calendar-weekday">چ</div>' + 
                    '<div class="calendar-weekday">پ</div>' + 
                    '<div class="calendar-weekday">ج</div>'
                )
            );
            
            $calendarFooter.html($('<div class="date-picker-notice">').html(this._options.notice || ''));
            $calendarFooter.append($('<button type="button" class="btn btn-sm btn-outline-secondary">').text('پاک کردن').click(() => {
                this.clear();
                this.hide();
            }));

            $calendarView.append($calendarHeader).append($calendarBody).append($calendarFooter);
            $picker.append($pickerHeader).append($calendarView);
            $picker.data('target', target);

            $(parent).append($picker).css('position', 'relative');

            $calendarView.calendarView('weekViewElement', '<div>');
            $calendarView.calendarView('dayViewElement', '<div>');
            $calendarView.calendarView('beforeRenderDay', (date) => {
                let classNames = '';
                let text = '&nbsp;';
                let day;
                let data = this._dataKeyByDay();

                if(day = data[date.gregorian().format('yyyy-MM-dd')]) {
                    classNames = day.class;
                    text = day.text;
                }

                let $day = $(`<div class="${ClassName.DAY_NUMBER} ${classNames}">`);
    
                $day.html(`<div>${date.jalali().getDay()}</div><div class="extra-content">${text}</div>`);
                
                return $day;
            });

            $calendarView.on('select.bs.calendar-view', (event) => {
                const selectedDay = event.relatedTarget.dataset.gregorianDate;
                const days = this._dataKeyByDay();
                const pasoonate = Pasoonate.make().gregorian(selectedDay);
                const inputCheckin = $(parent).find(Selector.INPUT_CHECKIN);
                const inputCheckout = $(parent).find(Selector.INPUT_CHECKOUT);

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
        
                            while(pasoonate.gregorian().format('yyyy-MM-dd') !== this._endDay) {
                                pasoonate.addDay(1);
                                const d = pasoonate.gregorian().format('yyyy-MM-dd');
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
        
                            while(pasoonate.gregorian().format('yyyy-MM-dd') !== this._startDay) {
                                pasoonate.subDay(1);
                                const d = pasoonate.gregorian().format('yyyy-MM-dd');
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
    
                        if(pasoonate.gregorian().format('yyyy-MM-dd') <= this._startDay) {
                            return true;
                        }

                        while(pasoonate.gregorian().format('yyyy-MM-dd') > this._startDay) {
                            pasoonate.subDay(1);
                            const d = pasoonate.gregorian().format('yyyy-MM-dd');
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

                switch(this._focusOn) {
                    case 'start':
                        $(inputCheckin).addClass('focus');
                        $(inputCheckout).removeClass('focus');
                    break;
                    case 'end':
                        $(inputCheckout).addClass('focus');
                        $(inputCheckin).removeClass('focus');
                    break;
                }

                $(inputCheckin).html('انتخاب کنید');
                $(inputCheckout).html('انتخاب کنید');

                if(this._startDay) {
                    $(inputCheckin).html(Pasoonate.make().gregorian(this._startDay).jalali().format('dd MMMM'));
                }

                if(this._endDay) {
                    $(inputCheckout).html(Pasoonate.make().gregorian(this._endDay).jalali().format('dd MMMM'));
                }

                const changeEvent = $.Event(Event.CHANGE, {
                    startDay: this._startDay,
                    endDay: this._endDay
                });
    
                $(this._element).trigger(changeEvent);

                this._unlockCurrentDays();
                this._autoLockDays();
                this._lockDays(this._options.lockBefore, this._options.lockAfter);

                this.hide();
            });

            $calendarView.on('over.bs.calendar-view', (event) => {
                const date = event.relatedTarget.dataset.gregorianDate;
                const days = this._dataKeyByDay();
                const pasoonate = Pasoonate.make().gregorian(date);

                if(this._startDay == date) {
                    return true;
                } 
                
                if(this._startDay === null || this._startDay > date) {
                    return true;
                }

                if(this._startDay && this._endDay === null) {
                    //Check Disables
                    let isSelectableDay = {value: false};
                    $($calendarView).calendarView('hasClass', date, ClassName.SELECTABLE_DAY, isSelectableDay);
                    let isLockDay = {value: false};
                    $($calendarView).calendarView('hasClass', date, ClassName.LOCK_DAY, isLockDay);

                    const isFirstSelectableDay = !isLockDay.value && isSelectableDay.value;
                    
                    if(days[date] && days[date].disabled && !isFirstSelectableDay) {
                        return true;
                    }

                    while(pasoonate.gregorian().format('yyyy-MM-dd') !== this._startDay) {
                        pasoonate.subDay(1);
                        const d = pasoonate.gregorian().format('yyyy-MM-dd');
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
                const startDay = Pasoonate.make().gregorian(this._startDay).setTime(0, 0, 0);
                let findDisabled = false;
                let findFirstDisabled = null;
                const firstDay = Pasoonate.make(range.first).gregorian().setTime(0, 0, 0);
                const lastDay = Pasoonate.make(range.last).gregorian().setTime(0, 0, 0);
                
                while(startDay.beforeThanOrEqual(lastDay)) {
                    startDay.gregorian().addDay(1);
                    
                    const d = startDay.gregorian().format('yyyy-MM-dd');

                    if(!findDisabled && (days[d] && days[d].disabled)) {
                        findDisabled = true;

                        if(findFirstDisabled === null) {
                            findFirstDisabled = d;
                        }
                    }

                    if(findDisabled && findFirstDisabled !== d) {
                        $($calendarView).calendarView('addClass', d, ClassName.LOCK_DAY)
                    }                    
                }

                findDisabled = false;
                startDay.gregorian(this._startDay).setTime(0, 0, 0);
                
                while(startDay.afterThanOrEqual(firstDay)) {
                    startDay.gregorian().subDay(1);
                    
                    const d = startDay.gregorian().format('yyyy-MM-dd');

                    if(!findDisabled && days[d] && days[d].disabled) {
                        findDisabled = true;
                    }

                    if(findDisabled) {
                        $($calendarView).calendarView('addClass', d, ClassName.LOCK_DAY)
                    }
                }
            }
        }

        _lockDays(before, after) {
            const $calendarView = $(this._element.parentNode).find(Selector.CALENDAR_VIEW);
            const range = {};
            
            $calendarView.calendarView('getFirstAndLastDay', range);

            const firstDay = Pasoonate.make(range.first).gregorian().setTime(0, 0, 0);
            const lastDay = Pasoonate.make(range.last).gregorian().setTime(0, 0, 0);

            if(before) {
                const beforeDay = Pasoonate.make().gregorian(before).setTime(0, 0, 0);

                let isSelectableDay = {value: false};
                $($calendarView).calendarView('hasClass', before, ClassName.SELECTABLE_DAY, isSelectableDay);
                
                if(isSelectableDay.value) {
                    $($calendarView).calendarView('addClass', before, ClassName.LOCK_DAY);
                }

                while(beforeDay.afterThan(firstDay)) {
                    beforeDay.gregorian().subDay(1);
                    
                    const d = beforeDay.gregorian().format('yyyy-MM-dd');
                    $($calendarView).calendarView('addClass', d, ClassName.LOCK_DAY);
                }
            }

            if(after) {
                const afterDay = Pasoonate.make().gregorian(after).setTime(0, 0, 0);

                while(afterDay.beforeThan(lastDay)) {
                    afterDay.gregorian().addDay(1);
                    
                    const d = afterDay.gregorian().format('yyyy-MM-dd');
                    $($calendarView).calendarView('addClass', d, ClassName.LOCK_DAY)
                }
            }
        }

        _unlockCurrentDays() {
            const $calendarView = $(this._element.parentNode).find(Selector.CALENDAR_VIEW);
            const range = {};

            $calendarView.calendarView('getFirstAndLastDay', range);

            const firstDay = Pasoonate.make(range.first).gregorian().setTime(0, 0, 0);
            const lastDay = Pasoonate.make(range.last).gregorian().setTime(0, 0, 0);

            while(firstDay.beforeThanOrEqual(lastDay)) {
                $calendarView.calendarView('removeClass', firstDay.gregorian().format('yyyy-MM-dd'), ClassName.LOCK_DAY);
                firstDay.gregorian().addDay(1);
            }
        }

        _assignSelectableDays() {
            const $calendarView = $(this._element.parentNode).find(Selector.CALENDAR_VIEW);
            const days = this._dataKeyByDay();
            const range = {};

            $calendarView.calendarView('getFirstAndLastDay', range);

            const firstDay = Pasoonate.make(range.first).gregorian().setTime(0, 0, 0);
            const lastDay = Pasoonate.make(range.last).gregorian().setTime(0, 0, 0);            
            let selectableDay = 0;

            while(firstDay.beforeThanOrEqual(lastDay)) {
                const temp = firstDay.gregorian().format('yyyy-MM-dd');
                
                if(days[temp] && days[temp].disabled) {
                    selectableDay = selectableDay === 0 ? 1 : 2;
                } else {
                    selectableDay = 0;
                }

                if(selectableDay === 1) {
                    $($calendarView).calendarView('addClass', temp, ClassName.SELECTABLE_DAY);
                }

                firstDay.addDay(1);
            }
        }

        _updateDataOption(inputData) {
            const data = [];
            const oldData = this._dataKeyByDay();
            let day = null;
            
            inputData = inputData || [];
            
            for(let i = 0; i < inputData.length; i++) {
                day = inputData[i].day;
                oldData[day] = inputData[i];
            }

            for(let i in oldData) {
                data.push(oldData[i]);
            }

            return data;
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
        .on('click', Selector.BTN_CLOSE, function () {
            $(this).closest(Selector.DATE_PICKER).parent().find(Selector.DATA_TOGGLE).datePicker('hide');
        })
        .on('click', Selector.INPUT_CHECKIN, function () {
            $(this).closest(Selector.DATE_PICKER).parent().find(Selector.DATA_TOGGLE).datePicker('focusOn', 'start');
        })
        .on('click', Selector.INPUT_CHECKOUT, function () {
            $(this).closest(Selector.DATE_PICKER).parent().find(Selector.DATA_TOGGLE).datePicker('focusOn', 'end');
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

