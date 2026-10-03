// ========================================
// Contact Form Handler (Resend via Vercel Function)
// Mouad.Dev Portfolio
// ========================================

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contact-form");
    const status = document.getElementById("status");

    if (!form) return;

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const button = form.querySelector('button[type="submit"]') || form.querySelector("button");
        const originalButtonText = button ? button.innerHTML : "Send Message 🚀";

        // Disable submit button while sending
        if (button) {
            button.disabled = true;
            button.innerHTML = "Sending... ⏳";
        }

        if (status) {
            status.style.color = "#00D4FF";
            status.textContent = "Sending your message...";
        }

        const formData = {
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            subject: form.subject.value.trim(),
            message: form.message.value.trim()
        };

        try {
            const response = await fetch("/api/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json().catch(() => ({}));

            if (response.ok && result.success) {
                // Success: "✅ Message sent successfully!" (green), reset form.
                if (status) {
                    status.style.color = "#00FF88";
                    status.textContent = "✅ Message sent successfully!";
                    setTimeout(() => {
                        status.textContent = "";
                    }, 5000);
                }

                form.reset();

                // Optional Firestore backup if available
                if (typeof db !== "undefined") {
                    try {
                        await db.collection("messages").add({
                            name: formData.name,
                            email: formData.email,
                            subject: formData.subject,
                            message: formData.message,
                            createdAt: firebase.firestore.FieldValue.serverTimestamp()
                        });
                    } catch (dbErr) {
                        console.warn("Firestore backup notice:", dbErr);
                    }
                }
            } else {
                throw new Error(result.error || `HTTP ${response.status}: Failed to send message`);
            }
        } catch (error) {
            // Error: "❌ Failed to send message." (red), log real error to console.
            console.error("Failed to send contact message:", error);

            if (status) {
                status.style.color = "#ff4d4d";
                status.textContent = "❌ Failed to send message.";
            }
        } finally {
            // Re-enable submit button
            if (button) {
                button.disabled = false;
                button.innerHTML = originalButtonText;
            }
        }
    });
});