const s1 = document.querySelector(".step1");
const serviceId = "service_1cklzlt";
const templateId = "template_4obe4gi";
const s2 = document.querySelector(".step2");
const s3 = document.querySelector(".step3");
const email = document.querySelector("#email");
const VEmail = document.querySelector("#verifyEmail");
const inputs = document.querySelectorAll("#otpForm input");
const nextBtn = document.querySelector(".nextBtn");
const verifyBtn = document.querySelector(".verifyBtn");

// Event listener on window when it loads
window.addEventListener("load", () => {
  emailjs.init("gCOnRXz710o2Xj7MU");
  s2.style.display = "none";
  s3.style.display = "none";
  nextBtn.classList.add("disable");
  verifyBtn.classList.add("disable");
});

// Function to validate email and toggle next button class
const valid = (email) => {
  let re = /\S+@\S+\.\S+/;
  if (re.test(email)) {
    nextBtn.classList.remove("disable");
  } else {
    nextBtn.classList.add("disable");
  }
};

// Function for next button click
nextBtn.addEventListener("click", () => {
  // Attach email validation to email input event
  email.addEventListener("input", (e) => valid(e.target.value));
  let OTPgen = Math.floor(1000 + Math.random() * 9000).toString();

  nextBtn.innerHTML = "⚡ Sending...";

  let templateParameter = {
    from_name: "Vishu Verma Dev Community",
    OTP: OTPgen,
    message: "Please find out the attached file.",
    reply_to: email.value,
  };

  emailjs.send(serviceId, templateId, templateParameter).then(
    (res) => {
      s1.style.display = "none";
      s2.style.display = "flex";
      nextBtn.innerHTML = `Next`;
      window.generatedOTP = OTPgen; // Store OTP for verification
    },
    (err) => {
      console.log(err);
      nextBtn.innerHTML = `Next`;
    }
  );
  VEmail.textContent = email.value;
});

// Function to verify OTP
inputs.forEach((input, index1) => {
  input.addEventListener("keyup", (e) => {
    const currentInput = input,
      nextInput = input.nextElementSibling,
      prevInput = input.previousElementSibling;

    if (currentInput.value.length > 1) {
      currentInput.value = "";
      return;
    }

    if (
      nextInput &&
      nextInput.hasAttribute("disabled") &&
      currentInput.value !== ""
    ) {
      nextInput.removeAttribute("disabled");
      nextInput.focus();
    }
    if (e.key === "Backspace") {
      inputs.forEach((input, index2) => {
        if (index1 <= index2 && prevInput) {
          input.setAttribute("disabled", "true");
          currentInput.value = "";
          prevInput.focus();
        }
      });
    }

    // Check if all input fields have values
    const allInputsFilled = Array.from(inputs).every(
      (input) => input.value.trim() !== ""
    );

    if (allInputsFilled) {
      verifyBtn.classList.remove("disable");
    } else {
      verifyBtn.classList.add("disable");
    }
  });
});

// Function that runs on verify button click
verifyBtn.addEventListener("click", () => {
  let values = "";
  inputs.forEach((input) => {
    values += input.value;
  });
  if (values === window.generatedOTP) {
    s2.style.display = "none";
    s3.style.display = "flex";
    s1.style.display = "none";
  } else {
    verifyBtn.classList.add("err_shake");
  }
  setTimeout(() => {
    verifyBtn.classList.remove("err_shake");
  }, 1000);
});
