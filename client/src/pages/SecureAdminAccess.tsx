import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BackendAdminLogin from "@/components/BackendAdminLogin";

export default function SecureAdminAccess() {
  const [accessCode, setAccessCode] = useState("");
  const [showPortal, setShowPortal] = useState(false);

  const handleAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Use a secure access code
    if (accessCode === "USA2025ADMIN") {
      setShowPortal(true);
    } else {
      alert("Invalid access code");
    }
  };

  if (showPortal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">USA Home Admin Systems</h1>
            <p className="text-blue-100">Choose your administration interface</p>
          </div>
          
          {/* Unified Admin System */}
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-blue-800">Unified Admin Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">Complete administrative access for platform management, feedback, deletion requests, and all backend operations</p>
              <Button 
                onClick={() => window.location.href = '/admin'}
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
              >
                Enter Admin Dashboard
              </Button>
              <p className="text-sm text-gray-500">Access notifications, billing, feedback management, and more</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">Secure Access Required</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAccessSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Enter access code"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="text-center"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Access Admin Portal
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}