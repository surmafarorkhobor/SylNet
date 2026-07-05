# Sylhetin Database Schema (Version 1.0)

এই ডকুমেন্টটি Sylhetin-এর সম্পূর্ণ ডাটাবেজ ডিজাইন — এখন পর্যন্ত তৈরি প্রোটোটাইপের সব ফিচার (Majlis, Post, Reaction, Comment, Share, Profile, News, People You May Know) এবং Vision Document-এ উল্লেখিত ভবিষ্যৎ ফিচারগুলো (OTP Login, Report System, Notification) বিবেচনা করে বানানো হয়েছে।

ER ডায়াগ্রামের জন্য আলাদা ফাইল দেখুন: `sylnet-erd.mermaid`

---

## ১. users (ব্যবহারকারী)

মূল প্রোফাইল টেবিল — "বাস্তব মানুষ, বাস্তব পরিচয়" নীতি অনুযায়ী।

| Column | Type | Note |
|---|---|---|
| id | BIGINT UNSIGNED, PK | |
| name | VARCHAR(100) | |
| phone | VARCHAR(20), UNIQUE | OTP লগইনের মূল আইডেন্টিফায়ার |
| email | VARCHAR(150), NULLABLE | |
| password_hash | VARCHAR(255), NULLABLE | ফিউচার ইমেইল/পাসওয়ার্ড লগইনের জন্য |
| avatar_url | VARCHAR(255), NULLABLE | |
| cover_url | VARCHAR(255), NULLABLE | |
| bio | TEXT, NULLABLE | |
| country | VARCHAR(100) | দেশ |
| district | VARCHAR(100) | জেলা |
| upazila | VARCHAR(100) | উপজেলা |
| union_name | VARCHAR(100) | ইউনিয়ন |
| current_location | VARCHAR(150) | বর্তমান অবস্থান (প্রবাসী হলে দেশের নাম) |
| profession | VARCHAR(100) | পেশা |
| is_verified | BOOLEAN, DEFAULT false | ✅ যাচাইকৃত ব্যাজ |
| is_active | BOOLEAN, DEFAULT true | Fake/spam অ্যাকাউন্ট ব্লক করতে |
| otp_verified_at | TIMESTAMP, NULLABLE | |
| created_at / updated_at | TIMESTAMP | |

**ইনডেক্স:** `phone` (unique), `(district, upazila, union_name)` — Majlis সাজেশনের জন্য কম্পোজিট ইনডেক্স।

---

## ২. otp_verifications (OTP লগইন)

| Column | Type | Note |
|---|---|---|
| id | BIGINT UNSIGNED, PK | |
| phone | VARCHAR(20) | |
| otp_code | VARCHAR(6) | হ্যাশ করে রাখা ভালো |
| expires_at | TIMESTAMP | সাধারণত ৫-১০ মিনিট |
| verified_at | TIMESTAMP, NULLABLE | |
| created_at | TIMESTAMP | |

**নোট:** Rate-limiting জরুরি (একই নাম্বারে বারবার OTP পাঠানো ঠেকাতে) — Spam Protection ফিচারের অংশ।

---

## ৩. majlis (মজলিস / কমিউনিটি গ্রুপ)

Sylhetin-এর সবচেয়ে গুরুত্বপূর্ণ ফিচার। `parent_majlis_id` দিয়ে হায়ারার্কি তৈরি হয়: **ইউনিয়ন → উপজেলা → জেলা**।

| Column | Type | Note |
|---|---|---|
| id | BIGINT UNSIGNED, PK | |
| name | VARCHAR(150) | যেমন: "ফেঞ্চুগঞ্জ ইউনিয়ন মজলিস" |
| icon | VARCHAR(20) | ইমোজি বা আইকন কোড |
| type | ENUM | `union`, `upazila`, `district`, `expatriate`, `business`, `student`, `islamic`, `village` (ভবিষ্যৎ) |
| parent_majlis_id | BIGINT UNSIGNED, FK → majlis.id, NULLABLE | হায়ারার্কি লিংক |
| description | TEXT, NULLABLE | |
| member_count | INT, DEFAULT 0 | Denormalized কাউন্ট — পারফরম্যান্সের জন্য (ট্রিগার/জব দিয়ে আপডেট হবে) |
| created_at | TIMESTAMP | |

**নোট:** `expatriate` টাইপের মজলিসের জন্য দেশের নাম আলাদা কলামে (`country_scope`) রাখা যেতে পারে ভবিষ্যতে (যেমন "প্রবাসী মজলিস — সৌদি আরব")।

---

## ৪. majlis_members (মজলিস সদস্যপদ)

| Column | Type | Note |
|---|---|---|
| id | BIGINT UNSIGNED, PK | |
| majlis_id | BIGINT UNSIGNED, FK → majlis.id | |
| user_id | BIGINT UNSIGNED, FK → users.id | |
| role | ENUM | `member`, `moderator`, `admin` |
| joined_at | TIMESTAMP | |

**ইনডেক্স:** UNIQUE `(majlis_id, user_id)` — একই ইউজার একই মজলিসে দুইবার জয়েন করতে পারবে না।

---

## ৫. posts (পোস্ট)

| Column | Type | Note |
|---|---|---|
| id | BIGINT UNSIGNED, PK | |
| user_id | BIGINT UNSIGNED, FK → users.id | |
| majlis_id | BIGINT UNSIGNED, FK → majlis.id, NULLABLE | পোস্ট যদি নির্দিষ্ট মজলিসে করা হয় |
| content | TEXT, NULLABLE | ছবি-শুধু পোস্টের জন্য nullable |
| is_deleted | BOOLEAN, DEFAULT false | Soft delete |
| created_at / updated_at | TIMESTAMP | |

**ইনডেক্স:** `(majlis_id, created_at)` — মজলিস ফিড লোড করার জন্য, `(user_id, created_at)` — প্রোফাইল পোস্ট লিস্টের জন্য।

---

## ৬. post_media (পোস্ট ছবি/ভিডিও)

| Column | Type | Note |
|---|---|---|
| id | BIGINT UNSIGNED, PK | |
| post_id | BIGINT UNSIGNED, FK → posts.id | |
| media_type | ENUM | `image`, `video` |
| url | VARCHAR(255) | Cloud Storage পাথ |
| sort_order | TINYINT, DEFAULT 0 | একাধিক ছবির ক্রম |

---

## ৭. reactions (রিয়েকশন)

৬টা সিলেটি রিয়েকশনের জন্য।

| Column | Type | Note |
|---|---|---|
| id | BIGINT UNSIGNED, PK | |
| post_id | BIGINT UNSIGNED, FK → posts.id | |
| user_id | BIGINT UNSIGNED, FK → users.id | |
| type | ENUM | `like` (👍 ফছন অইছে), `love` (❤️ ভালা লাগছে), `haha` (😂 হা হা), `wow` (😮 ছমতখার), `sad` (😢 খশটো ফাইলাম), `angry` (😡 রাগ খরলাম) |
| created_at | TIMESTAMP | |

**ইনডেক্স:** UNIQUE `(post_id, user_id)` — একজন ইউজার একটা পোস্টে একটাই রিয়েকশন দিতে পারবে (রিয়েকশন পাল্টালে `type` আপডেট হবে, নতুন রো তৈরি হবে না)।

---

## ৮. comments (কমেন্ট)

| Column | Type | Note |
|---|---|---|
| id | BIGINT UNSIGNED, PK | |
| post_id | BIGINT UNSIGNED, FK → posts.id | |
| user_id | BIGINT UNSIGNED, FK → users.id | |
| parent_comment_id | BIGINT UNSIGNED, FK → comments.id, NULLABLE | ভবিষ্যতে রিপ্লাই থ্রেডের জন্য |
| content | TEXT | |
| created_at | TIMESTAMP | |

---

## ৯. shares (শেয়ার)

| Column | Type | Note |
|---|---|---|
| id | BIGINT UNSIGNED, PK | |
| post_id | BIGINT UNSIGNED, FK → posts.id | |
| user_id | BIGINT UNSIGNED, FK → users.id | |
| created_at | TIMESTAMP | |

**নোট:** শেয়ার কাউন্ট এই টেবিলের `COUNT(*)` থেকেই বের করা যাবে, আলাদা কাউন্টার কলাম লাগবে না (কম ডেটা হলে); বড় স্কেলে গেলে `posts.share_count` denormalized কলাম যোগ করা যায়।

---

## ১০. connections (ফলো / পিপল ইউ মে নো)

| Column | Type | Note |
|---|---|---|
| id | BIGINT UNSIGNED, PK | |
| follower_id | BIGINT UNSIGNED, FK → users.id | |
| followed_id | BIGINT UNSIGNED, FK → users.id | |
| status | ENUM | `pending`, `accepted` |
| created_at | TIMESTAMP | |

**ইনডেক্স:** UNIQUE `(follower_id, followed_id)`।

---

## ১১. news (শুরমাফারর খবর)

| Column | Type | Note |
|---|---|---|
| id | BIGINT UNSIGNED, PK | |
| source_name | VARCHAR(100), DEFAULT 'Surma Faror Khobor' | |
| title | VARCHAR(255) | |
| body | TEXT | |
| published_at | TIMESTAMP | |
| created_at | TIMESTAMP | |

## ১১.১ news_media

| Column | Type | Note |
|---|---|---|
| id | BIGINT UNSIGNED, PK | |
| news_id | BIGINT UNSIGNED, FK → news.id | |
| url | VARCHAR(255) | |

---

## ১২. notifications (নোটিফিকেশন)

| Column | Type | Note |
|---|---|---|
| id | BIGINT UNSIGNED, PK | |
| user_id | BIGINT UNSIGNED, FK → users.id | যাকে জানানো হচ্ছে |
| actor_id | BIGINT UNSIGNED, FK → users.id | যে কাজটা করেছে (রিয়েক্ট/কমেন্ট/শেয়ার/ফলো) |
| type | ENUM | `reaction`, `comment`, `share`, `follow`, `majlis_invite` |
| post_id | BIGINT UNSIGNED, FK → posts.id, NULLABLE | |
| majlis_id | BIGINT UNSIGNED, FK → majlis.id, NULLABLE | |
| is_read | BOOLEAN, DEFAULT false | |
| created_at | TIMESTAMP | |

---

## ১৩. reports (রিপোর্ট সিস্টেম)

| Column | Type | Note |
|---|---|---|
| id | BIGINT UNSIGNED, PK | |
| reporter_id | BIGINT UNSIGNED, FK → users.id | |
| reported_user_id | BIGINT UNSIGNED, FK → users.id, NULLABLE | |
| reported_post_id | BIGINT UNSIGNED, FK → posts.id, NULLABLE | |
| reason | VARCHAR(255) | |
| status | ENUM | `pending`, `reviewed`, `resolved` |
| created_at | TIMESTAMP | |

---

## সম্পর্কের সারসংক্ষেপ (Relationships)

- এক **user** অনেক **post**, **comment**, **reaction**, **share** করতে পারে (1 → N)
- এক **user** অনেক **majlis**-এ যোগ দিতে পারে, `majlis_members` টেবিল দিয়ে (N ↔ N)
- এক **majlis** নিজের ভেতরেই আরেকটা **majlis**-এর "parent" হতে পারে (self-referencing — ইউনিয়ন → উপজেলা → জেলা হায়ারার্কি)
- এক **post**-এ অনেক **media**, **comment**, **reaction**, **share** থাকতে পারে (1 → N)
- **reactions** টেবিলে unique constraint থাকায় একজন ইউজার একটা পোস্টে একটাই রিয়েকশন রাখতে পারবে

---

## Laravel Migration নোট

- সব টেবিলে Laravel-এর ডিফল্ট `id()`, `timestamps()` ব্যবহার করা যাবে
- Foreign key-গুলোতে `->constrained()->cascadeOnDelete()` ব্যবহার করলে ইউজার/পোস্ট ডিলিট হলে সংশ্লিষ্ট ডেটাও পরিষ্কার হয়ে যাবে
- `majlis.parent_majlis_id` সেলফ-রেফারেন্সিং ফরেন কি — মাইগ্রেশনে `->nullable()->constrained('majlis')->nullOnDelete()`
- Enum কলামগুলো (`type`, `role`, `status` ইত্যাদি) Laravel-এ `enum()` কলাম টাইপ বা string + validation দিয়ে করা যায় — ভবিষ্যতে নতুন টাইপ যোগ করার সুবিধার জন্য string + validation বেশি নমনীয়
- `member_count` এবং অন্যান্য denormalized কাউন্ট কলাম আপডেট করতে Laravel Model Events (Observers) ব্যবহার করা ভালো অভ্যাস

---

## পরের ধাপ

এই স্কিমা রেডি থাকলে পরের ধাপগুলো হবে:
1. Laravel প্রজেক্ট সেটআপ + Migration ফাইল তৈরি (এই স্কিমা থেকে সরাসরি)
2. Model + Relationship (Eloquent) সেটআপ
3. REST API endpoint ডিজাইন (routes/api.php)
4. Admin Panel-এর জন্য প্রয়োজনীয় ভিউ
