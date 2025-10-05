"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Testimonials from "./components/testimonials/Testimonials";
import About from "./components/about/About";
import HelpCenter from "./components/help-center/HelpCenter";
import { useRouter } from "next/navigation";
import AuthModal from "./components/auth/AuthModal";
import { auth } from "@/firebase.config";
import { onAuthStateChanged, User } from "firebase/auth";

type TabKey = "home" | "testimonials" | "settings" | "about" | "help";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabKey>("home");
  const [authOpen, setAuthOpen] = useState<"login" | "signup" | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const router = useRouter();

  const handleTabChange = (tabId: TabKey) => {
    setActiveTab(tabId);
  };
  const tabs: Record<TabKey, JSX.Element> = {
    home: (
      <div className="flex flex-col md:flex-row items-center justify-between gap-12 p-8">
        <div className="text-left max-w-2xl">
          <h1 className="text-5xl md:text-6xl text-white font-bold mb-6 leading-tight">
            Make Ethical, Value-Aligned Choices with Confidence
          </h1>
          <p className="text-xl xl:text-2xl text-white mb-4">
            Discover companies that truly match your social, environmental, and
            economic beliefs.
          </p>
          <p className="text-lg xl:text-xl text-white mb-6 leading-relaxed">
            Leadger is the ethical consumer app that helps you spend and invest
            in companies aligned with your values. Take our free quiz today and
            receive personalized insights that empower your everyday ethical
            choices.
          </p>
          <button
            className="px-6 py-3 text-lg font-semibold rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-all duration-200"
            onClick={() => router.push("/onboarding")}
          >
            Start Your Free Quiz Now
          </button>
        </div>
        <div className="flex-shrink-0">
          <Image
            src="/landingimage.jpg"
            alt="Landing visual"
            width={450}
            height={450}
            className="rounded-xl shadow-xl"
            priority
          />
        </div>
      </div>
    ),
    testimonials: <Testimonials />,
    settings: (
      <div className="card-elevated p-4">
        <h2 className="text-3xl font-bold text-center text-black">Settings</h2>
        <p className="text-lg text-muted-foreground">
          Configure your preferences and notifications
        </p>
      </div>
    ),
    about: <About />,
    help: <HelpCenter />,
  };

  // --- Navigation ---
  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "testimonials", label: "Testimonials" },
    { id: "help", label: "Help Center" },
  ] as const;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      {/* Background */}
      <main
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/background-logo2.jpeg')" }}
      />
      <div className="fixed inset-0 bg-black/60 z-0" />

      <div className="relative z-10 min-h-screen overflow-auto flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-6 bg-white shadow-md">
          {/* Logo */}
          <button
            onClick={() => handleTabChange("home")}
            className="flex-shrink-0 focus:outline-none"
            aria-label="Go to Home"
          >
            <Image
              src="/leadgertechlogo.jpg"
              alt="Leadger.tech Logo"
              width={250}
              height={250}
              className="rounded-full"
              priority
            />
          </button>

          {/* Nav */}
          <nav className="flex-grow flex justify-center gap-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id as TabKey)}
                className={`px-3 py-2 rounded-lg text-lg font-medium border transition-all duration-200 ${
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-background/80 text-foreground border-border hover:bg-accent hover:text-accent-foreground hover:border-accent"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Header Buttons */}
          {!currentUser ? (
            <div className="relative flex items-center gap-2">
              <button
                onClick={() => setAuthOpen("login")}
                className="px-3 py-2 rounded-lg border transition-all duration-200 bg-background/80 text-foreground border-border hover:bg-accent hover:text-accent-foreground hover:border-accent"
                aria-label="Sign In"
              >
                Sign In
              </button>
              <button
                className="px-3 py-2 text-lg font-semibold rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-all duration-200"
                onClick={() => setAuthOpen("signup")}
              >
                SIGN UP
              </button>
            </div>
          ) : (
            <div>
              <span>{currentUser.email}</span>
              <button
                onClick={() => auth.signOut()}
                className="ml-4 px-3 py-2 rounded-lg border transition-all duration-200 bg-background/80 text-foreground border-border hover:bg-accent hover:text-accent-foreground hover:border-accent"
                aria-label="Sign Out"
              >
                Sign Out
              </button>
            </div>
          )}

          {/* Settings Button */}
        </header>

        {/* Main Content */}
        <section className="max-w-6xl mx-auto mt-8 px-4 flex-grow">
          {tabs[activeTab]}
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white mt-12 py-8 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h4 className="text-xl font-semibold">Leadger.tech</h4>
              <p className="text-sm text-gray-400 mt-1">
                Empowering ethical choices through transparency.
              </p>
            </div>
            <div className="flex gap-6 text-sm">
              <button
                onClick={() => handleTabChange("about")}
                className="hover:text-orange-400 transition text-sm"
              >
                About
              </button>
              <button
                onClick={() => handleTabChange("help")}
                className="hover:text-orange-400 transition text-sm"
              >
                Contact
              </button>
            </div>
          </div>
          <div className="text-center text-xs text-gray-500 mt-6">
            &copy; {new Date().getFullYear()} Leadger.tech. All rights reserved.
          </div>
        </footer>

        {/* Auth Modal */}
        <AuthModal open={!!authOpen} onClose={() => setAuthOpen(null)} />
      </div>
    </>
  );
}
