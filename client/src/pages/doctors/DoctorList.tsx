
import Layout from "@/components/layout/Layout";
import { doctors } from "@/lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, CalendarCheck, Star, Clock } from "lucide-react";
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

export default function DoctorList() {
  const [selectedDoctor, setSelectedDoctor] = useState<typeof doctors[0] | null>(null);

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
              />
            </div>
            <Button variant="outline" className="h-12 w-12 rounded-xl border-gray-200 px-0">
              <Filter className="w-4 h-4 text-gray-600" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all rounded-2xl overflow-hidden bg-white group">
              <CardContent className="p-0 flex flex-col sm:flex-row">
                <div className="w-full sm:w-40 h-40 sm:h-auto bg-gray-100 relative flex-shrink-0">
                  <img 
                    src={doctor.avatar} 
                    alt={doctor.name} 
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
                    <h3 className="text-lg font-bold text-gray-900">{doctor.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">{doctor.experience} experience</p>
                    
                    <div className="flex items-center gap-2 text-xs text-green-600 font-medium bg-green-50 w-fit px-2 py-1 rounded-md">
                      <Clock className="w-3 h-3" />
                      {doctor.availability}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-50 flex gap-3">
                     <Dialog>
                      <DialogTrigger asChild>
                        <Button className="flex-1 rounded-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20" onClick={() => setSelectedDoctor(doctor)}>
                          Book Appointment
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Book Appointment</DialogTitle>
                          <DialogDescription>
                            Schedule a visit with {selectedDoctor?.name}.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <label className="text-sm font-medium">Select Date</label>
                            <Input type="date" className="col-span-3" />
                          </div>
                          <div className="grid gap-2">
                            <label className="text-sm font-medium">Reason for Visit</label>
                            <Input placeholder="E.g., Annual checkup, headache..." className="col-span-3" />
                          </div>
                          <div className="grid gap-2">
                            <label className="text-sm font-medium">Attach Medical Records (Optional)</label>
                            <FileUpload label="Upload past prescriptions or reports" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" onClick={() => alert('Appointment Request Sent with Attachments!')}>Confirm Booking</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
