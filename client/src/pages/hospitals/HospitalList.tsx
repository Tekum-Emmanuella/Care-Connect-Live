
import Layout from "@/components/layout/Layout";
import { hospitals } from "@/lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Star, Filter } from "lucide-react";

export default function HospitalList() {
  return (
    <Layout>
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-heading font-bold text-gray-900">Registered Hospitals</h1>
          <p className="text-gray-500 max-w-2xl">
            Browse all accredited healthcare facilities in the CAM HEALTH network. 
            View their specialties, available doctors, and book appointments.
          </p>
          
          <div className="flex gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search by name, location, or specialty..." 
                className="pl-10 h-12 rounded-xl bg-white border-gray-200 shadow-sm"
              />
            </div>
            <Button variant="outline" className="h-12 w-12 rounded-xl border-gray-200 px-0">
              <Filter className="w-4 h-4 text-gray-600" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {hospitals.map((hospital) => (
            <Card key={hospital.id} className="border-none shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden rounded-2xl group bg-white">
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={hospital.image} 
                  alt={hospital.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  {hospital.rating}
                </div>
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg text-xs text-white font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {hospital.distance} away
                </div>
              </div>
              <CardContent className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{hospital.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{hospital.location}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {hospital.specialties.slice(0, 3).map((spec) => (
                    <Badge key={spec} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-normal">
                      {spec}
                    </Badge>
                  ))}
                  {hospital.specialties.length > 3 && (
                    <Badge variant="secondary" className="bg-gray-50 text-gray-600">
                      +{hospital.specialties.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="text-sm">
                    <span className="font-bold text-primary">{hospital.availableDoctors}</span>
                    <span className="text-gray-500 ml-1">Doctors Available</span>
                  </div>
                  <Button size="sm" className="rounded-lg bg-primary hover:bg-primary/90">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
