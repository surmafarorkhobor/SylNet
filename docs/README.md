# SylNet — Database Documentation

এই ফোল্ডারে SylNet প্রজেক্টের ডাটাবেজ ডিজাইন সংক্রান্ত সব ডকুমেন্টেশন রাখা আছে।

📄 **[sylnet-database-schema.md](./sylnet-database-schema.md)** — সম্পূর্ণ টেবিল-বাই-টেবিল বিবরণ (কলাম, টাইপ, ইনডেক্স, রিলেশনশিপ, Laravel migration নোট)

---

## ER Diagram

```mermaid
erDiagram

    USERS ||--o{ POSTS : "লেখেন"
    USERS ||--o{ COMMENTS : "লেখেন"
    USERS ||--o{ REACTIONS : "দেন"
    USERS ||--o{ SHARES : "করেন"
    USERS ||--o{ MAJLIS_MEMBERS : "যোগ দেন"
    USERS ||--o{ OTP_VERIFICATIONS : "যাচাই করেন"
    USERS ||--o{ NOTIFICATIONS : "পান"
    USERS ||--o{ REPORTS : "রিপোর্ট করেন"
    USERS ||--o{ CONNECTIONS : "ফলো করেন"

    MAJLIS ||--o{ MAJLIS_MEMBERS : "সদস্য রাখে"
    MAJLIS ||--o{ POSTS : "ধারণ করে"
    MAJLIS }o--o| MAJLIS : "parent (ইউনিয়ন→উপজেলা→জেলা)"

    POSTS ||--o{ POST_MEDIA : "ছবি/ভিডিও রাখে"
    POSTS ||--o{ COMMENTS : "পায়"
    POSTS ||--o{ REACTIONS : "পায়"
    POSTS ||--o{ SHARES : "পায়"
    POSTS ||--o{ NOTIFICATIONS : "ট্রিগার করে"

    COMMENTS }o--o| COMMENTS : "reply to (nested)"

    NEWS ||--o{ NEWS_MEDIA : "ছবি রাখে"

    USERS {
        bigint id PK
        string name
        string phone UK
        string email
        string password_hash
        string avatar_url
        string cover_url
        text bio
        string country
        string district
        string upazila
        string union_name
        string current_location
        string profession
        boolean is_verified
        boolean is_active
        timestamp otp_verified_at
        timestamp created_at
        timestamp updated_at
    }

    OTP_VERIFICATIONS {
        bigint id PK
        string phone
        string otp_code
        timestamp expires_at
        timestamp verified_at
        timestamp created_at
    }

    MAJLIS {
        bigint id PK
        string name
        string icon
        string type "union/upazila/district/expatriate/business/student/islamic"
        bigint parent_majlis_id FK
        text description
        int member_count
        timestamp created_at
    }

    MAJLIS_MEMBERS {
        bigint id PK
        bigint majlis_id FK
        bigint user_id FK
        string role "member/moderator/admin"
        timestamp joined_at
    }

    POSTS {
        bigint id PK
        bigint user_id FK
        bigint majlis_id FK "nullable"
        text content
        boolean is_deleted
        timestamp created_at
        timestamp updated_at
    }

    POST_MEDIA {
        bigint id PK
        bigint post_id FK
        string media_type "image/video"
        string url
        int sort_order
    }

    REACTIONS {
        bigint id PK
        bigint post_id FK
        bigint user_id FK
        string type "like/love/haha/wow/sad/angry"
        timestamp created_at
    }

    COMMENTS {
        bigint id PK
        bigint post_id FK
        bigint user_id FK
        bigint parent_comment_id FK "nullable"
        text content
        timestamp created_at
    }

    SHARES {
        bigint id PK
        bigint post_id FK
        bigint user_id FK
        timestamp created_at
    }

    CONNECTIONS {
        bigint id PK
        bigint follower_id FK
        bigint followed_id FK
        string status "pending/accepted"
        timestamp created_at
    }

    NEWS {
        bigint id PK
        string source_name
        string title
        text body
        timestamp published_at
        timestamp created_at
    }

    NEWS_MEDIA {
        bigint id PK
        bigint news_id FK
        string url
    }

    NOTIFICATIONS {
        bigint id PK
        bigint user_id FK "যাকে জানানো হচ্ছে"
        bigint actor_id FK "যে কাজটা করেছে"
        string type "reaction/comment/share/follow/majlis_invite"
        bigint post_id FK "nullable"
        bigint majlis_id FK "nullable"
        boolean is_read
        timestamp created_at
    }

    REPORTS {
        bigint id PK
        bigint reporter_id FK
        bigint reported_user_id FK "nullable"
        bigint reported_post_id FK "nullable"
        string reason
        string status "pending/reviewed/resolved"
        timestamp created_at
    }
```

> GitHub-এ এই পেজটা দেখলে উপরের কোড ব্লকটা স্বয়ংক্রিয়ভাবে ভিজ্যুয়াল ER ডায়াগ্রাম হিসেবে রেন্ডার হয়ে যাবে।

---

## টেবিল তালিকা (সংক্ষেপে)

| টেবিল | কাজ |
|---|---|
| `users` | ব্যবহারকারীর প্রোফাইল ও পরিচয় |
| `otp_verifications` | ফোন নাম্বার OTP যাচাই |
| `majlis` | কমিউনিটি গ্রুপ (ইউনিয়ন → উপজেলা → জেলা হায়ারার্কি) |
| `majlis_members` | কে কোন মজলিসে যোগ দিয়েছে |
| `posts` | পোস্ট |
| `post_media` | পোস্টের ছবি/ভিডিও |
| `reactions` | ৬ ধরনের সিলেটি রিয়েকশন |
| `comments` | মন্তব্য |
| `shares` | শেয়ার |
| `connections` | ফলো / পিপল ইউ মে নো |
| `news` | Surma Faror Khobor থেকে আসা খবর |
| `news_media` | খবরের ছবি |
| `notifications` | নোটিফিকেশন |
| `reports` | রিপোর্ট সিস্টেম |

বিস্তারিত জানতে [sylnet-database-schema.md](./sylnet-database-schema.md) দেখুন।
