if (!window.Quick) {
    window.Quick = {};
}

window.Quick.nebulon = function () {
    'use strict';

    var e = { 
        children: [],
        addChild: function(child) {
            this[child.id] = child;
            for (var i in this.children) {
                if (this._children.hasOwnProperty(i)) {
                    this.children[i][child.id] = child;
                    child[this.children[i].id] = this.children[i];
                }
            }
            e.children.push(child);
            Quick.Engine.addElement(child);
            return child;
        },
        initializeBindings: function() {
            for (var i = 0; i < e.children.length; ++i) { e.children[i].initializeBindings(); }
        },
        render: function() {
            for (var i = 0; i < e.children.length; ++i) { e.children[i].render(); }
        }
    };

    Quick.Label = function (id, parent) {
        var e = new Quick.Text(id, parent);
        e.addProperty("color", function () {return "#3C7DC1";});
        e.addProperty("fontSize", function () {return "32px";});
        e.addProperty("fontFamily", function () {return "Liberation Sans";});
        return e;
    };
    Quick.Button = function (id, parent) {
        var e = new Quick.Item(id, parent);
        e.addProperty("width", function () {return this.l.textWidth < 140 ? 100 : (this.l.textWidth + 40);});
        e.addProperty("height", function () {return this.l.textHeight < 70 ? 50 : (this.l.textHeight + 20);});
        e.addProperty("label", function () {return "";});
        e.addProperty("cursor", function () {return "default";});
        e.addProperty("hoverEnabled", function () {return true;});
        e.addProperty("backgroundColor", function () {
        if (this.mousePressed) {
            return "#006B9F";
        } else if (this.containsMouse) {
            return "#30A7DF";
        } else {
            return "#3C7DC1";
        }
     });
        e.addProperty("fontSize", function () {return "32px";});
        e.addChild((function() {
            var e = new Quick.Label("l");
            e.addProperty("color", function () {return "white";});
            e.addProperty("text", function () {return this.parent.label;});
            e.addProperty("left", function () {return this.parent.width/2 - this.textWidth/2;});
            e.addProperty("top", function () {return this.parent.height/2 - this.textHeight/2;});
            e.addProperty("fontSize", function () {return this.parent.fontSize;});
            return e;
        })());
        return e;
    };
    Quick.Deck = function (id, parent) {
        var e = new Quick.Item(id, parent);
        e.addProperty("activeCard", function () {return undefined;});
        e.addProperty("width", function () {return this.parent.width;});
        e.addProperty("height", function () {return this.parent.height;});
        e.addProperty("overflow", function () {return "hidden";});
        e.addFunction("showCard", function (card) {
        
        if (this.activeCard === card) {
            return;
        }

        if (this.activeCard) {
            this.activeCard.top = this.bottom;
        }

        this.activeCard = card;
        this.activeCard.top = 0;
    
        });
        e.addEventHandler("onload", function () {
        
        var kids = this.children();

        for (var i in kids) {
            if (kids.hasOwnProperty(i)) {
                if (!this.activeCard) {
                    this.activeCard = kids[i];
                }

                if (kids[i] === this.activeCard) {
                    kids[i].top = 0;
                } else {
                    kids[i].top = this.bottom;
                }
            }
        }
    
        });
        return e;
    };
    Quick.Card = function (id, parent) {
        var e = new Quick.Item(id, parent);
        e.addProperty("width", function () {return this.parent.width;});
        e.addProperty("height", function () {return this.parent.height;});
        e.addProperty("backgroundColor", function () {return "white";});
        e.addChild((function() {
            var e = new Quick.Behavior();
            e.addProperty("top", function () {return "500ms";});
            e.addProperty("target", function () {return this.parent;});
            return e;
        })());
        return e;
    };
    Quick.Layout = function (id, parent) {
        var e = new Quick.Item(id, parent);
        e.addProperty("width", function () {return this.childrenWidth;});
        e.addProperty("height", function () {return this.childrenHeight;});
        e.addProperty("spacing", function () {return 10;});
        e.addProperty("orientation", function () {return "vertical";});
        e.addFunction("_layout", function () {
        
        var kids = this.children();
        var sibling = undefined;

        if (this.spacing === 50)
            console.error("----------------------")
        for (var i in kids) {
            if (kids.hasOwnProperty(i)) {
                if (this.orientation === "vertical") {
                    if (this.spacing === 50)
                        console.log(sibling)
                    kids[i].top = sibling ? (this.spacing + sibling.bottom) : 0;
                    if (this.spacing === 50) {
                        console.log(kids[i].getSilent("top"), kids[i].getSilent("height"))
                    }
                    kids[i].left = 0;
                } else {
                    kids[i].top = 0;
                    kids[i].left = sibling ? (this.spacing + sibling.right) : 0;
                }
                sibling = kids[i];
            }
        }
    
        });
        e.addFunction("_setupListeners", function () {
        
        var kids = this.children();
        var that = this;

        for (var i in kids) {
            if (kids.hasOwnProperty(i)) {
                kids[i].addChanged('width', function () { that._layout() });
                kids[i].addChanged('height', function () { that._layout() });
            }
        }
    
        });
        e.addProperty("orientationChanged", function () {return this._layout();});
        e.addEventHandler("onload", function () {
        this._setupListeners()
        });
        return e;
    };
    Quick.VerticalLayout = function (id, parent) {
        var e = new Quick.Layout(id, parent);
        e.addProperty("orientation", function () {return "vertical";});
        return e;
    };
    Quick.HorizontalLayout = function (id, parent) {
        var e = new Quick.Layout(id, parent);
        e.addProperty("orientation", function () {return "horizontal";});
        return e;
    };
    e.initializeBindings();
    e.render();
    return e;
};
