# 005 — Assignment Table Design

**Status:** Accepted

## Context

Ödev ve sınav bilgilerini tutacak bir tablo tasarlanacak. İki soru öne çıktı:

1. Ödevler sınıfa mı (ClassroomId) yoksa kişiye mi (StudentId) atanmalı?
2. Dosya eklentisi nasıl modellenecek?

## Decision

Tek bir `Assignments` tablosu kullanılacak. Alanlar:

| Alan | Tip | Açıklama |
|---|---|---|
| Id | Guid | PK |
| ClassroomId | Guid (FK) | Hangi sınıfa atandığı |
| Title | string | Ödev/sınav adı |
| Description | string? | Opsiyonel açıklama |
| Type | enum | Homework \| Exam |
| FileUrl | string? | Opsiyonel dosya bağlantısı |
| StartDate | DateOnly | Başlangıç tarihi |
| DueDate | DateOnly | Bitiş/sınav tarihi |
| CreatedAtUtc | DateTimeOffset | — |

**Kişiye özel ödev (StudentId) V1'de kapsam dışı bırakıldı.** Sınıfa atama yeterli; ihtiyaç doğarsa ClassroomId nullable yapılıp StudentId eklenir.

**Dosya upload altyapısı (blob storage vb.) V1'de kapsam dışı.** FileUrl nullable string olarak tutuldu — altyapı hazır olduğunda doldurulmaya başlanır.

## Consequences

- Sınıf bazlı ödev/sınav listeleme basit bir `WHERE ClassroomId = ?` sorgusuyla yapılır.
- Type alanı sayesinde ödev ve sınav ayrı sayfalar yerine tek endpoint'ten filtrelenebilir.
- Kişiye özel ödev gerektiğinde küçük bir migration yeterli, büyük refactor gerekmez.
