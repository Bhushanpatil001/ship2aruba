"use client";

import { Settings, User, Bell, Shield, Smartphone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const sections = [
    {
      title: "Profile Information",
      description: "Manage your personal details and public profile.",
      icon: User,
      action: "Edit Profile"
    },
    {
      title: "Security Settings",
      description: "Update your password and manage two-factor authentication.",
      icon: Shield,
      action: "Update Security"
    },
    {
      title: "Notification Preferences",
      description: "Choose how you want to be notified about shipment updates.",
      icon: Bell,
      action: "Configure"
    },
    {
      title: "Mobile App",
      description: "Link your device to receive real-time push notifications.",
      icon: Smartphone,
      action: "Link Device"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Settings size={24} />
          </div>
          Account Settings
        </h1>
        <p className="mt-2 text-muted">Manage your account preferences and security settings.</p>
      </div>

      <div className="grid gap-6">
        {sections.map((section) => (
          <Card key={section.title} className="border-border bg-card hover:border-primary/20 transition-all group shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-muted/20 flex items-center justify-center text-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <section.icon size={24} />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">{section.title}</CardTitle>
                  <CardDescription className="mt-1 font-medium">{section.description}</CardDescription>
                </div>
              </div>
              <Button variant="outline" className="rounded-xl font-bold px-6">
                {section.action}
              </Button>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
