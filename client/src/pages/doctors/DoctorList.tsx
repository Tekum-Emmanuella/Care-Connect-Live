import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Star, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export default function DoctorList() {
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [appointmentData, setAppointmentData] = useState({ date: "", reason: "" });
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: doctors = [], isLoading } = useQuery({
    queryKey: ['doctors', searchQuery],
    queryFn: () => api.getDoctors(searchQuery || undefined),
  });

  const bookAppointmentMutation = useMutation({
    mutationFn: (data: any) => api.createAppointment(data),
    onSuccess: () => {
      toast.success("Appointment request sent successfully!");
      queryClient.invalidateQueries({ queryKey: ['appointments', user?.id] });
      setSelectedDoctor(null);
      setAppointmentData({ date: "", reason: "" }); // Clear form
    },
    onError: () => {
      toast.error("Failed to book appointment. Please try again.");
    },
  });

  const handleBookAppointment = () => {
    console.log('Button clicked!', appointmentData); // Added console.log
    if (!user || !selectedDoctor || !appointmentData.date) {
      toast.error("Please fill in all required fields");
      return;
    }

    bookAppointmentMutation.mutate({
      patientId: user.id,
      doctorId: selectedDoctor.id,
      hospitalId: selectedDoctor.hospitalId,
      date: appointmentData.date,
      time: "09:00 AM",
      type: "consultation",
      reason: appointmentData.reason,
      status: "pending",
    });
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-heading font-bold text-gray-900">Find a Specialist</h1>
          <p className="text-gray-500 max-w-2xl">
            Book appointments with top doctors across our registered hospitals. 
            Filter by specialty, availability, and rating.
          </p>
          
          <div className="flex gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search doctor name or specialty..." 
                className="pl-10 h-12 rounded-xl bg-white border-gray-200 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-doctor"
              />
            </div>
            <Button variant="outline" className="h-12 w-12 rounded-xl border-gray-200 px-0">
              <Filter className="w-4 h-4 text-gray-600" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading doctors...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {doctors.map((doctor: any) => (
              <Card key={doctor.id} className="border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all rounded-2xl overflow-hidden bg-white group" data-testid={`card-doctor-${doctor.id}`}>
                <CardContent className="p-0 flex flex-col sm:flex-row">
                  <div className="w-full sm:w-40 h-40 sm:h-auto bg-gray-100 relative flex-shrink-0">
                    <img 
                      src={doctor.user.avatar || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300"} 
                      alt={doctor.user.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <Badge variant="secondary" className="bg-orange-50 text-orange-700 hover:bg-orange-100 mb-2">
                          {doctor.specialty}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm font-medium text-gray-600">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          {doctor.rating}
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900" data-testid={`text-doctor-name-${doctor.id}`}>{doctor.user.name}</h3>
                      <p className="text-sm text-gray-500 mb-1">{doctor.experience} experience</p>
                      <p className="text-xs text-gray-400">{doctor.hospital.name}</p>
                      
                      <div className="flex items-center gap-2 text-xs text-green-600 font-medium bg-green-50 w-fit px-2 py-1 rounded-md mt-2">
                        <Clock className="w-3 h-3" />
                        Available Today
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-50 flex gap-3">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="flex-1 rounded-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20" onClick={() => setSelectedDoctor(doctor)} data-testid={`button-book-${doctor.id}`}>
                            Book Appointment
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Book Appointment</DialogTitle>
                            <DialogDescription>
                              Schedule a visit with {selectedDoctor?.user.name}.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <label className="text-sm font-medium">Select Date</label>
                              <Input 
                                type="date" 
                                className="col-span-3"
                                value={appointmentData.date}
                                onChange={(e) => setAppointmentData({ ...appointmentData, date: e.target.value })}
                                data-testid="input-appointment-date"
                              />
                            </div>
                            <div className="grid gap-2">
                              <label className="text-sm font-medium">Reason for Visit</label>
                              <Input 
                                placeholder="E.g., Annual checkup, headache..." 
                                className="col-span-3"
                                value={appointmentData.reason}
                                onChange={(e) => setAppointmentData({ ...appointmentData, reason: e.target.value })}
                                data-testid="input-appointment-reason"
                              />
                            </div>
                            <div className="grid gap-2">
                              <label className="text-sm font-medium">Attach Medical Records (Optional)</label>
                              <FileUpload label="Upload past prescriptions or reports" />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button 
                              type="submit" 
                              onClick={handleBookAppointment}
                              data-testid="button-confirm-booking"
                            >
                              Confirm Booking
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
