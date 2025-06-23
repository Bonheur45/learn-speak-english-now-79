import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { createCohort, CohortPayload } from '@/services/cohorts';
import { toast } from '@/hooks/use-toast';

interface FormData extends CohortPayload {}

const CreateCohort: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const cohort = await createCohort(data);
      toast({ title: 'Cohort created', description: cohort.name });
      navigate('/tutor/cohorts');
    } catch (err: any) {
      console.error(err);
      toast({ title: 'Error', description: 'Unable to create cohort', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout isLoggedIn userRole="tutor">
      <div className="container mx-auto max-w-xl py-10">
        <Card>
          <CardHeader>
            <CardTitle>Create New Cohort</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block text-sm mb-1">Name</label>
                <Input {...register('name', { required: true })} placeholder="Spring 2025 A1-A2" />
                {errors.name && <p className="text-xs text-red-500">Name required</p>}
              </div>
              <div>
                <label className="block text-sm mb-1">Proficiency Level</label>
                <Select onValueChange={(v)=>setValue('proficiency_level', v as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A1-A2">A1-A2</SelectItem>
                    <SelectItem value="B1-B2">B1-B2</SelectItem>
                    <SelectItem value="C1-C2">C1-C2</SelectItem>
                  </SelectContent>
                </Select>
                {errors.proficiency_level && <p className="text-xs text-red-500">Required</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Start Date</label>
                  <Input type="date" {...register('start_date')} />
                </div>
                <div>
                  <label className="block text-sm mb-1">End Date</label>
                  <Input type="date" {...register('end_date')} />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Capacity</label>
                <Input type="number" {...register('max_students')} placeholder="30" />
              </div>
              <Button type="submit" disabled={submitting} className="w-full">{submitting ? 'Creating...' : 'Create'}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateCohort; 