define([
    'sitecore',
    '/-/speak/v1/ecm/TimeOfDayReportBase.js',
    '/-/speak/v1/ecm/ReportDataService.js',
    '/-/speak/v1/ecm/MathHelper.js'
], function (sitecore, TimeOfDayReportBase, ReportDataService, MathHelper) {
    var model = TimeOfDayReportBase.model.extend({
        reCalculate: function() {
            var group = this.getHourGroup(),
                data = group.orderBy(this.get('eventType')).top(1);
            this.set('bestTimeOfDay', data[0]);
        }
    });

    var view = TimeOfDayReportBase.view.extend({
        childComponents: [
            'ScoreCard'
        ],
        initialize: function() {
            this._super();
            this.model.set('description', this.$el.data('sc-description'));
            this.attachHandlers();
            this.update();
        },
        attachHandlers: function() {
            this.model.on('change:bestTimeOfDay', this.update, this);
        },
        update: function() {
            var bestTimeOfDay = this.model.get('bestTimeOfDay');
            
            if (bestTimeOfDay) {
                var hour = Number(bestTimeOfDay.key),
                visits = bestTimeOfDay.value[this.model.get('eventType')];

                this.children.ScoreCard.set('value', hour + ':00' + '-' + (hour + 1) + ':00');
                this.children.ScoreCard.set(
                    'description',
                    visits +
                    ' ' + this.model.get('description')
                );
            }
        }
    });

    return sitecore.Factories.createComponent("TimeOfDayRate", model, view, ".sc-TimeOfDayRate");
});