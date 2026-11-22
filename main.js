/* Optical Lab — accessible interactions and form helpers.
   Set LAB_CONTACT_EMAIL to the laboratory's verified inbox before publishing. */
"use strict";

const LAB_CONTACT_EMAIL = "opticallab@sau.int"; // Replace if this is not the lab's official address.

function openDialog(dialog) {
    if (!dialog) return;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
}
function closeDialog(dialog) {
    if (!dialog) return;
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
}

document.addEventListener("click", (event) => {
    const opener = event.target.closest("[data-open-dialog]");
    if (opener) openDialog(document.getElementById(opener.dataset.openDialog));

    const closer = event.target.closest("[data-close-dialog]");
    if (closer) closeDialog(closer.closest("dialog"));

    const emailButton = event.target.closest("[data-email-contact]");
    if (emailButton) {
        const card = emailButton.closest(".person-card");
        const name = card?.querySelector("h3")?.textContent.trim() || "Lab member";
        const role = card?.querySelector(".person-role")?.textContent.trim() || "Optical Lab community";
        const content = document.getElementById("profile-dialog-content");
        const title = document.getElementById("profile-dialog-title");
        if (title) title.textContent = "Contact " + name;
        if (content) content.innerHTML =
            `<p><strong>${escapeHTML(name)}</strong></p>
             <p>${escapeHTML(role)}</p>
             <p>Individual email addresses are not published in this project. Please use the official lab contact form to send your enquiry.</p>
             <p><a class="solid-btn" href="contact.html">Go to Contact Page</a></p>`;
        openDialog(document.getElementById("profile-dialog"));
    }

    const profileButton = event.target.closest("[data-profile]");
    if (profileButton) {
        const content = document.getElementById("profile-dialog-content");
        const title = document.getElementById("profile-dialog-title");
        if (profileButton.dataset.profile === "principal-investigator") {
            const pi = document.querySelector(".pi-card");
            const name = pi?.querySelector("h2")?.textContent.trim() || "Principal Investigator";
            const role = pi?.querySelector(".pi-role")?.textContent.trim() || "";
            const dept = pi?.querySelector(".pi-dept")?.textContent.trim() || "";
            if (title) title.textContent = "Principal Investigator — Profile";
            if (content) content.innerHTML =
                `<p><strong>${escapeHTML(name)}</strong></p>
                 <p>${escapeHTML(role)}</p><p>${escapeHTML(dept)}</p>
                 <p>The profile description on this website is currently a placeholder. Add the faculty member's verified biography and research interests before publishing.</p>
                 <h3 style="color:#22d3ee;margin:18px 0 8px">Related publications listed on this website</h3>
                 <ul>
                    <li>High-Speed Optical Data Transmission Using Wavelength Division Multiplexing (sample entry)</li>
                    <li>Non-Invasive Optical Imaging Techniques for Biological Samples (sample entry)</li>
                    <li>Design of Low-Loss Optical Fiber Links for Campus Networks (sample entry)</li>
                 </ul>
                 <p class="form-note">Publication titles currently shown on the website are sample content and must be verified.</p>`;
        } else {
            const card = profileButton.closest(".person-card");
            const name = card?.querySelector("h3")?.textContent.trim() || "Lab member";
            const role = card?.querySelector(".person-role")?.textContent.trim() || "";
            const detail = card?.querySelector(".person-info p")?.textContent.trim() || "";
            if (title) title.textContent = name + " — Profile";
            if (content) content.innerHTML =
                `<p><strong>${escapeHTML(name)}</strong></p>
                 <p>${escapeHTML(role)}</p><p>${escapeHTML(detail)}</p>
                 <p>Additional biography, research interests and links can be added when verified details are available.</p>`;
        }
        openDialog(document.getElementById("profile-dialog"));
    }
});

document.querySelectorAll("dialog.interaction-dialog").forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) closeDialog(dialog);
    });
});

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
}

document.querySelectorAll("[data-mail-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;

        const data = new FormData(form);
        const lines = [];
        for (const [key, value] of data.entries()) lines.push(`${key}: ${value}`);
        const subject = form.dataset.subjectPrefix || "Optical Lab Enquiry";
        const recipient = LAB_CONTACT_EMAIL.trim();

        if (!recipient || recipient.includes("REPLACE_WITH")) {
            const status = form.querySelector(".form-status") || form.parentElement.querySelector(".form-status");
            if (status) {
                status.textContent = "The form is valid, but the laboratory email address has not been configured. Please contact the site administrator.";
                status.classList.add("is-visible");
            }
            return;
        }

        const mailto = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n\n"))}`;
        window.location.href = mailto;
        const status = form.querySelector(".form-status") || form.parentElement.querySelector(".form-status");
        if (status) {
            status.textContent = "Your email app should open with this request prepared. Review the details and press Send in your email app to submit it.";
            status.classList.add("is-visible");
        }
    });
});
