# Japan Trip 2026 · יפן שלנו

אתר סטטי לתכנון הטיול של יוסי ויעלה ביפן, 28 באוקטובר עד 18 בנובמבר 2026.

## תכולה
- Timeline לפי ימים ואירועים המתפרסים על מספר ימים
- מפה אינטראקטיבית של יפן עם נקודות ציון
- סינון לפי עיר, סוג מקום, תאריך וחיפוש
- חלונית אירוע עם פרטים, סטטוס וקישורים
- ממשק עברי מותאם לטלפון

## תחזוקה
כל מידע על מקומות נמצא ב-[data/itinerary.json](data/itinerary.json). הוספת אירוע אינה מצריכה שינוי בקוד האתר.

דוגמה **למבנה בלבד** (לא הזמנה אמיתית):

```json
{
  "id": "unique-id",
  "title": "שם המקום",
  "city": "טוקיו",
  "category": "food",
  "status": "planned",
  "startDate": "2026-11-02",
  "endDate": null,
  "time": "19:00",
  "location": "כתובת",
  "description": "פרטים על המקום",
  "coordinates": { "lat": 35.6762, "lng": 139.6503 },
  "links": [{ "label": "אתר", "url": "https://example.com" }]
}
```

קטגוריות: `city`, `attraction`, `food`, `hotel`, `transport`.

סטטוסים: `confirmed` (מאושר), `planned` (מתוכנן), `idea` (רעיון).

לאירוע ללא תאריך יש להגדיר `startDate: null`, `endDate: null` ולהוסיף `dateNote`.

**חשוב:** הקוד והאתר ציבוריים. אין להכניס מספרי הזמנות, דרכונים, פרטי קשר פרטיים או קישורים למסמכים רגישים.

## פרסום עם GitHub Pages
1. עברו ל-**Settings → Pages** בריפו.
2. תחת **Build and deployment** בחרו **Deploy from a branch**.
3. בחרו **main** ו-**/(root)** ולחצו **Save**.
4. הכתובת הצפויה לאחר הפרסום: https://yosibs.github.io/japan-trip-2026/

כל עדכון ל-main יפורסם מחדש על ידי GitHub Pages.

## הרצה מקומית
```bash
python -m http.server 8000
```
פתחו http://localhost:8000. יש צורך בשרת HTTP מקומי עבור קובץ ה-JSON. מפות ופונטים נטענים מהרשת.
