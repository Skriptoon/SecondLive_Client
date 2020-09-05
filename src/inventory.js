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
      <div className="inventory row">
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
                    <td><div className="equip-cell" id="top"></div></td>
                    <td><div className="equip-cell" id="leg"></div></td>
                  </tr>
                  <tr>
                    <td><div className="equip-cell" id="shoes"></div></td>
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
      elem2[i][k] = <td className="cell" key={k + i * size_x}><div className="cell-body" id={k + i * size_x}></div></td>;
      cells[k + i * size_x] = false;
    }
    elem[i] = <tr key={i}>{elem2[i]}</tr>;
  }
  return elem;
}

ReactDOM.render(<Inventory />, document.querySelector("#inventory"));

var cell;
var pos;
$( ".cell-body" ).droppable({
    drop: function( event, ui ) {
        var drag_coords = $(ui.draggable).offset();
        var drop_coords = $(this).offset();

        if(cell) return;

        setTimeout(() => {
        cell = false;
        }, 100)

        if($(ui.draggable).attr("data-size-x") == 1 && $(ui.draggable).attr("data-size-x") == 1) {
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

$(".equip").droppable({
  drop: function(event, ui) {
    if(cell) return;

    setTimeout(() => {
    cell = false;
    }, 100);

    cell = true;


  }
});

function push_cell(drag, drop) {
  if(check_cells($(drop).attr("id"), drag)) {
    $(drag).offset($(drop).offset());
    for(var i = 0; i < $(drag).attr("data-size-x"); i++) {
      for(var k = 0; k < $(drag).attr("data-size-y"); k++) {
        
        cells[Number($(drop).attr("id")) + i + k * size_x] = true;
        items[Number($(drag).attr("id").substr(5))].Cell = Number($(drop).attr("id"));
      }
    }
    cell = true;
    //mp.trigger("client.inventory.update", JSON.stringify(items), JSON.stringify(cells));
  }
  else {
    $(drag).offset($("#" + items[Number($(drag).attr("id").substr(5))].Cell).offset());
    for(var i = 0; i < $(drag).attr("data-size-x"); i++) {
      for(var k = 0; k < $(drag).attr("data-size-y"); k++) {
        cells[items[Number($(drag).attr("id").substr(5))].Cell + i + k * size_x] = true;
      }
    }
  }
}

function check_cells(id, drop) {
  if(Number($(drop).attr("data-size-x")) + Number(id) % size_x > size_x
  || Number(id) + ($(drop).attr("data-size-y") - 1) * size_x > size_x * size_y)
    return false;
  for(var i = 0; i < $(drop).attr("data-size-x"); i++) {
    for(var k = 0; k < $(drop).attr("data-size-y"); k++) {
      if(cells[Number(id) + i + k * size_x])
        return false;
    }
  }
  return true;
}

function add_item(x, y, type) {
  var szcell = get_freecell(x, y);
  console.log(szcell);
  if(szcell == -1) {
    return;
  }
  $("#cell").append('<div class="obj" id="item-' + item + '" data-size-x="' + x + '" data-size-y="' + y + '"><img src="img/items/' + type + '.png" width="100%"></div>');
  
  $("#item-" + item).css("width", x * size_cell + x - 1)
    .css("height", y * size_cell + y - 1)
    .draggable({
    start: function( event, ui ) {
      //pos = $(this).offset();
      for(var i = 0; i < $(this).attr("data-size-x"); i++) {
        for(var k = 0; k < $(this).attr("data-size-y"); k++) {
          cells[items[Number($(this).attr("id").substr(5))].Cell + i + k * size_x] = false;
        }
      }
    },
    stop: function(event, ui) {
      if(!cell) {
        $(this).offset($("#" + items[Number($(this).attr("id").substr(5))].Cell).offset());
        for(var i = 0; i < $(this).attr("data-size-x"); i++) {
          for(var k = 0; k < $(this).attr("data-size-y"); k++) {
            cells[items[Number($(this).attr("id").substr(5))].Cell + i + k * size_x] = true;
          }
        }
      }
    }
  })
  .offset($("#" + szcell).offset());
  for(var i = 0; i < x; i++) {
    for(var k = 0; k < y; k++) {
      cells[szcell + i + k * size_x] = true;
    }
  }
  items[item] = new Item(type, szcell, x, y);
  //mp.trigger("client.inventory.update", JSON.stringify(items), JSON.stringify(cells));
  item++;
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