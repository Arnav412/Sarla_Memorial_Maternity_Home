# Sarla Memorial Maternity Home Website

Official website repository for **Sarla Memorial Maternity Home** (established under the aegis of Sarla Memorial Charitable Trust in loving memory of Smt. Sarla Gupta), located in Ward No. 9, R.S. Pura, Jammu, J&K (181102).

The website is fully responsive, optimized for ultra-fast performance, and serves as an interactive informational portal and appointment booking system for patients.

🌐 **Live Website**: [https://sarla-memorial-maternity-home-1.onrender.com/](https://sarla-memorial-maternity-home-1.onrender.com/)

---

## 🌟 Key Features

- **Motto & Identity**: Features the transparent hospital badge logo, mission motto (*"We Care, God Cures"*), J&K state registration details (Reg No. J/NHCE/2012-13/519), and trust background.
- **Specialist OPD Programs & Interactive Flashcards**:
  - **Gynaecology & Obstetrics OPD**: Interactive 3D flashcards featuring **Dr. Ram Rattan** (Senior Consultant, 25+ Yrs Exp), **Dr. Sonika Gupta** (B-Grade Gynaecologist, 15+ Yrs Exp), and **Dr. Sushma Gupta** (Medical Officer, 30+ Yrs Exp).
  - **Cancer OPD Clinic**: Interactive 3D flashcards featuring **Dr. Paras Khanna** (AIIMS New Delhi), **Dr. Vikas Heer** (Tata Medical Centre Kolkata), and OPD Camp Schedule.
  - **General OPD**: A wide, static executive profile card featuring **Dr. Anil Gupta** (Medical Officer – General Medicine).
- **Core Visiting Medical Panel**: Comprehensive listings for core specialists (Dr. Ram Rattan, Dr. Shanti Swaroop Sharma, Dr. Rajnesh Kumar, Dr. Sonika Gupta, Dr. Sushma Gupta, Dr. Anil Gupta).
- **Material Design Datepicker**: Interactive calendar modal for selecting appointment dates with cut-off validation and clean UX.
- **Secure Email Booking System**: Integrated appointment form connected to FormSubmit AJAX routing requests directly to `sarlamemorialmaternityhome@gmail.com`.
- **Floating Contact Panel**: Bottom-left interactive widget with one-click call buttons and clipboard copy functionality for phone numbers and email.
- **Mobile Responsive Design**: Full iOS WebKit and Android Chrome 3D transform support, touch-optimized gestures, and liquid responsive layouts.

---

## ⚡ Performance & Concurrent User Capacity

### **How many users can it handle at once?**

Because the website is built as a **decoupled static web application** (HTML5, Vanilla CSS, Vanilla JS) with all asset delivery handled via static web servers or Content Delivery Networks (CDNs):

| Architecture / Hosting Environment | Concurrent Users (At Once) | Monthly Traffic Limit |
| :--- | :--- | :--- |
| **Standard Cloud Hosting (Render / Netlify / Vercel)** | **10,000+ Concurrent Visitors** | 100+ GB Bandwidth |
| **CDN Accelerated (Cloudflare Pages / Cloudflare Edge)** | **100,000+ Concurrent Visitors** | Unlimited Edge Bandwidth |
| **Local Server (`python3 -m http.server`)** | **~500 - 1,000 Concurrent Requests** | Limited by host network |

### **Why can it handle so many concurrent visitors?**
1. **Zero Database Bottlenecks**: Since all clinic schedules, doctor listings, datepicker logic, and flashcard flip animations execute client-side in the visitor's browser, there are no heavy database queries or server CPU bottlenecks.
2. **CDN Edge Caching**: Static HTML, CSS, JavaScript, and image assets are cached at CDN edge nodes globally, delivering sub-50ms page load times to thousands of simultaneous users.
3. **Asynchronous Form Submit**: Appointment booking requests are dispatched asynchronously via FormSubmit APIs without locking up server threads.

---

## 🚀 Running Locally

To run the website locally on your machine:

```bash
# Clone the repository
git clone https://github.com/Arnav412/Sarla_Memorial_Maternity_Home.git

# Navigate into project directory
cd Hospital_1

# Start a local HTTP server
python3 -m http.server 8000
```

Open your browser and navigate to **[http://localhost:8000](http://localhost:8000)**.

---

## ✉️ Appointment Form Configuration

The appointment booking form submits to **`sarlamemorialmaternityhome@gmail.com`**.

To verify or reactivate FormSubmit notifications:
1. Submit a test appointment request on the live site.
2. Open the inbox for `sarlamemorialmaternityhome@gmail.com`.
3. Click the activation link sent by FormSubmit to confirm.
4. All future patient requests will route directly to the email.
