let currIndex = 0;
const information = document.getElementById("info_container");
const infoContent = document.getElementById("information_container");
let elementArray = Array.from(infoContent.querySelectorAll(".info"))

document.addEventListener("DOMContentLoaded", function () {
    showItem(currIndex);
});

document.getElementById("prev").addEventListener("click", function () {
    if (currIndex > 0) {
        hideItem(currIndex);
        currIndex -= 1;
        showItem(currIndex);
        document.getElementById("next").textContent = "Next";
    }
});

document.getElementById("next").addEventListener("click", function () {
    if (currIndex < elementArray.length - 1) {
        hideItem(currIndex);
        currIndex += 1;
        showItem(currIndex);
        if (currIndex == elementArray.length - 1) {
            document.getElementById("next").textContent = "Close";
        }
    } else {
        information.classList.add("hidden");
        localStorage.setItem("help", true);
        startGame();
    }
});

function hideItem(index) {
    elementArray[index].classList.add("hidden");
}

function showItem(index) {
    elementArray[index].classList.remove("hidden");
}