let freighter = {};

freighter.init = {};
freighter.custom = {};
freighter.events = {};

freighter.init.drawGrid = () => {
  var layoutContainer = document.querySelector('.layout');
  for (let i = 0; i < 21; i++) {
    for (let j = 0; j < 21; j++) {
      let layoutCell = `<div class="cell" id="cell-${j}-${i}"></div>`
      layoutContainer.innerHTML += layoutCell;
    }
  }
};

freighter.custom.onColorChange = (event) => {
  freighter.custom.chosenColor = event.target.style.backgroundColor;
}

freighter.events.onDragStart = (event) => {
  event.dataTransfer.setData('image/png', event.target.id);
  event.dataTransfer.effectAllowed = 'copy';
  event.dataTransfer.dropEffect = 'copy';

  event.currentTarget.style.backgroundColor = freighter.custom.chosenColor;
};

freighter.events.onDragOver = (event) => {
  event.preventDefault();
  event.currentTarget.style.background = freighter.custom.chosenColor;
  event.currentTarget.style.opacity = '0.5';
};

freighter.events.onDragLeave = (event) => {
  event.preventDefault();
  event.target.style.backgroundColor = '';
  event.target.style.opacity = '1';
};

freighter.events.onDragEnd = (event) => {
  event.currentTarget.style.background = '';
}

freighter.events.onDragExit = (event) => {
  event.currentTarget.style.background = '';
  event.currentTarget.style.opacity = '1';
}

freighter.events.onDrop = (event) => {
  event.preventDefault();
  const id = event.dataTransfer.getData('image/png');
  const draggableElementCopy = document.getElementById(id).cloneNode(true);

  const idCoords = event.target.id.replace('cell-', '');
  draggableElementCopy.id = `${id}_${idCoords}`;
  draggableElementCopy.setAttribute('data-rotate', '0');
  draggableElementCopy.addEventListener('click', freighter.events.onClick);
  draggableElementCopy.addEventListener('contextmenu', freighter.events.onContextMenu);
  draggableElementCopy.style.backgroundColor = freighter.custom.chosenColor;
  
  event.target.appendChild(draggableElementCopy);
  draggableElementCopy.style.opacity = '1';
  event.dataTransfer.clearData();
}

freighter.events.onClick = (event) => {
  let rotate = Number(event.target.dataset.rotate);
  rotate += 90;
  if (rotate >= 360) {
    rotate = 0;
  }
  event.target.dataset.rotate = rotate;
  event.target.style.transform = `rotate(${rotate}deg)`;ß
}

freighter.events.onContextMenu = (event) => {
  event.preventDefault();
  event.target.parentElement.style.backgroundColor = 'white';
  event.target.remove();
}

$(document).ready(function() {
  $('#color-picker').spectrum({
    type: "text",
    hideAfterPaletteSelect: "true"
  });
  freighter.custom.chosenColor = $('#color-picker').css('background-color');
  $('#color-picker').change(freighter.custom.onColorChange);
});

window.onload = function() {
  freighter.init.drawGrid();

  let pieces = document.querySelectorAll('.tile img');
  let layoutCells = document.querySelectorAll('.cell');

  pieces.forEach(piece => {
    piece.addEventListener('dragstart', freighter.events.onDragStart);
    piece.addEventListener('dragend', freighter.events.onDragEnd);
   
  });

  layoutCells.forEach(cell => {
    cell.addEventListener('dragover', freighter.events.onDragOver);
    cell.addEventListener('dragleave', freighter.events.onDragLeave);
    cell.addEventListener('dragexit', freighter.events.onDragExit);
    cell.addEventListener('drop', freighter.events.onDrop);
  });
}