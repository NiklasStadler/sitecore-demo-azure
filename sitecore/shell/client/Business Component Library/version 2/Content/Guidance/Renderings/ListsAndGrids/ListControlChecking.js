(function (Speak) {

  Speak.pageCode({
    name: "CheckingApp",
    initialized: function () {
      this.ListControlCheckingAndPaging.on("change:CheckedValues", function () { this.Text2.Text = JSON.stringify(this.ListControlCheckingAndPaging.CheckedValues); }, this);
      this.on("lcch:data:next", function () { this.DataSource.next(); });
      this.on("lcch:data:refresh", function () { this.DataSource.loadData(); });
    }
  });
})(Sitecore.Speak);

