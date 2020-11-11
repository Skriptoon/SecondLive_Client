'use strict';

const size_x = 5;
const size_y = 10;
const size_cell = 60;

var item = 0;
var items = [];
var cells = [];

var open = false;

class Size {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Item {
  constructor(id, cell, x, y, count = 1, stack = 1, data = "", Active = false) {
    this.ID = id;
    this.Cell = cell;
    this.Size = new Size(x, y);
    this.Count = count;
    this.Stack = stack
    this.Data = data;
    this.IsActive = Active;
  }
}

class Inventory extends React.Component {

  componentDidMount() {
    $(".cell-body").droppable({
      drop: function( event, ui ) {
          var drag_coords = $(ui.draggable).offset();
          var drop_coords = $(this).offset();
  
          if(cell) return;
  
          if(items[$(ui.draggable).attr("id").substr(5)].Size.x == 1 && items[$(ui.draggable).attr("id").substr(5)].Size.y == 1) {
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
  
        cell = true;

        equipItem = $(ui.draggable).attr("id").substr(5);
        mp.trigger("client.item.use", JSON.stringify(items[equipItem]));
      },
      accept:".dress"
    });
    
    $(".inventory").droppable({
      drop: function(event, ui) {
        if(!cell) {
          mp.trigger("client.item.act", 1, JSON.stringify(items[ui.draggable.attr("id").substr(5)]));
          $("item-" + ui.draggable.attr("id").substr(5)).unbind()
            .draggable("destroy");
          itemdrop = true
          setTimeout(() => {itemdrop = false}, 10)
          items[ui.draggable.attr("id").substr(5)] = null;
          if(open)
            ReactDOM.render(<Inventory />, document.querySelector("#inventory"))
        }
        else 
          cell = false
      }
    });
    
    $(document).mousedown(function(e){
      if($(e.target).attr("id") != "con-menu")
      ReactDOM.unmountComponentAtNode(document.querySelector(".menu"))
    });

    for(var i = 0; items[i] !== undefined; i++)  {
      if(items[i] === null || items[i].ID >= 0 || items[i].Cell != -2) continue;
      $("#item-" + i).draggable({
        start: function(event, ui){
          $(this).addClass("obj")
            .css("width", items[Number($(this).attr("id").substr(5))].Size.x * size_cell + items[Number($(this).attr("id").substr(5))].Size.x - 1)
            .css("height", items[Number($(this).attr("id").substr(5))].Size.y * size_cell + items[Number($(this).attr("id").substr(5))].Size.x - 1);
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
    }
  }

  componentDidUpdate() {
    for(var i = 0; items[i] !== undefined; i++)  {
      if(items[i] === null || items[i].ID >= 0 || items[i].Cell != -2) continue;
      $("#item-" + i).draggable({
        start: function(event, ui){
          $(this).addClass("obj")
            .css("width", items[Number($(this).attr("id").substr(5))].Size.x * size_cell + items[Number($(this).attr("id").substr(5))].Size.x - 1)
            .css("height", items[Number($(this).attr("id").substr(5))].Size.y * size_cell + items[Number($(this).attr("id").substr(5))].Size.x - 1);
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
    }
  }

  componentWillUnmount() {
    $(document).unbind();
    $(".inventory").droppable("destroy");
    $(".equip").droppable("destroy");
    $(".cell-body").droppable("destroy");
  }

  render() {
    return(
      <div className="container-fluid">
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
                      <td><div className="equip-cell" id="hat">{RenderDress(-1)}</div></td>
                      <td><div className="equip-cell" id="mask"></div></td>
                      <td><div className="equip-cell" id="glass"></div></td>
                      <td><div className="equip-cell" id="ears"></div></td>
                      <td><div className="equip-cell" id="-8"></div></td>
                      <td><div className="equip-cell" id="-4">{RenderDress(-4)}</div></td>
                    </tr>
                    <tr>
                      <td><div className="equip-cell" id="-6">{RenderDress(-6)}</div></td>
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
                <div id="items">
                  <RenderItem />
                </div>
                </div>
              </div>
            </div>
          </div>
          <div className="menu"></div>
        </div>
      </div>
    )
  }
}

class RenderItem extends React.Component {

  componentDidMount() {
    RenderItem_Event()
  }

  componentDidUpdate() {
    for(var i = 0; items[i] !== undefined; i++)  {
      if(items[i] === null) continue;
      var itemDOM = $("#item-" + i);
      itemDOM.unbind();
      if(itemDOM.draggable("instance") != undefined)
        itemDOM.draggable("destroy");
    }
    setTimeout(() => {RenderItem_Event()}, 10)
  }

  componentWillUnmount() {
    for(var i = 0; items[i] !== undefined; i++)  {
      if(items[i] === null) continue;
      var itemDOM = $("#item-" + i);
      itemDOM.unbind();
      if(itemDOM.draggable("instance") != undefined)
        itemDOM.draggable("destroy");
    }
  }

  render() {
    var elem = [];
    for(var i = 0; items[i] !== undefined; i++)  {
      if(items[i] === null || items[i].Cell == -2) continue;

      var style = {
        width: items[i].Size.x * size_cell + items[i].Size.x - 1,
        height: items[i].Size.y * size_cell + items[i].Size.y - 1
      }
      if(items[i].Count > 1)
        var szcount = <span className="count">{items[i].Count}</span>;
      elem[i] = <div key={i} className="obj" id={"item-" + i} style={style}><img src={'img/items/' + items[i].ID + '.png'} width="100%" />{szcount}</div>;
      szcount = undefined;
    }

    return elem;
  }
}

class Menu extends React.Component {
  constructor(props) {
    super(props)
    this.DropItem = this.DropItem.bind(this);
  }

  DropItem() {
    mp.trigger("client.item.act", 1, JSON.stringify(items[this.props.id]));
    items[this.props.id] = null;
    if(open)
      ReactDOM.render(<Inventory />, document.querySelector("#inventory"))
  }

  render() {
    this.style = {
      position: "absolute",
      top: this.props.y,
      left: this.props.x
    }

    return (<ul className="list-group" style={this.style}>
			<li className="list-group-item">
        Одеть
			</li>   
			<li className="list-group-item" id="con-menu" onClick={this.DropItem}>
        Выбросить
			</li>
		</ul>)
  }
}

function RenderCell() {
  var elem = [];
  var elem2 = [];
  for(let i = 0; i < size_y; i++) {
    elem2[i] = [];
    for(var k = 0; k < size_x; k++) {
      elem2[i][k] = <td className="cell" key={k + i * size_x}><div className="cell-body droppable" id={k + i * size_x}></div></td>;
      if(!cells[k + i * size_x])
        cells[k + i * size_x] = false;
    }
    elem[i] = <tr key={i}>{elem2[i]}</tr>;
  }
  return elem;
}

function RenderDress(id) {
  for(var i = 0; items[i] !== undefined; i++)  {
    if(items[i] === null || items[i].ID >= 0 || items[i].ID != id || items[i].Cell != -2) continue;

    var elem = <div className="dress" id={"item-" + i}><img src={'img/items/' + items[i].ID + '.png'} width='100%'/></div>;
    return elem;
  }
}

function RenderItem_Event() {
  for(var i = 0; items[i] !== undefined; i++)  {
    if(items[i] === null || items[i].Cell == -2) continue;
    console.log(i)
    var itemDOM = $("#item-" + i);

    if(items[i].ID < 0) {
      itemDOM.addClass("dress");
    }

    itemDOM.mousedown(function(e) {
      if(e.button == 0) {
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
      }
    })
    .contextmenu(function(e) {
      var x = 0; 
      var y = 0;
      var d = document;
      var w = window;

      if (d.attachEvent != null) { // Internet Explorer & Opera
          x = w.e.clientX + (d.documentElement.scrollLeft ? d.documentElement.scrollLeft : d.body.scrollLeft);
          y = w.e.clientY + (d.documentElement.scrollTop ? d.documentElement.scrollTop : d.body.scrollTop);
      } else if (!d.attachEvent && d.addEventListener) { // Gecko
          x = e.clientX + w.scrollX;
          y = e.clientY + w.scrollY;
      }

      ReactDOM.render(<Menu x={x} y={y} id={$(this).attr("id").substr(5)}/>, document.querySelector(".menu"))
      return false;
    })
    .mouseup(function(e) {
      if(!cell) {
        var pos = $(this).offset();
        $(this).css("position", "relative");
        $(this).offset(pos)
      }
      if(!startdrag && e.button == 0) {
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
        if(!cell && ! itemdrop) {
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
    })
    .css("position", "relative")
    .offset($("#" + items[i].Cell).offset())
  }
}

var cell;
var equipItem;
var startdrag;
var itemdrop;

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

    items[equipItem].Cell = -2;
    ReactDOM.render(<Inventory />, document.querySelector("#inventory"))
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
  if(check_cells($(drop).attr("id"), drag)) {
    if(items[Number($(drag).attr("id").substr(5))].Cell == -2) {
      let itemID = $(drag).attr("id").substr(5);

      mp.trigger("client.item.use", JSON.stringify(items[itemID]));
    }

    $(drag).css("position", "relative")
    .offset($(drop).offset());

    for(var i = 0; i < items[Number($(drag).attr("id").substr(5))].Size.x; i++) {
      for(var k = 0; k < items[Number($(drag).attr("id").substr(5))].Size.y; k++) {
        
        cells[Number($(drop).attr("id")) + i + k * size_x] = true;
      }
    }
    items[Number($(drag).attr("id").substr(5))].Cell = Number($(drop).attr("id"));
    ReactDOM.render(<Inventory />, document.querySelector("#inventory"))
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
  cell = true;
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


function add_item(x, y, type, count, stack, szcell = -1, data="") {
  szcell = szcell == -1 ? get_freecell(x, y) : szcell;
  if(szcell == -1) {
    return;
  }

  if(szcell == -2) {
    items[item] = new Item(type, szcell, x, y, count, stack, data);
    item++;
  } else {
    var szId;
    for(var i = 0; items[i] != undefined; i++) {
      if(items[i].ID == type)
        szId = i;
    }
    if(szId >= 0 && stack >= count + items[szId].Count) {
      items[szId].Count += count
    } else {
      for(var i = 0; i < x; i++) {
        for(var k = 0; k < y; k++) {
          cells[szcell + i + k * size_x] = true;
        }
      }
    
      items[item] = new Item(type, szcell, x, y, count, stack, data);
      
      item++;
    }
  }
  if(open)
  ReactDOM.render(<Inventory />, document.querySelector("#inventory"))
  mp.trigger("client.inventory.update", JSON.stringify(items), JSON.stringify(cells));
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

function OpenCloseInventory() {
  if(!open) {
    ReactDOM.render(<Inventory />, document.querySelector("#inventory"));
    open = true
  } else {
    ReactDOM.unmountComponentAtNode(document.querySelector("#inventory"));
    open = false
  }
}