# Sarla Memorial Maternity Home Website

A responsive, high-performance static website for **Sarla Memorial Maternity Home** (established under the aegis of Sarla Memorial Charitable Trust in loving memory of Smt. Sarla Gupta).

---

## 🌟 Features

- **Motto & Identity**: Features the transparent circular hospital badge logo, mission motto (*"We Care, God Cures"*), registration details, and charitable trust history.
- **Specialized Procedures**: Detailed sections showcasing Obstetrics, Gynecology, and Preventative Screenings.
- **Core Visiting Panel**: Information on key visiting specialists (Dr. R R Gupta, Dr. Shanti Swaroop Sharma, Dr. Manoj Kumar Mahajan, Dr. Rajnesh Kumar).
- **Interactive Oncology Camp Program**: Dynamic 6-card flipping deck highlighting oncology surgeons and monthly clinics (First Saturday of each month).
- **ENT Specialist Profile**: Elegant static profile card for Dr. Rajeev Sharma (Tuesday & Friday weekly consultations).
- **Secure Email Notifications**: Integrated booking form connecting to **FormSubmit.co**, sending patient requests directly to `sarlamemorialmaternityhome99@gmail.com`.
- **Floating Contact Panel**: Quick contact selector widget in the bottom-left corner with click-to-call links and instant number copying.

---

## 🚀 Running Locally

To view the website locally, launch a local HTTP server in the project directory:

```bash
# Start a simple Python web server
python3 -m http.server 8000
```

Once running, navigate to **[http://localhost:8000](http://localhost:8000)** in your browser.

---

## ✉️ Appointment Form Setup (FormSubmit)

The appointment booking form uses the free **FormSubmit.co** AJAX API. On the first submission:
1. Submit a test booking on the website.
2. Check the inbox of **`sarlamemorialmaternityhome99@gmail.com`**.
3. Click the activation link in the email sent by FormSubmit.
4. All future requests will be delivered directly as structured emails.

---

## 🌐 Deploying to Render

This project is fully ready for zero-cost deployment on **Render** as a **Static Site**:

1. Push your files to a GitHub repository.
2. Log into the [Render Dashboard](https://dashboard.render.com) and click **New +** -> **Static Site**.
3. Connect your repository and use these settings:
   - **Name**: `sarla-memorial`
   - **Build Command**: *Leave blank*
   - **Publish Directory**: `.`
4. Click **Deploy Static Site**.
