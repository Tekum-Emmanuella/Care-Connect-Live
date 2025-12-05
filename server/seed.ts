import { db } from "./db";
import { users, hospitals, doctors, appointments } from "@shared/schema";
import bcrypt from "bcrypt";

async function seed() {
  console.log("Seeding database...");

  // Create sample hospitals
  const [hospital1, hospital2, hospital3, hospital4] = await db.insert(hospitals).values([
    {
      name: "Yaoundé General Hospital",
      location: "Yaoundé, Centre Region",
      region: "Centre",
      image: "https://images.unsplash.com/photo-1587351021759-3e566b9af923?auto=format&fit=crop&q=80&w=1000",
      specialties: ["Cardiology", "Neurology", "Pediatrics", "Emergency"],
      rating: "4.8",
      description: "A leading referral hospital providing specialized medical care with state-of-the-art facilities.",
      contactPhone: "+237 222 123 456",
      contactEmail: "info@ygh.cm"
    },
    {
      name: "Laquintinie Hospital",
      location: "Douala, Littoral Region",
      region: "Littoral",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000",
      specialties: ["Orthopedics", "Maternity", "General Surgery"],
      rating: "4.5",
      description: "Historic hospital serving the Douala region with comprehensive healthcare services.",
      contactPhone: "+237 233 456 789",
      contactEmail: "contact@laquintinie.cm"
    },
    {
      name: "Bamenda Regional Hospital",
      location: "Bamenda, North West Region",
      region: "North West",
      image: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&q=80&w=1000",
      specialties: ["Infectious Diseases", "Pediatrics", "Internal Medicine"],
      rating: "4.2",
      description: "Primary healthcare provider for the North West region.",
      contactPhone: "+237 233 789 012",
      contactEmail: "info@brh.cm"
    },
    {
      name: "Buea Regional Hospital",
      location: "Buea, South West Region",
      region: "South West",
      image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=1000",
      specialties: ["Dermatology", "Family Medicine", "Radiology"],
      rating: "4.6",
      description: "Modern facility offering a wide range of medical and diagnostic services.",
      contactPhone: "+237 233 345 678",
      contactEmail: "info@buerh.cm"
    }
  ]).returning();

  // Create sample patient
  const hashedPassword = await bcrypt.hash("password123", 10);
  const [patient] = await db.insert(users).values({
    nationalId: "CM001234567",
    email: "sarah.tabe@example.cm",
    password: hashedPassword,
    name: "Sarah Tabe",
    phone: "+237 670 123 456",
    bloodType: "O+",
    dateOfBirth: "1990-05-15",
    gender: "Female",
    role: "patient",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
  }).returning();

  // Create doctor users and profiles
  const [doctorUser1] = await db.insert(users).values({
    nationalId: "CM987654321",
    email: "dr.njoya@ygh.cm",
    password: hashedPassword,
    name: "Dr. Amara Njoya",
    phone: "+237 677 234 567",
    role: "doctor",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300"
  }).returning();

  const [doctorUser2] = await db.insert(users).values({
    nationalId: "CM987654322",
    email: "dr.biya@ygh.cm",
    password: hashedPassword,
    name: "Dr. Jean-Paul Biya",
    phone: "+237 677 345 678",
    role: "doctor",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300"
  }).returning();

  const [doctorUser3] = await db.insert(users).values({
    nationalId: "CM987654323",
    email: "dr.tchuente@laquintinie.cm",
    password: hashedPassword,
    name: "Dr. Marie Tchuente",
    phone: "+237 677 456 789",
    role: "doctor",
    avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300"
  }).returning();

  const [doctorUser4] = await db.insert(users).values({
    nationalId: "CM987654324",
    email: "dr.etoo@laquintinie.cm",
    password: hashedPassword,
    name: "Dr. Samuel Eto'o",
    phone: "+237 677 567 890",
    role: "doctor",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300"
  }).returning();

  // Create doctor profiles
  const [doctor1, doctor2, doctor3, doctor4] = await db.insert(doctors).values([
    {
      userId: doctorUser1.id,
      hospitalId: hospital1.id,
      specialty: "Cardiologist",
      experience: "12 years",
      rating: "4.9",
      licenseNumber: "CM-MED-001",
      bio: "Specialized in cardiovascular diseases and preventive cardiology."
    },
    {
      userId: doctorUser2.id,
      hospitalId: hospital1.id,
      specialty: "Neurologist",
      experience: "8 years",
      rating: "4.7",
      licenseNumber: "CM-MED-002",
      bio: "Expert in neurological disorders and brain health."
    },
    {
      userId: doctorUser3.id,
      hospitalId: hospital2.id,
      specialty: "Pediatrician",
      experience: "15 years",
      rating: "5.0",
      licenseNumber: "CM-MED-003",
      bio: "Passionate about child healthcare and development."
    },
    {
      userId: doctorUser4.id,
      hospitalId: hospital2.id,
      specialty: "Orthopedic Surgeon",
      experience: "10 years",
      rating: "4.8",
      licenseNumber: "CM-MED-004",
      bio: "Specialized in sports injuries and joint replacement."
    }
  ]).returning();

  // Create sample appointments
  await db.insert(appointments).values([
    {
      patientId: patient.id,
      doctorId: doctor1.id,
      hospitalId: hospital1.id,
      date: "2025-12-10",
      time: "09:30 AM",
      status: "confirmed",
      type: "checkup",
      reason: "Annual cardiac checkup"
    },
    {
      patientId: patient.id,
      doctorId: doctor3.id,
      hospitalId: hospital2.id,
      date: "2025-12-15",
      time: "02:00 PM",
      status: "pending",
      type: "consultation",
      reason: "Family health consultation"
    }
  ]);

  console.log("✅ Database seeded successfully!");
  console.log("\nTest credentials:");
  console.log("National ID: CM001234567");
  console.log("Email: sarah.tabe@example.cm");
  console.log("Password: password123");
  
  process.exit(0);
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
