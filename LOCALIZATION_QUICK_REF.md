# Quick Reference: Using Localization in Your Project

## TL;DR - The Essentials

### Using Translations in a Component

```tsx
"use client";

import { useLocale } from "@/app/context/LocaleContext";

export function MyComponent() {
  const { t, locale, setLocale } = useLocale();

  return (
    <div>
      <h1>{t("navigation.collections")}</h1>
      <p>Current language: {locale}</p>
      <button onClick={() => setLocale("ar")}>عربي</button>
    </div>
  );
}
```

### Adding New Translations

1. **Add to all JSON files** in `app/locales/`:
   - `en.json`: `"myKey": "My Value"`
   - `ar.json`: `"myKey": "قيمتي"`
   - `fr.json`: `"myKey": "Ma Valeur"`
   - `es.json`: `"myKey": "Mi Valor"`

2. **Use in components**:
   ```tsx
   {
     t("myKey");
   }
   ```

### Adding a New Language

1. Create `app/locales/[code].json` (e.g., `de.json`)
2. Copy all keys from `en.json` and translate
3. Update `app/context/LocaleContext.tsx`:
   ```tsx
   const translations = {
     en: require("../locales/en.json"),
     de: require("../locales/de.json"), // ADD THIS
   };
   ```
4. Update type:
   ```tsx
   type LocaleType = "en" | "ar" | "fr" | "es" | "de"; // ADD "de"
   ```
5. Update `app/components/LanguageSwitcher.tsx`:
   ```tsx
   const localeNames = {
     de: "Deutsch", // ADD THIS
   };
   ```

## Common Tasks

### Display Current Language

```tsx
const { locale } = useLocale();
console.log(locale); // "en", "ar", "fr", or "es"
```

### Change Language Programmatically

```tsx
const { setLocale } = useLocale();
setLocale("fr"); // Switch to French
```

### Access Locale Hook

```tsx
const { t, locale, setLocale, availableLocales } = useLocale();
```

### Translation Key Patterns

Use dot notation for nested keys:

```
✅ Good:
  t("navigation.forHer")
  t("checkout.firstName")
  t("footer.contactUs")

❌ Wrong:
  t("navigation/forHer")
  t("navigationForHer")
  t("NAVIGATION.FOR_HER")
```

## Available Components

### LanguageSwitcher

```tsx
import { LanguageSwitcher } from "@/app/components/LanguageSwitcher";

<LanguageSwitcher />; // Renders language dropdown
```

## JSON Structure Best Practices

```json
{
  "section": {
    "subsection": {
      "key": "value"
    }
  }
}
```

**Example**:

```json
{
  "navigation": {
    "primary": {
      "new": "New",
      "shop": "Shop"
    },
    "search": "Search..."
  }
}
```

## Troubleshooting

| Problem                      | Solution                                          |
| ---------------------------- | ------------------------------------------------- |
| Translation not showing      | Check key path matches JSON file exactly          |
| Language switch doesn't work | Ensure component is wrapped by `<LocaleProvider>` |
| useLocale hook error         | Import from `@/app/context/LocaleContext`         |
| Missing translations         | Add key to ALL language JSON files                |

## Where Are Translations?

```
app/locales/
├── en.json    ← English
├── ar.json    ← Arabic (RTL)
├── fr.json    ← French
└── es.json    ← Spanish
```

## Where Is the System?

```
app/context/LocaleContext.tsx        ← Core system
app/components/LanguageSwitcher.tsx  ← Language picker
app/layout.tsx                       ← Provider wrapper
```

## Current Supported Keys

### Navigation

- `navigation.new`
- `navigation.forHer`
- `navigation.forHim`
- `navigation.collections`
- `navigation.search`

### Hero Section

- `hero.silkMusk.title`, `subtitle`, `description`
- `hero.midnightAgar.title`, `subtitle`, `description`
- `hero.shopNow`

### Cart

- `cart.yourCart`
- `cart.emptyCart`
- `cart.addProducts`
- `cart.sku`
- `cart.total`
- `cart.subtotal`
- `cart.checkout`
- `cart.continueShopping`
- `cart.removeItem`

### Checkout

- `checkout.title`
- `checkout.address`
- `checkout.shipping`
- `checkout.payment`
- `checkout.confirmation`
- Form fields: firstName, lastName, email, phone, etc.

### Products

- `products.viewAll`
- `products.addToCart`
- `products.viewDetails`

### Order

- `orderConfirmation.confirmed`
- `orderConfirmation.thank_you`
- `orderConfirmation.orderReceived`
- `orderConfirmation.orderNumber`
- `orderConfirmation.checkEmail`

### Footer

- `footer.*` (20+ keys for all footer content)

---

**Need Help?** Refer to:

- `I18N_GUIDE.md` - Full documentation
- `app/components/Header.tsx` - Component usage example
- `app/locales/en.json` - Key structure reference
