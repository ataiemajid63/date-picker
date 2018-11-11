import Pasoonate from "./pasoonate";

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

export default CalendarView;