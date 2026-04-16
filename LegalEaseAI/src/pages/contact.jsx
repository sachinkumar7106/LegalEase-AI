const Contact = () => {
  return (
    <div className="page">
      <h1>Contact Us</h1>
      <p>Have questions? We’re here to help.</p>

      <form className="form">
        <input type="text" placeholder="Full Name" required />
        <input type="email" placeholder="Email Address" required />
        <textarea placeholder="Describe your legal query..." required></textarea>
        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
};

export default Contact;