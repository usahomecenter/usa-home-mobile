import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { translations } from "./hooks/useLanguage";

// Debug translations in the console
console.log("Available translations:", {
  en: Object.keys(translations.en).length,
  es: Object.keys(translations.es).length,
  fa: Object.keys(translations.fa).length,
  ar: Object.keys(translations.ar).length,
  zh: Object.keys(translations.zh).length,
  hi: Object.keys(translations.hi).length,
  tl: Object.keys(translations.tl).length,
  ko: Object.keys(translations.ko).length
});

// Check a specific translation
console.log("Translation test:", {
  en_back: translations.en.back,
  es_back: translations.es.back,
  fa_back: translations.fa.back,
  ar_back: translations.ar.back,
  zh_back: translations.zh.back,
  hi_back: translations.hi.back,
  tl_back: translations.tl.back,
  ko_back: translations.ko.back,
  en_category_not_found: translations.en.category_not_found,
  es_category_not_found: translations.es.category_not_found,
  fa_category_not_found: translations.fa.category_not_found,
  ar_category_not_found: translations.ar.category_not_found,
  zh_category_not_found: translations.zh.category_not_found,
  hi_category_not_found: translations.hi.category_not_found,
  tl_category_not_found: translations.tl.category_not_found,
  ko_category_not_found: translations.ko.category_not_found
});

// Create the root element and render the app
const root = createRoot(document.getElementById("root")!);

root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);