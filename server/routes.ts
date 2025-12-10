import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertHospitalSchema, 
  insertDoctorSchema, 
  insertAppointmentSchema,
  insertMedicalRecordSchema,
  insertPatientTransferSchema
} from "@shared/schema";
import bcrypt from "bcrypt";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Authentication
  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const hashedPassword = await bcrypt.hash(data.password, 10);
      
      const existingUser = await storage.getUserByNationalId(data.nationalId) || 
                           await storage.getUserByEmail(data.email);
      
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }
      
      const user = await storage.createUser({
        ...data,
        password: hashedPassword
      });
      
      res.json({ user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { identifier, password } = req.body;
      
      let user = await storage.getUserByNationalId(identifier);
      if (!user) {
        user = await storage.getUserByEmail(identifier);
      }
      
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      req.session.userId = user.id;
      res.json({ user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Hospitals
  app.get("/api/hospitals", async (req, res) => {
    try {
      const query = req.query.q as string;
      const hospitals = query 
        ? await storage.searchHospitals(query)
        : await storage.getAllHospitals();
      res.json(hospitals);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/hospitals/:id", async (req, res) => {
    try {
      const hospital = await storage.getHospital(parseInt(req.params.id));
      if (!hospital) {
        return res.status(404).json({ error: "Hospital not found" });
      }
      res.json(hospital);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/hospitals", async (req, res) => {
    try {
      const data = insertHospitalSchema.parse(req.body);
      const hospital = await storage.createHospital(data);
      res.json(hospital);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Doctors
  app.get("/api/doctors", async (req, res) => {
    try {
      const query = req.query.q as string;
      const hospitalId = req.query.hospitalId as string;
      
      let doctors;
      if (hospitalId) {
        doctors = await storage.getDoctorsByHospital(parseInt(hospitalId));
      } else if (query) {
        doctors = await storage.searchDoctors(query);
      } else {
        doctors = await storage.getAllDoctors();
      }
      
      res.json(doctors);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/doctors/:id", async (req, res) => {
    try {
      const doctor = await storage.getDoctor(parseInt(req.params.id));
      if (!doctor) {
        return res.status(404).json({ error: "Doctor not found" });
      }
      res.json(doctor);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/doctors", async (req, res) => {
    try {
      const data = insertDoctorSchema.parse(req.body);
      const doctor = await storage.createDoctor(data);
      res.json(doctor);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Appointments
  app.post("/api/appointments", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const data = insertAppointmentSchema.parse(req.body);
      const videoLink = `https://meet.jit.si/CareConnect-${Math.random().toString(36).substring(2, 15)}`;
      const appointment = await storage.createAppointment({ ...data, patientId: req.session.userId, videoLink });
      res.json(appointment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/appointments/patient/:patientId", async (req, res) => {
    try {
      if (!req.session.userId || req.session.userId !== parseInt(req.params.patientId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const appointments = await storage.getPatientAppointments(
        parseInt(req.params.patientId)
      );
      res.json(appointments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/appointments/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const appointment = await storage.updateAppointmentStatus(
        parseInt(req.params.id),
        status
      );
      
      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }
      
      res.json(appointment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Medical Records
  app.post("/api/records", async (req, res) => {
    try {
      const data = insertMedicalRecordSchema.parse(req.body);
      const record = await storage.createMedicalRecord(data);
      res.json(record);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/records/patient/:patientId", async (req, res) => {
    try {
      const records = await storage.getPatientRecords(
        parseInt(req.params.patientId)
      );
      res.json(records);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Patient Transfers
  app.post("/api/transfers", async (req, res) => {
    try {
      const data = insertPatientTransferSchema.parse(req.body);
      const transfer = await storage.createTransfer(data);
      res.json(transfer);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/transfers/patient/:patientId", async (req, res) => {
    try {
      const transfers = await storage.getPatientTransfers(
        parseInt(req.params.patientId)
      );
      res.json(transfers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // User Profile
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ ...user, password: undefined });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.updateUser(parseInt(req.params.id), req.body);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ ...user, password: undefined });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  return httpServer;
}
