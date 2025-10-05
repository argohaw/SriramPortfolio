import React, { useEffect } from "react";
import LiquidEther from "./components/reactbits/LiquidEther";
import Navbar from "./components/Navbar";
import Homepage from "./components/Homepage";
import Services from "./components/Services";
import Resume from "./components/Resume";
import WorkProjects from "./components/WorkProjects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import "./App.css";

// Wrapper around your front content
const ContentWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div style={{ position: "relative", zIndex: 1 }}>{children}</div>;
};

const App: React.FC = () => {
  useEffect(() => {
    // Scroll to homepage on refresh
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          position: "fixed",
          zIndex: 0,
          backgroundColor: "black",
          pointerEvents: "none",
        }}
      >
        <LiquidEther
          colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>
      <ContentWrapper>
        <Navbar />
        <Homepage />
        <Resume />
        <WorkProjects />
        <Services />
        <Contact />
        <Footer />
      </ContentWrapper>
    </>
  );
};

export default App;
