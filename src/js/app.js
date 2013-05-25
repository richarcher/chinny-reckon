var App = {};

App.Chin = Backbone.Model.extend({});

App.Chins = Backbone.Collection.extend({
  model: App.Chin,
  url: "/images.json",
  initialize: function () {
    this.fetch({
      success: function() {
        chin_router = new App.ChinRouter();
        Backbone.history.start({pushState : true});
      }
    });
  },
  comparator: function(model) {
    var mod = new Date(model.get("date"));
    return -mod;
  }
});

App.ChinView = Backbone.View.extend({
  el: $("#chin"),
  events: {
    'click #img': 'nextChin'
  },
  initialize: function() {
    if ($("#img").length === 0) {
      this.$el.append( "<div id=\"img\" class=\"image\"></div>" );
    }
    $(document).on('keydown',$.proxy(this.keyboard,this));
  },
  render: function(chin) {
    this.model = chin;
    $('#img').css({"background-image" : "url('" + chin.get("url") +"')"});
  },
  nextChin: function() {
    this.moveChin('next');
  },
  prevChin: function() {
    this.moveChin('prev');
  },
  moveChin: function(dir) {
    var name, current_idx;
    if (dir === "prev") current_idx = all_chins.indexOf(this.model) - 1;
    if (dir === "next") current_idx = all_chins.indexOf(this.model) + 1;
    current_idx = (current_idx + all_chins.length) % all_chins.length
    name = all_chins.at(current_idx).get("name");
    chin_router.navigate( name , { trigger : true });
  },
  keyboard: function(e) {
    if (e.keyCode === 74) return this.prevChin();
    if (e.keyCode === 75) return this.nextChin();
  }
});

App.ChinRouter = Backbone.Router.extend({
  routes : {
    ""      : "index",
    "*name" : "name"
  },
  index: function() {
    this.navigate( all_chins.at(0).get("name"), { trigger : true } );
  },
  name: function(namestr) {
    var url = all_chins.findWhere({name : namestr});
    if ( typeof url === "undefined" ) {
      return this.navigate( "/", { trigger : true } );
    }
    chin_view.render( url );
  }
});

var all_chins = new App.Chins();
var chin_view = new App.ChinView();
var chin_router;