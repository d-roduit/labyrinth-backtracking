import { Grid } from "./Grid";
import { Position } from "./Position";

const matrix: number[][] = [
    [-1, -1, -1, -1, -1, -1, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, 1, 7, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, 3, 2, 6, 10, 12, 14, 16, 4, 8, 10, 12, -1, -1, -1, -1, -1, -1],
    [-1, -1, 4, 1, 5, 9, 11, 13, 15, 19, 21, 13, 15, 2, 5, -1, -1, -1, -1, -1],
    [-1, -1, 5, 4, 8, 12, 12, 16, 14, 16, 16, 18, 4, 7, 10, 12, -1, -1, -1, -1],
    [-1, -1, 2, 7, 7, 11, 15, 17, 19, 19, 21, 23, 9, 13, 15, 15, 18, -1, -1, -1],
    [-1, -1, 6, 2, 10, 12, 10, 14, 18, 22, 24, 26, 14, 18, 18, 20, 22, 24, -1, -1],
    [-1, -1, 9, 8, 13, 15, 13, 11, 15, 17, 27, 19, 21, 23, 19, 23, 23, 27, -1, -1],
    [-1, -1, 12, 11, 11, 12, 16, 18, 20, 20, 22, 24, 24, 26, 22, 24, 26, 28, -1, -1],
    [-1, -1, 15, 14, 16, 15, 17, 13, 17, 21, 25, 21, 25, 29, 25, 27, 27, 31, -1, -1],
    [-1, -1, 18, 22, 14, 18, 12, 16, 2, 6, 10, 24, 20, 24, 28, 30, 2, 4, -1, -1],
    [-1, -1, 21, 25, 25, 11, 15, 0, 3, 9, 15, 19, 23, 25, 3, 5, 7, 7, -1, -1],
    [-1, 20, 24, 28, 30, 32, 0, 4, 8, 12, 14, 16, 18, 4, 8, 12, 10, 12, 14, -1],
    [19, 23, 25, 29, 33, 0, 3, 7, 11, 13, 17, 11, 13, 15, 13, 17, 19, 21, 17, 19],
    [-1, 26, 28, 30, 34, 2, 6, 10, 12, 16, 14, 16, 18, 20, 20, 22, 18, 20, 22, -1],
    [-1, -1, 29, 33, 1, 5, 7, 11, 15, 17, 19, 19, 19, 23, 25, 25, 23, 25, -1, -1],
    [-1, -1, 32, 0, 4, 2, 4, 6, 18, 11, 13, 17, 22, 22, 28, 30, 28, 30, -1, -1],
    [-1, -1, -1, 3, 0, 3, 7, 9, 11, 13, 16, 21, 25, 27, 29, 33, 35, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, 14, 16, 20, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, 19, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
];


// Draw grid from matrix given
const htmlTable: HTMLElement = document.getElementById("grid");
const resolvedPathsDiv: HTMLElement = document.getElementById("resolvedPaths");
const searchedAreaDiv: HTMLElement = document.getElementById("searchedArea");
const ldsRingLoader: HTMLCollection = document.getElementsByClassName("ldsRingLoader");


const labyrinth: Grid = new Grid(matrix);
labyrinth.draw(htmlTable);

const play = () => {

labyrinth.resolvePaths(new Position(0, 6), 19)
    .then((resolvedPaths) => {

        // Remove loders
        while(ldsRingLoader[0]) {
            ldsRingLoader[0].parentNode.removeChild(ldsRingLoader[0]);
        }​


        console.log("Nb de chemins trouvés : " + resolvedPaths.length);

        // Create a button for each path found
        for (let i = 0; i < resolvedPaths.length; i++) {
            let button = document.createElement("button");
            button.textContent = "Path " + (i+1);
            button.id = i.toString();

            resolvedPathsDiv.appendChild(button);

            if (i < resolvedPaths.length - 1) {
                let br = document.createElement("br");
                resolvedPathsDiv.appendChild(br);
            }
        }

        resolvedPathsDiv.addEventListener("click", function(e: MouseEvent) {
            let event: Event = e || window.event;

            let element: HTMLElement = event.target as HTMLElement;

            if (element.tagName.toLowerCase() === "button") {
                const buttonID: number = Number(element.getAttribute("id"));

                if (!isNaN(buttonID)) {
                    if (buttonID >= 0 && buttonID <= resolvedPaths.length) {
                        labyrinth.paintPath(resolvedPaths[buttonID]);
                    }
                }
            }
        });


        // Create button for the searched area
        const searchedArea: Position[] = labyrinth.getSearchedArea();
        const searchedAreaButton: HTMLElement = document.createElement("button");
        searchedAreaButton.textContent = "Show";

        searchedAreaDiv.appendChild(searchedAreaButton);

        searchedAreaButton.addEventListener("click", function() {
            labyrinth.paintPath(searchedArea);
        });

    });

}

play();

const replayButton = document.getElementById("replayButton");
replayButton.addEventListener("click", () => {
    location.reload();
});
