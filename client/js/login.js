import { BASE_AUTH_URL } from "./URL.js";

window.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const inputFields = document.querySelectorAll(".form-control");
  const togglePassword = document.getElementById("togglePassword");
  const passwordField = document.getElementById("password");

  // Clear error message when user starts typing
  inputFields.forEach((field) => {
    field.addEventListener("input", () => {
      document.getElementById("error-message").style.display = "none";
    });
  });

  //Toggle visibility of the password
  togglePassword.addEventListener("click", () => {
    
    if (passwordField.type === "password") {
      passwordField.type = "text";
      togglePassword.classList.add("show");
  } else {
      passwordField.type = "password";
      togglePassword.classList.remove("show");
  }
});

  // Add submit event listener
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      try {
        const response = await loginUser(email, password);

        if (!response.error) {
          // Store user details and token in localStorage
          localStorage.setItem("token", response.token);
          localStorage.setItem("userId", response.data.id);
          localStorage.setItem("email", response.data.email);
          localStorage.setItem(
            "username",
            `${response.data.firstName} ${response.data.lastName}`
          );
          localStorage.setItem("isAdmin", response.data.isAdmin);

          if (response.data.isAdmin) {
            window.location.href = "../client/admin.html"; // Admin page
          } else {
            window.location.href = "../client/home.html"; // User page
          }
        } else {
          displayError(response.message);
        }
      } catch (error) {
        displayError("An error occurred during login. Please try again.");
        console.error("Login error:", error);
      }
    });
  } else {
    console.error("Login form not found");
  }
});

// Helper function to log in the user
async function loginUser(email, password) {
  try {
    const response = await fetch(`${BASE_AUTH_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    // Parse the response
    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      return {
        error: true,
        message: data.message || "Invalid login credentials.",
      };
    }
  } catch (error) {
    return { error: true, message: error.message };
  }
}

// Helper function to display error messages
function displayError(message) {
  const errorMessage = document.getElementById("error-message");
  errorMessage.style.display = "block";
  errorMessage.innerHTML = message;
}
