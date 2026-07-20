// ========================================
// EmailJS Configuration
// Mouad.Dev Portfolio
// ========================================

emailjs.init({
    publicKey: "uc-w7A9YTvK8cVZRt"
});

const form = document.getElementById("contact-form");
const status = document.getElementById("status");

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const button = form.querySelector("button");

    button.disabled = true;
    button.innerHTML = "Sending...";

    status.style.color = "#00D4FF";
    status.innerHTML = "Sending your message...";

    try {

        // إرسال البريد
        await emailjs.sendForm(
            "service_ssr7fxw",
            "template_gxmzg8v",
            form
        );

        // حفظ الرسالة في Firestore
        await db.collection("messages").add({

            name: form.name.value,

            email: form.email.value,

            subject: form.subject.value,

            message: form.message.value,

            createdAt: firebase.firestore.FieldValue.serverTimestamp()

        });

        status.style.color = "#00FF88";
        status.innerHTML = "✅ Message sent successfully!";
        setTimeout(()=>{

status.innerHTML="";

},5000);

        form.reset();

    } catch (error) {

        console.error(error);

        status.style.color = "#ff4d4d";
        status.innerHTML = "❌ Failed to send message.";

    }

    button.disabled = false;
    button.innerHTML = "Send Message 🚀";

});