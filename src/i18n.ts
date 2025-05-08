import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      common: {
        loading: 'Loading...',
        processing: 'Processing...',
        show: 'Show',
        hide: 'Hide',
        edit: 'Edit',
        delete: 'Delete',
        save: 'Save',
        cancel: 'Cancel',
        back: 'Back',
        confirm: 'Confirm'
      },
      balance: {
        title: 'My Balance',
        currentBalance: 'Current Balance',
        addFunds: 'Add Funds',
        add: 'Add',
        transactions: 'Transaction History',
        vipPackages: 'VIP Packages',
        invalidAmount: 'Please enter a valid amount',
        fundsAdded: 'Funds added successfully'
      },
      transaction: {
        date: 'Date',
        type: 'Type',
        amount: 'Amount',
        description: 'Description',
        status: 'Status',
        deposit: 'Deposit',
        withdrawal: 'Withdrawal',
        vipPurchase: 'VIP Purchase',
        completed: 'Completed',
        pending: 'Pending',
        failed: 'Failed',
        noTransactions: 'No transactions found'
      },
      vip: {
        status: 'VIP Status',
        selectCar: 'Select a Car',
        selectCarOption: 'Choose a car',
        purchase: 'Purchase',
        purchaseSuccess: 'VIP status purchased successfully',
        activate: 'Activate',
        deactivate: 'Deactivate',
        days: 'days',
        insufficientBalance: 'Insufficient balance',
        needMoreFunds: 'Need more funds',
        feature: {
          highlighted: 'Highlighted in listings',
          topCategory: 'Top position in category',
          topSearch: 'Appears at top in search results',
          priority5: '5x more visibility',
          priority10: '10x more visibility',
          priority20: '20x more visibility'
        }
      },
      error: {
        fetchBalance: 'Failed to fetch balance',
        addFunds: 'Failed to add funds',
        fetchTransactions: 'Failed to fetch transactions',
        fetchVipPrices: 'Failed to fetch VIP prices',
        fetchUserCars: 'Failed to fetch your cars',
        purchaseVip: 'Failed to purchase VIP status'
      }
    }
  },
  ka: {
    translation: {
      common: {
        loading: 'იტვირთება...',
        processing: 'მიმდინარეობს...',
        show: 'ჩვენება',
        hide: 'დამალვა',
        edit: 'რედაქტირება',
        delete: 'წაშლა',
        save: 'შენახვა',
        cancel: 'გაუქმება',
        back: 'უკან',
        confirm: 'დადასტურება'
      },
      balance: {
        title: 'ჩემი ბალანსი',
        currentBalance: 'მიმდინარე ბალანსი',
        addFunds: 'თანხის დამატება',
        add: 'დამატება',
        transactions: 'ტრანზაქციების ისტორია',
        vipPackages: 'VIP პაკეტები',
        invalidAmount: 'გთხოვთ შეიყვანოთ სწორი თანხა',
        fundsAdded: 'თანხა წარმატებით დაემატა'
      },
      transaction: {
        date: 'თარიღი',
        type: 'ტიპი',
        amount: 'თანხა',
        description: 'აღწერა',
        status: 'სტატუსი',
        deposit: 'შევსება',
        withdrawal: 'გატანა',
        vipPurchase: 'VIP შეძენა',
        completed: 'დასრულებული',
        pending: 'მიმდინარე',
        failed: 'წარუმატებელი',
        noTransactions: 'ტრანზაქციები არ მოიძებნა'
      },
      vip: {
        status: 'VIP სტატუსი',
        selectCar: 'აირჩიეთ მანქანა',
        selectCarOption: 'აირჩიეთ მანქანა',
        purchase: 'შეძენა',
        purchaseSuccess: 'VIP სტატუსი წარმატებით შეძენილია',
        activate: 'აქტივაცია',
        deactivate: 'დეაქტივაცია',
        days: 'დღე',
        insufficientBalance: 'არასაკმარისი ბალანსი',
        needMoreFunds: 'საჭიროა მეტი თანხა',
        feature: {
          highlighted: 'გამოკვეთილია სიაში',
          topCategory: 'ზედა პოზიცია კატეგორიაში',
          topSearch: 'ჩანს ძიების შედეგების თავში',
          priority5: '5-ჯერ მეტი ხილვადობა',
          priority10: '10-ჯერ მეტი ხილვადობა',
          priority20: '20-ჯერ მეტი ხილვადობა'
        }
      },
      error: {
        fetchBalance: 'ბალანსის მიღება ვერ მოხერხდა',
        addFunds: 'თანხის დამატება ვერ მოხერხდა',
        fetchTransactions: 'ტრანზაქციების ისტორიის მიღება ვერ მოხერხდა',
        fetchVipPrices: 'VIP ფასების მიღება ვერ მოხერხდა',
        fetchUserCars: 'თქვენი მანქანების მიღება ვერ მოხერხდა',
        purchaseVip: 'VIP სტატუსის შეძენა ვერ მოხერხდა'
      }
    }
  }
};

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ka', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already safes from XSS
    }
  });

export default i18n;
