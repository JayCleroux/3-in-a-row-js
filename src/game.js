(function() {
  
  const gridSizes = {
    '6x6': 'https://prog2700.onrender.com/threeinarow/6x6',
    '8x8': 'https://prog2700.onrender.com/threeinarow/8x8',
    '10x10': 'https://prog2700.onrender.com/threeinarow/10x10',
    '12x12': 'https://prog2700.onrender.com/threeinarow/12x12',
    '14x14': 'https://prog2700.onrender.com/threeinarow/14x14',
    'Random': 'https://prog2700.onrender.com/threeinarow/random',
  };

  const colors = ['gold', '#B366FF', 'white'];

  let api = 'https://prog2700.onrender.com/threeinarow/sample';
  let messageDiv;
  let gridData = null;
  let showIncorrectSquares = false;

  function fetchGrid(api) {
    fetch(api)
      .then(response => response.json())
      .then(json => {
        gridData = json;
        tableSize = json.rows.length
        renderGrid();
      }).catch(error => console.error(error));
  }

  function renderGrid() {
    const gameDiv = document.querySelector('#theGame');
    const table = document.createElement('table');
    const trArr = gridData.rows.map((row, i) => {
      const tdArr = row.map((square, j) => {
        const td = document.createElement('td');
        td.id = `square-${i}-${j}`;
        td.style.backgroundColor = colors[square.currentState];
        square.originalState = square.currentState;
        if (square.canToggle) {
          td.addEventListener('click', () => {
            if (square.canToggle) {
              square.currentState = (square.currentState + 1) % colors.length;
              td.style.backgroundColor = colors[square.currentState];
            }
          });
        }   
        return td;
      });
      const tr = document.createElement('tr');
      tr.append(...tdArr);
      return tr;
    });
    table.append(...trArr);
    gameDiv.appendChild(table);

    const checkButton = document.createElement('button');
    checkButton.innerHTML = 'Check Puzzle';
    checkButton.onclick = function() {
      checkGameState(gridData);
    };     

    const restartButton = document.createElement('button');
    restartButton.innerHTML = 'Restart';
    restartButton.onclick = function() {
      refreshDOM();
      fetchGrid(api);
    };   

    const checkbox = document.createElement('input');
    checkbox.id = "showIncorrectCheckbox"
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', function() {
      showIncorrectSquares = this.checked;
    });

    const checkboxLabel = document.createElement('label');
    checkboxLabel.setAttribute('for', 'showIncorrectCheckbox');
    checkboxLabel.innerText = 'Show incorrect squares';

    const select = document.createElement('select');
    const defaultOption = document.createElement('option');
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.textContent = 'Select size';
    select.appendChild(defaultOption);

    Object.entries(gridSizes).map(([size, value]) => {
      const option = document.createElement('option');
      option.value = value;
      option.text = size;
      select.appendChild(option);
    });

    select.onchange = function() {
      api = select.value;
      refreshDOM();
      fetchGrid(api);
    };
    
    messageDiv = document.createElement('div');
    document.body.appendChild(checkButton);
    document.body.appendChild(messageDiv);
    document.body.appendChild(select);
    document.body.appendChild(restartButton);
    document.body.appendChild(checkbox);
    document.body.appendChild(checkboxLabel);
  }

  function checkGameState(rows) {
    let allCorrect = true;
    let allCurrentOrCorrect = true;
    let message = '';
  
    rows.rows.map((row, i) => {
      return row.map((square, j) => {
        const td = document.getElementById(`square-${i}-${j}`);
        if (square.currentState !== square.correctState) {
          allCorrect = false;
        }
        if (square.currentState !== square.correctState && square.currentState !== square.originalState) {
          if (showIncorrectSquares) {
            td.style.border = '5px solid red';
          } else {
            td.style.border = '1px solid black';
          }
          allCurrentOrCorrect = false;
        } else {
          td.style.border = '1px solid black';
        }
        return square;
      });
    });
    
    if (allCorrect) {
      message = 'You did it!!';
    } else if (allCurrentOrCorrect) {
      message = 'Everything is okay'
    } else {
      message = 'Something is wrong';
    }
    messageDiv.innerHTML = message;
  }

  function refreshDOM() {

    const table = document.querySelector('table');

    table.remove();
    
    Array.from(document.querySelectorAll('button')).map(button => button.remove());

    Array.from(document.querySelectorAll('input[type="checkbox"]')).map(checkbox => checkbox.remove());

    Array.from(document.querySelectorAll('label')).map(label => label.remove());

    Array.from(document.querySelectorAll('select')).map(select => select.remove());

    messageDiv.remove();
    
  }

  fetchGrid(api);

})();
  

