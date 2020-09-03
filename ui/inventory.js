'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var size_x = 5;
var size_y = 10;

var item = 0;
var items = [];
var cells = [];

var Cells = function Cells() {
  _classCallCheck(this, Cells);

  this.active = false;
};

var Item = function Item(cell, x, y, type) {
  _classCallCheck(this, Item);

  this.cell = cell;
  this.x = x;
  this.y = y;
  this.type = type;
};

var Inventory = function (_React$Component) {
  _inherits(Inventory, _React$Component);

  function Inventory() {
    _classCallCheck(this, Inventory);

    return _possibleConstructorReturn(this, (Inventory.__proto__ || Object.getPrototypeOf(Inventory)).apply(this, arguments));
  }

  _createClass(Inventory, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "inventory row" },
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
                      React.createElement("div", { className: "equip-cell", id: "hat" })
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
                      React.createElement("div", { className: "equip-cell", id: "top" })
                    ),
                    React.createElement(
                      "td",
                      null,
                      React.createElement("div", { className: "equip-cell", id: "leg" })
                    )
                  ),
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "td",
                      null,
                      React.createElement("div", { className: "equip-cell", id: "shoes" })
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
                "table",
                { className: "table-bordered" },
                React.createElement(
                  "tbody",
                  null,
                  RenderCell(size_x, size_y)
                )
              )
            )
          )
        )
      );
    }
  }]);

  return Inventory;
}(React.Component);

function RenderCell(x, y) {
  var elem = [];
  var elem2 = [];
  for (var i = 0; i < size_y; i++) {
    elem2[i] = [];
    for (var k = 0; k < size_x; k++) {
      elem2[i][k] = React.createElement(
        "td",
        { className: "cell", key: k + i * size_x },
        React.createElement("div", { className: "cell-body", id: k + i * size_x })
      );
      cells[k + i * size_x] = new Cells();
    }
    elem[i] = React.createElement(
      "tr",
      { key: i },
      elem2[i]
    );
  }
  return elem;
}

ReactDOM.render(React.createElement(Inventory, null), document.querySelector("#inventory"));

var cell;
var pos;
$(".cell-body").droppable({
  drop: function drop(event, ui) {
    var drag_coords = $(ui.draggable).offset();
    var drop_coords = $(this).offset();

    if (cell) return;

    setTimeout(function () {
      cell = false;
    }, 100);

    if ($(ui.draggable).attr("data-size-x") == 1 && $(ui.draggable).attr("data-size-x") == 1) {
      console.log();
      if (drop_coords.top == drag_coords.top) {
        if ((drop_coords.left + 30 - drag_coords.left) * 30 / (30 * 30) > 0.5) push_cell(ui.draggable, this);
        return;
      }
      if (drop_coords.left == drag_coords.left) {
        if ((drop_coords.top + 30 - drag_coords.top) * 30 / (30 * 30) > 0.5) push_cell(ui.draggable, this);
        return;
      }
    }
    if (drop_coords.top < drag_coords.top && drag_coords.top < drop_coords.top + 30 && drop_coords.left < drag_coords.left && drag_coords.left < drop_coords.left + 30) {
      if ((drop_coords.top + 30 - drag_coords.top) * (drop_coords.left + 30 - drag_coords.left) / (30 * 30) > 0.3) {
        push_cell(ui.draggable, this);
        return;
      }
    }

    if (drop_coords.top < drag_coords.top && drag_coords.top < drop_coords.top + 30 && drop_coords.left > drag_coords.left) {
      if ((drop_coords.top + 30 - drag_coords.top) * 30 / (30 * 30) > 0.5) {
        push_cell(ui.draggable, this);
        return;
      }
    }

    if (drop_coords.top > drag_coords.top && drop_coords.left < drag_coords.left && drag_coords.left < drop_coords.left + 30) {
      if ((drag_coords.top + $(ui.draggable).height() - drop_coords.top) * (drop_coords.left + 30 - drag_coords.left) / (30 * 30) > 0.5) {
        push_cell(ui.draggable, this);
        return;
      }
    }

    if (drop_coords.top > drag_coords.top && drop_coords.left > drag_coords.left) {
      if ((drag_coords.top + $(ui.draggable).height() - drop_coords.top) * 30 / (30 * 30) > 0.4) {
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

    setTimeout(function () {
      cell = false;
    }, 100);

    cell = true;
  }
});

function push_cell(drag, drop) {
  if (check_cells($(drop).attr("id"), drag)) {
    $(drag).offset($(drop).offset());
    for (var i = 0; i < $(drag).attr("data-size-x"); i++) {
      for (var k = 0; k < $(drag).attr("data-size-y"); k++) {

        cells[Number($(drop).attr("id")) + i + k * size_x].active = true;
        items[Number($(drag).attr("id").substr(5))].cell = Number($(drop).attr("id"));
      }
    }
    cell = true;
  } else {
    $(drag).offset($("#" + items[Number($(drag).attr("id").substr(5))].cell).offset());
    for (var i = 0; i < $(drag).attr("data-size-x"); i++) {
      for (var k = 0; k < $(drag).attr("data-size-y"); k++) {
        cells[items[Number($(drag).attr("id").substr(5))].cell + i + k * size_x].active = true;
      }
    }
  }
}

function check_cells(id, drop) {
  if (Number($(drop).attr("data-size-x")) + Number(id) % size_x > size_x || Number(id) + ($(drop).attr("data-size-y") - 1) * size_x > size_x * size_y) return false;
  for (var i = 0; i < $(drop).attr("data-size-x"); i++) {
    for (var k = 0; k < $(drop).attr("data-size-y"); k++) {
      if (cells[Number(id) + i + k * size_x].active) return false;
    }
  }
  return true;
}

function add_item(x, y, type) {
  $("#root").append('<div class="obj" id="item-' + item + '" data-size-x="' + x + '" data-size-y="' + y + '"><img src="img/items/' + type + '.png" width="100%"></div>');
  var szcell = get_freecell(x, y);
  if (szcell == -1) {}
  $("#item-" + item).css("width", x * 30 + x - 1).css("height", y * 30 + y - 1).draggable({
    start: function start(event, ui) {
      //pos = $(this).offset();
      for (var i = 0; i < $(this).attr("data-size-x"); i++) {
        for (var k = 0; k < $(this).attr("data-size-y"); k++) {
          cells[items[Number($(this).attr("id").substr(5))].cell + i + k * size_x].active = false;
        }
      }
    },
    stop: function stop(event, ui) {
      if (!cell) {
        $(this).offset($("#" + items[Number($(this).attr("id").substr(5))].cell).offset());
        for (var i = 0; i < $(this).attr("data-size-x"); i++) {
          for (var k = 0; k < $(this).attr("data-size-y"); k++) {
            cells[items[Number($(this).attr("id").substr(5))].cell + i + k * size_x].active = true;
          }
        }
      }
    }
  }).offset($("#" + szcell).offset());
  for (var i = 0; i < x; i++) {
    for (var k = 0; k < y; k++) {
      cells[szcell + i + k * size_x].active = true;
    }
  }
  items[item] = new Item(szcell, x, y, type);
  item++;
}

function get_freecell(x, y) {
  var free = false;
  for (var freecell = 0; freecell < size_x * size_y; freecell++) {
    for (var i = 0; i < x; i++) {
      for (var k = 0; k < y; k++) {
        free = false;
        if (freecell + i + k * size_x > size_x * size_y - 1) break;
        if (cells[freecell + i + k * size_x].active) break;
        free = true;
      }
      if (!free) break;
    }
    if (x + freecell % size_x > size_x || freecell + (y - 1) * size_x > size_x * size_y) continue;
    if (free) return freecell;
  }
  return -1;
}