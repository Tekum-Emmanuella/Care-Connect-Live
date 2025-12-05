
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@assets/generated_images/vibrant_abstract_medical_logo_symbol.png";
import heroImage from "@assets/generated_images/friendly_doctor_using_a_tablet_in_a_modern_clinic.png";
import { useState } from "react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock login delay
    setTimeout(() => {
      setIsLoading(false);
      setLocation("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 relative">
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <img src={logo} alt="CamHealth Logo" className="w-8 h-8 object-contain" />
          <span className="font-heading font-bold text-lg text-primary">CAM HEALTH</span>
        </div>

        <div className="max-w-sm mx-auto w-full space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">
              Welcome Back
            </h1>
            <p className="text-gray-500">
              Enter your credentials to access your patient portal.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">National ID / Email</Label>
              <Input 
                id="email" 
                type="text" 
                placeholder="Enter your ID or Email" 
                className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:ring-primary focus:border-primary"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm text-primary hover:underline font-medium">Forgot?</a>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <a href="#" className="text-primary font-medium hover:underline">
              Register at a hospital
            </a>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block w-1/2 bg-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10 z-10 mix-blend-multiply"></div>
        <img 
          src={heroImage} 
          alt="Doctor smiling" 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-12 z-20 bg-gradient-to-t from-black/60 to-transparent text-white">
          <h2 className="text-3xl font-heading font-bold mb-4">Healthcare Everywhere.</h2>
          <p className="text-white/90 text-lg max-w-md">
            Access doctors, manage appointments, and track your health records across all registered hospitals in Cameroon.
          </p>
        </div>
      </div>
    </div>
  );
}
