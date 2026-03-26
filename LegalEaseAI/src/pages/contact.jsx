import React from "react";

const Contact = () => {
  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "auto" }}>
      <h1>Contact Us</h1>

      <p>Have questions or feedback? Reach out to us 👇</p>

      <form style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input type="text" placeholder="Your Name" required />
        <input type="email" placeholder="Your Email" required />
        <textarea rows="5" placeholder="Your Message" required />

        <button type="submit">Send Message</button>
      </form>

      <div style={{ marginTop: "30px" }}>
        <p><b>Email:</b> support@legalease.ai</p>
        <p><b>Location:</b> India</p>
      </div>
    </div>
  );
};

export default Contact;