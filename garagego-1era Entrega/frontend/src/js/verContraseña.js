function togglePassword(inputId, button) {

  const input =
    document.getElementById(inputId);

  if (!input) {
    return;
  }

  const mostrarPassword =
    input.type === "password";

  input.type =
    mostrarPassword
      ? "text"
      : "password";

  if (button) {
    button.classList.toggle("is-visible", mostrarPassword);
    button.setAttribute(
      "aria-label",
      mostrarPassword
        ? "Ocultar contraseña"
        : "Ver contraseña"
    );
  }
}

function prepararTogglePassword(buttonId, inputId) {
  const button =
    document.getElementById(buttonId);

  if (!button) {
    return;
  }

  button.setAttribute("aria-label", "Ver contraseña");
  button.addEventListener("click", () => {
    togglePassword(inputId, button);
  });
}

prepararTogglePassword("togglePassword", "password");
prepararTogglePassword("toggleConfirmPassword", "confirmPassword");
