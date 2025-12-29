// src/services/mapper.service.ts
import { Injectable } from '@angular/core';
import { CraftsmanApi, ProfessionApi } from '../../model/api-response.model';
import { Carpenter } from '../../model/carpenter.model';
import { Painter } from '../../model/painter.model';
import { AcTechnician } from '../../model/ac-technician.model';
import { Electrician } from '../../model/electrician.model';
import { Plumber } from '../../model/plumber.model';
import { AluminumTechnician } from '../../model/aluminum-technician.model'; 
import { GasTechnician } from '../../model/gas-technician.model';

import { DeviceRepair } from '../../model/device-repair.model';

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
    const painterProfession = professions.find(p => p.arabicName === 'نقاش');
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
mapToElectrician(craftsmanApi: CraftsmanApi, professions: ProfessionApi[]): Electrician {
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
    certifications: this.generateElectricianCertifications(),
    imageUrl: craftsmanApi.profileImageUrl || undefined
  };
}

/**
 * Filter electricians from craftsmen list
 */
filterElectricians(craftsmen: CraftsmanApi[], professions: ProfessionApi[]): Electrician[] {
  const electricianProfession = professions.find(p => p.arabicName === 'كهربائي');
  if (!electricianProfession) return [];
  
  return craftsmen
    .filter(c => c.professionId === electricianProfession.id)
    .map(c => this.mapToElectrician(c, professions));
}

// Add this private helper method
private generateElectricianCertifications(): string[] {
  const allCertifications = [
    'شهادة كهربائي معتمد',
    'ترخيص تركيبات كهربائية',
    'شهادة سلامة كهربائية',
    'دورة انظمة الحماية',
    'شهادة لوحات كهربائية',
    'ترخيص صيانة محولات',
    'دورة انظمة الطاقة الشمسية',
    'شهادة كهرباء صناعية'
  ];
  // Return random 2-4 certifications
  const count = Math.floor(Math.random() * 3) + 2;
  return allCertifications.sort(() => 0.5 - Math.random()).slice(0, count);
}
// Add these methods to your existing mapper.service.ts

/**
 * Map API craftsman data to Plumber model
 */
mapToPlumber(craftsmanApi: CraftsmanApi, professions: ProfessionApi[]): Plumber {
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
    services: this.generatePlumberServices(),
    imageUrl: craftsmanApi.profileImageUrl || undefined
  };
}

/**
 * Filter plumbers from craftsmen list
 */
filterPlumbers(craftsmen: CraftsmanApi[], professions: ProfessionApi[]): Plumber[] {
  const plumberProfession = professions.find(p => p.arabicName === 'سباك');
  if (!plumberProfession) return [];
  
  return craftsmen
    .filter(c => c.professionId === plumberProfession.id)
    .map(c => this.mapToPlumber(c, professions));
}

// Add this private helper method
private generatePlumberServices(): string[] {
  const allServices = [
    'إصلاح تسريبات المياه',
    'تركيب مواسير',
    'صيانة حمامات',
    'تركيب سخانات',
    'تسليك مجاري',
    'تركيب خلاطات',
    'صيانة خزانات',
    'فحص شبكات المياه'
  ];
  // Return random 4-6 services
  const count = Math.floor(Math.random() * 3) + 4;
  return allServices.sort(() => 0.5 - Math.random()).slice(0, count);
}

// Add these methods to your existing mapper.service.ts

/**
 * Map API craftsman data to AluminumTechnician model
 */
mapToAluminumTechnician(craftsmanApi: CraftsmanApi, professions: ProfessionApi[]): AluminumTechnician {
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
    services: this.generateAluminumServices(),
    materials: this.generateAluminumMaterials(),
    projects: this.generatePlaceholderProjects(),
    warranty: Math.random() > 0.3, // Random for now
    imageUrl: craftsmanApi.profileImageUrl || undefined
  };
}

/**
 * Filter aluminum technicians from craftsmen list
 */
filterAluminumTechnicians(craftsmen: CraftsmanApi[], professions: ProfessionApi[]): AluminumTechnician[] {
  const aluminumProfession = professions.find(p => p.arabicName === 'فني ألوميتال');
  if (!aluminumProfession) return [];
  
  return craftsmen
    .filter(c => c.professionId === aluminumProfession.id)
    .map(c => this.mapToAluminumTechnician(c, professions));
}

// Add these private helper methods
private generateAluminumServices(): string[] {
  const allServices = [
    'تركيب مطابخ ألوميتال',
    'تركيب شبابيك',
    'تركيب أبواب ألوميتال',
    'واجهات زجاجية',
    'بارتشن',
    'كلادينج',
    'شتر ألوميتال',
    'درابزين'
  ];
  // Return random 4-6 services
  const count = Math.floor(Math.random() * 3) + 4;
  return allServices.sort(() => 0.5 - Math.random()).slice(0, count);
}

private generateAluminumMaterials(): string[] {
  const allMaterials = [
    'ألوميتال محلي',
    'ألوميتال مستورد',
    'ألوميتال سعودي',
    'ألوميتال تركي',
    'زجاج سيكوريت',
    'زجاج عادي',
    'إكسسوارات ألمانية',
    'إكسسوارات إيطالية'
  ];
  // Return random 3-5 materials
  const count = Math.floor(Math.random() * 3) + 3;
  return allMaterials.sort(() => 0.5 - Math.random()).slice(0, count);
}

// Add these methods to your existing mapper.service.ts

/**
 * Map API craftsman data to GasTechnician model
 */
mapToGasTechnician(craftsmanApi: CraftsmanApi, professions: ProfessionApi[]): GasTechnician {
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
    services: this.generateGasServices(),
    certifications: this.generateGasCertifications(),
    emergencyService: Math.random() > 0.4, // Random for now
    licensedBy: this.generateLicenseAuthority(),
    imageUrl: craftsmanApi.profileImageUrl || undefined
  };
}

/**
 * Filter gas technicians from craftsmen list
 */
filterGasTechnicians(craftsmen: CraftsmanApi[], professions: ProfessionApi[]): GasTechnician[] {
  const gasProfession = professions.find(p => p.arabicName === 'فني غاز');
  if (!gasProfession) return [];
  
  return craftsmen
    .filter(c => c.professionId === gasProfession.id)
    .map(c => this.mapToGasTechnician(c, professions));
}

// Add these private helper methods
private generateGasServices(): string[] {
  const allServices = [
    'صيانة مواقد الغاز',
    'تركيب أنابيب غاز',
    'فحص تسريبات الغاز',
    'تركيب سخانات غاز',
    'صيانة أفران غاز',
    'تحويل من أنبوبة لغاز طبيعي',
    'فحص دوري للسلامة',
    'صيانة عدادات الغاز'
  ];
  // Return random 4-6 services
  const count = Math.floor(Math.random() * 3) + 4;
  return allServices.sort(() => 0.5 - Math.random()).slice(0, count);
}

private generateGasCertifications(): string[] {
  const allCertifications = [
    'شهادة فني غاز معتمد',
    'ترخيص تركيب غاز طبيعي',
    'شهادة سلامة غاز',
    'دورة كشف التسريبات',
    'ترخيص صيانة سخانات',
    'شهادة تمديدات غاز',
    'دورة السلامة المهنية'
  ];
  // Return random 2-4 certifications
  const count = Math.floor(Math.random() * 3) + 2;
  return allCertifications.sort(() => 0.5 - Math.random()).slice(0, count);
}

private generateLicenseAuthority(): string | undefined {
  const authorities = [
    'وزارة البترول',
    'هيئة الطاقة',
    'شركة الغاز الطبيعي',
    'الهيئة القومية للسلامة',
    null
  ];
  const selected = authorities[Math.floor(Math.random() * authorities.length)];
  return selected || undefined;
}
// Add to mapper.service.ts after the gas technician methods

/**
 * Map API craftsman data to DeviceRepair model
 */
mapToDeviceRepair(craftsmanApi: CraftsmanApi, professions: ProfessionApi[]): DeviceRepair {
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
    deviceTypes: this.generateDeviceTypes(),
    brands: this.generateDeviceBrands(),
    services: this.generateDeviceServices(),
    warranty: Math.random() > 0.3, // Random for now
    warrantyPeriod: this.generateWarrantyPeriod(),
    imageUrl: craftsmanApi.profileImageUrl || undefined
  };
}

/**
 * Filter device repair technicians from craftsmen list
 */
filterDeviceRepairs(craftsmen: CraftsmanApi[], professions: ProfessionApi[]): DeviceRepair[] {
  const deviceRepairProfession = professions.find(p => p.arabicName === 'إصلاح أجهزة');
  if (!deviceRepairProfession) return [];
  
  return craftsmen
    .filter(c => c.professionId === deviceRepairProfession.id)
    .map(c => this.mapToDeviceRepair(c, professions));
}

// Add these private helper methods
private generateDeviceTypes(): string[] {
  const allDevices = [
    'غسالات ملابس',
    'ثلاجات',
    'ديب فريزر',
    'غسالات أطباق',
    'بوتاجازات',
    'أفران كهربائية',
    'ميكروويف',
    'مكانس كهربائية',
    'خلاطات',
    'محضرات طعام'
  ];
  // Return random 3-5 device types
  const count = Math.floor(Math.random() * 3) + 3;
  return allDevices.sort(() => 0.5 - Math.random()).slice(0, count);
}

private generateDeviceBrands(): string[] {
  const allBrands = [
    'سامسونج',
    'ال جي',
    'بوش',
    'سيمنس',
    'ويرلبول',
    'هوفر',
    'إنديست',
    'زانوسي',
    'كريازي',
    'شارب',
    'توشيبا',
    'باناسونيك'
  ];
  // Return random 4-6 brands
  const count = Math.floor(Math.random() * 3) + 4;
  return allBrands.sort(() => 0.5 - Math.random()).slice(0, count);
}

private generateDeviceServices(): string[] {
  const allServices = [
    'صيانة دورية',
    'إصلاح أعطال',
    'تغيير قطع غيار',
    'صيانة منزلية',
    'فحص شامل',
    'تنظيف عميق',
    'ضبط وبرمجة',
    'استشارات فنية'
  ];
  // Return random 4-6 services
  const count = Math.floor(Math.random() * 3) + 4;
  return allServices.sort(() => 0.5 - Math.random()).slice(0, count);
}

private generateWarrantyPeriod(): string | undefined {
  const periods = [
    'شهر واحد',
    '3 شهور',
    '6 شهور',
    'سنة',
    'سنتين',
    undefined
  ];
  return periods[Math.floor(Math.random() * periods.length)];
}

}