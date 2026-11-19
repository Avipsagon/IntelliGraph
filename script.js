// Theme toggle (light / dark) with saved preference
const themeToggle = document.getElementById("themeToggle");

function updateToggleLabel() {
    const isDark = document.body.classList.contains("dark-theme");
    themeToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
}

themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-theme");
    updateToggleLabel();
    try {
        const theme = document.body.classList.contains("dark-theme") ? "dark" : "light";
        localStorage.setItem("ig-theme", theme);
    } catch (e) {}
});

updateToggleLabel();