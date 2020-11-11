'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var size_x = 5;
var size_y = 10;
var size_cell = 60;

var item = 0;
var items = [];
var cells = [];

var open = false;

var Size = function Size(x, y) {
  _classCallCheck(this, Size);

  this.x = x;
  this.y = y;
};

var Item = function Item(id, cell, x, y) {
  var count = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
  var stack = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;
  var data = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : "";
  var Active = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;

  _classCallCheck(this, Item);

  this.ID = id;
  this.Cell = cell;
  this.Size = new Size(x, y);
  this.Count = count;
  this.Stack = stack;
  this.Data = data;
  this.IsActive = Active;
};

var Inventory = function (_React$Component) {
  _inherits(Inventory, _React$Component);

  function Inventory() {
    _classCallCheck(this, Inventory);

    return _possibleConstructorReturn(this, (Inventory.__proto__ || Object.getPrototypeOf(Inventory)).apply(this, arguments));
  }

  _createClass(Inventory, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      $(".cell-body").droppable({
        drop: function drop(event, ui) {
          var drag_coords = $(ui.draggable).offset();
          var drop_coords = $(this).offset();

          if (cell) return;

          if (items[$(ui.draggable).attr("id").substr(5)].Size.x == 1 && items[$(ui.draggable).attr("id").substr(5)].Size.y == 1) {
            if (drop_coords.top == drag_coords.top) {
              if ((drop_coords.left + size_cell - drag_coords.left) * size_cell / (size_cell * size_cell) > 0.5) push_cell(ui.draggable, this);
              return;
            }
            if (drop_coords.left == drag_coords.left) {
              if ((drop_coords.top + size_cell - drag_coords.top) * size_cell / (size_cell * size_cell) > 0.5) push_cell(ui.draggable, this);
              return;
            }
          }
          if (drop_coords.top < drag_coords.top && drag_coords.top < drop_coords.top + size_cell && drop_coords.left < drag_coords.left && drag_coords.left < drop_coords.left + size_cell) {
            if ((drop_coords.top + size_cell - drag_coords.top) * (drop_coords.left + size_cell - drag_coords.left) / (size_cell * size_cell) > 0.3) {
              push_cell(ui.draggable, this);
              return;
            }
          }

          if (drop_coords.top < drag_coords.top && drag_coords.top < drop_coords.top + size_cell && drop_coords.left > drag_coords.left) {
            if ((drop_coords.top + size_cell - drag_coords.top) * size_cell / (size_cell * size_cell) > 0.5) {
              push_cell(ui.draggable, this);
              return;
            }
          }

          if (drop_coords.top > drag_coords.top && drop_coords.left < drag_coords.left && drag_coords.left < drop_coords.left + size_cell) {
            if ((drag_coords.top + $(ui.draggable).height() - drop_coords.top) * (drop_coords.left + size_cell - drag_coords.left) / (size_cell * size_cell) > 0.5) {
              push_cell(ui.draggable, this);
              return;
            }
          }

          if (drop_coords.top > drag_coords.top && drop_coords.left > drag_coords.left) {
            if ((drag_coords.top + $(ui.draggable).height() - drop_coords.top) * size_cell / (size_cell * size_cell) > 0.4) {
              push_cell(ui.draggable, this);
              return;
            }
          }
        },

        tolerance: "touch"
      });

      $(".equip").droppable({
        drop: function drop(event, ui) {
          if (cell) return;

          cell = true;

          equipItem = $(ui.draggable).attr("id").substr(5);
          mp.trigger("client.item.use", JSON.stringify(items[equipItem]));
        },
        accept: ".dress"
      });

      $(".inventory").droppable({
        drop: function drop(event, ui) {
          if (!cell) {
            mp.trigger("client.item.act", 1, JSON.stringify(items[ui.draggable.attr("id").substr(5)]));
            $("item-" + ui.draggable.attr("id").substr(5)).unbind().draggable("destroy");
            itemdrop = true;
            setTimeout(function () {
              itemdrop = false;
            }, 10);
            items[ui.draggable.attr("id").substr(5)] = null;
            if (open) ReactDOM.render(React.createElement(Inventory, null), document.querySelector("#inventory"));
          } else cell = false;
        }
      });

      $(document).mousedown(function (e) {
        if ($(e.target).attr("id") != "con-menu") ReactDOM.unmountComponentAtNode(document.querySelector(".menu"));
      });

      for (var i = 0; items[i] !== undefined; i++) {
        if (items[i] === null || items[i].ID >= 0 || items[i].Cell != -2) continue;
        $("#item-" + i).draggable({
          start: function start(event, ui) {
            $(this).addClass("obj").css("width", items[Number($(this).attr("id").substr(5))].Size.x * size_cell + items[Number($(this).attr("id").substr(5))].Size.x - 1).css("height", items[Number($(this).attr("id").substr(5))].Size.y * size_cell + items[Number($(this).attr("id").substr(5))].Size.x - 1);
          }
        }).mousedown(function () {
          var pos = $(this).offset();
          $(this).css("position", "absolute");
          $(this).offset(pos);
        }).mouseup(function () {
          if (!cell) {
            var pos = $(this).offset();
            $(this).css("position", "relative");
            $(this).offset(pos);
          }
        }).mousemove(function (e) {
          var pos = $("#cell").offset();

          if (pos.top < e.pageY && e.pageY < pos.top + 20 && pos.left < e.pageX && e.pageX < pos.left + $("#cell").width()) $("#cell").scrollTop($("#cell").scrollTop() - 5);

          if (pos.top + $("#cell").height() - 20 < e.pageY && e.pageY < pos.top + $("#cell").height() && pos.left < e.pageX && e.pageX < pos.left + $("#cell").width()) $("#cell").scrollTop($("#cell").scrollTop() + 5);
        });
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      for (var i = 0; items[i] !== undefined; i++) {
        if (items[i] === null || items[i].ID >= 0 || items[i].Cell != -2) continue;
        $("#item-" + i).draggable({
          start: function start(event, ui) {
            $(this).addClass("obj").css("width", items[Number($(this).attr("id").substr(5))].Size.x * size_cell + items[Number($(this).attr("id").substr(5))].Size.x - 1).css("height", items[Number($(this).attr("id").substr(5))].Size.y * size_cell + items[Number($(this).attr("id").substr(5))].Size.x - 1);
          }
        }).mousedown(function () {
          var pos = $(this).offset();
          $(this).css("position", "absolute");
          $(this).offset(pos);
        }).mouseup(function () {
          if (!cell) {
            var pos = $(this).offset();
            $(this).css("position", "relative");
            $(this).offset(pos);
          }
        }).mousemove(function (e) {
          var pos = $("#cell").offset();

          if (pos.top < e.pageY && e.pageY < pos.top + 20 && pos.left < e.pageX && e.pageX < pos.left + $("#cell").width()) $("#cell").scrollTop($("#cell").scrollTop() - 5);

          if (pos.top + $("#cell").height() - 20 < e.pageY && e.pageY < pos.top + $("#cell").height() && pos.left < e.pageX && e.pageX < pos.left + $("#cell").width()) $("#cell").scrollTop($("#cell").scrollTop() + 5);
        });
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      $(document).unbind();
      $(".inventory").droppable("destroy");
      $(".equip").droppable("destroy");
      $(".cell-body").droppable("destroy");
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "container-fluid" },
        React.createElement(
          "div",
          { className: "inventory row align-items-center" },
          React.createElement(
            "div",
            { className: "col-12" },
            React.createElement(
              "div",
              { className: "row justify-content-center" },
              React.createElement(
                "div",
                { className: "equip col-auto" },
                React.createElement(
                  "div",
                  { className: "head" },
                  React.createElement(
                    "h4",
                    null,
                    "\u042D\u043A\u0438\u043F\u0438\u0440\u043E\u0432\u043A\u0430"
                  )
                ),
                React.createElement(
                  "table",
                  { className: "table-bordered" },
                  React.createElement(
                    "tbody",
                    null,
                    React.createElement(
                      "tr",
                      null,
                      React.createElement(
                        "td",
                        null,
                        React.createElement(
                          "div",
                          { className: "equip-cell", id: "hat" },
                          RenderDress(-1)
                        )
                      ),
                      React.createElement(
                        "td",
                        null,
                        React.createElement("div", { className: "equip-cell", id: "mask" })
                      ),
                      React.createElement(
                        "td",
                        null,
                        React.createElement("div", { className: "equip-cell", id: "glass" })
                      ),
                      React.createElement(
                        "td",
                        null,
                        React.createElement("div", { className: "equip-cell", id: "ears" })
                      ),
                      React.createElement(
                        "td",
                        null,
                        React.createElement("div", { className: "equip-cell", id: "-8" })
                      ),
                      React.createElement(
                        "td",
                        null,
                        React.createElement(
                          "div",
                          { className: "equip-cell", id: "-4" },
                          RenderDress(-4)
                        )
                      )
                    ),
                    React.createElement(
                      "tr",
                      null,
                      React.createElement(
                        "td",
                        null,
                        React.createElement(
                          "div",
                          { className: "equip-cell", id: "-6" },
                          RenderDress(-6)
                        )
                      ),
                      React.createElement(
                        "td",
                        null,
                        React.createElement("div", { className: "equip-cell", id: "accessories" })
                      ),
                      React.createElement(
                        "td",
                        null,
                        React.createElement("div", { className: "equip-cell", id: "armor" })
                      ),
                      React.createElement(
                        "td",
                        null,
                        React.createElement("div", { className: "equip-cell", id: "watche" })
                      ),
                      React.createElement(
                        "td",
                        null,
                        React.createElement("div", { className: "equip-cell", id: "bracelet" })
                      ),
                      React.createElement(
                        "td",
                        null,
                        React.createElement("div", { className: "equip-cell", id: "backpack" })
                      )
                    )
                  )
                )
              ),
              React.createElement(
                "div",
                { className: "cells col-auto" },
                React.createElement(
                  "div",
                  { className: "head" },
                  React.createElement(
                    "h4",
                    null,
                    "\u0418\u043D\u0432\u0435\u043D\u0442\u0430\u0440\u044C"
                  )
                ),
                React.createElement(
                  "div",
                  { id: "cell" },
                  React.createElement(
                    "table",
                    { className: "table-bordered" },
                    React.createElement(
                      "tbody",
                      null,
                      RenderCell(size_x, size_y)
                    )
                  ),
                  React.createElement(
                    "div",
                    { id: "items" },
                    React.createElement(RenderItem, null)
                  )
                )
              )
            )
          ),
          React.createElement("div", { className: "menu" })
        )
      );
    }
  }]);

  return Inventory;
}(React.Component);

var RenderItem = function (_React$Component2) {
  _inherits(RenderItem, _React$Component2);

  function RenderItem() {
    _classCallCheck(this, RenderItem);

    return _possibleConstructorReturn(this, (RenderItem.__proto__ || Object.getPrototypeOf(RenderItem)).apply(this, arguments));
  }

  _createClass(RenderItem, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      RenderItem_Event();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      for (var i = 0; items[i] !== undefined; i++) {
        if (items[i] === null) continue;
        var itemDOM = $("#item-" + i);
        itemDOM.unbind();
        if (itemDOM.draggable("instance") != undefined) itemDOM.draggable("destroy");
      }
      setTimeout(function () {
        RenderItem_Event();
      }, 10);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      for (var i = 0; items[i] !== undefined; i++) {
        if (items[i] === null) continue;
        var itemDOM = $("#item-" + i);
        itemDOM.unbind();
        if (itemDOM.draggable("instance") != undefined) itemDOM.draggable("destroy");
      }
    }
  }, {
    key: "render",
    value: function render() {
      var elem = [];
      for (var i = 0; items[i] !== undefined; i++) {
        if (items[i] === null || items[i].Cell == -2) continue;

        var style = {
          width: items[i].Size.x * size_cell + items[i].Size.x - 1,
          height: items[i].Size.y * size_cell + items[i].Size.y - 1
        };
        if (items[i].Count > 1) var szcount = React.createElement(
          "span",
          { className: "count" },
          items[i].Count
        );
        elem[i] = React.createElement(
          "div",
          { key: i, className: "obj", id: "item-" + i, style: style },
          React.createElement("img", { src: 'img/items/' + items[i].ID + '.png', width: "100%" }),
          szcount
        );
        szcount = undefined;
      }

      return elem;
    }
  }]);

  return RenderItem;
}(React.Component);

var Menu = function (_React$Component3) {
  _inherits(Menu, _React$Component3);

  function Menu(props) {
    _classCallCheck(this, Menu);

    var _this3 = _possibleConstructorReturn(this, (Menu.__proto__ || Object.getPrototypeOf(Menu)).call(this, props));

    _this3.DropItem = _this3.DropItem.bind(_this3);
    return _this3;
  }

  _createClass(Menu, [{
    key: "DropItem",
    value: function DropItem() {
      mp.trigger("client.item.act", 1, JSON.stringify(items[this.props.id]));
      items[this.props.id] = null;
      if (open) ReactDOM.render(React.createElement(Inventory, null), document.querySelector("#inventory"));
    }
  }, {
    key: "render",
    value: function render() {
      this.style = {
        position: "absolute",
        top: this.props.y,
        left: this.props.x
      };

      return React.createElement(
        "ul",
        { className: "list-group", style: this.style },
        React.createElement(
          "li",
          { className: "list-group-item" },
          "\u041E\u0434\u0435\u0442\u044C"
        ),
        React.createElement(
          "li",
          { className: "list-group-item", id: "con-menu", onClick: this.DropItem },
          "\u0412\u044B\u0431\u0440\u043E\u0441\u0438\u0442\u044C"
        )
      );
    }
  }]);

  return Menu;
}(React.Component);

function RenderCell() {
  var elem = [];
  var elem2 = [];
  for (var i = 0; i < size_y; i++) {
    elem2[i] = [];
    for (var k = 0; k < size_x; k++) {
      elem2[i][k] = React.createElement(
        "td",
        { className: "cell", key: k + i * size_x },
        React.createElement("div", { className: "cell-body droppable", id: k + i * size_x })
      );
      if (!cells[k + i * size_x]) cells[k + i * size_x] = false;
    }
    elem[i] = React.createElement(
      "tr",
      { key: i },
      elem2[i]
    );
  }
  return elem;
}

function RenderDress(id) {
  for (var i = 0; items[i] !== undefined; i++) {
    if (items[i] === null || items[i].ID >= 0 || items[i].ID != id || items[i].Cell != -2) continue;

    var elem = React.createElement(
      "div",
      { className: "dress", id: "item-" + i },
      React.createElement("img", { src: 'img/items/' + items[i].ID + '.png', width: "100%" })
    );
    return elem;
  }
}

function RenderItem_Event() {
  for (var i = 0; items[i] !== undefined; i++) {
    if (items[i] === null || items[i].Cell == -2) continue;
    console.log(i);
    var itemDOM = $("#item-" + i);

    if (items[i].ID < 0) {
      itemDOM.addClass("dress");
    }

    itemDOM.mousedown(function (e) {
      if (e.button == 0) {
        var pos = $(this).offset();
        $(this).css("position", "absolute");
        $(this).offset(pos);

        for (var i = 1, elem; $("#items > .obj:nth-child(" + i + ")").length; i++) {
          if ($(this).attr("id").substr(5) == $("#items > .obj:nth-child(" + i + ")").attr("id").substr(5)) {
            elem = true;
            continue;
          }
          if (elem) {
            var offset = $("#items > .obj:nth-child(" + i + ")").offset();
            offset.top += size_cell * items[Number($(this).attr("id").substr(5))].Size.y + items[Number($(this).attr("id").substr(5))].Size.y - 1;
            $("#items > .obj:nth-child(" + i + ")").offset(offset);
          }
        }
      }
    }).contextmenu(function (e) {
      var x = 0;
      var y = 0;
      var d = document;
      var w = window;

      if (d.attachEvent != null) {
        // Internet Explorer & Opera
        x = w.e.clientX + (d.documentElement.scrollLeft ? d.documentElement.scrollLeft : d.body.scrollLeft);
        y = w.e.clientY + (d.documentElement.scrollTop ? d.documentElement.scrollTop : d.body.scrollTop);
      } else if (!d.attachEvent && d.addEventListener) {
        // Gecko
        x = e.clientX + w.scrollX;
        y = e.clientY + w.scrollY;
      }

      ReactDOM.render(React.createElement(Menu, { x: x, y: y, id: $(this).attr("id").substr(5) }), document.querySelector(".menu"));
      return false;
    }).mouseup(function (e) {
      if (!cell) {
        var pos = $(this).offset();
        $(this).css("position", "relative");
        $(this).offset(pos);
      }
      if (!startdrag && e.button == 0) {
        for (var i = 1, elem; $("#items > .obj:nth-child(" + i + ")").length; i++) {
          if ($(this).attr("id").substr(5) == $("#items > .obj:nth-child(" + i + ")").attr("id").substr(5)) {
            elem = true;
            continue;
          }
          if (elem) {
            var offset = $("#items > .obj:nth-child(" + i + ")").offset();
            offset.top -= size_cell * items[Number($(this).attr("id").substr(5))].Size.y + items[Number($(this).attr("id").substr(5))].Size.y - 1;
            $("#items > .obj:nth-child(" + i + ")").offset(offset);
          }
        }
      }
    }).draggable({
      start: function start(event, ui) {
        for (var i = 0; i < items[Number($(this).attr("id").substr(5))].Size.x; i++) {
          for (var k = 0; k < items[Number($(this).attr("id").substr(5))].Size.y; k++) {
            cells[items[Number($(this).attr("id").substr(5))].Cell + i + k * size_x] = false;
          }
        }
        startdrag = true;
      },
      stop: function stop(event, ui) {
        for (var i = 1, elem; $("#items > .obj:nth-child(" + i + ")").length; i++) {
          if ($(this).attr("id").substr(5) == $("#items > .obj:nth-child(" + i + ")").attr("id").substr(5)) {
            elem = true;
            continue;
          }
          if (elem) {
            var offset = $("#items > .obj:nth-child(" + i + ")").offset();
            offset.top -= size_cell * items[Number($(this).attr("id").substr(5))].Size.y + items[Number($(this).attr("id").substr(5))].Size.y - 1;
            $("#items > .obj:nth-child(" + i + ")").offset(offset);
          }
        }
        if (!cell && !itemdrop) {
          $(this).css("position", "relative").offset($("#" + items[Number($(this).attr("id").substr(5))].Cell).offset());
          for (var i = 0; i < items[Number($(this).attr("id").substr(5))].Size.x; i++) {
            for (var k = 0; k < items[Number($(this).attr("id").substr(5))].Size.y; k++) {
              cells[items[Number($(this).attr("id").substr(5))].Cell + i + k * size_x] = true;
            }
          }
        }
        startdrag = false;
      },
      scroll: false
    }).mousemove(function (e) {
      var pos = $("#cell").offset();

      if (pos.top < e.pageY && e.pageY < pos.top + 20 && pos.left < e.pageX && e.pageX < pos.left + $("#cell").width()) $("#cell").scrollTop($("#cell").scrollTop() - 5);

      if (pos.top + $("#cell").height() - 20 < e.pageY && e.pageY < pos.top + $("#cell").height() && pos.left < e.pageX && e.pageX < pos.left + $("#cell").width()) $("#cell").scrollTop($("#cell").scrollTop() + 5);
    }).css("position", "relative").offset($("#" + items[i].Cell).offset());
  }
}

var cell;
var equipItem;
var startdrag;
var itemdrop;

function ItemUse(response) {
  var itemID = $("#item-" + equipItem);
  if (response) {
    for (var i = 1, elem; $("#items > .obj:nth-child(" + i + ")").length; i++) {
      if (equipItem == $("#items > .obj:nth-child(" + i + ")").attr("id").substr(5)) {
        elem = true;
        continue;
      }
      if (elem) {
        var offset = $("#items > .obj:nth-child(" + i + ")").offset();
        offset.top += size_cell * items[equipItem].Size.y + items[equipItem].Size.y - 1;
        $("#items > .obj:nth-child(" + i + ")").offset(offset);
      }
    }

    items[equipItem].Cell = -2;
    ReactDOM.render(React.createElement(Inventory, null), document.querySelector("#inventory"));
  } /*else {
    itemID.css("position", "relative")
    .offset($("#" + items[equipItem].Cell).offset());
      for(var i = 0; i < items[equipItem].Size.x; i++) {
      for(var k = 0; k < items[equipItem].Size.y; k++) {
        cells[items[equipItem].Cell + i + k * size_x] = true;
      }
    }
    }*/
  mp.trigger("client.inventory.update", JSON.stringify(items), JSON.stringify(cells));
}

function push_cell(drag, drop) {
  if (check_cells($(drop).attr("id"), drag)) {
    if (items[Number($(drag).attr("id").substr(5))].Cell == -2) {
      var itemID = $(drag).attr("id").substr(5);

      mp.trigger("client.item.use", JSON.stringify(items[itemID]));
    }

    $(drag).css("position", "relative").offset($(drop).offset());

    for (var i = 0; i < items[Number($(drag).attr("id").substr(5))].Size.x; i++) {
      for (var k = 0; k < items[Number($(drag).attr("id").substr(5))].Size.y; k++) {

        cells[Number($(drop).attr("id")) + i + k * size_x] = true;
      }
    }
    items[Number($(drag).attr("id").substr(5))].Cell = Number($(drop).attr("id"));
    ReactDOM.render(React.createElement(Inventory, null), document.querySelector("#inventory"));
    mp.trigger("client.inventory.update", JSON.stringify(items), JSON.stringify(cells));
  } else {
    $(drag).css("position", "relative").offset($("#" + items[Number($(drag).attr("id").substr(5))].Cell).offset());

    for (var i = 0; i < items[Number($(drag).attr("id").substr(5))].Size.x; i++) {
      for (var k = 0; k < items[Number($(drag).attr("id").substr(5))].Size.y; k++) {
        cells[items[Number($(drag).attr("id").substr(5))].Cell + i + k * size_x] = true;
      }
    }
  }
  cell = true;
}

function check_cells(id, drag) {
  if (Number(items[Number($(drag).attr("id").substr(5))].Size.x) + Number(id) % size_x > size_x || Number(id) + (items[Number($(drag).attr("id").substr(5))].Size.y - 1) * size_x > size_x * size_y) return false;

  for (var i = 0; i < items[Number($(drag).attr("id").substr(5))].Size.x; i++) {
    for (var k = 0; k < items[Number($(drag).attr("id").substr(5))].Size.y; k++) {
      if (cells[Number(id) + i + k * size_x]) return false;
    }
  }
  return true;
}

function add_item(x, y, type, count, stack) {
  var szcell = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : -1;
  var data = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : "";

  szcell = szcell == -1 ? get_freecell(x, y) : szcell;
  if (szcell == -1) {
    return;
  }

  if (szcell == -2) {
    items[item] = new Item(type, szcell, x, y, count, stack, data);
    item++;
  } else {
    var szId;
    for (var i = 0; items[i] != undefined; i++) {
      if (items[i].ID == type) szId = i;
    }
    if (szId >= 0 && stack >= count + items[szId].Count) {
      items[szId].Count += count;
    } else {
      for (var i = 0; i < x; i++) {
        for (var k = 0; k < y; k++) {
          cells[szcell + i + k * size_x] = true;
        }
      }

      items[item] = new Item(type, szcell, x, y, count, stack, data);

      item++;
    }
  }
  if (open) ReactDOM.render(React.createElement(Inventory, null), document.querySelector("#inventory"));
  mp.trigger("client.inventory.update", JSON.stringify(items), JSON.stringify(cells));
}

function get_freecell(x, y) {
  var free = false;
  for (var freecell = 0; freecell < size_x * size_y; freecell++) {
    for (var i = 0; i < x; i++) {
      for (var k = 0; k < y; k++) {
        free = false;
        if (freecell + i + k * size_x > size_x * size_y - 1) break;
        if (cells[freecell + i + k * size_x]) break;
        free = true;
      }
      if (!free) break;
    }
    if (x + freecell % size_x > size_x || freecell + (y - 1) * size_x > size_x * size_y) continue;
    if (free) return freecell;
  }
  return -1;
}

function OpenCloseInventory() {
  if (!open) {
    ReactDOM.render(React.createElement(Inventory, null), document.querySelector("#inventory"));
    open = true;
  } else {
    ReactDOM.unmountComponentAtNode(document.querySelector("#inventory"));
    open = false;
  }
}