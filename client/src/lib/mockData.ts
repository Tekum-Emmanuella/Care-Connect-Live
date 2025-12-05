
import { Calendar, Clock, MapPin, Star, Shield, Activity } from "lucide-react";

export const users = [
  {
    id: "1",
    name: "Sarah Tabe",
    role: "patient",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    bloodType: "O+",
    conditions: ["Asthma"],
    lastCheckup: "2024-10-15",
  }
];

export const hospitals = [
  {
    id: "h1",
    name: "Yaoundé General Hospital",
    location: "Yaoundé, Centre Region",
    image: "https://images.unsplash.com/photo-1587351021759-3e566b9af923?auto=format&fit=crop&q=80&w=1000",
    specialties: ["Cardiology", "Neurology", "Pediatrics", "Emergency"],
    rating: 4.8,
    distance: "2.5 km",
    availableDoctors: 12,
    description: "A leading referral hospital providing specialized medical care with state-of-the-art facilities."
  },
  {
    id: "h2",
    name: "Laquintinie Hospital",
    location: "Douala, Littoral Region",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000",
    specialties: ["Orthopedics", "Maternity", "General Surgery"],
    rating: 4.5,
    distance: "15 km",
    availableDoctors: 8,
    description: "Historic hospital serving the Douala region with comprehensive healthcare services."
  },
  {
    id: "h3",
    name: "Bamenda Regional Hospital",
    location: "Bamenda, North West Region",
    image: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&q=80&w=1000",
    specialties: ["Infectious Diseases", "Pediatrics", "Internal Medicine"],
    rating: 4.2,
    distance: "350 km",
    availableDoctors: 5,
    description: "Primary healthcare provider for the North West region."
  },
  {
    id: "h4",
    name: "Buea Regional Hospital",
    location: "Buea, South West Region",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=1000",
    specialties: ["Dermatology", "Family Medicine", "Radiology"],
    rating: 4.6,
    distance: "320 km",
    availableDoctors: 7,
    description: "Modern facility offering a wide range of medical and diagnostic services."
  }
];

export const doctors = [
  {
    id: "d1",
    hospitalId: "h1",
    name: "Dr. Amara Njoya",
    specialty: "Cardiologist",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
    rating: 4.9,
    patients: 1200,
    experience: "12 years",
    availability: "Available Today"
  },
  {
    id: "d2",
    hospitalId: "h1",
    name: "Dr. Jean-Paul Biya",
    specialty: "Neurologist",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300",
    rating: 4.7,
    patients: 850,
    experience: "8 years",
    availability: "Next Available: Tomorrow"
  },
  {
    id: "d3",
    hospitalId: "h2",
    name: "Dr. Marie Tchuente",
    specialty: "Pediatrician",
    avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300",
    rating: 5.0,
    patients: 2000,
    experience: "15 years",
    availability: "Available Now"
  },
  {
    id: "d4",
    hospitalId: "h2",
    name: "Dr. Samuel Eto'o (Medical)",
    specialty: "Orthopedic Surgeon",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300",
    rating: 4.8,
    patients: 900,
    experience: "10 years",
    availability: "Book for Next Week"
  }
];

export const appointments = [
  {
    id: "a1",
    doctor: doctors[0],
    date: "2025-12-10",
    time: "09:30 AM",
    status: "Confirmed",
    type: "Check-up"
  },
  {
    id: "a2",
    doctor: doctors[2],
    date: "2025-12-15",
    time: "02:00 PM",
    status: "Pending",
    type: "Consultation"
  }
];
