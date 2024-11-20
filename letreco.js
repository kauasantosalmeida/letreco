let popupVisivel = false;


// Função para mostrar e esconder o pop-up
function mostrarPopup() {
    const popup = document.getElementById("popup");
    
    if (popupVisivel) {
        popup.style.display = "none";
        popupVisivel = false;
    } else {
        popup.style.display = "block";
        popupVisivel = true;
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const tiles = document.querySelector(".tile-container");
    const backspaceAndEnterRow = document.querySelector("#backspaceAndEnterRow");
    const keyboardFirstRow = document.querySelector("#keybordFirstRow");
    const keyboardSecondRow = document.querySelector("#keybordSecondRow");
    const keyboardThirdRow = document.querySelector("#keybordThirdRow");

    const keysFirstRow = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
    const keysSecondRow = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
    const keysThirdRow = ["Z", "X", "C", "V", "B", "N", "M"];

    const rows = 6;
    const columns = 5;
    let currentRow = 0;
    let currentColumn = 0;
    let letreco = "SABOR";
    let letrecoMap = {};
    for (let index = 0; index < letreco.length; index++) {
        letrecoMap[letreco[index]] = index;
    }
    const guesses = [];

    // Criação das linhas de tiles
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        guesses[rowIndex] = new Array(columns);
        const tileRow = document.createElement("div");
        tileRow.setAttribute("id", "row" + rowIndex);
        tileRow.setAttribute("class", "tile-row");

        for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
            const tileColumn = document.createElement("div");
            tileColumn.setAttribute("id", "row" + rowIndex + "column" + columnIndex);
            tileColumn.setAttribute("class", rowIndex === 0 ? "tile-column typing" : "tile-column disabled");
            tileRow.append(tileColumn);
            guesses[rowIndex][columnIndex] = "";
        }
        tiles.append(tileRow);
    }

    // Função para verificar o palpite
    const checGuess = () => {
        const guess = guesses[currentRow].join("");
        if (guess.length !== columns) return;

        const currentColumns = document.querySelectorAll(".typing");
        for (let index = 0; index < columns; index++) {
            const letter = guess[index];
            if (letrecoMap[letter] === undefined) {
                currentColumns[index].classList.add("wrong");
            } else if (letrecoMap[letter] === index) {
                currentColumns[index].classList.add("right");
            } else {
                currentColumns[index].classList.add("displace");
            }
        }

        if (guess === letreco) {
            window.alert("Palavra correta!");
        } else {
            if (currentRow === rows - 1) {
                window.alert("Errou!");
            } else {
                moveToNextRow();
            }
        }
    };

    const moveToNextRow = () => {
        const currentRowEl = document.querySelector("#row" + currentRow);
        const currentColumns = currentRowEl.querySelectorAll(".tile-column");
        for (let index = 0; index < currentColumns.length; index++) {
            currentColumns[index].classList.remove("typing");
            currentColumns[index].classList.add("disabled");
        }
        currentRow++;
        currentColumn = 0;

        const nextRowEl = document.querySelector("#row" + currentRow);
        const nextColumns = nextRowEl.querySelectorAll(".tile-column");
        for (let index = 0; index < nextColumns.length; index++) {
            nextColumns[index].classList.remove("disabled");
            nextColumns[index].classList.add("typing");
        }
    };

    // Função para manipular clique no teclado virtual
    const handleKeyboardClick = (key) => {
        if (currentColumn === columns) return;
        const currentTile = document.querySelector(`#row${currentRow}column${currentColumn}`);
        currentTile.textContent = key;
        guesses[currentRow][currentColumn] = key;
        currentColumn++;
    };

    // Criando o teclado
    const createKeybordRow = (keys, keyboardRow) => {
        keys.forEach((key) => {
            const buttonElement = document.createElement("button");
            buttonElement.textContent = key;
            buttonElement.addEventListener("click", () => handleKeyboardClick(key));
            keyboardRow.append(buttonElement);
        });
    };

    createKeybordRow(keysFirstRow, keyboardFirstRow);
    createKeybordRow(keysSecondRow, keyboardSecondRow);
    createKeybordRow(keysThirdRow, keyboardThirdRow);

    const handleBackspace = () => {
        if (currentColumn === 0) return;
        currentColumn--;
        const currentTile = document.querySelector(`#row${currentRow}column${currentColumn}`);
        currentTile.textContent = "";
        guesses[currentRow][currentColumn] = "";
    };

    const backspaceButton = document.createElement("button");
    backspaceButton.textContent = "⌫";
    backspaceButton.classList.add("backspace-button");  // Adiciona a classe
    backspaceButton.addEventListener("click", handleBackspace);
    backspaceAndEnterRow.append(backspaceButton);

    const enterButton = document.createElement("button");
    enterButton.textContent = "↲";
    enterButton.classList.add("enter-button");  // Adiciona a classe
    enterButton.addEventListener("click", checGuess);
    backspaceAndEnterRow.append(enterButton);


    // Agora dentro de DOMContentLoaded, para acessar as funções corretamente
    document.onkeydown = function (evt) {
        evt = evt || window.evt;
        if (evt.key === "Enter") {
            checGuess();
        } else if (evt.key === "Backspace") {
            handleBackspace();
        } else {
            handleKeyboardClick(evt.key.toUpperCase()); // Usando a função correta
        }
    };
});

function resetPage() {
    location.reload();  // Recarrega a página
}
