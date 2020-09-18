'use strict';

const size_x = 5;
const size_y = 10;
const size_cell = 60;

var item = 0;
var items = [];
var cells = [];

class Size {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Item {
  constructor(id, cell, x, y, count = 1, data = "", Active = false) {
    this.ID = id;
    this.Cell = cell;
    this.Size = new Size(x, y);
    this.Count = count;
    this.Data = data;
    this.IsActive = Active;
  }
}

class Inventory extends React.Component {
  render() {
    return(
      <div className="inventory row align-items-center">
        <div className="col-12">
          <div className="row justify-content-center">
            <div className="equip col-auto">
              <div className="head">
                <h4>Экипировка</h4>
              </div>
              <table className="table-bordered">
                <tbody>
                  <tr>
                    <td><div className="equip-cell" id="hat"></div></td>
                    <td><div className="equip-cell" id="mask"></div></td>
                    <td><div className="equip-cell" id="glass"></div></td>
                    <td><div className="equip-cell" id="ears"></div></td>
                    <td><div className="equip-cell" id="-8"></div></td>
                    <td><div className="equip-cell" id="-4"></div></td>
                  </tr>
                  <tr>
                    <td><div className="equip-cell" id="-6"></div></td>
                    <td><div className="equip-cell" id="accessories"></div></td>
                    <td><div className="equip-cell" id="armor"></div></td>
                    <td><div className="equip-cell" id="watche"></div></td>
                    <td><div className="equip-cell" id="bracelet"></div></td>
                    <td><div className="equip-cell" id="backpack"></div></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="cells col-auto">
              <div className="head">
                <h4>Инвентарь</h4>
              </div>
              <div id="cell">
              <table className="table-bordered">
                <tbody>
                  {RenderCell(size_x, size_y)}
                </tbody>
              </table>
              <div id="items"></div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    )
  }
}

function RenderCell(x, y) {
  var elem = [];
  var elem2 = [];
  for(let i = 0; i < size_y; i++) {
    elem2[i] = [];
    for(var k = 0; k < size_x; k++) {
      elem2[i][k] = <td className="cell" key={k + i * size_x}><div className="cell-body droppable" id={k + i * size_x}></div></td>;
      cells[k + i * size_x] = false;
    }
    elem[i] = <tr key={i}>{elem2[i]}</tr>;
  }
  return elem;
}

ReactDOM.render(<Inventory />, document.querySelector("#inventory"));

var cell;
$(".cell-body").droppable({
    drop: function( event, ui ) {
        var drag_coords = $(ui.draggable).offset();
        var drop_coords = $(this).offset();

        if(cell) return;

        setTimeout(() => {
        cell = false;
        }, 100)

        if(items[$(ui.draggable).attr("id").substr(5)].Size.x == 1 && items[$(ui.draggable).attr("id").substr(5)].Size.y == 1) {
          console.log();
          if(drop_coords.top == drag_coords.top) {
            if((drop_coords.left + size_cell - drag_coords.left) * size_cell / (size_cell*size_cell) > 0.5)
            push_cell(ui.draggable, this);
            return;
          }
          if(drop_coords.left == drag_coords.left) {
            if((drop_coords.top + size_cell - drag_coords.top) * size_cell / (size_cell*size_cell) > 0.5)
            push_cell(ui.draggable, this);
            return;
          }
        }
        if((drop_coords.top < drag_coords.top && drag_coords.top < (drop_coords.top + size_cell))
        && (drop_coords.left < drag_coords.left && drag_coords.left < (drop_coords.left + size_cell))) {
            if((drop_coords.top + size_cell - drag_coords.top) * (drop_coords.left + size_cell - drag_coords.left) / (size_cell*size_cell) > 0.3) {
              push_cell(ui.draggable, this);
              return;
            }
        }

        if((drop_coords.top < drag_coords.top && drag_coords.top < (drop_coords.top + size_cell))
        && (drop_coords.left > drag_coords.left)) {
            if((drop_coords.top + size_cell - drag_coords.top) * size_cell / (size_cell*size_cell) > 0.5) {
              push_cell(ui.draggable, this);
              return;
            }
        }

        if((drop_coords.top > drag_coords.top)
        && (drop_coords.left < drag_coords.left && drag_coords.left < (drop_coords.left + size_cell))) {
            if((drag_coords.top + $(ui.draggable).height() - drop_coords.top) * (drop_coords.left + size_cell - drag_coords.left) / (size_cell*size_cell) > 0.5) {
              push_cell(ui.draggable, this);
              return;
            }
        }

        if((drop_coords.top > drag_coords.top)
        && (drop_coords.left > drag_coords.left)) {
            if((drag_coords.top + $(ui.draggable).height() - drop_coords.top) * size_cell / (size_cell*size_cell) > 0.4) {
              push_cell(ui.draggable, this);
              return;
            }
        }
    },

    tolerance: "touch"
});

var equipItem;
var startdrag;

$(".equip").droppable({
  drop: function(event, ui) {
    if(cell) return;

    setTimeout(() => {
    cell = false;
    }, 100);

    cell = true;

    equipItem = $(ui.draggable).attr("id").substr(5);
    mp.trigger("client.item.use", JSON.stringify(items[equipItem]));
  },
  accept:".dress"
});

function ItemUse(response) {
  var itemID = $("#item-" + equipItem);
  if(response) {
    for(var i = 1, elem; $("#items > .obj:nth-child(" + i + ")").length; i++) {
      if(equipItem == $("#items > .obj:nth-child(" + i + ")").attr("id").substr(5)) {
        elem = true;
        continue;
      }
      if(elem) {
        var offset = $("#items > .obj:nth-child(" + i + ")").offset();
        offset.top += size_cell * items[equipItem].Size.y + items[equipItem].Size.y - 1;
        $("#items > .obj:nth-child(" + i + ")").offset(offset);
      }
    }
    $(itemID).draggable("destroy")
    .remove();
    items[equipItem].Cell = -2;

    $("#" + items[equipItem].ID).html("<div id='item-" + equipItem + "'><img src='img/items/" + items[equipItem].ID + ".png' width='100%'></div>");
    $("#item-" + equipItem).draggable({
      start: function(event, ui){
        $(this).addClass("obj")
          .css("width", items[$(this).attr("id").substr(5)].Size.x * size_cell + items[$(this).attr("id").substr(5)].Size.x - 1)
          .css("height", items[$(this).attr("id").substr(5)].Size.y * size_cell + items[$(this).attr("id").substr(5)].Size.x - 1);
      }
    })
    .mousedown(function() {
      var pos = $(this).offset();
      $(this).css("position", "absolute");
      $(this).offset(pos);
    })
    .mouseup(function() {
      if(!cell) {
        var pos = $(this).offset();
        pos.left -= 8.5;
        $(this).css("position", "relative");
        $(this).offset(pos);
      }
    })
    .mousemove(function(e) {
      var pos = $("#cell").offset();
  
      if(pos.top < e.pageY && e.pageY < pos.top + 20
      && pos.left < e.pageX && e.pageX < pos.left + $("#cell").width())
      $("#cell").scrollTop($("#cell").scrollTop() - 5);
  
      if(pos.top + $("#cell").height() - 20 < e.pageY && e.pageY < pos.top + $("#cell").height()
      && pos.left < e.pageX && e.pageX < pos.left + $("#cell").width())
      $("#cell").scrollTop($("#cell").scrollTop() + 5);
    });
  } else {
    itemID.css("position", "relative")
    .offset($("#" + items[equipItem].Cell).offset());

    for(var i = 0; i < items[equipItem].Size.x; i++) {
      for(var k = 0; k < items[equipItem].Size.y; k++) {
        cells[items[equipItem].Cell + i + k * size_x] = true;
      }
    }
  }
  mp.trigger("client.inventory.update", JSON.stringify(items), JSON.stringify(cells));
}

function push_cell(drag, drop) {
  if(check_cells($(drop).attr("id"), drag)) {

    if(items[Number($(drag).attr("id").substr(5))].Cell == -2) {
      let itemID = $(drag).attr("id").substr(5);

      $(drag).draggable("destroy")
      .remove();

      drag = CreateItem("#items", itemID, items[itemID].ID);
      drag.css("width", items[itemID].Size.x * size_cell + items[itemID].Size.x - 1)
      .css("height", items[itemID].Size.y * size_cell + items[itemID].Size.y - 1);

      mp.trigger("client.item.use", JSON.stringify(items[itemID]));
    }

    $(drag).css("position", "relative")
    .offset($(drop).offset());

    for(var i = 0; i < items[Number($(drag).attr("id").substr(5))].Size.x; i++) {
      for(var k = 0; k < items[Number($(drag).attr("id").substr(5))].Size.y; k++) {
        
        cells[Number($(drop).attr("id")) + i + k * size_x] = true;
        items[Number($(drag).attr("id").substr(5))].Cell = Number($(drop).attr("id"));
      }
    }

    cell = true;
    mp.trigger("client.inventory.update", JSON.stringify(items), JSON.stringify(cells));
  }
  else {
    $(drag).css("position", "relative")
    .offset($("#" + items[Number($(drag).attr("id").substr(5))].Cell).offset());

    for(var i = 0; i < items[Number($(drag).attr("id").substr(5))].Size.x; i++) {
      for(var k = 0; k < items[Number($(drag).attr("id").substr(5))].Size.y; k++) {
        cells[items[Number($(drag).attr("id").substr(5))].Cell + i + k * size_x] = true;
      }
    }
  }
}

function check_cells(id, drag) {
  if(Number(items[Number($(drag).attr("id").substr(5))].Size.x) + Number(id) % size_x > size_x
  || Number(id) + (items[Number($(drag).attr("id").substr(5))].Size.y - 1) * size_x > size_x * size_y)
    return false;

    for(var i = 0; i < items[Number($(drag).attr("id").substr(5))].Size.x; i++) {
      for(var k = 0; k < items[Number($(drag).attr("id").substr(5))].Size.y; k++) {
        if(cells[Number(id) + i + k * size_x])
          return false;
    }
  }
  return true;
}


function add_item(x, y, type, szcell = -1, data="") {
  szcell = szcell == -1 ? get_freecell(x, y) : szcell;
  if(szcell == -1) {
    return;
  }

  if(szcell == -2) {
    $("#" + type).html("<div id='item-" + item + "'><img src='img/items/" + type + ".png' width='100%'></div>");
    $("#item-" + item).draggable({
      start: function(event, ui){
        $(this).addClass("obj")
          .css("width", x * size_cell + x - 1)
          .css("height", y * size_cell + x - 1);
      }
    })
    .mousedown(function() {
      var pos = $(this).offset();
      $(this).css("position", "absolute");
      $(this).offset(pos);
    })
    .mouseup(function() {
      if(!cell) {
        var pos = $(this).offset();
        pos.left -= 8.5;
        $(this).css("position", "relative");
        $(this).offset(pos);
      }
    })
    .mousemove(function(e) {
      var pos = $("#cell").offset();
  
      if(pos.top < e.pageY && e.pageY < pos.top + 20
      && pos.left < e.pageX && e.pageX < pos.left + $("#cell").width())
      $("#cell").scrollTop($("#cell").scrollTop() - 5);
  
      if(pos.top + $("#cell").height() - 20 < e.pageY && e.pageY < pos.top + $("#cell").height()
      && pos.left < e.pageX && e.pageX < pos.left + $("#cell").width())
      $("#cell").scrollTop($("#cell").scrollTop() + 5);
    });
  } else {

    var szItem = CreateItem("#items", item, type);
    szItem.css("width", x * size_cell + x - 1)
    .css("height", y * size_cell + y - 1)
    .offset($("#" + szcell).offset());

    for(var i = 0; i < x; i++) {
      for(var k = 0; k < y; k++) {
        cells[szcell + i + k * size_x] = true;
      }
    }
  }
  items[item] = new Item(type, szcell, x, y, 1, data);
  mp.trigger("client.inventory.update", JSON.stringify(items), JSON.stringify(cells));
  item++;
}

function CreateItem(dom, item, type){
  $(dom).append('<div class="obj" id="item-' + item + '""><img src="img/items/' + type + '.png" width="100%"></div>');
  var itemDOM = $("#item-" + item);

  if(type < 0) {
    itemDOM.addClass("dress");
  }

  itemDOM.mousedown(function() {
    var pos = $(this).offset();
    $(this).css("position", "absolute");
    $(this).offset(pos);
    
    for(var i = 1, elem; $("#items > .obj:nth-child(" + i + ")").length; i++) {
      if($(this).attr("id").substr(5) == $("#items > .obj:nth-child(" + i + ")").attr("id").substr(5)) {
        elem = true;
        continue;
      }
      if(elem) {
        var offset = $("#items > .obj:nth-child(" + i + ")").offset();
        offset.top += size_cell * items[Number($(this).attr("id").substr(5))].Size.y + items[Number($(this).attr("id").substr(5))].Size.y - 1;
        $("#items > .obj:nth-child(" + i + ")").offset(offset);
      }
    }
  })
  .mouseup(function() {
    if(!cell) {
      var pos = $(this).offset();
      pos.left -= 8.5;
      $(this).css("position", "relative");
      $(this).offset(pos);
    }
    if(!startdrag) {
      for(var i = 1, elem; $("#items > .obj:nth-child(" + i + ")").length; i++) {
        if($(this).attr("id").substr(5) == $("#items > .obj:nth-child(" + i + ")").attr("id").substr(5)) {
          elem = true;
          continue;
        }
        if(elem) {
          var offset = $("#items > .obj:nth-child(" + i + ")").offset();
          offset.top -= size_cell * items[Number($(this).attr("id").substr(5))].Size.y + items[Number($(this).attr("id").substr(5))].Size.y - 1;
          $("#items > .obj:nth-child(" + i + ")").offset(offset);
        }
      }
    }
  })
  .draggable({
    start: function( event, ui ) {
      for(var i = 0; i < items[Number($(this).attr("id").substr(5))].Size.x; i++) {
        for(var k = 0; k < items[Number($(this).attr("id").substr(5))].Size.y; k++) {
          cells[items[Number($(this).attr("id").substr(5))].Cell + i + k * size_x] = false;
        }
      }
      startdrag = true;
    },
    stop: function(event, ui) {
      for(var i = 1, elem; $("#items > .obj:nth-child(" + i + ")").length; i++) {
        if($(this).attr("id").substr(5) == $("#items > .obj:nth-child(" + i + ")").attr("id").substr(5)) {
          elem = true;
          continue;
        }
        if(elem) {
          var offset = $("#items > .obj:nth-child(" + i + ")").offset();
          offset.top -= size_cell * items[Number($(this).attr("id").substr(5))].Size.y + items[Number($(this).attr("id").substr(5))].Size.y - 1;
          $("#items > .obj:nth-child(" + i + ")").offset(offset);
        }
      }
      if(!cell) {
        $(this).css("position", "relative")
          .offset($("#" + items[Number($(this).attr("id").substr(5))].Cell).offset());
        for(var i = 0; i < items[Number($(this).attr("id").substr(5))].Size.x; i++) {
          for(var k = 0; k < items[Number($(this).attr("id").substr(5))].Size.y; k++) {
            cells[items[Number($(this).attr("id").substr(5))].Cell + i + k * size_x] = true;
          }
        }
      }
      startdrag = false;
    },
    scroll: false
  })
  .mousemove(function(e) {
    var pos = $("#cell").offset();

    if(pos.top < e.pageY && e.pageY < pos.top + 20
    && pos.left < e.pageX && e.pageX < pos.left + $("#cell").width())
    $("#cell").scrollTop($("#cell").scrollTop() - 5);

    if(pos.top + $("#cell").height() - 20 < e.pageY && e.pageY < pos.top + $("#cell").height()
    && pos.left < e.pageX && e.pageX < pos.left + $("#cell").width())
    $("#cell").scrollTop($("#cell").scrollTop() + 5);
  });

  return itemDOM;
}

function get_freecell(x, y) {
  var free = false;
  for(var freecell = 0; freecell < size_x * size_y; freecell++) {
    for(var i = 0; i < x; i++) {
      for(var k = 0; k < y; k++) {
        free = false;
        if(freecell + i + k * size_x > size_x * size_y - 1) break;
        if(cells[freecell + i + k * size_x])
          break;
        free = true;
      }
      if(!free)
        break
    }
    if(x + freecell % size_x > size_x || freecell + (y - 1) * size_x > size_x * size_y)
      continue;
    if(free)
      return freecell;
  }
  return -1;
}

function OpenInventory() {
  $('#inventory').css('display', 'block');
  for(var i = 0; i < items.length; i++) {
    if($("#item-" + i).length && items[i].Cell != -2) {
      $("#item-" + i).offset($("#" + items[i].Cell).offset());
    }
  }
}