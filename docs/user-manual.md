# SylNet — ইউজার ম্যানুয়াল (নিজের জন্য রেফারেন্স)

এই ডকুমেন্টে আপনার পুরো SylNet প্রজেক্টের সবকিছু কোথায় আছে, কীভাবে কাজ শুরু করবেন, আর এখন পর্যন্ত কী কী করা হয়েছে — সব লেখা আছে। ভুলে গেলে এই ফাইলটা দেখে নিলেই মনে পড়ে যাবে।

---

## ১. প্রজেক্ট পরিচিতি

| বিষয় | তথ্য |
|---|---|
| প্রজেক্টের নাম | SylNet |
| স্লোগান | আমরা হখল ছিলটি |
| GitHub রিপো (ফ্রন্টএন্ড) | `SylNet` (github.com/surmafarorkhobor/SylNet) |
| ফ্রন্টএন্ড টাইপ | HTML/CSS/JS প্রোটোটাইপ (এখনো Flutter না) |
| ব্যাকএন্ড | Laravel (লোকাল কম্পিউটারে, এখনো GitHub-এ আপলোড করা হয়নি) |

---

## ২. GitHub রিপো স্ট্রাকচার (ফ্রন্টএন্ড)

রিপোর মূল ফোল্ডারে (root) আছে:

```
index.html          → হোম ফিড
majlis.html          → মজলিস তালিকা
majlis-detail.html   → নির্দিষ্ট মজলিসের নিজস্ব ফিড
create-post.html      → নতুন পোস্ট লেখার পেজ
news.html            → খবরের তালিকা
news-detail.html      → খবরের বিস্তারিত
profile.html          → প্রোফাইল পেজ
more.html            → সেটিংস/আরও
more-detail.html      → সেটিংস, প্রাইভেসি, অ্যাবাউট, হেল্প-এর বিস্তারিত
search.html          → সার্চ পেজ
style.css            → সব ডিজাইন/স্টাইল একসাথে
app.js               → সব ইন্টারঅ্যাক্টিভ ফিচারের কোড (রিয়েকশন, কমেন্ট, শেয়ার ইত্যাদি)
```

`docs/` ফোল্ডারে আছে:
```
docs/README.md                     → ডাটাবেজ ডকুমেন্টেশনের সূচি + ER ডায়াগ্রাম
docs/sylnet-database-schema.md     → পূর্ণাঙ্গ ডাটাবেজ টেবিল বিবরণ
docs/sylnet-erd.mermaid            → ER ডায়াগ্রামের সোর্স কোড
```

**⚠️ এই সব ফাইল শুধু `localStorage`-নির্ভর** — মানে ডেটা শুধু আপনার নিজের ফোনে/ব্রাউজারে সেভ থাকে, অন্য কেউ দেখতে পায় না। আসল ব্যাকএন্ড (Laravel) কানেক্ট হলে এটা পাল্টাবে।

---

## ৩. লোকাল ডেভেলপমেন্ট এনভায়রনমেন্ট (কম্পিউটারে)

| বিষয় | তথ্য |
|---|---|
| টুল | Laragon (Windows) |
| ইনস্টল লোকেশন | `C:\laragon` |
| প্রজেক্ট ফোল্ডার | `C:\laragon\www\sylnet-backend` |
| Apache | পোর্ট 80 |
| MySQL | পোর্ট 3306 |

### প্রতিদিন কাজ শুরু করার আগে যা করবেন:
1. Laragon চালু করুন (Start মেনু থেকে খুঁজে খুলুন)
2. Laragon উইন্ডোতে **"Start All"** বাটনে ক্লিক করুন
3. Apache আর MySQL-এর পাশে সবুজ বাতি জ্বললে বুঝবেন সব চালু হয়ে গেছে

### কাজ শেষে যা করবেন:
- টার্মিনাল/HeidiSQL বন্ধ করে দিলেই হবে, আলাদা করে কিছু "সেভ" করা লাগে না
- চাইলে Laragon-এ **"Stop"** চেপে সার্ভিস বন্ধ করতে পারেন (ঐচ্ছিক)

---

## ৪. Laravel ব্যাকএন্ড

| বিষয় | তথ্য |
|---|---|
| প্রজেক্ট পাথ | `C:\laragon\www\sylnet-backend` |
| তৈরি করা হয়েছে যেভাবে | `composer create-project laravel/laravel sylnet-backend` |
| টার্মিনাল খোলার উপায় | Laragon উইন্ডোতে **"Terminal"** বাটন |
| প্রজেক্টের ভেতরে ঢোকার কমান্ড | `cd C:\laragon\www\sylnet-backend` |

### মাইগ্রেশন ফাইল
- লোকেশন: `C:\laragon\www\sylnet-backend\database\migrations\`
- ১৪টা কাস্টম মাইগ্রেশন ফাইল বসানো আছে (users, otp_verifications, majlis, majlis_members, posts, post_media, reactions, comments, shares, connections, news, news_media, notifications, reports)
- মাইগ্রেশন রান করার কমান্ড: `php artisan migrate:fresh`
  *(এটা রান করলে সব পুরনো টেবিল মুছে আবার নতুন করে বানায় — সাবধানে ব্যবহার করবেন, কারণ থাকা ডেটা মুছে যাবে)*

---

## ৫. ডাটাবেজ তথ্য (MySQL)

| বিষয় | তথ্য |
|---|---|
| ডাটাবেজ ম্যানেজার | HeidiSQL (Laragon-এর "Database" বাটনে ক্লিক করলে খোলে) |
| ডাটাবেজের নাম | `sylnet` |
| Host | `127.0.0.1` |
| Port | `3306` |
| Username | `root` |
| Password | *(খালি — কোনো পাসওয়ার্ড নেই)* |

এই তথ্য `.env` ফাইলে বসানো আছে:
- ফাইল লোকেশন: `C:\laragon\www\sylnet-backend\.env`
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sylnet
DB_USERNAME=root
DB_PASSWORD=
```

**বর্তমান টেবিল সংখ্যা:** ১৬টা (১৪টা কাস্টম + Laravel-এর ডিফল্ট cache, jobs)

---

## ৬. এখন পর্যন্ত রোডম্যাপ স্ট্যাটাস

- ✅ ব্র্যান্ড: SylNet
- ✅ স্লোগান: আমরা হখল ছিলটি
- ✅ ফ্রন্টএন্ড প্রোটোটাইপ (HTML/CSS/JS) — GitHub-এ আপলোড করা
- ✅ Database Design (ER Diagram + Schema ডকুমেন্টেশন)
- ✅ Laravel প্রজেক্ট সেটআপ + MySQL কানেকশন + মাইগ্রেশন রান
- ⏳ Logo Final
- ⏳ Eloquent Models (User, Post, Majlis ইত্যাদি PHP ক্লাস)
- ⏳ REST API
- ⏳ Admin Panel
- ⏳ Flutter App
- ⏳ Beta Launch
- ⏳ Public Launch

---

## ৭. দরকারি কমান্ড রেফারেন্স (কপি-পেস্ট করার জন্য)

```
cd C:\laragon\www\sylnet-backend
```
প্রজেক্ট ফোল্ডারে ঢোকার কমান্ড (সবসময় প্রথমে এটা করবেন)

```
php artisan migrate:fresh
```
সব টেবিল মুছে নতুন করে বানানোর কমান্ড

```
php artisan migrate
```
নতুন কোনো মাইগ্রেশন ফাইল যোগ হলে শুধু সেটা রান করার কমান্ড (পুরনো টেবিল মুছবে না)

```
composer create-project laravel/laravel [প্রজেক্টের নাম]
```
নতুন Laravel প্রজেক্ট বানানোর কমান্ড (একবারই লাগে)

---

## ৮. পরের বার কথা শুরু করার সময় যা বলবেন

কথোপকথন শুরু করার সময় বলতে পারেন:
> "SylNet প্রজেক্টে কাল যেখানে রেখেছিলাম (Laravel migration সম্পন্ন), সেখান থেকে চালিয়ে যেতে চাই — এখন Models বানাতে চাই"

এতে সরাসরি সঠিক জায়গা থেকে শুরু করা যাবে।
