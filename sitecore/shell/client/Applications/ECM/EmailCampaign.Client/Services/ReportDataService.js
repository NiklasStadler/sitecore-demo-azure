﻿define([
    var ReportDataCollection = backbone.Collection.extend({
        model: ReportDataModel
    }),
        defaults: {
            managerRootId: '',
            messageId: '',
        },
            this.dataSources = new ReportDataCollection([]);
                return fact.event === constants.Reporting.Events.CLICK ? fact.bounces : 0;
            });
                return fact.isProductive ? fact.visits : 0;
            });
                return fact.isBrowsed ? fact.visits : 0;
            });
                return fact.value;
            });
                    uniques[uniqueKey] = dataSource.total(function (fact) {
                        return fact.event === eventCode ? fact.count : 0;
                    });
                });
            var debouncedUpdateDataSourceParams = _.debounce(this.updateDataSourceParameters, 50);
                return existing;
            }
        }
    });
});