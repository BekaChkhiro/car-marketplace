import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

export interface Option {
  value: string;
  label: string;
}

export const useTranslatedOptions = () => {
  const { t } = useTranslation(['filter', 'profile']);

  return useMemo(() => ({
    interiorMaterials: [
      { value: 'fabric', label: t('filter:interiorMaterials.fabric') },
      { value: 'leather', label: t('filter:interiorMaterials.leather') },
      { value: 'synthetic_leather', label: t('filter:interiorMaterials.synthetic_leather') },
      { value: 'combined', label: t('filter:interiorMaterials.combined') },
      { value: 'alcantara', label: t('filter:interiorMaterials.alcantara') }
    ],
    
    fuelTypes: [
      { value: 'petrol', label: t('filter:fuel.petrol') },
      { value: 'diesel', label: t('filter:fuel.diesel') },
      { value: 'hybrid', label: t('filter:fuel.hybrid') },
      { value: 'electric', label: t('filter:fuel.electric') },
      { value: 'plug_in_hybrid', label: t('filter:fuel.plug_in_hybrid') },
      { value: 'lpg', label: t('filter:fuel.lpg') },
      { value: 'cng', label: t('filter:fuel.cng') },
      { value: 'hydrogen', label: t('filter:fuel.hydrogen') }
    ],
    
    transmissions: [
      { value: 'manual', label: t('filter:transmissions.manual') },
      { value: 'automatic', label: t('filter:transmissions.automatic') }
    ],
    
    driveTypes: [
      { value: 'FWD', label: t('filter:driveTypes.front') },
      { value: 'RWD', label: t('filter:driveTypes.rear') },
      { value: 'AWD', label: t('filter:driveTypes.allWheel') },
      { value: '4WD', label: t('filter:driveTypes.fourWheel') }
    ],
    
    steeringWheels: [
      { value: 'left', label: t('filter:steeringWheels.left') },
      { value: 'right', label: t('filter:steeringWheels.right') }
    ],
    
    colors: [
      { value: 'white', label: t('filter:colors.white') },
      { value: 'black', label: t('filter:colors.black') },
      { value: 'silver', label: t('filter:colors.silver') },
      { value: 'gray', label: t('filter:colors.gray') },
      { value: 'red', label: t('filter:colors.red') },
      { value: 'blue', label: t('filter:colors.blue') },
      { value: 'yellow', label: t('filter:colors.yellow') },
      { value: 'green', label: t('filter:colors.green') },
      { value: 'orange', label: t('filter:colors.orange') },
      { value: 'gold', label: t('filter:colors.gold') },
      { value: 'purple', label: t('filter:colors.purple') },
      { value: 'pink', label: t('filter:colors.pink') },
      { value: 'beige', label: t('filter:colors.beige') },
      { value: 'burgundy', label: t('filter:colors.burgundy') },
      { value: 'lightblue', label: t('filter:colors.lightblue') },
      { value: 'brown', label: t('filter:colors.brown') },
      { value: 'other', label: t('filter:colors.other') }
    ],
    
    interiorColors: [
      { value: 'black', label: t('filter:colors.black') },
      { value: 'white', label: t('filter:colors.white') },
      { value: 'gray', label: t('filter:colors.gray') },
      { value: 'brown', label: t('filter:colors.brown') },
      { value: 'beige', label: t('filter:colors.beige') },
      { value: 'red', label: t('filter:colors.red') },
      { value: 'blue', label: t('filter:colors.blue') },
      { value: 'yellow', label: t('filter:colors.yellow') },
      { value: 'orange', label: t('filter:colors.orange') },
      { value: 'burgundy', label: t('filter:colors.burgundy') },
      { value: 'gold', label: t('filter:colors.gold') }
    ],
    
    locationTypes: [
      { value: 'georgia', label: t('profile:addCar.location.inGeorgia') },
      { value: 'transit', label: t('profile:addCar.location.inTransit') },
      { value: 'international', label: t('profile:addCar.location.international') }
    ],
    
    engineSizes: Array.from({ length: 261 }, (_, i) => {
      const value = ((i + 1) * 0.05).toFixed(2);
      return { value, label: value };
    }),
    
    vipStatuses: [
      { value: 'none', label: t('profile:addCar.vipStatus.types.none') },
      { value: 'vip', label: t('profile:addCar.vipStatus.types.vip') },
      { value: 'vip_plus', label: t('profile:addCar.vipStatus.types.vip_plus') },
      { value: 'super_vip', label: t('profile:addCar.vipStatus.types.super_vip') }
    ],
    
    cities: [
      { value: 'თბილისი', label: t('filter:locations.tbilisi') },
      { value: 'ბათუმი', label: t('filter:locations.batumi') },
      { value: 'ქუთაისი', label: t('filter:locations.kutaisi') },
      { value: 'რუსთავი', label: t('filter:locations.rustavi') },
      { value: 'გორი', label: t('filter:locations.gori') },
      { value: 'ზუგდიდი', label: t('filter:locations.zugdidi') },
      { value: 'ფოთი', label: t('filter:locations.poti') },
      { value: 'ხაშური', label: t('profile:cities.khashuri') },
      { value: 'სამტრედია', label: t('profile:cities.samtredia') },
      { value: 'სენაკი', label: t('profile:cities.senaki') }
    ],
    
    countries: [
      { value: 'საქართველო', label: t('profile:countries.georgia') },
      { value: 'გერმანია', label: t('profile:countries.germany') },
      { value: 'აშშ', label: t('profile:countries.usa') },
      { value: 'იაპონია', label: t('profile:countries.japan') },
      { value: 'დიდი ბრიტანეთი', label: t('profile:countries.uk') },
      { value: 'საფრანგეთი', label: t('profile:countries.france') },
      { value: 'იტალია', label: t('profile:countries.italy') },
      { value: 'ესპანეთი', label: t('profile:countries.spain') },
      { value: 'ნიდერლანდები', label: t('profile:countries.netherlands') },
      { value: 'ჩინეთი', label: t('profile:countries.china') },
      { value: 'კანადა', label: t('profile:countries.canada') },
      { value: 'თურქეთი', label: t('profile:countries.turkey') },
      { value: 'პოლონეთი', label: t('profile:countries.poland') },
      { value: 'სომხეთი', label: t('profile:countries.armenia') }
    ],
    
    driveTypesSwitcher: [
      { value: 'front', label: t('filter:driveTypes.front') },
      { value: 'rear', label: t('filter:driveTypes.rear') },
      { value: '4x4', label: t('filter:driveTypes.allWheel') },
      { value: 'all', label: t('filter:driveTypes.fourWheel') }
    ],
    
    steeringWheelsSwitcher: [
      { value: 'left', label: t('filter:steeringWheels.left') },
      { value: 'right', label: t('filter:steeringWheels.right') }
    ]
  }), [t]);
};