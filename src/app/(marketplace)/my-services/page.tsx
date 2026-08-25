'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSkillSetuStore } from '@/lib/data/store';
import { Service, ServiceStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PlusCircle, Eye, Pause, Play, Trash2, Edit, Calendar } from 'lucide-react';
import { formatINR, formatDate } from '@/lib/utils';

export default function MyServicesPage() {
  const store = useSkillSetuStore();
  const student = store.getCurrentStudent();
  const allServices = store.getServices().filter((s) => s.student_id === student.id);

  const [activeTab, setActiveTab] = useState('published');

  const published = allServices.filter((s) => s.status === 'published');
  const drafts = allServices.filter((s) => s.status === 'draft');
  const paused = allServices.filter((s) => s.status === 'paused');

  const handleToggleStatus = (service: Service) => {
    const nextStatus: ServiceStatus = service.status === 'published' ? 'paused' : 'published';
    store.updateService(service.id, { status: nextStatus });
  };

  const handleDelete = (serviceId: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      store.deleteService(serviceId);
    }
  };

  const renderServiceList = (servicesList: Service[]) => {
    if (servicesList.length === 0) {
      return (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <p className="text-xs text-slate-400">No services found in this tab.</p>
          <Link href="/create">
            <Button variant="default" size="sm" className="font-bold text-xs">
              <PlusCircle className="w-3.5 h-3.5 mr-1" />
              Create Service Listing
            </Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {servicesList.map((service) => (
          <div
            key={service.id}
            className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                  {service.category}
                </span>
                <Badge
                  variant={
                    service.status === 'published'
                      ? 'emerald'
                      : service.status === 'paused'
                      ? 'amber'
                      : 'secondary'
                  }
                  className="text-[10px] capitalize"
                >
                  {service.status}
                </Badge>
              </div>

              <Link
                href={`/services/${service.id}`}
                className="text-base font-bold text-slate-900 hover:text-orange-600 transition-colors block truncate"
              >
                {service.title}
              </Link>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                <span>
                  Price: <strong className="text-slate-900">{formatINR(service.price)}</strong>
                  /{service.pricing_unit.replace('per_', '')}
                </span>
                <span>•</span>
                <span>{service.views_count} views</span>
                <span>•</span>
                <span>{service.bookings_count} bookings</span>
                <span>•</span>
                <span>Created {formatDate(service.created_at)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <Link href={`/services/${service.id}`}>
                <Button variant="outline" size="sm" className="text-xs h-8">
                  <Eye className="w-3.5 h-3.5 mr-1" />
                  View
                </Button>
              </Link>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleStatus(service)}
                className="text-xs h-8"
              >
                {service.status === 'published' ? (
                  <>
                    <Pause className="w-3.5 h-3.5 mr-1 text-amber-600" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    Activate
                  </>
                )}
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(service.id)}
                className="text-xs h-8"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Services Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your published skills, active listings, pricing, and availability.
          </p>
        </div>

        <Link href="/create">
          <Button variant="default" className="font-bold text-xs shadow-xs">
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Create New Listing
          </Button>
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="published">
            Published ({published.length})
          </TabsTrigger>
          <TabsTrigger value="draft">
            Drafts ({drafts.length})
          </TabsTrigger>
          <TabsTrigger value="paused">
            Paused ({paused.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="published">
          {renderServiceList(published)}
        </TabsContent>
        <TabsContent value="draft">
          {renderServiceList(drafts)}
        </TabsContent>
        <TabsContent value="paused">
          {renderServiceList(paused)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
