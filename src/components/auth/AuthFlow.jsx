"use client";

import { useState, useEffect } from "react";
import SplashScreen from "./SplashScreen";
import LoginScreen from "./LoginScreen";
import SignupScreen from "./SignupScreen";

export default function AuthFlow() {
  const [currentView, setCurrentView] = useState("splash");
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentView("login");
        setIsVisible(true);
      }, 300);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const navigateTo = (view) => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentView(view);
      setIsVisible(true);
    }, 300);
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] font-sans flex items-center justify-center overflow-hidden">
      <div
        className={`w-full h-full transition-opacity duration-300 ease-in-out ${isVisible ? "opacity-100" : "opacity-0"}`}
      >
        {currentView === "splash" && <SplashScreen />}
        {currentView === "login" && (
          <LoginScreen onNavigate={() => navigateTo("signup")} />
        )}
        {currentView === "signup" && (
          <SignupScreen onNavigate={() => navigateTo("login")} />
        )}
      </div>
    </div>
  );
}
