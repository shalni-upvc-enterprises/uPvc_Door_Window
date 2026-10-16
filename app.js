let data = JSON.parse(localStorage.getItem("shalniData") || "null") || DEFAULT_DATA;

let selected = null;


// ===============================
// OLD DATA FIX / DEFAULT SETTINGS
// ===============================

if (!data.settings) {
    data.settings = {};
}

if (!data.settings.businessName) {
    data.settings.businessName = "Shalni uPVC Enterprises";
}

if (!data.settings.phone) {
    data.settings.phone = data.settings.whatsapp || "8210580737";
}

if (!data.settings.inquiry) {
    data.settings.inquiry = data.settings.whatsapp || "8210580737";
}

if (!data.settings.whatsapp) {
    data.settings.whatsapp = data.settings.inquiry;
}

if (!data.settings.logo) {
    data.settings.logo = "images/shop-logo.png";
}


// ===============================
// SAVE DATA
// ===============================

function save() {
    localStorage.setItem("shalniData", JSON.stringify(data));
}


// ===============================
// WHATSAPP NUMBER
// ===============================

function getWhatsAppNumber() {

    return (
        data.settings.inquiry ||
        data.settings.whatsapp ||
        "8210580737"
    ).replace(/\D/g, "");
}


function wa() {

    return "https://wa.me/91" + getWhatsAppNumber();

}


// ===============================
// WEBSITE RENDER
// ===============================

function render() {

    document.getElementById("brand").textContent =
        data.settings.businessName;

    document.getElementById("logo").src =
        data.settings.logo || "images/shop-logo.png";

    document.getElementById("heroEyebrow").textContent =
        data.settings.heroEyebrow;

    document.getElementById("heroTitle").textContent =
        data.settings.heroTitle;

    document.getElementById("heroText").textContent =
        data.settings.heroText;

    document.getElementById("heroImage").src =
        data.settings.heroImage || "images/upvc-window.jpg";

    document.getElementById("contactName").textContent =
        data.settings.businessName;

    document.getElementById("contactAddress").textContent =
        data.settings.address;


    // CALL NUMBER

    const phoneLink =
        document.getElementById("phoneLink");

    if (phoneLink) {

        phoneLink.textContent =
            data.settings.phone;

        phoneLink.href =
            "tel:+91" +
            data.settings.phone.replace(/\D/g, "");

    }


    // ENQUIRY NUMBER

    const inquiryLink =
        document.getElementById("inquiryLink");

    if (inquiryLink) {

        inquiryLink.textContent =
            data.settings.inquiry;

        inquiryLink.href =
            "tel:+91" +
            data.settings.inquiry.replace(/\D/g, "");

    }


    // HERO WHATSAPP

    document.getElementById("heroWhatsApp").href =
        wa() +
        "?text=" +
        encodeURIComponent(
            "Hello " +
            data.settings.businessName +
            ", I want a door/window quotation."
        );


    // CONTACT WHATSAPP

    document.getElementById("contactWhatsApp").href =
        wa() +
        "?text=" +
        encodeURIComponent(
            "Hello " +
            data.settings.businessName
        );


    // CATEGORY FILTER

    const cats = [
        "All",
        ...new Set(
            data.products.map(
                product => product.cat
            )
        )
    ];


    document.getElementById("filters").innerHTML =
        cats.map(
            (category, index) => `

            <button
                class="filter-btn ${index === 0 ? "active" : ""}"
                onclick="filterProducts('${category}',this)"
            >
                ${category}
            </button>

        `
        ).join("");


    renderProducts("All");


    document.getElementById("year").textContent =
        new Date().getFullYear();

}


// ===============================
// PRODUCT DISPLAY
// ===============================

function renderProducts(category) {

    const products =
        data.products.filter(
            product =>
                category === "All" ||
                product.cat === category
        );


    document.getElementById("productGrid").innerHTML =
        products.map(product => `

        <article class="product-card">

            <div>

                ${
                    product.image

                    ?

                    `<img
                        src="${product.image}"
                        alt="${product.name}"
                    >`

                    :

                    `<div class="placeholder">
                        ${product.name.toUpperCase()}
                    </div>`
                }

            </div>


            <div class="product-body">

                <span class="tag">
                    ${product.cat}
                </span>


                <h3>
                    ${product.name}
                </h3>


                <p>
                    ${product.text}
                </p>


                <button
                    class="small-btn"
                    onclick="openQuote('${product.id}')"
                >
                    Select Product
                </button>

            </div>

        </article>

    `).join("");

}


// ===============================
// CATEGORY FILTER
// ===============================

function filterProducts(category, button) {

    document
        .querySelectorAll(".filter-btn")
        .forEach(
            btn =>
                btn.classList.remove("active")
        );


    button.classList.add("active");


    renderProducts(category);

}


// ===============================
// OPEN QUOTATION
// ===============================

function openQuote(id) {

    selected =
        data.products.find(
            product =>
                product.id === id
        );


    if (!selected) {
        return;
    }


    document.getElementById("modalProduct").textContent =
        selected.name;


    document.getElementById("qWidth").value = 4;

    document.getElementById("qHeight").value = 5;

    document.getElementById("qQty").value = 1;


    document
        .getElementById("quoteModal")
        .classList.add("show");


    calculateEstimate();

}


// ===============================
// CLOSE QUOTATION
// ===============================

function closeQuote() {

    document
        .getElementById("quoteModal")
        .classList.remove("show");

}


// ===============================
// ⭐ FIXED ESTIMATE CALCULATOR
// ===============================

function calculateEstimate() {

    if (!selected) {
        return;
    }


    const width =
        parseFloat(
            document.getElementById("qWidth").value
        ) || 0;


    const height =
        parseFloat(
            document.getElementById("qHeight").value
        ) || 0;


    const quantity =
        parseInt(
            document.getElementById("qQty").value
        ) || 1;


    // ADMIN PANEL RATE

    const rate =
        parseFloat(selected.rate) || 0;


    // AREA OF ONE PRODUCT

    const singleArea =
        width * height;


    // TOTAL AREA

    const totalArea =
        singleArea * quantity;


    // TOTAL PRICE

    const totalPrice =
        totalArea * rate;


    // SHOW AREA

    document.getElementById("qArea").textContent =

        singleArea.toFixed(2) +
        " sq.ft. / item (" +
        totalArea.toFixed(2) +
        " total)";


    // SHOW PRICE

    if (rate > 0) {

        document.getElementById("qPrice").textContent =

            "₹" +
            totalPrice.toLocaleString("en-IN") +
            " approx.";

    }

    else {

        document.getElementById("qPrice").textContent =
            "Rate not set";

    }

}


// ===============================
// WHATSAPP QUOTATION
// ===============================

function sendQuote() {

    if (!selected) {
        return;
    }


    const width =
        parseFloat(
            document.getElementById("qWidth").value
        ) || 0;


    const height =
        parseFloat(
            document.getElementById("qHeight").value
        ) || 0;


    const quantity =
        parseInt(
            document.getElementById("qQty").value
        ) || 1;


    const rate =
        parseFloat(selected.rate) || 0;


    const singleArea =
        width * height;


    const totalArea =
        singleArea * quantity;


    const totalPrice =
        totalArea * rate;


    let message =

        "Hello " +
        data.settings.businessName +
        ",\n\n" +

        "Product: " +
        selected.name +
        "\n" +

        "Size: " +
        width +
        " ft × " +
        height +
        " ft\n" +

        "Area: " +
        singleArea.toFixed(2) +
        " sq.ft. / item\n" +

        "Quantity: " +
        quantity +
        "\n" +

        "Total Area: " +
        totalArea.toFixed(2) +
        " sq.ft.\n";


    if (rate > 0) {

        message +=

            "Rate: ₹" +
            rate.toLocaleString("en-IN") +
            "/sq.ft.\n" +

            "Estimated Amount: ₹" +
            totalPrice.toLocaleString("en-IN") +
            "\n";

    }


    message +=

        "\nPlease confirm the final quotation.";


    const whatsappURL =

        wa() +
        "?text=" +
        encodeURIComponent(message);


    window.open(
        whatsappURL,
        "_blank"
    );

}


// ===============================
// ⭐ LIVE PRICE UPDATE
// ===============================

document
    .getElementById("qWidth")
    .addEventListener(
        "input",
        calculateEstimate
    );


document
    .getElementById("qHeight")
    .addEventListener(
        "input",
        calculateEstimate
    );


document
    .getElementById("qQty")
    .addEventListener(
        "input",
        calculateEstimate
    );


// ===============================
// MOBILE MENU
// ===============================

function toggleMenu() {

    document
        .getElementById("navMenu")
        .classList.toggle("open");

}


// ===============================
// START WEBSITE
// ===============================

render();
