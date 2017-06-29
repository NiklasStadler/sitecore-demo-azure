define([
    "sitecore"
],
function(sitecore) {
    var model = sitecore.Definitions.Models.ControlModel.extend({});
    var view = sitecore.Definitions.Views.ControlView.extend({});
    sitecore.Factories.createComponent("RecipientActivityReport", model, view, ".sc-RecipientActivityReport");
})