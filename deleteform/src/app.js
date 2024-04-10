  export async function generatePin(email) {
    const data = {
        email: email
    }
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    const response = await fetch('https://flexser.app/acc/generate', requestOptions);
  
    if (response.ok) {
      const json = await response.json();

      return {
        responseCode: json.responseCode,
        flowErrors: json.flowErrors,
        validationErrors: json.validationErrors,
      };
    } else {
      throw new Error("Something went wrong, try again later!");
    }
  }

  export async function deleteAccount(email, pin) {
    const data = {
        email: email,
        pinCode: pin
    }
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    const response = await fetch('https://flexser.app/acc/delete', requestOptions);
  
    if (response.ok) {
      const json = await response.json();

      return {
        responseCode: json.responseCode,
        flowErrors: json.flowErrors,
        validationErrors: json.validationErrors,
      };
    } else {
      throw new Error("Something went wrong, try again later!");
    }
  }