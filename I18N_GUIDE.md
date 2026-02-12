# Localization & i18n Implementation Guide

## Overview

Your Perfume Page project now has a complete internationalization (i18n) system that allows you to support multiple languages. All hardcoded text has been extracted and organized into a centralized translation system.

## Supported Languages

- 🇬🇧 **English** (en)
- 🇸🇦 **Arabic** (ar) - Right-to-left language support ready
- 🇫🇷 **Français** (fr)
- 🇪🇸 **Español** (es)

## Project Structure

```
app/
├── locales/                          # Translation files
│   ├── en.json                      # English translations
│   ├── ar.json                      # Arabic translations
│   ├── fr.json                      # French translations
│   └── es.json                      # Spanish translations
├── context/
│   ├── LocaleContext.tsx            # Localization context & provider
│   ├── CartContext.tsx
│   └── CheckoutContext.tsx
├── hooks/
│   └── useCart.ts
├── components/
│   ├── LanguageSwitcher.tsx         # NEW: Language selector component
│   ├── Header.tsx                   # Updated with i18n
│   ├── Footer.tsx                   # Updated with i18n
│   ├── HeroSection.tsx              # Updated with i18n
│   ├── ProductGrid.tsx              # Updated with i18n
│   ├── CartDrawer.tsx               # Updated with i18n
│   └── ...other components
└── layout.tsx                        # Updated with LocaleProvider

```

## How the System Works

### 1. **Translation Files Structure**

Each language file (`en.json`, `ar.json`, etc.) is organized by feature/section:

```json
{
  "common": {
    "language": "English"
  },
  "navigation": {
    "new": "New",
    "forHer": "For Her",
    "forHim": "For Him",
    "collections": "Collections",
    "search": "Search..."
  },
  "hero": {
    "silkMusk": {
      "title": "Silk Musk",
      "subtitle": "Experience Pure Elegance",
      "description": "A delicate blend of white florals and soft musk"
    }
  },
  "cart": {
    "yourCart": "Your Cart",
    "emptyCart": "Your cart is empty",
    "total": "Total"
  }
  // ... more sections
}
```

### 2. **LocaleContext & useLocale Hook**

**File**: `app/context/LocaleContext.tsx`

The context provides:

- `locale` - Current active language (en, ar, fr, es)
- `setLocale()` - Function to change language
- `t()` - Translation function
- `availableLocales` - Array of supported languages

### 3. **Using Translations in Components**

```tsx
"use client";

import { useLocale } from "../context/LocaleContext";

export function MyComponent() {
  const { t } = useLocale();

  return (
    <div>
      <h1>{t("navigation.new")}</h1>
      <p>{t("cart.yourCart")}</p>
      <button>{t("products.addToCart")}</button>
    </div>
  );
}
```

### 4. **Language Switcher**

**File**: `app/components/LanguageSwitcher.tsx`

A dropdown component that allows users to change the language:

```tsx
<LanguageSwitcher />
```

Automatically handles:

- Language selection
- Locale update
- Display of language names in current language

## Updated Components

The following components have been updated with localization:

✅ **Header.tsx** - Navigation labels, search placeholder
✅ **Footer.tsx** - Footer links and descriptions
✅ **HeroSection.tsx** - Hero slide content
✅ **ProductGrid.tsx** - Filter buttons, "View All" button
✅ **CartDrawer.tsx** - Cart labels and messages
✅ **LanguageSwitcher.tsx** - NEW language selector component

## Adding Localization to New Components

### Step 1: Import the hook

```tsx
import { useLocale } from "../context/LocaleContext";
```

### Step 2: Get the translation function

```tsx
export function MyComponent() {
  const { t } = useLocale();

  // ... component code
}
```

### Step 3: Replace hardcoded text

```tsx
// Before
<h1>Welcome to our store</h1>

// After
<h1>{t("common.welcome")}</h1>
```

### Step 4: Add translations to JSON files

Add your key to each language file:

**en.json**:

```json
{
  "common": {
    "welcome": "Welcome to our store"
  }
}
```

**ar.json**:

```json
{
  "common": {
    "welcome": "أهلا بك في متجرنا"
  }
}
```

## Translation Key Naming Conventions

Use dot notation for nested keys:

```
✅ Good:
  payment.methodLabel
  checkout.address.street
  products.filters.category

❌ Avoid:
  PaymentMethodLabel
  checkoutAddressStreet
  products_filters_category
```

## Available Translation Keys

### Navigation

- `navigation.new`
- `navigation.forHer`
- `navigation.forHim`
- `navigation.collections`
- `navigation.search`

### Cart

- `cart.yourCart`
- `cart.emptyCart`
- `cart.addProducts`
- `cart.sku`
- `cart.total`
- `cart.subtotal`
- `cart.checkout`
- `cart.continueShopping`

### Products

- `products.viewAll`
- `products.addToCart`
- `products.viewDetails`

### Checkout

- `checkout.title`
- `checkout.address`
- `checkout.shipping`
- `checkout.payment`
- `checkout.firstName`
- `checkout.lastName`
- `checkout.email`
- `checkout.phone`
- `checkout.addressLine1`
- `checkout.addressLine2`
- `checkout.city`
- `checkout.state`
- `checkout.zipCode`
- `checkout.country`

### Order Confirmation

- `orderConfirmation.confirmed`
- `orderConfirmation.thank_you`
- `orderConfirmation.orderReceived`
- `orderConfirmation.orderNumber`
- `orderConfirmation.checkEmail`

### Footer

- `footer.brand`
- `footer.description`
- `footer.shop`
- `footer.newArrivals`
- `footer.bestSellers`
- `footer.giftSets`
- `footer.support`
- `footer.contactUs`
- `footer.shippingInfo`
- `footer.returns`
- `footer.faq`
- `footer.legal`
- `footer.privacy`
- `footer.terms`

## How to Extend the System

### Adding a New Language

1. **Create new translation file**: Copy an existing JSON file (e.g., `en.json`) and name it appropriately (e.g., `de.json` for German)

2. **Translate all content** in the new file

3. **Update LocaleContext.tsx** to import and register the new language:

```tsx
const translations: Record<LocaleType, any> = {
  en: require("../locales/en.json"),
  ar: require("../locales/ar.json"),
  fr: require("../locales/fr.json"),
  es: require("../locales/es.json"),
  de: require("../locales/de.json"), // Add this
};

type LocaleType = "en" | "ar" | "fr" | "es" | "de"; // Update this
```

4. **Add language name to LanguageSwitcher.tsx**:

```tsx
const localeNames: Record<string, string> = {
  en: "English",
  ar: "العربية",
  fr: "Français",
  es: "Español",
  de: "Deutsch", // Add this
};
```

## Running the Project

### Development

```bash
npm run dev
```

The app will start with English as the default language. You can switch languages using the LanguageSwitcher dropdown in the header.

### Production

```bash
npm run build
npm run start
```

## Best Practices

1. **Keep keys organized** - Group related translations together by feature/section
2. **Use consistent naming** - Use the same pattern for similar keys across languages
3. **Avoid placeholder text** - Always provide actual translations, not English defaults
4. **Test all languages** - Verify that UI elements resize properly for longer translations
5. **Handle RTL languages** - Remember that Arabic requires right-to-left text direction
6. **Keep translations in sync** - Ensure all language files have the same keys

## Future Enhancements

Potential improvements to the i18n system:

- Add language detection based on user's browser locale
- Persist language preference in localStorage
- Implement date/time formatting for specific locales
- Add currency localization (INR, EUR, etc.)
- Implement pluralization rules
- Add translation management UI for admin panel
- Server-side rendering with locale detection

## Troubleshooting

### Issue: Translation not showing

**Solution**: Check if the key path is correct. Use the exact key path like `section.subsection.key`.

### Issue: Language switch not working

**Solution**: Ensure component is wrapped with `<LocaleProvider>` in the layout.

### Issue: Missing translations for a language

**Solution**: Add the missing key to all language JSON files with proper translations.

## Support

For any issues or questions about the localization system, refer to this documentation or check the code in:

- `app/context/LocaleContext.tsx` - Core localization logic
- `app/locales/*.json` - Translation files
- `app/components/LanguageSwitcher.tsx` - Language selection UI

---

Last Updated: February 2026
