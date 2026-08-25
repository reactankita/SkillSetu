# Mock Data Strategy & Seeding Matrix — SkillSetu

## 1. Data Integrity Principle
Seed data in SkillSetu is strictly relational. Student profiles own specific services, bookings reference those exact services and students, reviews link to completed bookings, and dashboard statistics (earnings, booking counts, ratings) are calculated from this underlying graph.

---

## 2. Seed Personas (15 Diverse Indian Student Profiles)

1. **Sarah Chen** — *IIT Bombay, B.Tech CSE (4th Yr)* | Full-Stack Web Development, Next.js, API Architecture | `SK-ST-104827`
2. **Arjun Mehta** — *COEP Pune, B.Tech Mech (3rd Yr)* | College Fest & Event Photography, Portrait Shoots | `SK-ST-104828`
3. **Meera Iyer** — *IISc Bangalore, M.Sc Physics (2nd Yr)* | IIT-JEE Physics & Calculus Tutoring | `SK-ST-104829`
4. **Nikita Shah** — *NID Ahmedabad, B.Des Interaction (3rd Yr)* | UI/UX Design, Mobile App Wireframing, Figma Systems | `SK-ST-104830`
5. **Lea Fontaine** — *KM Music Conservatory, B.Mus (2nd Yr)* | Audio Production, Jingle Creation, Video Scoring | `SK-ST-104831`
6. **Aditi Verma** — *BITS Pilani, B.E. CS (4th Yr)* | Python Data Analytics, SQL Dashboards, Machine Learning | `SK-ST-104832`
7. **Kabir Rao** — *MICA Ahmedabad, PGDM Comm (2nd Yr)* | Instagram Growth Strategy, Reel Direction, Brand Copy | `SK-ST-104833`
8. **David Okafor** — *Symbiosis Pune, B.A. Journalism (3rd Yr)* | SEO Blog Writing, Technical Documentation, Pitch Decks | `SK-ST-104834`
9. **Rohan Sen** — *Jadavpur University, B.E. Electronics (4th Yr)* | Embedded Systems, IoT Prototyping, Arduino/ESP32 | `SK-ST-104835`
10. **Ananya Gupta** — *NIFT New Delhi, B.Des Fashion (3rd Yr)* | College Event Decoration, Theme Stage Setups, Costume Design | `SK-ST-104836`
11. **Tanmay Bhatia** — *DTU Delhi, B.Tech IT (3rd Yr)* | Flutter & React Native Mobile App Development | `SK-ST-104837`
12. **Pranav Joshi** — *Sir J.J. School of Art Mumbai, B.F.A. (4th Yr)* | Custom Oil Painting, Digital Portrait Art, Caricatures | `SK-ST-104838`
13. **Rhea Kapoor** — *St. Xavier's College Mumbai, B.Sc Stats (3rd Yr)* | Advanced Excel Modeling, Business Forecasting | `SK-ST-104839`
14. **Vikram Malhotra** — *RVCE Bengaluru, B.E. Civil (4th Yr)* | 3D Exhibition Structure Modeling, Architectural Rendering | `SK-ST-104840`
15. **Ishaan Sharma** — *SRCC Delhi, B.Com Hons (2nd Yr)* | Financial Modeling, Startup Pitch Deck Design & Review | `SK-ST-104841`

---

## 3. Seed Catalog Statistics
* **Services**: 28+ published listings spanning Tech, Design, Art, Photo, Video, Events, Decoration, Tutoring, Music, Crafts, Content, and Business.
* **Community Opportunities**: 12+ active postings from verified startups, college clubs, and local businesses.
* **Reviews**: 15+ verified reviews linked to completed bookings with 4.7 to 5.0 star distributions.
* **Bookings**: Multi-state bookings representing `CONFIRMED`, `ACTIVE`, `COMPLETED_BY_STUDENT`, `CONFIRMED_BY_CLIENT`, `CANCELLED`, and `DISPUTED` to exercise the full state machine.
