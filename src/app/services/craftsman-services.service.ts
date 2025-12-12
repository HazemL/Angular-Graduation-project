import { Injectable } from '@angular/core';

export interface Service {
  icon: string;
  title: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class CraftsmanServicesService {
  private static readonly servicesData: Service[] = [
    { icon: 'plumbing', title: 'سباك', description: 'إصلاح وتركيب' },
    { icon: 'electrical_services', title: 'كهربائي', description: 'صيانة وتأسيس' },
    { icon: 'carpenter', title: 'نجار', description: 'تصنيع وتركيب' },
    { icon: 'ac_unit', title: 'فني تكييف', description: 'شحن وصيانة' },
    { icon: 'format_paint', title: 'نقاش', description: 'دهانات وتشطيبات' },
    { icon: 'window', title: 'فني ألوميتال', description: 'مطابخ وشبابيك' },
    { icon: 'propane_tank', title: 'فني غاز', description: 'صيانة وتركيب' },
    { icon: 'blender', title: 'إصلاح أجهزة', description: 'غسالات وثلاجات' }
  ];

  constructor() { }

  /**
   * Get all available services
   */
  getAllServices(): Service[] {
    return [...CraftsmanServicesService.servicesData];
  }

  /**
   * Get a service by title
   */
  getServiceByTitle(title: string): Service | undefined {
    return CraftsmanServicesService.servicesData.find(service => service.title === title);
  }

  /**
   * Get service titles only
   */
  getServiceTitles(): string[] {
    return CraftsmanServicesService.servicesData.map(service => service.title);
  }

  /**
   * Get service by icon
   */
  getServiceByIcon(icon: string): Service | undefined {
    return CraftsmanServicesService.servicesData.find(service => service.icon === icon);
  }

  /**
   * Check if a service exists by title
   */
  hasService(title: string): boolean {
    return CraftsmanServicesService.servicesData.some(service => service.title === title);
  }
}
