"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Phone, Plus, Trash2, CheckCircle, Clock, AlertTriangle } from "lucide-react"

interface EmergencyContact {
  id: string
  name: string
  phone: string
  relationship: string
  isPrimary: boolean
  lastNotified?: Date
  status: "available" | "notified" | "responded" | "unavailable"
}

const mockContacts: EmergencyContact[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    phone: "+1 (555) 123-4567",
    relationship: "Sister",
    isPrimary: true,
    status: "available",
  },
  {
    id: "2",
    name: "Mike Chen",
    phone: "+1 (555) 987-6543",
    relationship: "Best Friend",
    isPrimary: false,
    status: "available",
  },
]

interface EmergencyContactManagerProps {
  isEmergencyActive?: boolean
  onContactsUpdated?: (contacts: EmergencyContact[]) => void
}

export function EmergencyContactManager({
  isEmergencyActive = false,
  onContactsUpdated,
}: EmergencyContactManagerProps) {
  const [contacts, setContacts] = useState<EmergencyContact[]>(mockContacts)
  const [isAddingContact, setIsAddingContact] = useState(false)
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    relationship: "",
  })

  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      const contact: EmergencyContact = {
        id: Date.now().toString(),
        name: newContact.name,
        phone: newContact.phone,
        relationship: newContact.relationship || "Contact",
        isPrimary: contacts.length === 0,
        status: "available",
      }

      const updatedContacts = [...contacts, contact]
      setContacts(updatedContacts)
      onContactsUpdated?.(updatedContacts)

      setNewContact({ name: "", phone: "", relationship: "" })
      setIsAddingContact(false)
    }
  }

  const handleRemoveContact = (id: string) => {
    const updatedContacts = contacts.filter((c) => c.id !== id)
    setContacts(updatedContacts)
    onContactsUpdated?.(updatedContacts)
  }

  const handleSetPrimary = (id: string) => {
    const updatedContacts = contacts.map((c) => ({
      ...c,
      isPrimary: c.id === id,
    }))
    setContacts(updatedContacts)
    onContactsUpdated?.(updatedContacts)
  }

  const handleNotifyContact = (id: string) => {
    const updatedContacts = contacts.map((c) =>
      c.id === id ? { ...c, status: "notified" as const, lastNotified: new Date() } : c,
    )
    setContacts(updatedContacts)
    onContactsUpdated?.(updatedContacts)

    // Simulate response after delay
    setTimeout(() => {
      setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, status: "responded" as const } : c)))
    }, 5000)
  }

  const getStatusIcon = (status: EmergencyContact["status"]) => {
    switch (status) {
      case "available":
        return <CheckCircle className="w-4 h-4 text-safe" />
      case "notified":
        return <Clock className="w-4 h-4 text-caution animate-pulse" />
      case "responded":
        return <CheckCircle className="w-4 h-4 text-safe" />
      case "unavailable":
        return <AlertTriangle className="w-4 h-4 text-warning" />
    }
  }

  const getStatusColor = (status: EmergencyContact["status"]) => {
    switch (status) {
      case "available":
        return "bg-safe/10 text-safe border-safe/20"
      case "notified":
        return "bg-caution/10 text-caution border-caution/20"
      case "responded":
        return "bg-safe/10 text-safe border-safe/20"
      case "unavailable":
        return "bg-warning/10 text-warning border-warning/20"
    }
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Emergency Contacts</CardTitle>
          {!isEmergencyActive && (
            <Button variant="ghost" size="sm" onClick={() => setIsAddingContact(true)} disabled={isAddingContact}>
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Add New Contact Form */}
        {isAddingContact && (
          <Card className="border-muted">
            <CardContent className="p-4 space-y-3">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newContact.name}
                  onChange={(e) => setNewContact((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter contact name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={newContact.phone}
                  onChange={(e) => setNewContact((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1 (555) 123-4567"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="relationship">Relationship</Label>
                <Input
                  id="relationship"
                  value={newContact.relationship}
                  onChange={(e) => setNewContact((prev) => ({ ...prev, relationship: e.target.value }))}
                  placeholder="e.g., Family, Friend, Colleague"
                  className="mt-1"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleAddContact} size="sm" className="flex-1">
                  Add Contact
                </Button>
                <Button variant="outline" onClick={() => setIsAddingContact(false)} size="sm" className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contact List */}
        {contacts.length === 0 ? (
          <div className="text-center py-6">
            <Phone className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No emergency contacts added</p>
            <p className="text-xs text-muted-foreground mt-1">
              Add contacts to enable automatic emergency notifications
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {contacts.map((contact) => (
              <Card key={contact.id} className="border-muted">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-sm">{contact.name}</h4>
                        {contact.isPrimary && (
                          <Badge variant="outline" className="text-xs bg-safe/10 text-safe border-safe/20">
                            Primary
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{contact.phone}</p>
                      <p className="text-xs text-muted-foreground">{contact.relationship}</p>

                      {contact.lastNotified && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Last notified: {contact.lastNotified.toLocaleTimeString()}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge className={`text-xs ${getStatusColor(contact.status)}`}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(contact.status)}
                          <span className="capitalize">{contact.status}</span>
                        </div>
                      </Badge>

                      {!isEmergencyActive && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveContact(contact.id)}
                          className="w-8 h-8"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-3">
                    {isEmergencyActive ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleNotifyContact(contact.id)}
                        disabled={contact.status === "notified"}
                        className="flex-1"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        {contact.status === "notified" ? "Notified" : "Notify Now"}
                      </Button>
                    ) : (
                      <>
                        {!contact.isPrimary && (
                          <Button variant="ghost" size="sm" onClick={() => handleSetPrimary(contact.id)}>
                            Set as Primary
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Emergency Mode Info */}
        {isEmergencyActive && (
          <div className="bg-warning/10 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-warning">Emergency Mode Active</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Contacts will receive your live location and safety status. Primary contact will be notified first.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
