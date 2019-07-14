function solve(){

  // var colFilledHeights = new Array(boardSize).fill(0);
  // var availableBlocks = new Array(blockCount).fill(true);

  var blocksPlaced = 0;
  var solution = [];
  var blocks = window.blocks;
  var blockCount = blocks.length;
  var boardSize = window.boardSize;

  //var solutionCount = 0;
  //var currentConfig = [];
  //var solutions = [];

  //placeBlock(availableBlocks, colFilledHeights, 0, 0, 56, 56, 0, 0);

  //Place a block in the top-leftmost empty slot (recursive function)
  (function placeBlock(availableBlocks, colFilledHeights, insCol, insRow, emptyWidth, emptyHeight, lastBlockPlaced,depth) {
    //if(blocksPlaced > 20) return false;/////////////////////

    for (var i = 0; i < blockCount; i++) {
      if(!availableBlocks[i]) continue;//don't try a block unless it is available..
      var block = blocks[i];


      do {
        if(!blockFits(block)) {
          //console.log("block "+(i)+(block.rot ? " (rotated)" : " (not rotated)")+" doesn't fit...");
          continue;
        }

        //add to current board configuration
        //currentConfig[depth] = block.rot ? i + 0.5 : i;

        //calculate new properties
        var newAvailableBlocks = availableBlocks.slice();//Object.create(availableBlocks);
        newAvailableBlocks[i] = false;

        var newColFilledHeights = colFilledHeights.slice();//Object.create(colFilledHeights);
        for(var j = insCol; j < insCol + block.width; j++)
          newColFilledHeights[j] += block.height;

        var newInsCol, newInsRow, newEmptyWidth, newEmptyHeight;
        if(block.width < emptyWidth) {
          newInsCol = insCol + block.width;
          newInsRow = insRow;
          newEmptyWidth = emptyWidth - block.width;
          newEmptyHeight = emptyHeight
        } else { //search the board...

          //find first empty space (min col height)
          newInsRow = newColFilledHeights[0]; newInsCol = 0;
          for(var k = 1; k < boardSize; k++) {//check each column
            if (newColFilledHeights[k] < newInsRow) {
              newInsRow = newColFilledHeights[k];
              newInsCol = k;
            }
          }

          //////////
          if(newInsRow == boardSize) {// S O L V E D
            solution.push({block: i, top: insRow, left:insCol})
            return true
            //solutionCount++;
            //solutions.push(currentConfig.slice());
          }
          //////////

          //calculate width of empty space
          newEmptyWidth = 1;
          for(var l = newInsCol + 1; l < boardSize; l++){
            if(newColFilledHeights[l] > newInsRow)
              break;
            newEmptyWidth++;
          }
          //calculate height of empty space
          newEmptyHeight = boardSize - newInsRow;
        }

        blocksPlaced++;



        if(placeBlock(newAvailableBlocks, newColFilledHeights, newInsCol, newInsRow, newEmptyWidth, newEmptyHeight, i, depth+1)) {
          console.log(
            "placed block "+(i)+(block.rot ? " (rotated)" : "")+" at ("+insCol+", "+insRow+")\n"
           +"Filled column heights: "+newColFilledHeights+"\n"
           +"Available blocks: "+newAvailableBlocks+"\n"
           +"Next insertion point: ("+newInsCol+", "+newInsRow+")\n"
           +"Empty width: "+newEmptyWidth+"\n"
           +"Empty height: "+newEmptyHeight+"\n"
           +"Blocks placed: "+blocksPlaced+"\n"
           +"------------------------"
          );
          solution.push({block: i, top: insRow, left:insCol})
          return true;
        }


      } while (block.rotate());


    }//master block loop
    //console.log("No block fits; backtracking... (remove block "+lastBlockPlaced+")");

    function blockFits(block){
      var heightDiff = emptyHeight - block.height;
      var widthDiff = emptyWidth - block.width;
      if (
        heightDiff < 0 ||
        widthDiff < 0 ||
        (widthDiff < 4 && widthDiff != 0) ||
        (heightDiff < 4 && heightDiff != 0)
        || widthDiff == 5 ||
        heightDiff == 5 ||
        widthDiff == 8 ||
        heightDiff == 8 ||
        widthDiff == 9 ||
        heightDiff == 9

      ) return false;

      return true;
    }



  }(new Array(blockCount).fill(true), new Array(boardSize).fill(0), 0, 0, boardSize, boardSize, 0, 0));//placeBlocks()

  // console.log("# of solutions: ",solutionCount);
  // console.log("Solutions: ",solutions);

  return solution;
}
