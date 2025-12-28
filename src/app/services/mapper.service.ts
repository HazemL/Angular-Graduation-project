// src/services/mapper.service.ts
import { Injectable } from '@angular/core';
import { CraftsmanApi, ProfessionApi } from '../../model/api-response.model';
import { Carpenter } from '../../model/carpenter.model';
import { Painter } from '../../model/painter.model';
import { AcTechnician } from '../../model/ac-technician.model';
@Injectable({
  providedIn: 'root'
})
export class MapperService {
  
  /**
   * Map API craftsman data to Carpenter model
   */
  mapToCarpenter(craftsmanApi: CraftsmanApi, professions: ProfessionApi[]): Carpenter {
    const profession = professions.find(p => p.id === craftsmanApi.professionId);
    
    return {
      id: craftsmanApi.id,
      name: craftsmanApi.fullName,
      phone: craftsmanApi.phone,
      email: this.generatePlaceholderEmail(craftsmanApi.userId),
      address: `${craftsmanApi.cityName}, ${craftsmanApi.governorateName}`,
      specialization: profession?.arabicName || 'غير محدد',
      experience: craftsmanApi.experienceYears,
      rating: this.generatePlaceholderRating(),
      availability: craftsmanApi.isVerified,
      governorate: craftsmanApi.governorateName,
      city: craftsmanApi.cityName,
      bio: craftsmanApi.bio,
      minPrice: craftsmanApi.minPrice,
      maxPrice: craftsmanApi.maxPrice,
      isVerified: craftsmanApi.isVerified,
      verificationDate: craftsmanApi.verificationDate,
      services: this.generatePlaceholderServices(profession?.arabicName),
      imageUrl: craftsmanApi.profileImageUrl || undefined,
      portfolio: []
    };
  }

  /**
   * Map API craftsman data to Painter model
   */
  mapToPainter(craftsmanApi: CraftsmanApi, professions: ProfessionApi[]): Painter {
    const profession = professions.find(p => p.id === craftsmanApi.professionId);
    
    return {
      id: craftsmanApi.id,
      name: craftsmanApi.fullName,
      phone: craftsmanApi.phone,
      email: this.generatePlaceholderEmail(craftsmanApi.userId),
      address: `${craftsmanApi.cityName}, ${craftsmanApi.governorateName}`,
      specialization: profession?.arabicName || 'غير محدد',
      experience: craftsmanApi.experienceYears,
      rating: this.generatePlaceholderRating(),
      availability: craftsmanApi.isVerified,
      governorate: craftsmanApi.governorateName,
      city: craftsmanApi.cityName,
      bio: craftsmanApi.bio,
      minPrice: craftsmanApi.minPrice,
      maxPrice: craftsmanApi.maxPrice,
      isVerified: craftsmanApi.isVerified,
      verificationDate: craftsmanApi.verificationDate,
      paintTypes: this.generatePaintTypes(),
      techniques: this.generatePaintTechniques(),
      projects: this.generatePlaceholderProjects(),
      imageUrl: craftsmanApi.profileImageUrl || undefined
    };
  }

  /**
   * Filter carpenters from craftsmen list
   */
  filterCarpenters(craftsmen: CraftsmanApi[], professions: ProfessionApi[]): Carpenter[] {
    const carpenterProfession = professions.find(p => p.arabicName === 'نجار');
    if (!carpenterProfession) return [];
    
    return craftsmen
      .filter(c => c.professionId === carpenterProfession.id)
      .map(c => this.mapToCarpenter(c, professions));
  }

  /**
   * Filter painters from craftsmen list
   */
  filterPainters(craftsmen: CraftsmanApi[], professions: ProfessionApi[]): Painter[] {
    const painterProfession = professions.find(p => p.arabicName === 'دهان');
    if (!painterProfession) return [];
    
    return craftsmen
      .filter(c => c.professionId === painterProfession.id)
      .map(c => this.mapToPainter(c, professions));
  }

  // Placeholder generators
  private generatePlaceholderEmail(userId: number): string {
    return `craftsman${userId}@example.com`;
  }

  private generatePlaceholderRating(): number {
    return Number((Math.random() * 2 + 3).toFixed(1)); // 3.0 - 5.0
  }

  private generatePlaceholderServices(profession?: string): string[] {
    if (profession === 'نجار') {
      return ['تصنيع أثاث', 'تركيب أبواب', 'إصلاح خشب', 'ديكورات خشبية'];
    }
    if (profession === 'سباك') {
      return ['إصلاح تسريبات', 'تركيب مواسير', 'صيانة حمامات', 'تركيب سخانات'];
    }
    if (profession === 'فني كهرباء') {
      return ['تمديد كهرباء', 'إصلاح أعطال', 'تركيب لمبات', 'فحص كهربائي'];
    }
    return ['خدمات متنوعة', 'استشارات', 'صيانة عامة'];
  }

  private generatePaintTypes(): string[] {
    const allTypes = [
      'بلاستيك',
      'زيت',
      'جوتن',
      'سيكو',
      'كابوليه',
      'أكريليك',
      'ورنيش',
      'لاكيه'
    ];
    // Return random 3-5 types
    const count = Math.floor(Math.random() * 3) + 3;
    return allTypes.sort(() => 0.5 - Math.random()).slice(0, count);
  }

  private generatePaintTechniques(): string[] {
    const allTechniques = [
      'رش',
      'رول',
      'فرشاة',
      'استنسل',
      'ديكورات حديثة',
      'دهان قديم',
      'رخام صناعي'
    ];
    // Return random 2-4 techniques
    const count = Math.floor(Math.random() * 3) + 2;
    return allTechniques.sort(() => 0.5 - Math.random()).slice(0, count);
  }

  private generatePlaceholderProjects(): string[] {
    const count = Math.floor(Math.random() * 10) + 5; // 5-15 projects
    return Array(count).fill('project').map((_, i) => `مشروع ${i + 1}`);
  }


// Add these methods to your existing mapper.service.ts

/**
 * Map API craftsman data to AcTechnician model
 */
mapToAcTechnician(craftsmanApi: CraftsmanApi, professions: ProfessionApi[]): AcTechnician {
  const profession = professions.find(p => p.id === craftsmanApi.professionId);
  
  return {
    id: craftsmanApi.id,
    name: craftsmanApi.fullName,
    phone: craftsmanApi.phone,
    email: this.generatePlaceholderEmail(craftsmanApi.userId),
    address: `${craftsmanApi.cityName}, ${craftsmanApi.governorateName}`,
    specialization: profession?.arabicName || 'غير محدد',
    experience: craftsmanApi.experienceYears,
    rating: this.generatePlaceholderRating(),
    availability: craftsmanApi.isVerified,
    governorate: craftsmanApi.governorateName,
    city: craftsmanApi.cityName,
    bio: craftsmanApi.bio,
    minPrice: craftsmanApi.minPrice,
    maxPrice: craftsmanApi.maxPrice,
    isVerified: craftsmanApi.isVerified,
    verificationDate: craftsmanApi.verificationDate,
    brands: this.generateAcBrands(),
    services: this.generateAcServices(),
    emergencyService: Math.random() > 0.5, // Random for now
    imageUrl: craftsmanApi.profileImageUrl || undefined
  };
}

/**
 * Filter AC technicians from craftsmen list
 */
filterAcTechnicians(craftsmen: CraftsmanApi[], professions: ProfessionApi[]): AcTechnician[] {
  const acTechProfession = professions.find(p => p.arabicName === 'فني تكييف');
  if (!acTechProfession) return [];
  
  return craftsmen
    .filter(c => c.professionId === acTechProfession.id)
    .map(c => this.mapToAcTechnician(c, professions));
}

// Add these private helper methods
private generateAcBrands(): string[] {
  const allBrands = [
    'كاريير',
    'ال جي',
    'سامسونج',
    'جري',
    'ميديا',
    'شارب',
    'يورك',
    'ترين',
    'دايكن',
    'هيتاشي',
    'باناسونيك',
    'هاير'
  ];
  // Return random 4-7 brands
  const count = Math.floor(Math.random() * 4) + 4;
  return allBrands.sort(() => 0.5 - Math.random()).slice(0, count);
}

private generateAcServices(): string[] {
  const allServices = [
    'صيانة دورية',
    'شحن فريون',
    'تنظيف وحدات',
    'إصلاح أعطال',
    'تركيب تكييفات',
    'فك ونقل',
    'غسيل كيميائي',
    'تغيير فلاتر'
  ];
  // Return random 4-6 services
  const count = Math.floor(Math.random() * 3) + 4;
  return allServices.sort(() => 0.5 - Math.random()).slice(0, count);
}

}