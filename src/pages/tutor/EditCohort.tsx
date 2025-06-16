import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { CohortPayload, getCohort, updateCohort } from '@/services/cohorts';
import { toast } from '@/hooks/use-toast';

const EditCohort: React.FC = () => {
  const { cohortId } = useParams<{ cohortId: string }>();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm<CohortPayload & { status: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!cohortId) return;
    getCohort(cohortId)
      .then((c) => {
        setValue('name', c.name);
        setValue('proficiency_level', c.proficiency_level);
        setValue('max_students', c.capacity);
        setValue('start_date', c.start_date?.slice(0, 10));
        setValue('end_date', c.end_date?.slice(0, 10));
        // @ts-ignore
        setValue('status', c.status);
      })
      .finally(() => setLoading(false));
  }, [cohortId, setValue]);

  const onSubmit = async (data: any) => {
    if (!cohortId) return;
    setSaving(true);
    try {
      await updateCohort(cohortId, data);
      toast({ title: 'Updated', description: data.name });
      navigate('/tutor/cohorts');
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Update failed', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <Layout isLoggedIn userRole="tutor">
      <div className="container mx-auto max-w-xl py-10">
        <Card>
          <CardHeader>
            <CardTitle>Edit Cohort</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block text-sm mb-1">Name</label>
                <Input {...register('name', { required: true })} />
              </div>
              <div>
                <label className="block text-sm mb-1">Proficiency Level</label>
                <Select defaultValue="" onValueChange={(v)=>setValue('proficiency_level', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A1-A2">A1-A2</SelectItem>
                    <SelectItem value="B1-B2">B1-B2</SelectItem>
                    <SelectItem value="C1-C2">C1-C2</SelectItem>
                  </SelectContent>
                </Select>
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
                <Input type="number" {...register('max_students')} />
              </div>
              <div>
                <label className="block text-sm mb-1">Status</label>
                <Select defaultValue="" onValueChange={(v)=>setValue('status', v)}>
                  <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={saving} className="w-full">{saving ? 'Saving...' : 'Save'}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EditCohort; 