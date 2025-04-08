export type Language = 'english' | 'tamil' | 'hindi';

export const translations: Record<Language, Record<string, string>> = {
  english: {
    // Existing translations
    nav_home: 'Home',
    nav_category: 'Categories',
    nav_orders: 'Orders',
    nav_profile: 'Profile',
    category_title: 'Shop by Category',
    category_offers: 'Offers',
    category_vegetables: 'Vegetables',
    category_fruits: 'Fruits',
    category_grocery: 'Grocery',
    category_plastic: 'Plastics',
    category_living: 'Living',
    category_all: 'All Categories',
    category_subcategory_not_found: 'Category or subcategory not found',
    category_subcategory_not_exist: "The category or subcategory you're looking for doesn't exist.",
    see_all: 'View All',
    toggle_language: 'Toggle Language',
    language_english: 'English',
    language_tamil: 'Tamil',
    language_hindi: 'Hindi',
    cart: 'Cart',
    cart_empty: 'Your cart is empty',
    organic: 'Organic',
    contact_whatsapp: 'WhatsApp:',
    contact_phone: 'Call:',
    cycle_next_language: 'Cycle next language',
    items: 'items',
    add: 'Add',
    back: 'Back',
    checkout: 'Checkout',
    subtotal: 'Subtotal',
    total: 'Total',
    ratings: 'ratings',
    filter: 'Filter',
    sort: 'Sort',
    grid_view: 'Grid',
    list_view: 'List',
    special_offer: 'Special Offer',
    offer_discount: 'Up to {discount}% OFF!',
    offer_limited: 'Limited time offer',
    special_offers: 'Special Offers',
    fresh_produce: 'Fresh Produce',
    dashboard: 'Dashboard',
    categories: 'Categories',
    products: 'Products',
    orders: 'Orders',
    settings: 'Settings',
    admin_logout: 'Logout',
    name: 'Name',
    name_required: 'Name is required',
    phone: 'Phone',
    valid_phone_required: 'Valid phone number required',
    address: 'Address',
    address_required: 'Address is required',
    pincode: 'Pincode',
    valid_pincode_required: 'Valid 6-digit pincode required',
    pickup_time: 'Pickup Time',
    pickup_time_required: 'Please select a pickup time',
    payment_method: 'Payment Method',
    cash_on_delivery: 'Cash on Delivery',
    online_payment: 'Online Payment',
    place_order: 'Place Order',
    placing_order: 'Placing Order...',
    order_summary: 'Order Summary',
    delivery_method: 'Delivery Method',
    shop_pickup: 'Shop Pickup',
    door_delivery: 'Door Delivery',
    available_above_2000: 'Available for orders above ₹2000',
    delivery_details: 'Delivery Details',
    enter_name: 'Enter your name',
    enter_phone: 'Enter your phone number',
    enter_address: 'Enter your address',
    enter_pincode: 'Enter your pincode',
    error: 'Error',
    cart_empty_error: 'Your cart is empty. Add some items to place an order.',
    order_success: 'Order Placed Successfully',
    order_pickup_success: 'Your order has been placed successfully. You can pick it up at the selected time.',
    order_delivery_success: 'Your order has been placed successfully. We will deliver it to your address shortly.',
    order_placed: 'Order Placed',
    thank_you: 'Thank You!',
    order_confirmation_message: 'Your order has been received and is being processed. You will receive updates on your phone.',
    view_orders: 'View Orders',
    continue_shopping: 'Continue Shopping',
    add_items: 'Add some items to your cart',

    // New translations for Service Unavailable page
    service_unavailable: 'Service Unavailable',
    no_internet_message: "Looks like you're offline. Please check your internet connection and try again.",
    refresh_page: 'Refresh Page',
    go_to_home: 'Go to Home'
  },
  tamil: {
    // Existing translations
    nav_home: 'முகப்பு',
    nav_category: 'வகைகள்',
    nav_orders: 'ஆர்டர்கள்',
    nav_profile: 'சுயவிவரம்',
    category_title: 'வகை வாரியாக கடை',
    category_offers: 'சலுகைகள்',
    category_vegetables: 'காய்கறிகள்',
    category_fruits: 'பழங்கள்',
    category_grocery: 'மளிகை',
    category_plastic: 'பிளாஸ்டிக்',
    category_living: 'வாழ்க்கை',
    category_all: 'அனைத்து வகைகளும்',
    category_subcategory_not_found: 'வகை அல்லது துணை வகை கிடைக்கவில்லை',
    category_subcategory_not_exist: "நீங்கள் தேடும் வகை அல்லது துணை வகை இல்லை.",
    see_all: 'அனைத்தையும் காட்டு',
    toggle_language: 'மொழியை மாற்று',
    language_english: 'ஆங்கிலம்',
    language_tamil: 'தமிழ்',
    language_hindi: 'இந்தி',
    cart: 'கார்ட்',
    cart_empty: 'உங்கள் கார்ட் காலியாக உள்ளது',
    organic: 'இயற்கை',
    contact_whatsapp: 'வாட்ஸ்அப்:',
    contact_phone: 'அழைக்க:',
    cycle_next_language: 'அடுத்த மொழிக்கு மாற்று',
    items: 'பொருட்கள்',
    add: 'சேர்',
    back: 'பின்',
    checkout: 'செக்அவுட்',
    subtotal: 'கூட்டுத்தொகை',
    total: 'மொத்தம்',
    ratings: 'மதிப்பீடுகள்',
    filter: 'வடிகட்டி',
    sort: 'வரிசைப்படுத்து',
    grid_view: 'கட்ட பார்வை',
    list_view: 'பட்டியல் பார்வை',
    special_offer: 'சிறப்பு சலுகை',
    offer_discount: '{discount}% வரை தள்ளுபடி!',
    offer_limited: 'குறுகிய கால சலுகை',
    special_offers: 'சிறப்பு சலுகைகள்',
    fresh_produce: 'புதிய விளைபொருட்கள்',
    dashboard: 'டாஷ்போர்டு',
    categories: 'வகைகள்',
    products: 'பொருட்கள்',
    orders: 'ஆர்டர்கள்',
    settings: 'அமைப்புகள்',
    admin_logout: 'வெளியேறு',
    name: 'பெயர்',
    name_required: 'பெயர் தேவை',
    phone: 'தொலைபேசி',
    valid_phone_required: 'செல்லுபடியாகும் தொலைபேசி எண் தேவை',
    address: 'முகவரி',
    address_required: 'முகவரி தேவை',
    pincode: 'அஞ்சல் குறியீடு',
    valid_pincode_required: 'செல்லுபடியாகும் 6-இலக்க அஞ்சல் குறியீடு தேவை',
    pickup_time: 'எடுக்கும் நேரம்',
    pickup_time_required: 'எடுக்கும் நேரத்தைத் தேர்ந்தெடுக்கவும்',
    payment_method: 'கட்டண முறை',
    cash_on_delivery: 'பெறும்போது பணம்',
    online_payment: 'ஆன்லைன் பணம்',
    place_order: 'ஆர்டர் கொடுக்கவும்',
    placing_order: 'ஆர்டர் கொடுக்கிறது...',
    order_summary: 'ஆர்டர் சுருக்கம்',
    delivery_method: 'விநியோக முறை',
    shop_pickup: 'கடையில் எடுத்துக்கொள்ளுதல்',
    door_delivery: 'வீட்டுக்கு விநியோகம்',
    available_above_2000: '₹2000க்கு மேல் மட்டுமே',
    delivery_details: 'விநியோக விவரங்கள்',
    enter_name: 'உங்கள் பெயரை உள்ளிடவும்',
    enter_phone: 'உங்கள் தொலைபேசி எண்ணை உள்ளிடவும்',
    enter_address: 'உங்கள் முகவரியை உள்ளிடவும்',
    enter_pincode: 'உங்கள் அஞ்சல் குறியீட்டை உள்ளிடவும்',
    error: 'பிழை',
    cart_empty_error: 'உங்கள் கார்ட் காலியாக உள்ளது. ஆர்டர் செய்ய சில பொருட்களைச் சேர்க்கவும்.',
    order_success: 'ஆர்டர் வெற்றிகரமாக வைக்கப்பட்டது',
    order_pickup_success: 'உங்கள் ஆர்டர் வெற்றிகரமாக வைக்கப்பட்டுள்ளது. நீங்கள் தேர்ந்தெடுத்த நேரத்தில் அதை எடுத்துக்கொள்ளலாம்.',
    order_delivery_success: 'உங்கள் ஆர்டர் வெற்றிகரமாக வைக்கப்பட்டுள்ளது. விரைவில் அதை உங்கள் முகவரிக்கு வழங்குவோம்.',
    order_placed: 'ஆர்டர் வைக்கப்பட்டது',
    thank_you: 'நன்றி!',
    order_confirmation_message: 'உங்கள் ஆர்டர் பெறப்பட்டு செயலாக்கப்படுகிறது. உங்கள் தொலைபேசியில் புதுப்பிப்புகளைப் பெறுவீர்கள்.',
    view_orders: 'ஆர்டர்களைக் காண',
    continue_shopping: 'தொடர்ந்து ஷாப்பிங் செய்',
    add_items: 'உங்கள் கார்ட்டில் சில பொருட்களைச் சேர்க்கவும்',

    // New translations for Service Unavailable page
    service_unavailable: 'சேவை இல்லை',
    no_internet_message: "நீங்கள் ஆஃப்லைனில் இருப்பதாகத் தெரிகிறது. உங்கள் இணைய இணைப்பைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.",
    refresh_page: 'பக்கத்தை புதுப்பிக்கவும்',
    go_to_home: 'முகப்புக்குச் செல்'
  },
  hindi: {
    // Existing translations
    nav_home: 'होम',
    nav_category: 'श्रेणियाँ',
    nav_orders: 'ऑर्डर',
    nav_profile: 'प्रोफाइल',
    category_title: 'श्रेणी द्वारा खरीदारी करें',
    category_offers: 'ऑफर',
    category_vegetables: 'सब्जियाँ',
    category_fruits: 'फल',
    category_grocery: 'किराना',
    category_plastic: 'प्लास्टिक',
    category_living: 'लिविंग',
    category_all: 'सभी श्रेणियाँ',
    category_subcategory_not_found: 'श्रेणी या उपश्रेणी नहीं मिली',
    category_subcategory_not_exist: "आप जिस श्रेणी या उपश्रेणी को खोज रहे हैं वह मौजूद नहीं है।",
    see_all: 'सभी देखें',
    toggle_language: 'भाषा बदलें',
    language_english: 'अंग्रेज़ी',
    language_tamil: 'तमिल',
    language_hindi: 'हिंदी',
    cart: 'कार्ट',
    cart_empty: 'आपका कार्ट खाली है',
    organic: 'जैविक',
    contact_whatsapp: 'व्हाट्सएप:',
    contact_phone: 'कॉल:',
    cycle_next_language: 'अगली भाषा',
    items: 'आइटम',
    add: 'जोड़ें',
    back: 'वापस',
    checkout: 'चेकआउट',
    subtotal: 'सबटोटल',
    total: 'कुल',
    ratings: 'रेटिंग',
    filter: 'फ़िल्टर',
    sort: 'क्रमबद्ध करें',
    grid_view: 'ग्रिड व्यू',
    list_view: 'लिस्ट व्यू',
    special_offer: 'विशेष ऑफर',
    offer_discount: '{discount}% तक की छूट!',
    offer_limited: 'सीमित समय का ऑफर',
    special_offers: 'विशेष ऑफर',
    fresh_produce: 'ताजा उत्पाद',
    dashboard: 'डैशबोर्ड',
    categories: 'श्रेणियाँ',
    products: 'उत्पाद',
    orders: 'ऑर्डर',
    settings: 'सेटिंग्स',
    admin_logout: 'लॉगआउट',
    name: 'नाम',
    name_required: 'नाम आवश्यक है',
    phone: 'फोन',
    valid_phone_required: 'वैध फोन नंबर आवश्यक है',
    address: 'पता',
    address_required: 'पता आवश्यक है',
    pincode: 'पिनकोड',
    valid_pincode_required: 'वैध 6-अंकों का पिनकोड आवश्यक है',
    pickup_time: 'पिकअप समय',
    pickup_time_required: 'कृपया पिकअप समय चुनें',
    payment_method: 'भुगतान का तरीका',
    cash_on_delivery: 'डिलीवरी पर नकदी',
    online_payment: 'ऑनलाइन भुगतान',
    place_order: 'ऑर्डर दें',
    placing_order: 'ऑर्डर दिया जा रहा है...',
    order_summary: 'ऑर्डर सारांश',
    delivery_method: 'डिलीवरी का तरीका',
    shop_pickup: 'दुकान से पिकअप',
    door_delivery: 'घर तक डिलीवरी',
    available_above_2000: '₹2000 से ऊपर के ऑर्डर के लिए उपलब्ध',
    delivery_details: 'डिलीवरी विवरण',
    enter_name: 'अपना नाम दर्ज करें',
    enter_phone: 'अपना फोन नंबर दर्ज करें',
    enter_address: 'अपना पता दर्ज करें',
    enter_pincode: 'अपना पिनकोड दर्ज करें',
    error: 'त्रुटि',
    cart_empty_error: 'आपका कार्ट खाली है। ऑर्डर देने के लिए कुछ आइटम जोड़ें।',
    order_success: 'ऑर्डर सफलतापूर्वक दिया गया',
    order_pickup_success: 'आपका ऑर्डर सफलतापूर्वक दिया गया है। आप इसे चुने गए समय पर ले सकते हैं।',
    order_delivery_success: 'आपका ऑर्डर सफलतापूर्वक दिया गया है। हम इसे जल्द ही आपके पते पर डिलीवर करेंगे।',
    order_placed: 'ऑर्डर दिया गया',
    thank_you: 'धन्यवाद!',
    order_confirmation_message: 'आपका ऑर्डर प्राप्त हो गया है और प्रोसेस किया जा रहा है। आपको अपने फोन पर अपडेट मिलेंगे।',
    view_orders: 'ऑर्डर देखें',
    continue_shopping: 'शॉपिंग जारी रखें',
    add_items: 'अपने कार्ट में कुछ आइटम जोड़ें',

    // New translations for Service Unavailable page
    service_unavailable: 'सेवा अनुपलब्ध',
    no_internet_message: "लगता है आप ऑफलाइन हैं। कृपया अपने इंटरनेट कनेक्शन की जाँच करें और फिर से प्रयास करें।",
    refresh_page: 'पेज रिफ्रेश करें',
    go_to_home: 'होम पेज पर जाएं'
  }
};