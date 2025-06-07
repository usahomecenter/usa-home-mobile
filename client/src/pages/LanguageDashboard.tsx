import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { languageOptions } from "@/data/languageData";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Globe, Check, Settings, Languages, MessageSquare, BarChart3 } from "lucide-react";

const LanguageDashboard = () => {
  const { currentLanguage, setLanguage, t } = useLanguage();
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [showOriginal, setShowOriginal] = useState(false);

  // Calculate translation coverage for demonstration
  const getTranslationCoverage = (code: string) => {
    switch (code) {
      case 'en': return 100;
      case 'es': return 87;
      case 'fr': return 72;
      case 'de': return 68;
      case 'zh': return 54;
      case 'ja': return 42;
      case 'ru': return 36;
      case 'ar': return 29;
      case 'pt': return 63;
      case 'hi': return 21;
      default: return 0;
    }
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Globe className="h-8 w-8 text-primary" />
        {t('internationalization_dashboard')}
      </h1>
      
      <Tabs defaultValue="language" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="language" className="flex items-center gap-2">
            <Languages className="h-4 w-4" />
            {t('language_settings')}
          </TabsTrigger>
          <TabsTrigger value="translation" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            {t('translation_tools')}
          </TabsTrigger>
          <TabsTrigger value="statistics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {t('statistics')}
          </TabsTrigger>
        </TabsList>
        
        {/* Language Settings Tab */}
        <TabsContent value="language" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('current_language')}</CardTitle>
                <CardDescription>{t('your_primary_display_language')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  <div className="h-12 w-12 flex items-center justify-center bg-primary/10 rounded-full">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{currentLanguage.name}</h3>
                    <p className="text-sm text-muted-foreground">{t('code')}: {currentLanguage.code}</p>
                  </div>
                  <Badge variant="outline" className="ml-auto">
                    {t('active')}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t('language_preferences')}</CardTitle>
                <CardDescription>{t('customize_your_language_experience')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-translate">{t('auto_translate')}</Label>
                    <p className="text-sm text-muted-foreground">{t('translate_content_automatically')}</p>
                  </div>
                  <Switch 
                    id="auto-translate" 
                    checked={autoTranslate}
                    onCheckedChange={setAutoTranslate}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-original">{t('show_original_text')}</Label>
                    <p className="text-sm text-muted-foreground">{t('display_original_text_alongside_translation')}</p>
                  </div>
                  <Switch 
                    id="show-original" 
                    checked={showOriginal} 
                    onCheckedChange={setShowOriginal}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('available_languages')}</CardTitle>
              <CardDescription>{t('select_your_preferred_language')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {languageOptions.map((language) => (
                  <div
                    key={language.code}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent transition-colors ${
                      language.code === currentLanguage.code ? "bg-muted border border-border" : ""
                    }`}
                    onClick={() => setLanguage(language)}
                  >
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full">
                      <span className="text-sm">{language.abbr}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium truncate">{language.name}</h3>
                      <div className="flex items-center mt-1">
                        <Progress value={getTranslationCoverage(language.code)} className="h-1.5 flex-1" />
                        <span className="ml-2 text-xs text-muted-foreground">{getTranslationCoverage(language.code)}%</span>
                      </div>
                    </div>
                    {language.code === currentLanguage.code && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">{t('cancel')}</Button>
              <Button>{t('save_preferences')}</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Translation Tools Tab */}
        <TabsContent value="translation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('translation_tools')}</CardTitle>
              <CardDescription>{t('tools_to_help_with_translation')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-medium mb-2">{t('machine_translation')}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('use_ai_powered_translation_for_content')}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge>Google Translate</Badge>
                  <Badge>DeepL</Badge>
                  <Badge>Microsoft Translator</Badge>
                </div>
                <Button className="mt-4" size="sm">{t('configure')}</Button>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-medium mb-2">{t('translation_memory')}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('use_previously_translated_text_for_consistency')}
                </p>
                <Progress value={67} className="h-2 mb-2" />
                <p className="text-xs text-muted-foreground">{t('memory_database')}: 1,240 {t('entries')}</p>
                <Button className="mt-4" size="sm" variant="outline">{t('manage_database')}</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('community_translations')}</CardTitle>
              <CardDescription>{t('contribute_to_translations')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {t('help_translate_content_to_your_language')}
              </p>
              <Button>{t('join_translation_community')}</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Statistics Tab */}
        <TabsContent value="statistics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('translation_statistics')}</CardTitle>
              <CardDescription>{t('overview_of_translation_coverage')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {languageOptions.map((language) => (
                  <div key={language.code} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 flex items-center justify-center bg-primary/10 rounded-full">
                          <span className="text-xs font-medium">{language.abbr}</span>
                        </div>
                        <span>{language.name}</span>
                      </div>
                      <span className="text-sm font-medium">{getTranslationCoverage(language.code)}%</span>
                    </div>
                    <Progress value={getTranslationCoverage(language.code)} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{t('total_strings')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1,543</div>
                <p className="text-xs text-muted-foreground">{t('total_number_of_translatable_strings')}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{t('languages')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{languageOptions.length}</div>
                <p className="text-xs text-muted-foreground">{t('supported_languages')}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{t('contributors')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">27</div>
                <p className="text-xs text-muted-foreground">{t('active_translation_contributors')}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LanguageDashboard;