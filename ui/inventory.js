'use strict';

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

var Item = function Item(cell, x, y) {
  _classCallCheck(this, Item);

  this.cell = cell;
  this.x = x;
  this.y = y;
};

var body = '<div class="inventory">\
<div class="head">\
    <h4>Инвентарь</h4>\
</div>\
<div class="cells">\
    <table class="table-bordered">';
for (var i = 0; i < size_y; i++) {
  body += '<tr>';
  for (var k = 0; k < size_x; k++) {
    body += '<td class="cell"><div class="cell-body" id="' + (k + i * size_x) + '"></div></td>';
    cells[k + i * size_x] = new Cells();
  }
  body += '</tr>';
}
$("#root").append(body);
//$("#root").append('<div class="obj" data-size-x="3" data-size-y="2">');
//$("#root").append('<div class="obj" data-size-x="3" data-size-y="2">');

var cell;
var pos;
$(".cell-body").droppable({
  drop: function drop(event, ui) {
    var drag_coords = $(ui.draggable).offset();
    var drop_coords = $(this).offset();

    if (cell) return;

    setTimeout(function () {
      cell = false;
    }, 10);

    if (drop_coords.top < drag_coords.top && drag_coords.top < drop_coords.top + 30 && drop_coords.left < drag_coords.left && drag_coords.left < drop_coords.left + 30) {
      if ((drop_coords.top + 30 - drag_coords.top) * (drop_coords.left + 30 - drag_coords.left) / (30 * 30) > 0.35) {
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
      if ((drag_coords.top + $(ui.draggable).height() - drop_coords.top) * 30 / (30 * 30) > 0.35) {
        push_cell(ui.draggable, this);
        return;
      }
    }
  },

  tolerance: "touch"
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
  if (Number($(drop).attr("data-size-x")) + Number(id) % size_x > size_x || Number(id) + Number($(drop).attr("data-size-y")) * size_x > size_x * size_y) return false;
  for (var i = 0; i < $(drop).attr("data-size-x"); i++) {
    for (var k = 0; k < $(drop).attr("data-size-y"); k++) {
      if (cells[Number(id) + i + k * size_x].active) return false;
    }
  }
  return true;
}

function add_item(x, y, cell) {
  $("#root").append('<div class="obj" id="item-' + item + '" data-size-x="' + x + '" data-size-y="' + y + '"></div>');
  $("#item-" + item).css("width", x * 30 + x - 1).css("height", y * 30 + y - 1).draggable({
    start: function start(event, ui) {
      //pos = $(this).offset();
      for (var i = 0; i < $(this).attr("data-size-x"); i++) {
        for (var k = 0; k < $(this).attr("data-size-y"); k++) {
          cells[items[Number($(this).attr("id").substr(5))].cell + i + k * size_x].active = false;
        }
      }
    }
  }).offset($("#" + cell).offset());
  items[item] = new Item(cell, x, y);
  item++;
}