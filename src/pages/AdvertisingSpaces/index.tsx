import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { API_URL } from 'config/api';
import { ADVERTISING_PRICES, AdvertisingSpaceDetails } from 'config/constants';
import { Monitor, Smartphone, Info } from 'lucide-react';

// Define interface for Advertisement
interface Advertisement {
  id: number;
  title: string;
  image_url: string;
  placement: string;
  is_active: boolean;
}

const AdvertisingSpaces: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'ka';
  const [adExamples, setAdExamples] = useState<Record<string, Advertisement | null>>({});
  const [loading, setLoading] = useState(true);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  // Initialize all placement previews to be visible by default
  const [showPlacementPreview, setShowPlacementPreview] = useState<Record<string, boolean>>(
    Object.keys(ADVERTISING_PRICES).reduce((acc, placement) => {
      acc[placement] = true;
      return acc;
    }, {} as Record<string, boolean>)
  );
  
  // Helper function to get dimensions based on placement
  const getDimensions = (placementParam: string): string => {
    switch (placementParam) {
      case 'home_slider':
        return '1200 × 600 px';
      case 'home_banner':
        return '1200 × 300 px';
      case 'car_listing_top':
      case 'car_details_top':
      case 'car_details_bottom':
        return '728 × 140 px';
      case 'home_after_vip':
      case 'car_listing_bottom':
      case 'car_details_after_similar':
        return '720 × 140 px';
      default:
        return '720 × 140 px';
    }
  };
  
  // Function to render the appropriate preview based on placement type
  const renderPlacementPreview = (placement: string) => {
    // Home page previews
    if (placement.startsWith('home_')) {
      if (placement === 'home_slider') {
        return (
          <div className="w-full bg-blue-100 border-2 border-blue-500 rounded mb-2 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 w-full flex items-center justify-center">
              <div className={`${previewDevice === 'mobile' ? 'h-16' : 'h-24'} w-full flex flex-col items-center justify-center`}>
                {adExamples[placement] ? (
                  <img 
                    src={adExamples[placement]?.image_url} 
                    alt={`${placement} example`} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-blue-700 font-medium px-3 py-1 rounded bg-white/80 shadow-sm text-xs">
                      {currentLang === 'ka' ? 'თქვენი რეკლამა სლაიდერში' : 
                       currentLang === 'en' ? 'Your Ad in Slider' : 
                       'Ваша реклама в слайдере'}
                    </span>
                    <span className="text-xs mt-1 text-blue-600">1200 × 600 px</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      } else if (placement === 'home_banner') {
        return (
          <div className="w-full bg-blue-100 border-2 border-blue-500 rounded mb-2 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 w-full flex items-center justify-center">
              <div className={`${previewDevice === 'mobile' ? 'h-10' : 'h-14'} w-full flex flex-col items-center justify-center`}>
                {adExamples[placement] ? (
                  <img 
                    src={adExamples[placement]?.image_url} 
                    alt={`${placement} example`} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-blue-700 font-medium px-3 py-1 rounded bg-white/80 shadow-sm text-xs">
                      {currentLang === 'ka' ? 'თქვენი რეკლამა აქ' : 
                       currentLang === 'en' ? 'Your Ad Here' : 
                       'Ваша реклама здесь'}
                    </span>
                    <span className="text-xs mt-0.5 text-blue-600">1200 × 300 px</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      } else if (placement === 'home_after_vip') {
        return (
          <div className="w-full bg-blue-100 border-2 border-blue-500 rounded mb-2 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 w-full flex items-center justify-center">
              <div className={`${previewDevice === 'mobile' ? 'h-8' : 'h-12'} w-full flex flex-col items-center justify-center`}>
                {adExamples[placement] ? (
                  <img 
                    src={adExamples[placement]?.image_url} 
                    alt={`${placement} example`} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-blue-700 font-medium px-3 py-1 rounded bg-white/80 shadow-sm text-xs">
                      {currentLang === 'ka' ? 'თქვენი რეკლამა აქ' : 
                       currentLang === 'en' ? 'Your Ad Here' : 
                       'Ваша реклама здесь'}
                    </span>
                    <span className="text-xs mt-0.5 text-blue-600">720 × 140 px</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }
    }
    
    // Car listing page previews
    else if (placement.startsWith('car_listing_')) {
      return (
        <div className="w-full bg-blue-100 border-2 border-blue-500 rounded mb-2 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 w-full flex items-center justify-center">
            <div className={`${previewDevice === 'mobile' ? 'h-8' : 'h-12'} w-full flex flex-col items-center justify-center`}>
              {adExamples[placement] ? (
                <img 
                  src={adExamples[placement]?.image_url} 
                  alt={`${placement} example`} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <span className="text-blue-700 font-medium px-3 py-1 rounded bg-white/80 shadow-sm text-xs">
                    {currentLang === 'ka' ? 'თქვენი რეკლამა აქ' : 
                     currentLang === 'en' ? 'Your Ad Here' : 
                     'Ваша реклама здесь'}
                  </span>
                  <span className="text-xs mt-0.5 text-blue-600">{getDimensions(placement)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
    
    // Car details page previews
    else if (placement.startsWith('car_details_')) {
      return (
        <div className="w-full bg-blue-100 border-2 border-blue-500 rounded mb-2 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 w-full flex items-center justify-center">
            <div className={`${previewDevice === 'mobile' ? 'h-8' : 'h-12'} w-full flex flex-col items-center justify-center`}>
              {adExamples[placement] ? (
                <img 
                  src={adExamples[placement]?.image_url} 
                  alt={`${placement} example`} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <span className="text-blue-700 font-medium px-3 py-1 rounded bg-white/80 shadow-sm text-xs">
                    {currentLang === 'ka' ? 'თქვენი რეკლამა აქ' : 
                     currentLang === 'en' ? 'Your Ad Here' : 
                     'Ваша реклама здесь'}
                  </span>
                  <span className="text-xs mt-0.5 text-blue-600">{getDimensions(placement)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
    
    // Default preview
    return (
      <div className="w-full bg-blue-100 border-2 border-blue-500 rounded mb-2 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 w-full flex items-center justify-center">
          <div className={`${previewDevice === 'mobile' ? 'h-8' : 'h-12'} w-full flex flex-col items-center justify-center`}>
            {adExamples[placement] ? (
              <img 
                src={adExamples[placement]?.image_url} 
                alt={`${placement} example`} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center">
                <span className="text-blue-700 font-medium px-3 py-1 rounded bg-white/80 shadow-sm text-xs">
                  {currentLang === 'ka' ? 'თქვენი რეკლამა აქ' : 
                   currentLang === 'en' ? 'Your Ad Here' : 
                   'Ваша реклама здесь'}
                </span>
                <span className="text-xs mt-0.5 text-blue-600">{getDimensions(placement)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const fetchAdExamples = async () => {
      try {
        setLoading(true);
        // Fetch one example ad for each placement type
        const placements = Object.keys(ADVERTISING_PRICES);
        const examples: Record<string, Advertisement | null> = {};
        
        for (const placement of placements) {
          try {
            const response = await axios.get(`${API_URL}/api/advertisements/placement/${placement}`);
            examples[placement] = response.data[0] || null;
          } catch (error) {
            console.error(`Error fetching ${placement} ads:`, error);
            examples[placement] = null;
          }
        }
        
        setAdExamples(examples);
      } catch (error) {
        console.error('Error fetching ad examples:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdExamples();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {currentLang === 'ka' ? 'სარეკლამო სივრცეები' : 
         currentLang === 'en' ? 'Advertising Spaces' : 
         'Рекламные места'}
      </h1>
      
      <div className="max-w-3xl mx-auto mb-10">
        <p className="text-gray-700 mb-4">
          {currentLang === 'ka' ? 
            'განათავსეთ თქვენი რეკლამა ჩვენს პლატფორმაზე და მიიღეთ მაქსიმალური ხილვადობა. ჩვენ გთავაზობთ სხვადასხვა სარეკლამო სივრცეებს სხვადასხვა ფასად.' : 
           currentLang === 'en' ? 
            'Place your advertisement on our platform and get maximum visibility. We offer various advertising spaces at different prices.' : 
            'Разместите свою рекламу на нашей платформе и получите максимальную видимость. Мы предлагаем различные рекламные места по разным ценам.'}
        </p>
        <p className="text-gray-700 mb-4">
          {currentLang === 'ka' ? 
            `„რეკლამის შესახებ“ საქართველოს კანონით გათვალისწინებული შეზღუდვების მხედველობაში მიღებით პლატფორმაზე არ განთავსდება: ალკოჰოლიანი სასმელის; სექსუალური ხასიათის პროდუქციის; თამბაქოს ნაწარმის, თამბაქოს აქსესუარის ან/და თამბაქოს მოხმარებისთვის განკუთვნილი მოწყობილობის; აზარტული თამაშობის, ტოტალიზატორის, ლოტოს, ბინგოს, აზარტული თამაშობის ორგანიზატორის, ტოტალიზატორის ორგანიზატორის და ბინგოს ორგანიზატორის შესახებ; საბრძოლო იარაღის; სპეციალურ კონტროლს დაქვემდებარებული (პირველი ჯგუფისთვის მიკუთვნებული), მეორე ჯგუფისათვის მიკუთვნებული და საქართველოს ბაზარზე დაშვების უფლების არმქონე ფარმაცევტული პროდუქტის; ჩვილ ბავშვთა ხელოვნური კვების პროდუქტის (გარდა დამატებითი საკვებისა), საწოვრიანი ბოთლებისა და სატყუარების ნებისმიერი სახის რეკლამა.` : 
           currentLang === 'en' ? 
            `Taking into account the restrictions provided for by the Georgian Law on Advertising, the following will not be placed on the platform: alcoholic beverages; sexually explicit products; tobacco products, tobacco accessories and/or devices intended for tobacco consumption; gambling, totalizator, lotto, bingo, gambling organizer, totalizator organizer and bingo organizer; weapons; pharmaceutical products subject to special control (belonging to the first group), belonging to the second group and not having the right to enter the Georgian market; any type of advertising of artificial infant food products (except for complementary foods), feeding bottles and baits.` : 
            `Принимая во внимание ограничения, предусмотренные Законом Грузии «О рекламе», на платформе не будут размещаться: алкогольные напитки; продукция откровенно сексуального характера; табачные изделия, табачные принадлежности и/или устройства, предназначенные для потребления табака; азартные игры, тотализатор, лото, бинго, организатор азартных игр, организатор тотализатора и бинго; оружие; фармацевтические товары, подлежащие особому контролю (относящиеся к первой группе), относящиеся ко второй группе и не имеющие права доступа на рынок Грузии; любые виды рекламы искусственных продуктов детского питания (за исключением продуктов прикорма), бутылочек для кормления и приманок.`}
        </p>
        <p className="text-gray-700">
          {currentLang === 'ka' ? 
            'დაგვიკავშირდით რეკლამის განსათავსებლად ან დამატებითი ინფორმაციისთვის.' : 
           currentLang === 'en' ? 
            'Contact us to place an advertisement or for additional information.' : 
            'Свяжитесь с нами, чтобы разместить рекламу или получить дополнительную информацию.'}
        </p>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {Object.entries(ADVERTISING_PRICES).map(([placement, details]) => {
            // Type assertion for details
            const typedDetails = details as AdvertisingSpaceDetails;
            
            // Get recommended dimensions based on placement
            const getDimensions = () => {
              switch (placement) {
                case 'home_slider':
                  return '1200 × 600 px';
                case 'home_banner':
                  return '1200 × 300 px';
                case 'car_listing_top':
                case 'car_details_top':
                case 'car_details_bottom':
                  return '728 × 140 px';
                case 'home_after_vip':
                case 'car_listing_bottom':
                case 'car_details_after_similar':
                  return '720 × 140 px';
                default:
                  return '720 × 140 px';
              }
            };
            
            // Get placement name in current language
            const getPlacementName = () => {
              switch (placement) {
                case 'home_slider':
                  return currentLang === 'ka' ? 'მთავარი გვერდის სლაიდერი' : 
                         currentLang === 'en' ? 'Home Page Slider' : 'Слайдер на главной странице';
                case 'home_featured':
                  return currentLang === 'ka' ? 'მთავარი გვერდის რჩეული განცხადებები' : 
                         currentLang === 'en' ? 'Home Page Featured Listings' : 'Рекомендуемые объявления';
                case 'sidebar_banner':
                  return currentLang === 'ka' ? 'გვერდითი ბანერი' : 
                         currentLang === 'en' ? 'Sidebar Banner' : 'Боковой баннер';
                case 'category_banner':
                  return currentLang === 'ka' ? 'კატეგორიის ბანერი' : 
                         currentLang === 'en' ? 'Category Banner' : 'Баннер категории';
                default:
                  return placement.replace('_', ' ');
              }
            };
            
            return (
              <div key={placement} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                <div className="p-5">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-xl">
                      {typedDetails.description[currentLang as keyof typeof typedDetails.description]}
                    </h3>
                    <button 
                      onClick={() => setShowPlacementPreview(prev => ({ ...prev, [placement]: !prev[placement] }))}
                      className="text-xs flex items-center gap-1 text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      {showPlacementPreview[placement] ? 
                        (currentLang === 'ka' ? 'დამალვა' : 
                         currentLang === 'en' ? 'Hide Preview' : 'Скрыть') : 
                        (currentLang === 'ka' ? 'პრევიუ' : 
                         currentLang === 'en' ? 'Preview' : 'Предпросмотр')}
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  
                  {/* Placement Preview */}
                  {showPlacementPreview[placement] && (
                    <div className="mt-3 border border-gray-200 rounded-lg p-3 bg-gray-50 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-700">
                          {currentLang === 'ka' ? 'რეკლამის ადგილის პრევიუ' : 
                           currentLang === 'en' ? 'Ad Placement Preview' : 
                           'Предпросмотр места размещения'}
                        </h4>
                        <div className="flex items-center gap-1.5">
                          <button 
                            type="button"
                            onClick={() => setPreviewDevice('desktop')}
                            className={`flex items-center gap-1 text-xs px-1.5 py-0.5 ${previewDevice === 'desktop' ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-gray-100 text-gray-700'} rounded transition-colors`}
                          >
                            <Monitor className="h-3 w-3" />
                            <span>{currentLang === 'ka' ? 'დესკტოპი' : 
                                   currentLang === 'en' ? 'Desktop' : 'Десктоп'}</span>
                          </button>
                          <button 
                            type="button"
                            onClick={() => setPreviewDevice('mobile')}
                            className={`flex items-center gap-1 text-xs px-1.5 py-0.5 ${previewDevice === 'mobile' ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-gray-100 text-gray-700'} rounded transition-colors`}
                          >
                            <Smartphone className="h-3 w-3" />
                            <span>{currentLang === 'ka' ? 'მობილური' : 
                                   currentLang === 'en' ? 'Mobile' : 'Мобильный'}</span>
                          </button>
                        </div>
                      </div>
                      
                      <div className={`relative overflow-hidden rounded border border-gray-300 bg-white ${previewDevice === 'mobile' ? 'w-[320px] max-w-full mx-auto' : 'w-full'} transition-all duration-300`}>
                        <div className="p-2">
                          {/* Render the appropriate preview based on placement type */}
                          {renderPlacementPreview(placement)}
                          
                          {/* Placement Description */}
                          <div className="mt-2 text-xs text-gray-600">
                            <p>
                              {currentLang === 'ka' ? 'პოზიცია:' : 
                               currentLang === 'en' ? 'Position:' : 
                               'Позиция:'} <span className="font-medium">{getPlacementName()}</span>
                            </p>
                            <p className="mt-0.5">
                              {currentLang === 'ka' ? 'რეკომენდირებული ზომა:' : 
                               currentLang === 'en' ? 'Recommended size:' : 
                               'Рекомендуемый размер:'} <span className="font-medium"></span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-2xl font-bold text-primary">
                      {typedDetails.price} ₾
                    </div>
                    <div className="text-gray-600">
                      {currentLang === 'ka' ? `${typedDetails.duration} დღე` : 
                       currentLang === 'en' ? `${typedDetails.duration} days` : 
                       `${typedDetails.duration} дней`}
                    </div>
                  </div>
                
                  <div className="mt-4">
                    <a 
                      href={`mailto:info@bigway.ge?subject=${encodeURIComponent(
                        currentLang === 'ka' ? `სარეკლამო მოთხოვნა: ${getPlacementName()}` : 
                        currentLang === 'en' ? `Advertising Request: ${getPlacementName()}` : 
                        `Рекламный запрос: ${getPlacementName()}`
                      )}`} 
                      className="block w-full text-center bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded transition-colors"
                    >
                      {currentLang === 'ka' ? 'დაგვიკავშირდით' : 
                       currentLang === 'en' ? 'Contact Us' : 
                       'Связаться с нами'}
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="mt-12 bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-bold mb-4">
          {currentLang === 'ka' ? 'დაგვიკავშირდით' : 
           currentLang === 'en' ? 'Contact Us' : 
           'Свяжитесь с нами'}
        </h2>
        <p className="mb-4">
          {currentLang === 'ka' ? 
            'დამატებითი ინფორმაციისთვის ან რეკლამის განსათავსებლად, გთხოვთ დაგვიკავშირდეთ:' : 
           currentLang === 'en' ? 
            'For additional information or to place an advertisement, please contact us:' : 
            'Для получения дополнительной информации или размещения рекламы, пожалуйста, свяжитесь с нами:'}
        </p>
        <div className="flex flex-col space-y-2">
          <div>
            <strong>Email:</strong> info@autovend.ge
          </div>
          <div>
            <strong>
              {currentLang === 'ka' ? 'ტელეფონი' : 
               currentLang === 'en' ? 'Phone' : 
               'Телефон'}:
            </strong> +995 595 03 88 88
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvertisingSpaces;
