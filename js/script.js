const loading = document.getElementById("loading");
const body = document.getElementById("body");
const root = document.querySelector(":root");

root.style.setProperty("--color", `#${((1<<24)*Math.random()|[0]).toString(16)}`);

window.onload = () => setTimeout(() => {
    loading.classList.add("disabled");
    body.classList.remove("disabled")
}, 1550);