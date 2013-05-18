var Chin = Backbone.Model.extend({});

var Chins = Backbone.Collection.extend({
  model: Chin,
  comparator: function(model) {
    var mod = new Date(model.get("date"));
    return -mod;
  }
});

var ChinView = Backbone.View.extend({
  el: $("#chin"),
  events: {
    'click #img': 'nextChin'
  },
  initialize: function() {
    _.bindAll(this, 'keyPress');
    $(document).bind('keypress', this.keyPress);
    this.counter = 0;
    this.chins = all_chins.length;
    this.$el.append( "<div id=\"img\" class=\"image\"></div>" );
    this.render();
  },
  render: function() {
    if (this.counter === -1) this.counter = this.chins - 1;
    image = all_chins.at(this.counter % this.chins).get("name")
    $('#img').css({"background-image" : "url('" + image +"')"})
  },
  nextChin: function() {
    this.counter++;
    this.render();
  },
  prevChin: function() {
    this.counter--;
    this.render();
  },
  keyPress: function(e) {
    if (e.keyCode === 107) this.nextChin();
    if (e.keyCode === 106) this.prevChin();
  }
});

var all_chins = new Chins();
all_chins.fetch({
  url: "/images.json",
  success: function() {
    var chin_view = new ChinView();
  },
  error: function() {
    throw "There was an error loading JSON";
  }
});
