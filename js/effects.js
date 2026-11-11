//Participant: Abilmansur
$(function () {
    const $nav = $("header nav");
    const $menuButton = $("<button>", {
        type: "button",
        class: "menu-toggle",
        text: "☰ Menu",
        "aria-expanded": "false"
    });

    $menuButton.insertBefore($nav);

    $menuButton.on("click", function () {
        const isOpen = $(this).attr("aria-expanded") === "true";
        $(this).attr("aria-expanded", String(!isOpen));
        $nav.stop(true, true).slideToggle(250);
    });

    $(window).on("resize", function () {
        if (window.innerWidth > 600) {
            $nav.removeAttr("style");
            $menuButton.attr("aria-expanded", "false");
        }
    });

    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    $(`nav a[href="${currentPage}"]`).not(".btn")
        .addClass("active-link")
        .attr("aria-current", "page");

    $("#faq .faq-question").on("click", function () {
        const $item = $(this).closest(".faq-item");
        const $answer = $(this).next(".faq-answer");
        const isOpen = $item.hasClass("open");

        const $otherItems = $item.siblings(".faq-item");
        $otherItems.removeClass("open");
        $otherItems.find(".faq-answer").slideUp(200);
        $otherItems.find(".faq-question").attr("aria-expanded", "false");

        $item.toggleClass("open", !isOpen);
        $(this).attr("aria-expanded", String(!isOpen));

        if (isOpen) {
            $answer.slideUp(200);
        } else {
            $answer.slideDown(200);
        }
    });
});