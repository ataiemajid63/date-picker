const CalendarView=(e=>{const t="calendarView",a="bs.calendar-view",s=`.${a}`,n=e.fn[t],i={CHANGE:`change${s}`,CLICK_DATA_API:`click${s}.data-api`,OVER_DATA_API:`mouseenter${s}.data-api`,SELECT:`select${s}`,OVER:`over${s}`},r={CALENDAR_VIEW:"calendar-view",MONTH_VIEW:"calendar-month-view",WEEK_VIEW:"calendar-week-view",DAY_VIEW:"calendar-day-view",DAY_VIEW_TODAY:"calendar-day-view-today",DAY_VIEW_INFOCUS:"calendar-day-view-infocus",DAY_VIEW_OUTFOCUS:"calendar-day-view-outfocus",DAY_VIEW_SELECTED:"calendar-day-view-selected",DAY_VIEW_START:"calendar-day-view-start",DAY_VIEW_END:"calendar-day-view-end",DAY_VIEW_BETWEEN:"calendar-day-view-between",DAY_VIEW_DISABLED:"calendar-day-view-disabled"},d={CALENDAR_VIEW:`.${r.CALENDAR_VIEW}`,MONTH_VIEW:`.${r.MONTH_VIEW}`,DAY_VIEW:`.${r.DAY_VIEW}`};class o{constructor(t){this._element=t,this._calendar="jalali",this._current=Pasoonate.make()[this._calendar](),this._weekViewElement="<tr>",this._dayViewElement="<td>",this.beforeRenderDayAction=(e=>e.getDay()),this.render(),e(this._element).trigger(e.Event(i.CHANGE,{current:Pasoonate.make(this._current.getTimestamp())[this._calendar]()}))}render(){this._goto()}beforeRenderDay([e]){"function"==typeof e&&(this.beforeRenderDayAction=e,this._renderMonthView())}weekViewElement([e]){this._weekViewElement="function"==typeof e?e():e}dayViewElement([e]){this._dayViewElement="function"==typeof e?e():e}goto([e,t,a]){this._goto(e,t,a)}nextMonth(){let e=Pasoonate.make(this._current.getTimestamp())[this._calendar]();e.addMonth(1),this._goto(e.getYear(),e.getMonth())}prevMonth(){let e=Pasoonate.make(this._current.getTimestamp())[this._calendar]();e.subMonth(1),this._goto(e.getYear(),e.getMonth())}selectDay([t]){e(this._element).find(`${d.DAY_VIEW}[data-gregorian-date=${t}]`).addClass(r.DAY_VIEW_SELECTED)}clearSelection([t]){t?e(this._element).find(`${d.DAY_VIEW}[data-gregorian-date=${t}]`).removeClass(r.DAY_VIEW_SELECTED):e(this._element).find(d.DAY_VIEW).removeClass(r.DAY_VIEW_SELECTED)}selectRange([t,a]){const[s,n,i]=String(t).split("-"),o=Pasoonate.make().gregorian().setDate(Number(s),Number(n),Number(i));for(e(this._element).find(`${d.DAY_VIEW}[data-gregorian-date=${t}]`).addClass(r.DAY_VIEW_START),e(this._element).find(`${d.DAY_VIEW}[data-gregorian-date=${a}]`).addClass(r.DAY_VIEW_END),o.addDay(1);o.format("yyyy-mm-dd")!==a;)e(this._element).find(`${d.DAY_VIEW}[data-gregorian-date=${o.format("yyyy-mm-dd")}]`).addClass(r.DAY_VIEW_BETWEEN),o.addDay(1)}clearRange(){e(this._element).find(d.DAY_VIEW).removeClass([r.DAY_VIEW_START,r.DAY_VIEW_END,r.DAY_VIEW_BETWEEN])}startDay([t]){e(this._element).find(`${d.DAY_VIEW}[data-gregorian-date=${t}]`).addClass(r.DAY_VIEW_START)}endDay([t]){e(this._element).find(`${d.DAY_VIEW}[data-gregorian-date=${t}]`).addClass(r.DAY_VIEW_END)}disableDay([t]){e(this._element).find(`${d.DAY_VIEW}[data-gregorian-date=${t}]`).addClass(r.DAY_VIEW_DISABLED)}enableDay([t]){e(this._element).find(`${d.DAY_VIEW}[data-gregorian-date=${t}]`).removeClass(r.DAY_VIEW_DISABLED)}addClass([t,a]){e(this._element).find(`${d.DAY_VIEW}[data-gregorian-date=${t}]`).addClass(a)}removeClass([t,a]){e(this._element).find(`${d.DAY_VIEW}[data-gregorian-date=${t}]`).removeClass(a)}hasClass([t,a,s]){s.value=e(this._element).find(`${d.DAY_VIEW}[data-gregorian-date=${t}]`).hasClass(a)}getFirstAndLastDay([t]){const a=e(this._element).find(`${d.DAY_VIEW}`);a.length&&(t.first=Number(a[0].dataset.pick),t.last=Number(a[a.length-1].dataset.pick))}_renderMonthView(){let t,a=e(this._element).find(d.MONTH_VIEW),s=Pasoonate.make()[this._calendar]();a.empty(),s.setTimestamp(this._current.getTimestamp()).setDay(1),t=s.subDay(s.dayOfWeek());for(let e=1;e<=6;e++)a.append(this._renderWeekView(t,e)),t.addDay(7)}_renderWeekView(t,a){let s=e(this._weekViewElement),n=Pasoonate.make(t.getTimestamp())[this._calendar]();s.addClass(r.WEEK_VIEW).addClass("week-"+a);for(let e=0;e<7;e++)s.append(this._renderDayView(n)),n.addDay(1);return s}_renderDayView(t){let a=this.beforeRenderDayAction(t),s=e(this._dayViewElement),n=Pasoonate.make()[this._calendar]();return s.addClass(r.DAY_VIEW),s.attr("data-pick",t.getTimestamp()),s.attr("data-gregorian-date",Pasoonate.make(t.getTimestamp()).gregorian().format("yyyy-mm-dd")),t.getMonth()===this._current.getMonth()?(s.attr("data-day",t.getDay()),s.addClass(r.DAY_VIEW_INFOCUS)):s.addClass(r.DAY_VIEW_OUTFOCUS),t.format("yyyy-mm-dd")===n.format("yyyy-mm-dd")&&s.addClass(r.DAY_VIEW_TODAY),s.html(a),s}_goto(t,a,s){let n=Pasoonate.make(this._current.getTimestamp())[this._calendar](),r=!1;if(r=(t&&t!=this._current.getYear())|(a&&a!=this._current.getMonth())|(s&&s!=this._current.getDay())){this._current.setYear(parseInt(t)||this._current.getYear()),this._current.setMonth(parseInt(a)||this._current.getMonth()),this._current.setDay(parseInt(s)||this._current.getDay());const r=e.Event(i.CHANGE,{old:n,current:Pasoonate.make(this._current.getTimestamp())[this._calendar]()});if(e(this._element).trigger(r),r.isDefaultPrevented())return void this._current.setTimestamp(n.getTimestamp())}this._renderMonthView()}static _jQueryInterface(t,...s){return this.each(function(){const n=e(this);let i=n.data(a);if(i||(i=new o(this),n.data(a,i)),"string"==typeof t){if(void 0===i[t])throw new TypeError(`No method named "${t}"`);i[t](s)}})}}return e(document).on(i.CLICK_DATA_API,`${d.DAY_VIEW}:not(${d.DAY_VIEW_DISABLED})`,function(){e(this).closest(d.CALENDAR_VIEW).trigger(e.Event(i.SELECT,{relatedTarget:this}))}).on(i.OVER_DATA_API,`${d.DAY_VIEW}:not(${d.DAY_VIEW_DISABLED})`,function(){e(this).closest(d.CALENDAR_VIEW).trigger(e.Event(i.OVER,{relatedTarget:this}))}),e.fn[t]=o._jQueryInterface,e.fn[t].Constructor=o,e.fn[t].noConflict=function(){return e.fn[t]=n,o._jQueryInterface},o})($),DatePicker=(e=>{const t="datePicker",a="1.1.2",s="bs.date-picker",n=`.${s}`,i=e.fn[t],r={HIDE:`hide${n}`,HIDDEN:`hidden${n}`,SHOW:`show${n}`,SHOWN:`shown${n}`,FOCUS_CHANGE:`focus-change${n}`,CHANGE:`change${n}`,CLICK_DATA_API:`click${n}.data-api`,OVER_DATA_API:`mouseover${n}.data-api`},d={DATE_PICKER:"date-picker",DISABLED:"disabled",FADE:"fade",SHOW:"show",DAY_NUMBER:"date-picker-day-number",DAY_DISABLED:"date-picker-day-disabled",DAY_START:"date-picker-day-start",DAY_END:"date-picker-day-end",DAY_BETWEEN:"date-picker-day-between",BTN_NEXT_MONTH:"date-picker-btn-next-month",BTN_PREV_MONTH:"date-picker-btn-prev-month",YEAR_MONTH:"date-picker-year-month",LOCK_DAY:"calendar-day-view-lock",SELECTABLE_DAY:"calendar-day-view-selectable"},o={DATE_PICKER:".date-picker",INPUT:"input[type=date]",DISABLED:".disabled",DATA_TOGGLE:'[data-toggle="date-picker"]',DAY_NUMBER:".date-picker-day-number",BTN_NEXT_MONTH:".date-picker-btn-next-month",BTN_PREV_MONTH:".date-picker-btn-prev-month",YEAR_MONTH:".date-picker-year-month",CALENDAR_VIEW:".calendar-view",NOTICE:".date-picker-notice"};class l{constructor(e){this._element=e,this._options={},this._startDay=null,this._endDay=null,this._focusOn="start",this._render()}show(){if(this._element.parentNode&&this._element.parentNode.nodeType===Node.ELEMENT_NODE&&e(this._element).hasClass(d.DISABLED))return;const t=e(this._element.parentNode).find(o.DATE_PICKER)[0],a=e.Event(r.SHOW,{relatedTarget:this._element});if(e(this._element).trigger(a),a.isDefaultPrevented())return;e(t).addClass(d.SHOW),(()=>{const t=e.Event(r.SHOWN,{relatedTarget:this._element});e(this._element).trigger(t)})()}hide(){if(this._element.parentNode&&this._element.parentNode.nodeType===Node.ELEMENT_NODE&&e(this._element).hasClass(d.DISABLED))return;const t=e(this._element.parentNode).find(o.DATE_PICKER)[0],a=e.Event(r.HIDE,{relatedTarget:this._element});if(e(this._element).trigger(a),a.isDefaultPrevented())return;e(t).removeClass(d.SHOW),(()=>{const t=e.Event(r.HIDDEN,{relatedTarget:this._element});e(this._element).trigger(t)})()}toggle(){if(this._element.parentNode&&this._element.parentNode.nodeType===Node.ELEMENT_NODE&&e(this._element).hasClass(d.DISABLED))return;const t=e(this._element.parentNode).find(o.DATE_PICKER)[0];e(t).hasClass(d.SHOW)?this.hide():this.show()}dispose(){e.removeData(this._element,s),this._element=null}clear(){this._startDay=null,this._endDay=null,this._focusOn="start",e(this._element).parent().find(o.CALENDAR_VIEW).calendarView("clearRange"),this._unlockCurrentDays(),this._lockDays(this._options.lockBefore,this._options.lockAfter);const t=e.Event(r.CHANGE,{startDay:this._startDay,endDay:this._endDay});e(this._element).trigger(t)}options([e]){Object.assign(this._options,e),this.refresh()}focusOn([t]){if("start"===t)this._focusOn=t;else if("end"===t)if(null===this._startDay){this._focusOn="start";const t=e.Event(r.FOCUS_CHANGE,{relatedTarget:this._element,focusOn:this._focusOn});e(this._element).trigger(t)}else this._focusOn=t}refresh(){const t=e(this._element.parentNode).find(o.CALENDAR_VIEW),a=this._dataKeyByDay();t.calendarView("render");for(const e in a)a[e].disabled&&t.calendarView("disableDay",e);this._assignSelectableDays(),this._unlockCurrentDays(),this._autoLockDays(),this._lockDays(this._options.lockBefore,this._options.lockAfter),this._options.startDay&&(this._startDay=this._options.startDay,this._options.startDay=void 0),this._options.endDay&&(this._endDay=this._options.endDay,this._options.endDay=void 0),this._startDay&&t.calendarView("startDay",this._startDay),this._endDay&&t.calendarView("endDay",this._endDay),this._startDay&&this._endDay&&(t.calendarView("clearRange"),t.calendarView("selectRange",this._startDay,this._endDay)),t.find(o.NOTICE).empty(),this._options.notice&&t.find(o.NOTICE).html(this._options.notice)}nextMonth(){const t=e(this._element.parentNode).find(o.CALENDAR_VIEW),a=this._dataKeyByDay();t.calendarView("nextMonth");for(const e in a)a[e].disabled&&t.calendarView("disableDay",e);this._startDay&&t.calendarView("startDay",this._startDay),this._endDay&&t.calendarView("endDay",this._endDay),this._startDay&&this._endDay&&(t.calendarView("clearRange"),t.calendarView("selectRange",this._startDay,this._endDay)),this._assignSelectableDays(),this._unlockCurrentDays(),this._autoLockDays(),this._lockDays(this._options.lockBefore,this._options.lockAfter)}prevMonth(){const t=e(this._element.parentNode).find(o.CALENDAR_VIEW),a=this._dataKeyByDay();t.calendarView("prevMonth");for(const e in a)a[e].disabled&&t.calendarView("disableDay",e);this._startDay&&t.calendarView("startDay",this._startDay),this._endDay&&t.calendarView("endDay",this._endDay),this._startDay&&this._endDay&&(t.calendarView("clearRange"),t.calendarView("selectRange",this._startDay,this._endDay)),this._assignSelectableDays(),this._unlockCurrentDays(),this._autoLockDays(),this._lockDays(this._options.lockBefore,this._options.lockAfter)}_render(){if(this._element.parentNode&&this._element.parentNode.nodeType===Node.ELEMENT_NODE&&(e(this._element).hasClass(d.DISABLED)||this._element.hasAttribute("disabled")))return;let t=this._element,a=t.parentNode,s=e(`<div class="${d.DATE_PICKER}">`),n=e('<div class="calendar-view">'),i=e("<header>").html(e('<div class="calendar-nav">').html(`<div class="col-auto px-1"><button type="button" class="btn btn-link btn-sm ${d.BTN_PREV_MONTH}"><i class="arrow-right"></i></button></div>`+`<div class="col"><span class="${d.YEAR_MONTH}"></span></div>`+`<div class="col-auto px-1"><button type="button" class="btn btn-link btn-sm ${d.BTN_NEXT_MONTH}"><i class="arrow-left"></i></button></div>`)).append(e('<div class="calendar-weekdays">').html('<div class="calendar-weekday">ش</div><div class="calendar-weekday">ی</div><div class="calendar-weekday">د</div><div class="calendar-weekday">س</div><div class="calendar-weekday">چ</div><div class="calendar-weekday">پ</div><div class="calendar-weekday">ج</div>')),o=e('<div class="calendar-month-view">'),l=e("<footer>");l.html(e('<div class="date-picker-notice">').html(this._options.notice||"")),l.append(e('<button type="button" class="btn btn-sm btn-outline-secondary">').text("پاک کردن").click(()=>{this.clear(),this.hide()})),n.append(i).append(o).append(l),s.append(n),s.data("target",t),e(a).append(s).css("position","relative"),n.calendarView("weekViewElement","<div>"),n.calendarView("dayViewElement","<div>"),n.calendarView("beforeRenderDay",t=>{let a,s="",n="&nbsp;";(a=this._dataKeyByDay()[t.gregorian().format("yyyy-mm-dd")])&&(s=a.class,n=a.text);let i=e(`<div class="${d.DAY_NUMBER} ${s}">`);return i.html(`<div>${t.jalali().getDay()}</div><div class="extra-content">${n}</div>`),i}),n.on("select.bs.calendar-view",t=>{const a=t.relatedTarget.dataset.gregorianDate,s=this._dataKeyByDay(),[i,o,l]=a.split("-"),_=Pasoonate.make();_.gregorian().setDate(Number(i),Number(o),Number(l));let c={};n.calendarView("hasClass",a,d.SELECTABLE_DAY,c),c=c.value;const h={};if(n.calendarView("hasClass",a,d.LOCK_DAY,h),h.value&&!c)return;if("start"===this._focusOn){if(this._startDay===a)return!0;if(this._startDay){if(this._startDay=a,null===this._endDay){if(s[a]&&s[a].disabled)return!0;e(n).calendarView("clearRange").calendarView("startDay",this._startDay)}else if(this._endDay>a){if(s[a]&&s[a].disabled)return!0;for(;_.gregorian().format("yyyy-mm-dd")!==this._endDay;){_.addDay(1);const e=_.gregorian().format("yyyy-mm-dd");if(s[e]&&s[e].disabled&&e!==this._endDay)return!0}e(n).calendarView("clearRange").calendarView("selectRange",this._startDay,this._endDay)}else if(this._endDay<a){if(s[a]&&s[a].disabled)return!0;e(n).calendarView("clearRange").calendarView("startDay",this._startDay),this._endDay=null}}else{if(s[a]&&s[a].disabled)return!0;this._startDay=a,e(n).calendarView("clearRange").calendarView("startDay",this._startDay),this._focusOn="end";const t=e.Event(r.FOCUS_CHANGE,{relatedTarget:this._element,focusOn:this._focusOn});e(this._element).trigger(t)}}else if("end"===this._focusOn){if(this._endDay===a)return!0;if(this._endDay){if(this._endDay=a,null===this._startDay){this._focusOn="start";const t=e.Event(r.FOCUS_CHANGE,{relatedTarget:this._element,focusOn:this._focusOn});return e(this._element).trigger(t),!0}if(this._startDay<a){if(s[a]&&s[a].disabled&&!c)return!0;for(;_.gregorian().format("yyyy-mm-dd")!==this._startDay;){_.subDay(1);const e=_.gregorian().format("yyyy-mm-dd");if(s[e]&&s[e].disabled)return!0}e(n).calendarView("clearRange").calendarView("selectRange",this._startDay,this._endDay)}else if(this._startDay>a){if(s[a]&&s[a].disabled)return!0;e(n).calendarView("clearRange").calendarView("startDay",this._endDay),this._startDay=this._endDay,this._endDay=null}}else{if(s[a]&&s[a].disabled&&!c)return!0;if(_.gregorian().format("yyyy-mm-dd")<=this._startDay)return!0;for(;_.gregorian().format("yyyy-mm-dd")>this._startDay;){_.subDay(1);const e=_.gregorian().format("yyyy-mm-dd");if(s[e]&&s[e].disabled)return!0}this._endDay=a,e(n).calendarView("clearRange").calendarView("selectRange",this._startDay,this._endDay)}}const y=e.Event(r.CHANGE,{startDay:this._startDay,endDay:this._endDay});e(this._element).trigger(y),this._unlockCurrentDays(),this._autoLockDays(),this._lockDays(this._options.lockBefore,this._options.lockAfter),this.hide()}),n.on("over.bs.calendar-view",t=>{const a=t.relatedTarget.dataset.gregorianDate,s=this._dataKeyByDay(),[i,r,o]=a.split("-"),l=Pasoonate.make();if(l.gregorian().setDate(Number(i),Number(r),Number(o)),this._startDay==a)return!0;if(null===this._startDay||this._startDay>a)return!0;if(this._startDay&&null===this._endDay){let t={value:!1};e(n).calendarView("hasClass",a,d.SELECTABLE_DAY,t);let i={value:!1};e(n).calendarView("hasClass",a,d.LOCK_DAY,i);const r=!i.value&&t.value;if(s[a]&&s[a].disabled&&!r)return!0;for(;l.gregorian().format("yyyy-mm-dd")!==this._startDay;){l.subDay(1);const e=l.gregorian().format("yyyy-mm-dd");if(s[e]&&s[e].disabled)return!0}e(n).calendarView("clearRange").calendarView("selectRange",this._startDay,a)}})}_dataKeyByDay(){let e={};if(void 0===this._options.data)return e;for(const t of this._options.data)e[t.day]=t;return e}_autoLockDays(){const t=e(this._element.parentNode).find(o.CALENDAR_VIEW),a=this._dataKeyByDay(),s={};if(t.calendarView("getFirstAndLastDay",s),this._startDay){const[n,i,r]=this._startDay.split("-"),o=Pasoonate.make();o.gregorian().setDate(Number(n),Number(i),Number(r));let l=!1,_=null;for(;o.getTimestamp()<=s.last;){o.gregorian().addDay(1);const s=o.gregorian().format("yyyy-mm-dd");!l&&a[s]&&a[s].disabled&&(l=!0,null===_&&(_=s)),l&&_!==s&&e(t).calendarView("addClass",s,d.LOCK_DAY)}for(l=!1,o.gregorian().setDate(Number(n),Number(i),Number(r));o.getTimestamp()>=s.first;){o.gregorian().subDay(1);const s=o.gregorian().format("yyyy-mm-dd");!l&&a[s]&&a[s].disabled&&(l=!0),l&&e(t).calendarView("addClass",s,d.LOCK_DAY)}}}_lockDays(t,a){const s=e(this._element.parentNode).find(o.CALENDAR_VIEW),n=(this._dataKeyByDay(),{});if(s.calendarView("getFirstAndLastDay",n),t){const[a,i,r]=t.split("-"),o=Pasoonate.make();for(o.gregorian().setDate(Number(a),Number(i),Number(r));o.getTimestamp()>n.first;){o.gregorian().subDay(1);const t=o.gregorian().format("yyyy-mm-dd");e(s).calendarView("addClass",t,d.LOCK_DAY)}}if(a){const[t,i,r]=a.split("-"),o=Pasoonate.make();for(o.gregorian().setDate(Number(t),Number(i),Number(r));o.getTimestamp()<n.last;){o.gregorian().addDay(1);const t=o.gregorian().format("yyyy-mm-dd");e(s).calendarView("addClass",t,d.LOCK_DAY)}}}_unlockCurrentDays(){const t=e(this._element.parentNode).find(o.CALENDAR_VIEW),a={};t.calendarView("getFirstAndLastDay",a);const s=Pasoonate.make(a.first);for(;s.getTimestamp()<=a.last;)s.gregorian().addDay(1),t.calendarView("removeClass",s.gregorian().format("yyyy-mm-dd"),d.LOCK_DAY)}_assignSelectableDays(){const t=e(this._element.parentNode).find(o.CALENDAR_VIEW),a=this._dataKeyByDay(),s={};t.calendarView("getFirstAndLastDay",s);const n=Pasoonate.make(s.first);let i=0;for(;n.getTimestamp()<=s.last;){const s=n.gregorian().format("yyyy-mm-dd");1===(i=a[s]&&a[s].disabled?0===i?1:2:0)&&e(t).calendarView("addClass",s,d.SELECTABLE_DAY),n.addDay(1)}}static get VERSION(){return a}static _jQueryInterface(t,...a){return this.each(function(){const n=e(this);let i=n.data(s);if(i||(i=new l(this),n.data(s,i)),"string"==typeof t){if(void 0===i[t])throw new TypeError(`No method named "${t}"`);i[t](a)}})}}return e(document).on(r.CLICK_DATA_API,o.BTN_NEXT_MONTH,function(t){e(this).closest(o.DATE_PICKER).parent().find(o.DATA_TOGGLE).datePicker("nextMonth")}).on(r.CLICK_DATA_API,o.BTN_PREV_MONTH,function(t){e(this).closest(o.DATE_PICKER).parent().find(o.DATA_TOGGLE).datePicker("prevMonth")}).on("change.bs.calendar-view",`${o.DATE_PICKER} ${o.CALENDAR_VIEW}`,function(t){e(this).find(o.YEAR_MONTH).html(Pasoonate.trans(`jalali.month_name.${t.current.getMonth()}`)+" "+t.current.getYear())}).on("click",function(t){let a=e(".date-picker.show");if(a.length){if(a.parent().find(e(t.target)).length)return!0}a.datePicker("hide")}),e.fn[t]=l._jQueryInterface,e.fn[t].Constructor=l,e.fn[t].noConflict=function(){return e.fn[t]=i,l._jQueryInterface},l})($);