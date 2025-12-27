// src/services/mapper.service.ts
import { Injectable } from '@angular/core';
import { CraftsmanApi, ProfessionApi } from '../../model/api-response.model';
import { Carpenter } from '../../model/carpenter.model';

@Injectable({
  providedIn: 'root'
})
export class MapperService {
  
  /**
   * Map API craftsman data to Carpenter model
   */
  mapToCarpenter(
    craftsmanApi: CraftsmanApi, 
    professions: ProfessionApi[]
  ): Carpenter {
    const profession = professions.find(p => p.id === craftsmanApi.professionId);
    
    return {
      id: craftsmanApi.id,
      name: craftsmanApi.fullName,
      phone: this.generatePlaceholderPhone(craftsmanApi.userId),
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
      imageUrl: undefined // API doesn't provide images yet
    };
  }

  /**
   * Filter carpenters from craftsmen list
   */
  filterCarpenters(
    craftsmen: CraftsmanApi[], 
    professions: ProfessionApi[]
  ): Carpenter[] {
    const carpenterProfession = professions.find(p => p.arabicName === 'نجار');
    
    if (!carpenterProfession) return [];
    
    return craftsmen
      .filter(c => c.professionId === carpenterProfession.id)
      .map(c => this.mapToCarpenter(c, professions));
  }

  // Placeholder generators (remove when API provides real data)
  private generatePlaceholderPhone(userId: number): string {
    return `+20 1${userId.toString().padStart(9, '0')}`;
  }

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
    return [];
  }
}