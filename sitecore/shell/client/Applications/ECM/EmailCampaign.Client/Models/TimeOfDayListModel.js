define([
    "sitecore",
    "/-/speak/v1/ecm/ReportingListDataModel.js"
], function (
    sitecore,
    ReportingListDataModel
    ) {

    var dayNames = [
        "ECM.DayNames.Monday",
        "ECM.DayNames.Tuesday",
        "ECM.DayNames.Wednesday",
        "ECM.DayNames.Thursday",
        "ECM.DayNames.Friday",
        "ECM.DayNames.Saturday",
        "ECM.DayNames.Sunday"
    ];

    var TimeOfDayListModel = ReportingListDataModel.extend({
        initialize: function() {
            this._super();
            _.each(dayNames, function(day, key) {
                dayNames[key] = sitecore.Resources.Dictionary.translate(day);
            });
        },
        processDataItem: function(item) {
            this.setDayName(item);
            this.setHourRange(item);
            this._super(item);
        },
        setDayName: function(item) {
            item.dayOfWeek = dayNames[item.dayOfWeek - 1];
        },
        setHourRange: function(item) {
            item.hourRange = item.hour + ":00 - ";
            if (item.hour === 23) {
                item.hourRange += 0 + ":00";
            } else {
                item.hourRange += (item.hour + 1) + ":00";
            }
        }
    });

    /* test-code */
    TimeOfDayListModel._dayNames = dayNames;
    /* end-test-code */
    
    return TimeOfDayListModel;
});