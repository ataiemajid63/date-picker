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
    }

    const ClassName = {
        WEEK_VIEW: 'calendar-week-view',
        DAY_VIEW: 'calendar-day-view',
        DAY_VIEW_TODAY: 'calendar-day-view-today',
        DAY_VIEW_INFOCUS: 'calendar-day-view-infocus',
        DAY_VIEW_OUTFOCUS: 'calendar-day-view-outfocus',
        DAY_VIEW_SELECTED: 'calendar-day-view-selected',
    }

    const Selector = {
        MONTH_VIEW: 'tbody.calendar-month-view'
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

            if(day.format('yyyy-mm-dd') === this._current.format('yyyy-mm-dd')) {
                $day.addClass(ClassName.DAY_VIEW_SELECTED);
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

    // $(document)

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

    const NAME = 'datePicker'
    const VERSION = '1.0.0'
    const DATA_KEY = 'bs.date-picker'
    const EVENT_KEY = `.${DATA_KEY}`
    const DATA_API_KEY = '.data-api'
    const JQUERY_NO_CONFLICT = $.fn[NAME]

    const Event = {
        HIDE: `hide${EVENT_KEY}`,
        HIDDEN: `hidden${EVENT_KEY}`,
        SHOW: `show${EVENT_KEY}`,
        SHOWN: `shown${EVENT_KEY}`,
        CLICK_DATA_API: `click${EVENT_KEY}${DATA_API_KEY}`,
        CHANGE_DATA_API: `change${EVENT_KEY}${DATA_API_KEY}`
    }

    const ClassName = {
        DATE_PICKER: 'date-picker',
        DISABLED: 'disabled',
        FADE: 'fade',
        SHOW: 'show',
        DAY_NUMBER: 'date-picker-day-number',
        BTN_NEXT_MONTH: 'date-picker-btn-next-month',
        BTN_PREV_MONTH: 'date-picker-btn-prev-month',
        YEAR_MONTH: 'date-picker-year-month'
    }

    const Selector = {
        DATE_PICKER: '.date-picker',
        INPUT: 'input[type=date]',
        DISABLED: '.disabled',
        DATA_TOGGLE: '[data-toggle="date-picker"]',
        DAY_NUMBER: '.date-picker-day-number',
        BTN_NEXT_MONTH: '.date-picker-btn-next-month',
        BTN_PREV_MONTH: '.date-picker-btn-prev-month',
        YEAR_MONTH: '.date-picker-year-month'
    }

    class DatePicker {

        constructor(element) {
            this._element = element;

            this._init();
        }

        // Getters

        static get VERSION() {
            return VERSION
        }

        // Public

        show() {
            if (this._element.parentNode &&
                this._element.parentNode.nodeType === Node.ELEMENT_NODE &&
                $(this._element).hasClass(ClassName.DISABLED)) {
                return;
            }

            const datePicker = $(this._element.parentNode).find(Selector.DATE_PICKER)[0];
            const dateInput = $(this._element.parentNode).find(Selector.INPUT)[0];
            
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
            const dateInput = $(this._element.parentNode).find(Selector.INPUT)[0];
            
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

        // Private

        _init() {
            if (this._element.parentNode &&
                this._element.parentNode.nodeType === Node.ELEMENT_NODE &&
                ($(this._element).hasClass(ClassName.DISABLED) ||
                 this._element.hasAttribute('disabled'))) {
                return;
            }

            let target = this._element;
            let parent = target.parentNode;

            let $picker = $(`<div class="${ClassName.DATE_PICKER}">`);
            let $calendarView = $('<table class="calendar-view table">');
            let $calendarHeader = $('<thead>')
                .html(
                    $('<tr class="calendar-nav">').html(
                        $('<th class="p-1" colspan="7">').html(
                            '<div class="row">' +
                                `<div class="col-auto"><button type="button" class="btn btn-link btn-sm ${ClassName.BTN_PREV_MONTH}"><i class="icon icon-16 icon-arrow-right-muted"></i></button></div>`+
                                `<div class="col"><span class="${ClassName.YEAR_MONTH}"></span></div>`+
                                `<div class="col-auto"><button type="button" class="btn btn-link btn-sm ${ClassName.BTN_NEXT_MONTH}"><i class="icon icon-16 icon-arrow-left-muted"></i></button></div>`+
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

            $calendarView.append($calendarHeader).append($calendarBody);
            $picker.append($calendarView);
            $picker.data('target', target);

            $(parent).append($picker).css('position', 'relative');

            $($calendarView).calendarView('beforeRenderDay', (date) => { 
                let $day = $(`<div class="${ClassName.DAY_NUMBER}">`);
    
                $day.html(date.jalali().getDay());
                
                return $day;
            });
        }

        // Static

        static _jQueryInterface(config) {
            
            return this.each(function () {
                const $this = $(this)
                let data = $this.data(DATA_KEY)

                if (!data) {
                    data = new DatePicker(this)
                    $this.data(DATA_KEY, data)
                }

                if (typeof config === 'string') {
                    if (typeof data[config] === 'undefined') {
                        throw new TypeError(`No method named "${config}"`)
                    }
                    data[config]()
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
        .on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
            event.preventDefault();
            DatePicker._jQueryInterface.call($(this), 'toggle');
        })
        .on(Event.CLICK_DATA_API, Selector.DAY_NUMBER, function (event) {
            event.preventDefault();
            let target = $(this).closest(Selector.DATE_PICKER).data('target');
            let date = Pasoonate.make($(this).closest('.calendar-day-view').data('pick')).jalali();
            target.value = date.format('yyyy-mm-dd');
            DatePicker._jQueryInterface.call($(target), 'hide');
        })
        .on(Event.CLICK_DATA_API, Selector.BTN_NEXT_MONTH, function (event) {
            $(this).closest(Selector.DATE_PICKER).find('.calendar-view').calendarView('nextMonth');
        })
        .on(Event.CLICK_DATA_API, Selector.BTN_PREV_MONTH, function (event) {
            $(this).closest(Selector.DATE_PICKER).find('.calendar-view').calendarView('prevMonth');
        })
        .on('change.bs.calendar-view', `${Selector.DATE_PICKER} .calendar-view`, function (event) {
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

    $.fn[NAME] = DatePicker._jQueryInterface
    $.fn[NAME].Constructor = DatePicker
    $.fn[NAME].noConflict = function () {
        $.fn[NAME] = JQUERY_NO_CONFLICT
        return DatePicker._jQueryInterface
    }

    return DatePicker;    
})($);

// export default DatePicker;