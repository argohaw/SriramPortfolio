import React from "react";
import ScrollStack, { ScrollStackItem } from "./reactbits/ScrollStack";
import "./css/Services.css";

const Services: React.FC = () => {
  const handleStackComplete = () => {
    // Automatically scroll to contact section
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div id="services" className="services-wrapper">
      <div className="services-title-box">
        <h2 className="services-title">Services</h2>
      </div>

      <div className="services-scrollstack-container">
        <div className="services-scrollstack-inner">
          <ScrollStack onStackComplete={handleStackComplete}>
            <ScrollStackItem itemClassName="card-purple">
              <h2>Conference</h2>
              <p>
                I have participated at{" "}
                <ul>
                  <li>AIP Publishing</li>
                  <li>ICMTA'21 at SRMIST</li>
                  <li>SRM Research Day</li>
                </ul>
              </p>
            </ScrollStackItem>
            <ScrollStackItem itemClassName="card-blue">
              <h2>Workshop</h2>
              <p>
                I have participated at
                <ul>
                  <li>Actions On Google (SRM Developer Students Club)</li>
                  <li>Aaruush (National-level techno-management club)</li>
                  <li>Aglie DevOps (Renault-Nissan-Mitsubishi)</li>
                </ul>
              </p>
            </ScrollStackItem>
            <ScrollStackItem itemClassName="card-green">
              <h2>Hackathon</h2>
              <p>
                <ul>
                  <li>DBMS Hackthon (SRMIST)</li>
                  <li>2x Top 5 at Opentext Hackathon</li>
                  <li>Google Foobar challenge</li>
                  <li>SRM Developer Students Club Hackthon</li>
                </ul>
              </p>
            </ScrollStackItem>
            <ScrollStackItem itemClassName="card-purple">
              <h2>Publication</h2>
              <p>
                Secure E-Voting System using Blockchain Based on Solidity
                Technology at AIP and Secure Patient Records using multi-level
                encryption at SRM Research Day
              </p>
            </ScrollStackItem>
          </ScrollStack>
        </div>
      </div>
    </div>
  );
};

export default Services;
