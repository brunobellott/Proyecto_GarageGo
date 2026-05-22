function togglePassword(inputId) {

  const input =
    document.getElementById(inputId);

  input.type =
    input.type === "password"
      ? "text"
      : "password";
}

// PASSWORD
document
  .getElementById("togglePassword")
  .addEventListener("click", () => {

    togglePassword("password");

  });

// CONFIRM PASSWORD
document
  .getElementById("toggleConfirmPassword")
  .addEventListener("click", () => {

    togglePassword("confirmPassword");

  });
