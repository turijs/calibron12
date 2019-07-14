var scale = 8, recoupLeft, recoupTop, draggingStarted = false;//to help counteract rotating
var boardSize = 56;


function Block(width, height) {
  this._width = width;
  this._height = height;
  this.rot = false;
  this.id = Block.prototype.i++;
}
Block.prototype.i = 0;
Block.prototype.rotate = function() {
  this.rot = !this.rot;
  return this.rot;
}
Object.defineProperty(Block.prototype, 'width', {
  get: function(){ return this.rot ? this._height : this._width; }
});
Object.defineProperty(Block.prototype, 'height', {
  get: function(){ return this.rot ? this._width : this._height; }
});
////////////////////////////////////////////////////////////////////


window.blocks = [
  new Block(10,7),
  new Block(21,18),
  new Block(32,10),
  new Block(14,4),
  new Block(28,7),
  new Block(28,6),
  new Block(21,14),
  new Block(21,18),
  new Block(28,14),
  new Block(32,11),
  new Block(21,14),
  new Block(17,14)
];

// window.blocks = [
//   new Block(10,7),
//   new Block(21,18),
//   new Block(32,10),
//   new Block(7,4),
//   new Block(7,4),
//   new Block(28,7),
//   new Block(28,6),
//   new Block(21,14),
//   new Block(21,18),
//   new Block(28,14),
//   new Block(32,11),
//   new Block(21,14),
//   new Block(17,14)
// ];

$(document).ready(function(){
  window.$container = $('#container'),
  window.$board = $('#board');
  //Scale the board
  $board.css({
    "width": (boardSize*scale)+'px',
    "height": (boardSize*scale)+'px'
  });

  addBlocks(blocks);

  //setup dragging
  $('.block').draggable({
    //containment: "parent",
    stack: '.block',

    drag: function(e, ui) {
        // if(!draggingStarted) {
        //   console.log('started',ui);
        //   var left = parseInt($(this).css('left'),10);
        //   left = isNaN(left) ? 0 : left;
        //   var top = parseInt($(this).css('top'),10);
        //   top = isNaN(top) ? 0 : top;
        //   recoupLeft = left - ui.originalPosition.left;
        //   recoupTop = top - ui.originalPosition.top;
        //   draggingStarted = true;
        // }
        ui.position.left = Math.floor(ui.position.left / scale) * scale;
        ui.position.top = Math.floor(ui.position.top / scale) * scale;

        ui.position.left += recoupLeft;
        ui.position.top += recoupTop;
      }
  });





  $('.block').on('dragstart', function (event, ui) {
    console.log('started',ui,$(this).position());
    var left = parseInt($(this).css('left'),10);
    left = isNaN(left) ? 0 : left;
    var top = parseInt($(this).css('top'),10);
    top = isNaN(top) ? 0 : top;
    recoupLeft = left - ui.position.left;
    recoupTop = top - ui.position.top;
     draggingStarted = false;
  });

//rotation by pressing "r"
$(document).keydown(function(e){
  if(e.which == 82){
    var $target = $('.ui-draggable-dragging');
    var trans = $target.css('transform');
    //alert(trans);
    $target.css('transform',trans == 'matrix(1, 0, 0, 1, 0, 0)' ? 'rotate(-90deg)' : 'rotate(0deg)');

    //recalculating for rotations?
    var block = blocks[$target.attr('id')];
    if((block.width + block.height) % 2) {
      if(trans == 'matrix(1, 0, 0, 1, 0, 0)') {
        recoupTop += scale/2;
        recoupLeft += scale/2;

      } else {
        recoupTop -= scale/2;
        recoupLeft -= scale/2;
      }
    }
  }
});

$('#solve').click(function(){
  var solution = solve();

  for(var i = 0; i < solution.length; i++) {
    var cur = solution[i];
    moveBlock(cur.block,cur.top,cur.left);
  }

  console.log(solution);
})



});//document.ready

$(window).load(function(){
  setTimeout(function(){
    alert("Press r while dragging to rotate pieces");
  },1000);
});


/////////////////////////////////////////////////////////////////////
function addBlocks(blocks) {
  blocks.forEach(addBlock);

  //make abs positioned
  $('.block').css('left',function(){
    return $(this).position().left;
  }).css('top',function(){
    return $(this).position().top;
  }).css('position','absolute');
}
function addBlock(block) {
  $container.append(
    '<div class="block" id="'+block.id+'" style="width:'+(block._width*scale)+'px;height:'+(block._height*scale)+'px;">'
      +'<span>'+block.id+': '+block.width+'x'+block.height+'</span>'
   +'</div>'
  );
}

function moveBlock(blockNum, top, left) {
  var block = blocks[blockNum];
  var width = block._width;
  var height = block._height;

  if (block.rot) {
    top = top + (width-height)/2;
    left = left - (width-height)/2;
  }
  top *= scale;
  left *= scale;

  $('#'+blockNum).css({
    'transform': block.rot ? 'rotate(-90deg)' : 'rotate(0deg)',
    'left': left,
    'top': top
  });
}
