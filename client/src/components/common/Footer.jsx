import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="footer text-dark">
      <div className="footer-content d-flex  justify-content-between">
        <div className="footer-section me-3">
          <h3>Information</h3>
          <p>Pages</p>
          <p>Our Team</p>
          <p>Features</p>
          <p>Pricing</p>
        </div>
        <div className="footer-section">
          <h3>Resources</h3>
          <p>Wikipedia</p>
          <p>Travel Experiences</p>
          <p>Terms & Services</p>
          <p>Angular Dev</p>
        </div>
        <div className="footer-section">
          <h3>Help</h3>
          <p><Link to='signup'>SignUp</Link></p>
          <p><Link to ='signin'>Login</Link></p>
          <p>Terms of Services</p>
          <p>Privacy Policy</p>
        </div>
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Reach out if you need any help</p>
          <p>+91 9832749837</p>
        </div>
      </div>
      <div className="footer-bottom text-center mt-4">
        <p>@2025 VoyageR, All Rights Reserved</p>
      </div>
    </div>
  );
}

export default Footer;
