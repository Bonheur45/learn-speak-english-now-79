import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Cohort, getCohorts, refreshCohort } from '@/services/cohorts';
import { Calendar, Calendar as CalendarIcon, ChevronRight, Edit, Users, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const TutorCohorts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    getCohorts()
      .then(setCohorts)
      .catch((err) => console.error('Failed to fetch cohorts', err))
      .finally(() => setLoading(false));
  }, []);
  
  // Group cohorts by status
  const activeCohorts = cohorts.filter(c => c.status === 'active');
  const upcomingCohorts = cohorts.filter(c => c.status === 'upcoming');
  const completedCohorts = cohorts.filter(c => c.status === 'completed');
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isLoggedIn={true} userRole="tutor" />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-brand-blue">Cohort Management</h1>
            <p className="text-gray-600">Manage all course cohorts and their trimesters</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex gap-4">
            <Button asChild>
              <Link to="/tutor/cohorts/new">Create New Cohort</Link>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-8 w-full max-w-md mx-auto flex">
            <TabsTrigger value="active" className="flex-1">Active ({activeCohorts.length})</TabsTrigger>
            <TabsTrigger value="upcoming" className="flex-1">Upcoming ({upcomingCohorts.length})</TabsTrigger>
            <TabsTrigger value="completed" className="flex-1">Completed ({completedCohorts.length})</TabsTrigger>
            <TabsTrigger value="all" className="flex-1">All ({cohorts.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            <div className="grid gap-6">
              {activeCohorts.map(cohort => (
                <CohortCard key={cohort.id} cohort={cohort} />
              ))}
              {activeCohorts.length === 0 && (
                <EmptyState message="No active cohorts found" />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="upcoming">
            <div className="grid gap-6">
              {upcomingCohorts.map(cohort => (
                <CohortCard key={cohort.id} cohort={cohort} />
              ))}
              {upcomingCohorts.length === 0 && (
                <EmptyState message="No upcoming cohorts found" />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="completed">
            <div className="grid gap-6">
              {completedCohorts.map(cohort => (
                <CohortCard key={cohort.id} cohort={cohort} />
              ))}
              {completedCohorts.length === 0 && (
                <EmptyState message="No completed cohorts found" />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="all">
            <div className="grid gap-6">
              {cohorts.map(cohort => (
                <CohortCard key={cohort.id} cohort={cohort} />
              ))}
              {cohorts.length === 0 && (
                <EmptyState message="No cohorts found" />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Let's Do It English. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Cohort Card Component
interface CohortCardProps {
  cohort: {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    current_trimester: number;
    status: 'active' | 'upcoming' | 'completed';
  }
}

const CohortCard = ({ cohort }: CohortCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const [refreshing, setRefreshing] = React.useState(false);
  const studentCount = cohort.enrolled_students ?? Math.floor(Math.random() * 30) + 10;
  
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshCohort(cohort.id);
      toast({ title: 'Cohort refreshed', description: cohort.name });
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Unable to refresh', variant: 'destructive' });
    } finally {
      setRefreshing(false);
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gray-50 border-b">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>{cohort.name}</CardTitle>
              <Badge className={getStatusColor(cohort.status)}>
                {cohort.status}
              </Badge>
            </div>
            <CardDescription className="mt-1">
              {new Date(cohort.start_date).toLocaleDateString()} - {new Date(cohort.end_date).toLocaleDateString()}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to={`/tutor/cohorts/${cohort.id}/edit`}>
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Link>
            </Button>
            <Button onClick={handleRefresh} variant="outline" size="sm" disabled={refreshing} className="flex items-center gap-1">
              <RefreshCw className="h-4 w-4" /> {refreshing ? 'Refreshing' : 'Refresh'}
            </Button>
            <Button asChild size="sm">
              <Link to={`/tutor/cohorts/${cohort.id}`}>
                Manage
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Trimester</p>
              <p className="font-medium">{cohort.current_trimester} of 3</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Enrolled Students</p>
              <p className="font-medium">{studentCount} students</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-full">
              <CalendarIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-medium">12 months</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 border-t pt-6">
          <h3 className="font-medium mb-4">Trimester Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(trimNum => (
              <Link 
                key={trimNum}
                to={`/tutor/cohorts/${cohort.id}/trimesters/${trimNum}`}
                className={`
                  p-4 rounded-lg border flex items-center justify-between
                  ${trimNum === cohort.current_trimester ? 'border-blue-500 bg-blue-50' : 
                    trimNum < cohort.current_trimester ? 'border-green-500 bg-green-50' : 
                    'border-gray-200 hover:border-gray-300'}
                  transition-colors
                `}
              >
                <div>
                  <h4 className="font-medium">Trimester {trimNum}</h4>
                  <p className="text-sm text-gray-600">
                    {trimNum === cohort.current_trimester ? 'In Progress' : 
                      trimNum < cohort.current_trimester ? 'Completed' : 'Upcoming'}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 border-t flex flex-col sm:flex-row justify-between py-4">
        <div className="flex gap-4 mb-3 sm:mb-0">
          <Button asChild variant="outline" size="sm">
            <Link to={`/tutor/cohorts/${cohort.id}/students`}>
              View Students
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to={`/tutor/cohorts/${cohort.id}/materials`}>
              View Materials
            </Link>
          </Button>
        </div>
        <Button asChild size="sm">
          <Link to={`/tutor/cohorts/${cohort.id}/reports`}>
            Progress Reports
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

// Empty state component
const EmptyState = ({ message }: { message: string }) => (
  <Card>
    <CardContent className="py-12 text-center">
      <p className="text-gray-500 mb-4">{message}</p>
      <Button asChild>
        <Link to="/tutor/cohorts/new">Create New Cohort</Link>
      </Button>
    </CardContent>
  </Card>
);

export default TutorCohorts;
