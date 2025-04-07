import React, { useEffect } from 'react';
import { Car } from '../../../../api/types/car.types';
import { Car as CarIcon, Gauge, Palette, Shield, Wrench, MapPin, Check, X } from 'lucide-react';

// CSS ანიმაციები და სტილები
// ანიმაციის კლასები
const fadeInAnimation = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-in {
    animation: fadeIn 0.5s ease-out forwards;
    opacity: 0;
  }
`;

const pulseAnimation = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  .pulse {
    animation: pulse 2s infinite;
  }
`;

const shimmerAnimation = `
  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }
  .shimmer {
    background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%);
    background-size: 1000px 100%;
    animation: shimmer 2s infinite linear;
  }
`;

const cardStyle = "bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:border-green-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg relative overflow-hidden";
const sectionHeadingStyle = "text-xl font-semibold mb-4 text-gray-800 border-b pb-3 border-gray-100 flex items-center relative overflow-hidden shimmer";
const specItemStyle = "flex justify-between py-3 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 rounded-lg px-4 transition-all duration-300 border border-transparent hover:border-green-200 mb-1 spec-item-hover cursor-pointer";
const specGroupStyle = "space-y-2 bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:bg-gradient-to-br hover:from-white hover:to-green-50 border border-gray-100 hover:border-green-200";
const specLabelStyle = "font-medium text-gray-800 flex items-center";
const specValueStyle = "text-gray-600 font-semibold transition-all duration-300 hover:text-green-700";
const iconBaseStyle = "mr-2";

interface CarInfoProps {
  car: Car;
}

const CarInfo: React.FC<CarInfoProps> = ({ car }) => {
  // ანიმაციის სტილების დამატება
  useEffect(() => {
    // სტილების ელემენტის შექმნა
    const styleElement = document.createElement('style');
    styleElement.innerHTML = fadeInAnimation + pulseAnimation + shimmerAnimation;
    document.head.appendChild(styleElement);
    
    // ანიმაციის კლასების დამატება ელემენტებზე
    const sections = document.querySelectorAll('.car-section');
    sections.forEach((section, index) => {
      setTimeout(() => {
        section.classList.add('fade-in');
      }, index * 150);
    });
    
    // ფუნქცია გაწმენდისთვის
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Helper function to check if a specification value should be displayed
  const shouldDisplaySpec = (value: any): boolean => {
    if (value === undefined || value === null) return false;
    if (typeof value === 'string' && value.trim() === '') return false;
    return true;
  };

  // Helper function to format boolean values with icons
  const formatBoolean = (value: boolean | undefined) => {
    if (value === undefined) return null;
    return value ? 
      <span className="flex items-center text-green-600"><Check size={16} className="mr-1" /> დიახ</span> : 
      <span className="flex items-center text-red-500"><X size={16} className="mr-1" /> არა</span>;
  };

  // Helper function to translate drive type from English to Georgian if needed
  const translateDriveType = (driveType: string | undefined) => {
    if (!driveType) return '';
    
    switch(driveType.toLowerCase()) {
      case 'front':
      case 'fwd':
        return 'წინა';
      case 'rear':
      case 'rwd':
        return 'უკანა';
      case '4x4':
      case 'awd':
      case '4wd':
        return '4x4';
      default:
        return driveType;
    }
  };

  return (
    <div className="space-y-8">
      {/* Basic Info Card */}
      <div className={`${cardStyle} relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-r from-green-50 to-blue-50 rounded-full -mr-16 -mt-16 opacity-30 z-0"></div>
        <div className="car-section">
          <style dangerouslySetInnerHTML={{ __html: `
            .hover-card {
              transition: all 0.3s ease;
              position: relative;
              overflow: hidden;
            }
            .hover-card:hover {
              transform: translateY(-5px);
              box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
            }
            .hover-card:hover::after {
              content: '';
              position: absolute;
              bottom: 0;
              left: 0;
              width: 100%;
              height: 5px;
              background: linear-gradient(to right, #4ade80, #60a5fa);
            }
            .spec-item-hover:hover {
              background-color: rgba(74, 222, 128, 0.1);
              transform: translateX(5px);
            }
          ` }} />
        </div>
        <h1 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-3 border-gray-100 flex items-center relative z-10">
          <CarIcon size={24} className="mr-2 text-green-600" />
          {car.title || `${car.brand} ${car.model} ${car.year}`}
        </h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6 relative z-10">
          <div className="p-3 rounded-lg bg-gradient-to-br from-white to-gray-50 hover:from-green-50 hover:to-blue-50 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow">
            <p className="text-gray-500 text-sm mb-1">ფასი</p>
            <p className="font-semibold text-lg text-gray-800">
              {new Intl.NumberFormat('ka-GE', {
                style: 'currency',
                currency: car.currency || 'GEL',
                minimumFractionDigits: 0,
              }).format(car.price)}
            </p>
          </div>
          {car.specifications?.mileage && (
            <div className="p-3 rounded-lg bg-gradient-to-br from-white to-gray-50 hover:from-green-50 hover:to-blue-50 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md border border-transparent hover:border-green-200">
              <p className="text-gray-500 text-sm mb-1">გარბენი</p>
              <p className="font-semibold text-lg text-gray-800">
                {car.specifications.mileage.toLocaleString()} {car.specifications.mileage_unit || 'km'}
              </p>
            </div>
          )}
          {car.specifications?.fuel_type && (
            <div className="p-3 rounded-lg bg-gradient-to-br from-white to-gray-50 hover:from-green-50 hover:to-blue-50 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md border border-transparent hover:border-green-200">
              <p className="text-gray-500 text-sm mb-1">საწვავის ტიპი</p>
              <p className="font-semibold text-lg text-gray-800">{car.specifications.fuel_type}</p>
            </div>
          )}
          {car.specifications?.transmission && (
            <div className="p-3 rounded-lg bg-gradient-to-br from-white to-gray-50 hover:from-green-50 hover:to-blue-50 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md border border-transparent hover:border-green-200">
              <p className="text-gray-500 text-sm mb-1">გადაცემათა კოლოფი</p>
              <p className="font-semibold text-lg text-gray-800">{car.specifications.transmission}</p>
            </div>
          )}
          {car.specifications?.engine_size && (
            <div className="p-3 rounded-lg bg-gradient-to-br from-white to-gray-50 hover:from-green-50 hover:to-blue-50 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md border border-transparent hover:border-green-200">
              <p className="text-gray-500 text-sm mb-1">ძრავის მოცულობა</p>
              <p className="font-semibold text-lg text-gray-800">{car.specifications.engine_size}L</p>
            </div>
          )}
          {car.specifications?.steering_wheel && (
            <div className="p-3 rounded-lg bg-gradient-to-br from-white to-gray-50 hover:from-green-50 hover:to-blue-50 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md border border-transparent hover:border-green-200">
              <p className="text-gray-500 text-sm mb-1">საჭე</p>
              <p className="font-semibold text-lg text-gray-800">{car.specifications.steering_wheel}</p>
            </div>
          )}
          {car.specifications?.drive_type && (
            <div className="p-3 rounded-lg bg-gradient-to-br from-white to-gray-50 hover:from-green-50 hover:to-blue-50 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md border border-transparent hover:border-green-200">
              <p className="text-gray-500 text-sm mb-1">წამყვანი თვლები</p>
              <p className="font-semibold text-lg text-gray-800">{translateDriveType(car.specifications.drive_type)}</p>
            </div>
          )}
          {car.specifications?.color && (
            <div className="p-3 rounded-lg bg-gradient-to-br from-white to-gray-50 hover:from-green-50 hover:to-blue-50 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md border border-transparent hover:border-green-200">
              <p className="text-gray-500 text-sm mb-1">ფერი</p>
              <p className="font-semibold text-lg text-gray-800">{car.specifications.color}</p>
            </div>
          )}
          {car.specifications?.body_type && (
            <div className="p-3 rounded-lg bg-gradient-to-br from-white to-gray-50 hover:from-green-50 hover:to-blue-50 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md border border-transparent hover:border-green-200">
              <p className="text-gray-500 text-sm mb-1">ძარის ტიპი</p>
              <p className="font-semibold text-lg text-gray-800">{car.specifications.body_type}</p>
            </div>
          )}
        </div>

        {/* Car Description */}
        {car.description_ka && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold mb-3 flex items-center text-gray-800">
              <CarIcon size={18} className="mr-2 text-green-600" />
              აღწერა
            </h2>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed bg-gradient-to-r from-white to-green-50 p-5 rounded-lg shadow-sm border border-gray-100 hover:border-green-200 transition-all duration-300">{car.description_ka}</p>
          </div>
        )}
      </div>

      {/* Additional Specifications */}
      {car.specifications && Object.keys(car.specifications).length > 0 && (
        <div className={`${cardStyle} hover-card car-section`} style={{animationDelay: '0.2s'}}>
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-100 to-green-100 rounded-full -mr-20 -mt-20 opacity-30 z-0"></div>
          <h2 className={`${sectionHeadingStyle} relative z-10`}>
            <Wrench size={20} className="mr-2 text-green-600" />
            დამატებითი სპეციფიკაციები
          </h2>
          
          <div className="grid grid-cols-3 md:grid-cols-1 gap-6">
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes slideIn {
                from { transform: translateX(-20px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
              }
              .slide-in {
                animation: slideIn 0.5s ease-out forwards;
              }
            ` }} />
            {/* Engine & Drivetrain */}
            <div className={`${specGroupStyle} car-section slide-in`} style={{animationDelay: '0.4s'}}>
              <h3 className="text-lg text-gray-800 mb-3 pb-2 border-b border-gray-100 font-semibold flex items-center">
                <Gauge size={20} className="mr-2 text-blue-600" />
                ძრავა და ტრანსმისია
              </h3>
              
              {shouldDisplaySpec(car.specifications.engine_type) && (
                <div className={specItemStyle}>
                  <div className={specLabelStyle}>ძრავის ტიპი</div>
                  <div className={specValueStyle}>{car.specifications.engine_type}</div>
                </div>
              )}
              
              {shouldDisplaySpec(car.specifications.horsepower) && (
                <div className={specItemStyle}>
                  <div className={specLabelStyle}>ცხენის ძალა</div>
                  <div className={specValueStyle}>{car.specifications.horsepower} ცძ</div>
                </div>
              )}
              
              {shouldDisplaySpec(car.specifications.cylinders) && (
                <div className={specItemStyle}>
                  <div className={specLabelStyle}>ცილინდრები</div>
                  <div className={specValueStyle}>{car.specifications.cylinders}</div>
                </div>
              )}
              
              {shouldDisplaySpec(car.specifications.is_turbo) && (
                <div className={specItemStyle}>
                  <div className={specLabelStyle}>ტურბო</div>
                  <div className={specValueStyle}>{formatBoolean(car.specifications.is_turbo)}</div>
                </div>
              )}
              
              
              {shouldDisplaySpec(car.specifications.has_catalyst) && (
                <div className={specItemStyle}>
                  <div className={specLabelStyle}>კატალიზატორი</div>
                  <div className={specValueStyle}>{formatBoolean(car.specifications.has_catalyst)}</div>
                </div>
              )}
            </div>
            
            {/* Interior */}
            <div className={`${specGroupStyle} car-section slide-in`} style={{animationDelay: '0.4s'}}>
              <h3 className="text-lg text-gray-800 mb-3 pb-2 border-b border-gray-100 font-semibold flex items-center">
                <Palette size={20} className="mr-2 text-amber-600" />
                სალონი და ფუნქციები
              </h3>
              
              {shouldDisplaySpec(car.specifications.interior_material) && (
                <div className={specItemStyle}>
                  <div className={specLabelStyle}>სალონის მასალა</div>
                  <div className={specValueStyle}>{car.specifications.interior_material}</div>
                </div>
              )}
              
              {shouldDisplaySpec(car.specifications.interior_color) && (
                <div className={specItemStyle}>
                  <div className={specLabelStyle}>სალონის ფერი</div>
                  <div className={specValueStyle}>{car.specifications.interior_color}</div>
                </div>
              )}
              
              {shouldDisplaySpec(car.specifications.doors) && (
                <div className={specItemStyle}>
                  <div className={specLabelStyle}>კარები</div>
                  <div className={specValueStyle}>{car.specifications.doors}</div>
                </div>
              )}
              
              {shouldDisplaySpec(car.specifications.has_navigation) && (
                <div className={specItemStyle}>
                  <div className={specLabelStyle}>ნავიგაცია</div>
                  <div className={specValueStyle}>{formatBoolean(car.specifications.has_navigation)}</div>
                </div>
              )}
              
              {shouldDisplaySpec(car.specifications.has_bluetooth) && (
                <div className={specItemStyle}>
                  <div className={specLabelStyle}>ბლუთუზი</div>
                  <div className={specValueStyle}>{formatBoolean(car.specifications.has_bluetooth)}</div>
                </div>
              )}
              
              {shouldDisplaySpec(car.specifications.has_air_conditioning) && (
                <div className={specItemStyle}>
                  <div className={specLabelStyle}>კონდიციონერი</div>
                  <div className={specValueStyle}>{formatBoolean(car.specifications.has_air_conditioning)}</div>
                </div>
              )}
              
              {shouldDisplaySpec(car.specifications.has_climate_control) && (
                <div className={specItemStyle}>
                  <div className={specLabelStyle}>კლიმატ-კონტროლი</div>
                  <div className={specValueStyle}>{formatBoolean(car.specifications.has_climate_control)}</div>
                </div>
              )}
              
              {shouldDisplaySpec(car.specifications.has_seat_heating) && (
                <div className={specItemStyle}>
                  <div className={specLabelStyle}>სავარძლების გათბობა</div>
                  <div className={specValueStyle}>{formatBoolean(car.specifications.has_seat_heating)}</div>
                </div>
              )}
              
              {shouldDisplaySpec(car.specifications.has_seat_memory) && (
                <div className={specItemStyle}>
                  <div className={specLabelStyle}>სავარძლების მეხსიერება</div>
                  <div className={specValueStyle}>{formatBoolean(car.specifications.has_seat_memory)}</div>
                </div>
              )}
              
              {shouldDisplaySpec(car.specifications.has_sunroof) && (
                <div className={specItemStyle}>
                  <div className={specLabelStyle}>ლუქი</div>
                  <div className={specValueStyle}>{formatBoolean(car.specifications.has_sunroof)}</div>
                </div>
              )}
              
              {shouldDisplaySpec(car.specifications.has_panoramic_roof) && (
                <div className={specItemStyle}>
                  <div className={specLabelStyle}>პანორამული სახურავი</div>
                  <div className={specValueStyle}>{formatBoolean(car.specifications.has_panoramic_roof)}</div>
                </div>
              )}
            </div>
            
            {/* Safety & Security */}
            <div className={`${specGroupStyle} car-section slide-in`} style={{animationDelay: '0.4s'}}>
              <h3 className="text-lg text-gray-800 mb-3 pb-2 border-b border-gray-100 font-semibold flex items-center">
                <Shield size={20} className="mr-2 text-red-600" />
                უსაფრთხოება და დამატებითი ფუნქციები
              </h3>
              
              {shouldDisplaySpec(car.specifications.airbags_count) && (
                <div className={specItemStyle}>
                  <div className={specLabelStyle}>უსაფრთხოების ბალიშების რაოდენობა</div>
                  <div className={specValueStyle}>{car.specifications.airbags_count}</div>
                </div>
              )}
              {shouldDisplaySpec(car.specifications.has_abs) && (
                <div className={specItemStyle}>
                  <div className={specLabelStyle}>ABS</div>
                  <div className={specValueStyle}>{formatBoolean(car.specifications.has_abs)}</div>
                </div>
              )}
              {shouldDisplaySpec(car.specifications.has_esp) && (
                <div className={specItemStyle}>
                  <div className={specLabelStyle}>ESP</div>
                  <div className={specValueStyle}>{formatBoolean(car.specifications.has_esp)}</div>
                </div>
              )}
              {shouldDisplaySpec(car.specifications.has_traction_control) && (
                <div className={specItemStyle}>
                  <div className={specLabelStyle}>მოცურების საწინააღმდეგო</div>
                  <div className={specValueStyle}>{formatBoolean(car.specifications.has_traction_control)}</div>
                </div>
              )}
              {shouldDisplaySpec(car.specifications.has_parking_control) && (
                <div className={specItemStyle}>
                  <div className={specLabelStyle}>პარკინგის სენსორები</div>
                  <div className={specValueStyle}>{formatBoolean(car.specifications.has_parking_control)}</div>
                </div>
              )}
              {shouldDisplaySpec(car.specifications.has_rear_view_camera) && (
                <div className={specItemStyle}>
                  <div className={specLabelStyle}>უკანა ხედვის კამერა</div>
                  <div className={specValueStyle}>{formatBoolean(car.specifications.has_rear_view_camera)}</div>
                </div>
              )}
              {shouldDisplaySpec(car.specifications.has_cruise_control) && (
                <div className={specItemStyle}>
                  <div className={specLabelStyle}>კრუიზ კონტროლი</div>
                  <div className={specValueStyle}>{formatBoolean(car.specifications.has_cruise_control)}</div>
                </div>
              )}
              {shouldDisplaySpec(car.specifications.has_start_stop) && (
                <div className={specItemStyle}>
                  <div className={specLabelStyle}>Start-Stop სისტემა</div>
                  <div className={specValueStyle}>{formatBoolean(car.specifications.has_start_stop)}</div>
                </div>
              )}
              {shouldDisplaySpec(car.specifications.has_central_locking) && (
                <div className={specItemStyle}>
                  <div className={specLabelStyle}>ცენტრალური საკეტი</div>
                  <div className={specValueStyle}>{formatBoolean(car.specifications.has_central_locking)}</div>
                </div>
              )}
              {shouldDisplaySpec(car.specifications.has_alarm) && (
                <div className={specItemStyle}>
                  <div className={specLabelStyle}>სიგნალიზაცია</div>
                  <div className={specValueStyle}>{formatBoolean(car.specifications.has_alarm)}</div>
                </div>
              )}
              {shouldDisplaySpec(car.specifications.has_keyless_entry) && (
                <div className={specItemStyle}>
                  <div className={specLabelStyle}>უგასაღებო შესვლა</div>
                  <div className={specValueStyle}>{formatBoolean(car.specifications.has_keyless_entry)}</div>
                </div>
              )}
              {shouldDisplaySpec(car.specifications.is_disability_adapted) && (
                <div className={specItemStyle}>
                  <div className={specLabelStyle}>შშმ პირებისთვის ადაპტირებული</div>
                  <div className={specValueStyle}>{formatBoolean(car.specifications.is_disability_adapted)}</div>
                </div>
              )}
              {shouldDisplaySpec(car.specifications.is_cleared) && (
                <div className={specItemStyle}>
                  <div className={specLabelStyle}>განბაჟებული</div>
                  <div className={specValueStyle}>{formatBoolean(car.specifications.is_cleared)}</div>
                </div>
              )}
              {shouldDisplaySpec(car.specifications.has_technical_inspection) && (
                <div className={specItemStyle}>
                  <div className={specLabelStyle}>გავლილი აქვს ტექ. დათვალიერება</div>
                  <div className={specValueStyle}>{formatBoolean(car.specifications.has_technical_inspection)}</div>
                </div>
              )}
              {shouldDisplaySpec(car.specifications.clearance_status) && (
                <div className={specItemStyle}>
                  <div className={specLabelStyle}>განბაჟების სტატუსი</div>
                  <div className={specValueStyle}>
                    {car.specifications.clearance_status === 'cleared' && 'განბაჟებული'}
                    {car.specifications.clearance_status === 'not_cleared' && 'განუბაჟებელი'}
                    {car.specifications.clearance_status === 'in_progress' && 'მიმდინარეობს განბაჟება'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Location Info */}
      {car.location && (
        <div className={`${cardStyle} car-section`} style={{animationDelay: '0.3s'}}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-r from-red-50 to-orange-50 rounded-full -mr-16 -mt-16 opacity-30 z-0"></div>
          <h2 className={sectionHeadingStyle}>
            <MapPin size={20} className="mr-2 text-red-600" />
            ადგილმდებარეობა
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {car.location.country && (
              <div className="p-3 rounded-lg bg-gradient-to-br from-white to-gray-50 hover:from-red-50 hover:to-orange-50 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md border border-transparent hover:border-red-200">
                <p className="text-gray-500 text-sm mb-1">ქვეყანა</p>
                <p className="font-semibold text-lg text-gray-800">{car.location.country}</p>
              </div>
            )}
            {car.location.city && (
              <div className="p-3 rounded-lg bg-gradient-to-br from-white to-gray-50 hover:from-red-50 hover:to-orange-50 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md border border-transparent hover:border-red-200">
                <p className="text-gray-500 text-sm mb-1">ქალაქი</p>
                <p className="font-semibold text-lg text-gray-800">{car.location.city}</p>
              </div>
            )}
            {car.location.is_transit !== undefined && (
              <div className="p-3 rounded-lg bg-gradient-to-br from-white to-gray-50 hover:from-red-50 hover:to-orange-50 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md border border-transparent hover:border-red-200">
                <p className="text-gray-500 text-sm mb-1">ტრანზიტში</p>
                <p className="font-semibold text-lg text-gray-800 flex items-center">
                  {car.location.is_transit ? 
                    <span className="flex items-center text-green-600"><Check size={16} className="mr-1" /> დიახ</span> : 
                    <span className="flex items-center text-red-500"><X size={16} className="mr-1" /> არა</span>}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarInfo;