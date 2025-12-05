import { 
  type User, type InsertUser,
  type Hospital, type InsertHospital,
  type Doctor, type InsertDoctor,
  type Appointment, type InsertAppointment,
  type MedicalRecord, type InsertMedicalRecord,
  type PatientTransfer, type InsertPatientTransfer,
  users, hospitals, doctors, appointments, medicalRecords, patientTransfers
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, ilike, inArray } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByNationalId(nationalId: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Hospitals
  getAllHospitals(): Promise<Hospital[]>;
  getHospital(id: number): Promise<Hospital | undefined>;
  createHospital(hospital: InsertHospital): Promise<Hospital>;
  searchHospitals(query: string): Promise<Hospital[]>;
  
  // Doctors
  getAllDoctors(): Promise<Array<Doctor & { user: User; hospital: Hospital }>>;
  getDoctorsByHospital(hospitalId: number): Promise<Array<Doctor & { user: User }>>;
  getDoctor(id: number): Promise<(Doctor & { user: User; hospital: Hospital }) | undefined>;
  createDoctor(doctor: InsertDoctor): Promise<Doctor>;
  searchDoctors(query: string): Promise<Array<Doctor & { user: User; hospital: Hospital }>>;
  
  // Appointments
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getPatientAppointments(patientId: number): Promise<Array<Appointment & { doctor: Doctor & { user: User }; hospital: Hospital }>>;
  getDoctorAppointments(doctorId: number): Promise<Appointment[]>;
  updateAppointmentStatus(id: number, status: string): Promise<Appointment | undefined>;
  
  // Medical Records
  createMedicalRecord(record: InsertMedicalRecord): Promise<MedicalRecord>;
  getPatientRecords(patientId: number): Promise<MedicalRecord[]>;
  
  // Patient Transfers
  createTransfer(transfer: InsertPatientTransfer): Promise<PatientTransfer>;
  getPatientTransfers(patientId: number): Promise<Array<PatientTransfer & { fromHospital: Hospital; toHospital: Hospital }>>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByNationalId(nationalId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.nationalId, nationalId));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users).set(userData).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  // Hospitals
  async getAllHospitals(): Promise<Hospital[]> {
    return await db.select().from(hospitals);
  }

  async getHospital(id: number): Promise<Hospital | undefined> {
    const [hospital] = await db.select().from(hospitals).where(eq(hospitals.id, id));
    return hospital || undefined;
  }

  async createHospital(hospital: InsertHospital): Promise<Hospital> {
    const [newHospital] = await db.insert(hospitals).values(hospital).returning();
    return newHospital;
  }

  async searchHospitals(query: string): Promise<Hospital[]> {
    return await db.select().from(hospitals).where(
      or(
        ilike(hospitals.name, `%${query}%`),
        ilike(hospitals.location, `%${query}%`),
        ilike(hospitals.region, `%${query}%`)
      )!
    );
  }

  // Doctors
  async getAllDoctors(): Promise<Array<Doctor & { user: User; hospital: Hospital }>> {
    const result = await db
      .select()
      .from(doctors)
      .leftJoin(users, eq(doctors.userId, users.id))
      .leftJoin(hospitals, eq(doctors.hospitalId, hospitals.id));
    
    return result.map(row => ({
      ...row.doctors,
      user: row.users!,
      hospital: row.hospitals!
    }));
  }

  async getDoctorsByHospital(hospitalId: number): Promise<Array<Doctor & { user: User }>> {
    const result = await db
      .select()
      .from(doctors)
      .leftJoin(users, eq(doctors.userId, users.id))
      .where(eq(doctors.hospitalId, hospitalId));
    
    return result.map(row => ({
      ...row.doctors,
      user: row.users!
    }));
  }

  async getDoctor(id: number): Promise<(Doctor & { user: User; hospital: Hospital }) | undefined> {
    const result = await db
      .select()
      .from(doctors)
      .leftJoin(users, eq(doctors.userId, users.id))
      .leftJoin(hospitals, eq(doctors.hospitalId, hospitals.id))
      .where(eq(doctors.id, id));
    
    if (result.length === 0) return undefined;
    
    const row = result[0];
    return {
      ...row.doctors,
      user: row.users!,
      hospital: row.hospitals!
    };
  }

  async createDoctor(doctor: InsertDoctor): Promise<Doctor> {
    const [newDoctor] = await db.insert(doctors).values(doctor).returning();
    return newDoctor;
  }

  async searchDoctors(query: string): Promise<Array<Doctor & { user: User; hospital: Hospital }>> {
    const result = await db
      .select()
      .from(doctors)
      .leftJoin(users, eq(doctors.userId, users.id))
      .leftJoin(hospitals, eq(doctors.hospitalId, hospitals.id))
      .where(
        or(
          ilike(doctors.specialty, `%${query}%`),
          ilike(users.name, `%${query}%`)
        )!
      );
    
    return result.map(row => ({
      ...row.doctors,
      user: row.users!,
      hospital: row.hospitals!
    }));
  }

  // Appointments
  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [newAppointment] = await db.insert(appointments).values(appointment).returning();
    return newAppointment;
  }

  async getPatientAppointments(patientId: number): Promise<Array<Appointment & { doctor: Doctor & { user: User }; hospital: Hospital }>> {
    const result = await db
      .select()
      .from(appointments)
      .leftJoin(doctors, eq(appointments.doctorId, doctors.id))
      .leftJoin(users, eq(doctors.userId, users.id))
      .leftJoin(hospitals, eq(appointments.hospitalId, hospitals.id))
      .where(eq(appointments.patientId, patientId));
    
    return result.map(row => ({
      ...row.appointments,
      doctor: {
        ...row.doctors!,
        user: row.users!
      },
      hospital: row.hospitals!
    }));
  }

  async getDoctorAppointments(doctorId: number): Promise<Appointment[]> {
    return await db.select().from(appointments).where(eq(appointments.doctorId, doctorId));
  }

  async updateAppointmentStatus(id: number, status: string): Promise<Appointment | undefined> {
    const [appointment] = await db
      .update(appointments)
      .set({ status })
      .where(eq(appointments.id, id))
      .returning();
    return appointment || undefined;
  }

  // Medical Records
  async createMedicalRecord(record: InsertMedicalRecord): Promise<MedicalRecord> {
    const [newRecord] = await db.insert(medicalRecords).values(record).returning();
    return newRecord;
  }

  async getPatientRecords(patientId: number): Promise<MedicalRecord[]> {
    return await db.select().from(medicalRecords).where(eq(medicalRecords.patientId, patientId));
  }

  // Patient Transfers
  async createTransfer(transfer: InsertPatientTransfer): Promise<PatientTransfer> {
    const [newTransfer] = await db.insert(patientTransfers).values(transfer).returning();
    return newTransfer;
  }

  async getPatientTransfers(patientId: number): Promise<Array<PatientTransfer & { fromHospital: Hospital; toHospital: Hospital }>> {
    const result = await db
      .select()
      .from(patientTransfers)
      .leftJoin(hospitals, eq(patientTransfers.fromHospitalId, hospitals.id))
      .where(eq(patientTransfers.patientId, patientId));
    
    const withToHospitals = await Promise.all(
      result.map(async (row) => {
        const [toHospital] = await db
          .select()
          .from(hospitals)
          .where(eq(hospitals.id, row.patient_transfers.toHospitalId));
        
        return {
          ...row.patient_transfers,
          fromHospital: row.hospitals!,
          toHospital: toHospital
        };
      })
    );
    
    return withToHospitals;
  }
}

export const storage = new DatabaseStorage();
