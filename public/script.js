const alertMassage = window.location.search.split("&");
const alertElement = document.createElement("div");
const parent = document.getElementById("parent");

console.log(parent);
alertElement.classList.add("alert", "alert-dismissible", "fade", "show");
// check for any error
if (!(alertMassage[0] === "")) {
    if (alertMassage[0] === "?alert=success") {
        alertElement.classList.add("alert-success");
        const context = `<strong>${
            alertMassage[1].split("=")[1]
        }</strong><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button> `;
        alertElement.innerHTML = context;
    } else if (alertMassage[0] === "?alert=warning") {
        alertElement.classList.add("alert-warning");
        const context = `<strong>${
            alertMassage[1].split("=")[1]
        }</strong><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button> `;
        alertElement.innerHTML = context;
    }
    parent.prepend(alertElement);
}

