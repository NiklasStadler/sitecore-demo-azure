﻿define([
  "sitecore",
  "knockout",
  "underscore",
  "/-/speak/v1/exmExperienceGenerator/DataRepository.js",
  "/-/speak/v1/exmExperienceGenerator/uiUtils.js"], function (sc, ko, _, dataRepository, uiUtils) {
    var dialog = sc.Definitions.App.extend({
      initialized: function () {
        this.LandingPagesContainer = $("div[data-sc-id='LandingPagesListInnerPanel']");

        this.intitializeDevices();
        this.intitializeLocations();
        sc.trigger("campaignEditor:loaded", this);
      },
      showDialog: function (editingParameters) {
        this.cleanUI();
        this.EditCampaignDialog.show();
        if (editingParameters) {
          this.fillUI(editingParameters);
        }
        if (!String.prototype.startsWith) {
          String.prototype.startsWith = function (searchString, position) {
            position = position || 0;
            return this.substr(position, searchString.length) === searchString;
          };
        }
      },
      cleanUI: function () {
        var now = new Date();
        this.StartDate.viewModel.setDate(new Date(new Date(now).setDate(-30 + now.getDate())));
        this.EndDate.viewModel.setDate(now);
        uiUtils.resetSliders(this.EditCampaignDialog.viewModel.$el, this);
        this.LandingPagesContainer.empty();
      },
      intitializeDevices: function () {
        dataRepository.getDevices(function (devices) {
          var output = uiUtils.renderSliders(devices);
          $("div[data-sc-id='DeviceListInnerPanel']").append(output);
        });
      },
      intitializeLocations: function () {
        dataRepository.getLocations(function (locations) {
          var output = uiUtils.renderSliders(locations);
          $("div[data-sc-id='LocationPanel']").append(output);
        });
      },
      addLandingPages: function () {
        var pages = this.LandingPageTreeView.viewModel.checkedItemIds();
        var nodes = this.LandingPageTreeView.viewModel.getRoot().tree;
        var weights = [];
        this.LandingPagesContainer.find("input.sc-ds-slider").map(function (idx, el) {
          weights[el.getAttribute('data-sc-id')] = el.value;
        });

        this.LandingPagesContainer.empty();
        var self = this;
        nodes.visit(function (childNode) {
          var id = childNode.data.key;
          if (pages.indexOf(id) > -1) {
            var output = uiUtils.renderSliderWithDelete(childNode.data.title, id, weights[id]);
            self.LandingPagesContainer.append(output);
          }
        });
        this.AddLandingPagesDialog.hide();
        this.EditCampaignDialog.show();
      },

      getData: function () {
        var data = {
          startDate: this.StartDate.viewModel.getDate().toISOString(),
          endDate: this.EndDate.viewModel.getDate().toISOString(),
          events: {
            bounced: this.BouncedDistribution.get("text"),
            openRate: this.OpenRateDistribution.get("text"),
            clickRate: this.ClickRateDistribution.get("text"),
            unsubscribed: this.UnsubscribedDistribution.get("text"),
            unsubscribedFromAll: this.UnsubscribedFromAllDistribution.get("text"),
            delivered: this.DeliveredDistribution.get("text"),
            spamComplaints: this.SpamComplaintsDistribution.get("text")
          },
          dayDistribution: this.getDayDistribution(),
          devices: uiUtils.parseSlidersContainer(this.DeviceListExpander.viewModel.$el),
          locations: uiUtils.parseSlidersContainer(this.LocationsExpander.viewModel.$el),
          landingPages: uiUtils.parseSlidersContainer(this.LandingPagesListExpander.viewModel.$el)
        };

        return data;
      },

      submitEditCampaign: function () {
        var data = this.getData();
        this.trigger("campaignEditor:submit", data);
        this.EditCampaignDialog.hide();
      },

      cancelEditCampaign: function () {
        this.trigger("campaignEditor:cancel");
        this.EditCampaignDialog.hide();
      },
      getDayDistribution: function () {
        var distributionControls = [];
        for (var idx in this) {
          if (idx.startsWith("TrafficDistribution")) {
            distributionControls.push(this[idx]);
          }
        }

        var sortedControls = _.sortBy(distributionControls, function (item) { return item.get("name") });
        return _.map(sortedControls, function (item) { return item.get("text") });
      },
      setDayDistribution: function (days) {
        for (var idx in days) {
          this["TrafficDistribution" + idx].set("text", +days[idx]);
        }
      },

      fillUI: function (editingParameters) {
        this.StartDate.viewModel.setDate(new Date(editingParameters.startDate));
        this.EndDate.viewModel.setDate(new Date(editingParameters.endDate));

        this.setDayDistribution(editingParameters.dayDistribution);

        var events = editingParameters.events;
        this.BouncedDistribution.set("text", events.bounced);
        this.OpenRateDistribution.set("text", events.openRate);
        this.ClickRateDistribution.set("text", events.clickRate);
        this.UnsubscribedDistribution.set("text", events.unsubscribed);
        this.UnsubscribedFromAllDistribution.set("text", events.unsubscribedFromAll);
        this.DeliveredDistribution.set("text", events.delivered);
        this.SpamComplaintsDistribution.set("text", events.spamComplaints);

        uiUtils.setSliderValues(editingParameters.devices);
        uiUtils.setSliderValues(editingParameters.locations);

        var self = this;
        for (var id in editingParameters.landingPages) {
          dataRepository.getItem(id, this.LandingPageTreeView.get('database'), function (item) {
            var output = uiUtils.renderSliderWithDelete(item.$displayName, item.itemId, editingParameters.landingPages[item.itemId]);
            self.LandingPagesContainer.append(output);
          });
        }
      }
    });
    return dialog;
  });
