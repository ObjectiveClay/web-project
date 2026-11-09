
const contactForm = document.getElementById("contact-form");
const messageInput = document.getElementById("contact-message");
const messageCounter = document.getElementById("message-counter");
const contactSuccess = document.getElementById("contact-success");

const MESSAGE_MIN_LENGTH = 10;
const MESSAGE_MAX_LENGTH = 500;

function getContactError(input) {
    const value = input.value.trim();

    switch (input.id) {
        case "contact-name":
            if (value === "") return "Please enter your name.";
            if (value.length < 2) return "Name must be at least 2 characters.";
            return "";

        case "contact-email":
            if (value === "") return "Please enter your email.";
            if (!isValidEmail(value)) return "Enter a valid email, for example name@mail.com.";
            return "";

        case "contact-topic":
            return value === "" ? "Please choose a topic." : "";

        case "contact-message":
            if (value === "") return "Please write a message.";
            if (value.length < MESSAGE_MIN_LENGTH) {
                return `Message must be at least ${MESSAGE_MIN_LENGTH} characters (now ${value.length}).`;
            }
            if (value.length > MESSAGE_MAX_LENGTH) {
                return `Message must be ${MESSAGE_MAX_LENGTH} characters or less.`;
            }
            return "";

        default:
            return "";
    }
}

function updateMessageCounter() {
    const length = messageInput.value.length;
    messageCounter.textContent = `${length} / ${MESSAGE_MAX_LENGTH}`;
    messageCounter.classList.toggle("over-limit", length > MESSAGE_MAX_LENGTH);
}

function handleContactInput(event) {
    if (event.target.classList.contains("invalid")) {
        validateField(event.target, getContactError);
    }
    if (event.target === messageInput) {
        updateMessageCounter();
    }
}

function handleContactFieldLeave(event) {
    const field = event.target;
    if (field.closest(".field") && field.value.trim() !== "") {
        validateField(field, getContactError);
    }
}

function handleContactSubmit(event) {
    event.preventDefault();
    $("#contact-success").hide();

    if (!validateForm(contactForm, getContactError)) {
        return;
    }

    const name = document.getElementById("contact-name").value.trim();
    const email = document.getElementById("contact-email").value.trim();
    const topicSelect = document.getElementById("contact-topic");
    const topic = topicSelect.options[topicSelect.selectedIndex].text;

    contactSuccess.textContent =
        `Thank you, ${name}! We received your message about "${topic}" and will reply to ${email}.`;

    $("#contact-success").removeClass("hidden").hide().fadeIn(400);

    contactForm.reset();
    updateMessageCounter();
}

document.addEventListener("DOMContentLoaded", () => {
    updateMessageCounter();

    contactForm.addEventListener("input", handleContactInput);
    contactForm.addEventListener("focusout", handleContactFieldLeave);
    contactForm.addEventListener("submit", handleContactSubmit);
});