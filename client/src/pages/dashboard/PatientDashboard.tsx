import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Activity, Heart, Search, ArrowRight, User, Upload, Building2, UserRound } from "lucide-react";
import { Link } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { FileUpload } from "@/components/ui/file-upload";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function PatientDashboard() {
  const { user } = useAuth();

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments', user?.id],
    queryFn: () => user ? api.getPatientAppointments(user.id) : Promise.resolve([]),
    enabled: !!user,
  });

  const nextAppointment = appointments[0];

  if (!user) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Please log in to view your dashboard</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900">
              Hello, {user.name.split(" ")[0]} 👋
            </h1>
            <p className="text-gray-500">Here's your health overview for today.</p>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-xl h-12 px-4 border-gray-200 text-gray-600 hover:text-primary hover:border-primary/50" data-testid="button-upload-records">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Records
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Upload Medical Record</DialogTitle>
                  <DialogDescription>
                    Add past prescriptions, lab results, or insurance documents to your profile.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <FileUpload />
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={() => alert('Record Uploaded!')}>Save to Profile</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Link href="/doctors">
              <Button className="bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25 rounded-xl h-12 px-6" data-testid="button-find-specialist">
                <Search className="w-4 h-4 mr-2" />
                Find a Specialist
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-900">Blood Group</CardTitle>
              <Heart className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700" data-testid="text-blood-type">{user.bloodType || "Not Set"}</div>
              <p className="text-xs text-blue-600/80 mt-1">Universal Donor</p>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm bg-gradient-to-br from-purple-50 to-purple-100/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-purple-900">Next Checkup</CardTitle>
              <Calendar className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              {nextAppointment ? (
                <>
                  <div className="text-2xl font-bold text-purple-700" data-testid="text-next-appointment-date">{nextAppointment.date}</div>
                  <p className="text-xs text-purple-600/80 mt-1">{nextAppointment.time} with {nextAppointment.doctor.user.name}</p>
                </>
              ) : (
                <div className="text-lg font-bold text-purple-700">No upcoming</div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-gradient-to-br from-teal-50 to-teal-100/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-teal-900">Health Status</CardTitle>
              <Activity className="w-4 h-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-700">Stable</div>
              <p className="text-xs text-teal-600/80 mt-1">Last vitals: Normal</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Appointments */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-heading font-semibold">Upcoming Appointments</h2>
              <Button variant="link" className="text-primary">View all</Button>
            </div>
            
            <div className="space-y-4">
              {isLoading ? (
                <p className="text-gray-500 text-center py-8">Loading appointments...</p>
              ) : appointments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No appointments scheduled</p>
              ) : (
                appointments.map((apt: any) => (
                  <div key={apt.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow" data-testid={`card-appointment-${apt.id}`}>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold">
                      {apt.date.split("-")[2]}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{apt.type}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <User className="w-3 h-3" /> {apt.doctor.user.name}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {apt.time}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full ${
                          apt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-lg border-gray-200">
                      Reschedule
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h2 className="text-xl font-heading font-semibold">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/hospitals">
                <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-primary/50 hover:shadow-md hover:shadow-primary/5 transition-all cursor-pointer group" data-testid="card-find-hospital">
                  <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Find Hospital</h3>
                  <p className="text-xs text-gray-500 mt-1">Locate nearest care center</p>
                </div>
              </Link>

              <Link href="/doctors">
                <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-primary/50 hover:shadow-md hover:shadow-primary/5 transition-all cursor-pointer group" data-testid="card-book-specialist">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <UserRound className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Book Specialist</h3>
                  <p className="text-xs text-gray-500 mt-1">Cardiology, Neurology, etc.</p>
                </div>
              </Link>

              <Link href="/records">
                <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-primary/50 hover:shadow-md hover:shadow-primary/5 transition-all cursor-pointer group">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900">My Records</h3>
                  <p className="text-xs text-gray-500 mt-1">View history & vitals</p>
                </div>
              </Link>

              <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-primary/50 hover:shadow-md hover:shadow-primary/5 transition-all cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Heart className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900">Emergency</h3>
                <p className="text-xs text-gray-500 mt-1">Call for ambulance</p>
              </div>
            </div>
            
            {/* Transfer Info Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-primary to-teal-600 text-white shadow-lg shadow-primary/20 mt-4 relative overflow-hidden group cursor-pointer">
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-1">Transfer Patient Data</h3>
                <p className="text-white/80 text-sm mb-4 max-w-[200px]">Securely transfer your medical history to another registered hospital.</p>
                <Button variant="secondary" size="sm" className="rounded-lg bg-white/20 text-white hover:bg-white hover:text-primary border-none backdrop-blur-sm">
                  Start Transfer <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
