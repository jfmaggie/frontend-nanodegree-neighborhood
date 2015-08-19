// viewmodel
function AppViewModel(){
    this.testName = ko.observable("search place here");
    this.test = ko.computed(function(){
        return this.testName();
    }, this);
}

// Activates knokout.js
ko.applyBindings(new AppViewModel());