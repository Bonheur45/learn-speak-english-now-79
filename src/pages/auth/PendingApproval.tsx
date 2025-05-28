
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Clock, Mail, Users } from 'lucide-react';

const PendingApproval = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl">Registration Under Review</CardTitle>
          <CardDescription>
            Welcome to Let's Do It English Program, {user?.profile?.full_name}!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">What's happening now?</h3>
            <p className="text-blue-800">
              Your registration has been successfully submitted and is currently being reviewed by our academic team. 
              This process typically takes 1-2 business days.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Users className="w-5 h-5 text-green-600 mt-1" />
              <div>
                <h4 className="font-medium">Cohort Assignment</h4>
                <p className="text-sm text-gray-600">
                  {user?.studentProfile?.cohorts?.name ? 
                    `You've been assigned to: ${user.studentProfile.cohorts.name}` :
                    'You will be assigned to a cohort based on your English level'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h4 className="font-medium">Email Notifications</h4>
                <p className="text-sm text-gray-600">
                  You'll receive an email confirmation once your registration is approved and you can access the full program.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Limited Access Available</h4>
            <p className="text-sm text-gray-600 mb-3">
              While waiting for approval, you can access the first 3 days of content in your assigned level to get started.
            </p>
            <Button variant="outline" className="w-full">
              Explore Sample Content
            </Button>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-600 mb-3">
              Need help or have questions?
            </p>
            <div className="space-y-2">
              <Button variant="outline" size="sm">
                Contact Support
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingApproval;
