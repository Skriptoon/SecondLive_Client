'use strict';

const size_x = 5;
const size_y = 5;
$("#root").append('<div class="inventory">\
<div class="head">\
    <h4>Инвентарь</h4>\
</div>\
<div class="cells">\
    <table class="table-bordered">');
for(let i = 0; i < size_x; i++) {
  $("#root").append('<tr>');
  for(var k = 0; k < size_y; k++) {
    $("#root").append('<td class="cell"><div class="cell-body"></div></td>');
  }
  $("#root").append('</tr>');
}
/*
class Inventory extends React.Component {

  render() {
    var elem;
    for(let i = 0; i < size_x; i++){
      elem = <div><div class="cell-body"></div><div class="cell-body"></div></div>;
    }
    return elem;
  }
}

let domContainer = document.querySelector('#root');
ReactDOM.render(<Inventory />, domContainer);*/