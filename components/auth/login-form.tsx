/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sprout } from "lucide-react";

export function LoginForm() {
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    nationalId: "",
    farmSize: 0,
    farmLocation: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(loginData.email, loginData.password);
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Filter out empty optional fields
      const cleanedData = {
        email: registerData.email,
        password: registerData.password,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        ...(registerData.phone && { phone: registerData.phone }),
        ...(registerData.address && { address: registerData.address }),
        ...(registerData.dateOfBirth && {
          dateOfBirth: registerData.dateOfBirth,
        }),
        ...(registerData.nationalId && { nationalId: registerData.nationalId }),
        ...(registerData.farmSize > 0 && { farmSize: registerData.farmSize }),
        ...(registerData.farmLocation && {
          farmLocation: registerData.farmLocation,
        }),
      };

      await register(cleanedData);
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Sprout className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">AgTech ERP</h1>
          <p className="text-gray-600 mt-2">Cooperative Management System</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center">Welcome</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      required
                    />
                  </div>
                  {error && (
                    <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                      {error}
                    </p>
                  )}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </form>

                <div className="text-center text-sm text-gray-600 mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium mb-2">Demo Accounts:</p>
                  <p>Admin: admin@agtech.com / admin123</p>
                  <p>Farmer: john@agtech.com / farmer123</p>
                </div>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={registerData.firstName}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            firstName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        placeholder="Farmer"
                        value={registerData.lastName}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            lastName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="register-email">Email *</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="john.farmer@agtech.com"
                      value={registerData.email}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="register-password">Password *</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Password (min. 6 characters)"
                      value={registerData.password}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        placeholder="+1234567890"
                        value={registerData.phone}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="nationalId">National ID</Label>
                      <Input
                        id="nationalId"
                        placeholder="ID123456789"
                        value={registerData.nationalId}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            nationalId: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={registerData.dateOfBirth}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          dateOfBirth: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      placeholder="123 Farm Road, Rural Area"
                      value={registerData.address}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          address: e.target.value,
                        })
                      }
                      className="resize-none"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="farmSize">Farm Size (acres)</Label>
                      <Input
                        id="farmSize"
                        type="number"
                        placeholder="25.5"
                        min="0"
                        step="0.1"
                        value={registerData.farmSize || ""}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            farmSize: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="farmLocation">Farm Location</Label>
                      <Input
                        id="farmLocation"
                        placeholder="Enter farm location"
                        value={registerData.farmLocation}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            farmLocation: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                      {error}
                    </p>
                  )}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Registering..." : "Register as Farmer"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
