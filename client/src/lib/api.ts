const API_BASE = '/api';

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface RegisterData {
  nationalId: string;
  email: string;
  password: string;
  name: string;
  phone?: string;
  bloodType?: string;
  dateOfBirth?: string;
  gender?: string;
}

export const api = {
  // Auth
  async login(credentials: LoginCredentials) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async register(data: RegisterData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // Hospitals
  async getHospitals(query?: string) {
    const url = query ? `${API_BASE}/hospitals?q=${encodeURIComponent(query)}` : `${API_BASE}/hospitals`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async getHospital(id: number) {
    const res = await fetch(`${API_BASE}/hospitals/${id}`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // Doctors
  async getDoctors(query?: string, hospitalId?: number) {
    let url = `${API_BASE}/doctors`;
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (hospitalId) params.append('hospitalId', hospitalId.toString());
    if (params.toString()) url += `?${params.toString()}`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async getDoctor(id: number) {
    const res = await fetch(`${API_BASE}/doctors/${id}`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // Appointments
  async createAppointment(data: any) {
    const res = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async getPatientAppointments(patientId: number) {
    const res = await fetch(`${API_BASE}/appointments/patient/${patientId}`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async updateAppointmentStatus(id: number, status: string) {
    const res = await fetch(`${API_BASE}/appointments/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // Medical Records
  async createRecord(data: any) {
    const res = await fetch(`${API_BASE}/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async getPatientRecords(patientId: number) {
    const res = await fetch(`${API_BASE}/records/patient/${patientId}`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // User Profile
  async getUser(id: number) {
    const res = await fetch(`${API_BASE}/users/${id}`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async updateUser(id: number, data: any) {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};
