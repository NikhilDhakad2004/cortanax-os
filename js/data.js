/* ============================================================
   CORTANAX OS — DATA CONFIG
   ------------------------------------------------------------
   This file is the single source of truth for the whole site.
   To add a new project, certificate, or skill — just add a new
   object to the relevant array below and push to GitHub.
   Vercel/GitHub Pages will auto-redeploy and the OS updates.
   ============================================================ */

const CORTANAX_DATA = {

  profile: {
    name: "Nikhil Rajendra Dhakad",
    shortName: "Nikhil Dhakad",
    role: "AI/ML Developer & Data Science Undergrad",
    photo: "assets/profile.jpg",
    tagline: "Building intelligent systems that see, decide, and act.",
    bio: "Final-year BCA Data Science student at SRM Institute of Science and Technology, KTR. I build applied AI systems — from computer-vision detection pipelines to autonomous agents — and I'm deep in cybersecurity fundamentals alongside ML. I learn by shipping: every certificate and project here is something I actually built or completed, not a syllabus line.",
    location: "Chennai, India",
    dob: "02/09/2004",
    email: "nrdhakad2004@gmail.com",
    phone: "+91 7414909704",
    github: "https://github.com/NikhilDhakad2004",
    githubUsername: "NikhilDhakad2004",
    linkedin: "https://www.linkedin.com/in/nikhil-dhakad-00bbba408",
    resumeFile: "assets/Nikhil_Dhakad_Resume.pdf",
    // Set this to your live deployed URL once you deploy (e.g. "https://cortanax-nikhil.vercel.app").
    // Used to generate the QR code in the Contact Hub. Falls back to the GitHub profile until set.
    siteUrl: "",
    // Formspree form endpoint for the Contact Hub form (e.g. "https://formspree.io/f/xxxxxxx").
    // Get a free one at https://formspree.io — until set, the form falls back to opening the user's email app.
    formspreeEndpoint: ""
  },

  education: [
    {
      degree: "BCA — Data Science",
      institute: "SRM Institute of Science and Technology, KTR (Main Campus)",
      duration: "2024 — 2027",
      status: "Final Year",
      notes: "Advanced programming, database management, cybersecurity and software development, applied in capstone projects."
    }
  ],

  experience: [
    {
      title: "Data Science & Machine Learning Intern",
      org: "Sachitech, Nashik",
      duration: "Jun 2025 — Sep 2025",
      points: [
        "Developed and deployed ML models that improved prediction accuracy by 25% on key business metrics",
        "Engineered data pipelines processing 2M+ records daily for real-time analytics",
        "Reduced model training time by 40% through algorithm optimization and parallel processing",
        "Automated data cleaning workflows, cutting manual effort by 60%"
      ]
    },
    {
      title: "Internship — DS/ML",
      org: "Sachitech, Nashik (via ITT Council, Delhi)",
      duration: "Sep 2025",
      points: [
        "Completed 3-month certified internship program with 97% marks — Grade A+"
      ]
    }
  ],

  careerGoals: "To go deep into AI/ML — specializing in applied computer vision and autonomous agents — and build systems that operate reliably in the real world, not just in notebooks. Long-term, I want to work at the intersection of AI and security: building intelligent systems that are also robust against misuse.",

  achievements: [
    {
      title: "97% — Grade A+ in DS/ML Internship",
      desc: "Top-graded among cohort in the ITT Council certified internship at Sachitech, Nashik.",
      tag: "Internship"
    },
    {
      title: "25% Prediction Accuracy Improvement",
      desc: "Shipped ML models in production that measurably improved key business metrics at Sachitech.",
      tag: "Impact"
    },
    {
      title: "8 Certifications Across AI, Cloud & Security",
      desc: "IBM, AWS, Cisco, Kaggle and 3 Forage job simulations — completed, not just enrolled.",
      tag: "Learning"
    },
    {
      title: "Live Flagship Deployment",
      desc: "AI Border Intelligence shipped as a public Streamlit app — real YOLOv8 inference, not just a notebook demo.",
      tag: "Shipping"
    }
  ],

  skills: [
    { name: "Python", level: 90, category: "Core" },
    { name: "Machine Learning", level: 85, category: "AI/ML" },
    { name: "Deep Learning", level: 78, category: "AI/ML" },
    { name: "Artificial Intelligence", level: 85, category: "AI/ML" },
    { name: "NLP", level: 72, category: "AI/ML" },
    { name: "AI Agents", level: 75, category: "AI/ML" },
    { name: "Computer Vision (YOLOv8)", level: 80, category: "AI/ML" },
    { name: "Cybersecurity", level: 80, category: "Security" },
    { name: "IAM Fundamentals", level: 75, category: "Security" },
    { name: "Network Security", level: 72, category: "Security" },
    { name: "SQL", level: 82, category: "Data" },
    { name: "Pandas", level: 85, category: "Data" },
    { name: "NumPy", level: 82, category: "Data" },
    { name: "Data Cleaning & EDA", level: 85, category: "Data" },
    { name: "Matplotlib", level: 75, category: "Data" },
    { name: "SQLite", level: 78, category: "Data" },
    { name: "Streamlit", level: 85, category: "Tools" },
    { name: "OpenCV", level: 78, category: "Tools" },
    { name: "Git & GitHub", level: 80, category: "Tools" },
    { name: "AWS Cloud Basics", level: 65, category: "Tools" },
    { name: "Folium (Geo-mapping)", level: 70, category: "Tools" },
    { name: "Geopy", level: 68, category: "Tools" },
    { name: "PIL / Pillow", level: 75, category: "Tools" },
    { name: "Problem Solving", level: 88, category: "Core" },
    { name: "Data Structures Basics", level: 75, category: "Core" }
  ],

  projects: [
    {
      id: "border-intel",
      name: "AI Border Intelligence",
      subtitle: "Change-Detection Monitor",
      description: "A real-time object and change-detection system built for geospatial surveillance. Runs YOLOv8 inference on images and video, logs every detection to a local database, and plots detections live on an interactive map — turning raw camera feeds into a queryable intelligence layer.",
      flagship: true,
      tech: ["Python", "Streamlit", "YOLOv8 (Ultralytics)", "OpenCV", "Pillow", "Pandas", "Folium", "Geopy", "SQLite", "NumPy"],
      features: [
        "Image & video object detection using YOLOv8n",
        "Automated change-detection monitoring between frames",
        "Live interactive map integration (Folium + Geopy/Nominatim)",
        "Persistent detection history stored in SQLite",
        "Full Streamlit web interface — no install needed to try it"
      ],
      github: "https://github.com/NikhilDhakad2004/AI-Border-Intelligence-",
      demo: "https://qxn4jsvtbq3hgrdazr9ina.streamlit.app/",
      image: null
    }
  ],

  certificates: [
    {
      title: "System and Network Security",
      issuer: "IBM SkillsBuild",
      date: "Jul 02, 2026",
      verify: "https://www.credly.com/badges/b4cc719f-3bfb-404d-9b5e-203e3daf54ca"
    },
    {
      title: "AWS Cloud Practitioner Essentials",
      issuer: "AWS Training & Certification",
      date: "Jul 04, 2026"
    },
    {
      title: "Python",
      issuer: "Kaggle",
      date: "Jul 04, 2026"
    },
    {
      title: "Shields Up: Cybersecurity Job Simulation",
      issuer: "AIG (via Forage)",
      date: "Jun 29, 2026"
    },
    {
      title: "Cybersecurity Job Simulation",
      issuer: "Mastercard (via Forage)",
      date: "Jun 29, 2026"
    },
    {
      title: "Cybersecurity Analyst Job Simulation",
      issuer: "Tata (via Forage)",
      date: "Jun 29, 2026"
    },
    {
      title: "Data Science Essentials with Python",
      issuer: "Cisco Networking Academy",
      date: "Jun 30, 2026"
    },
    {
      title: "Internship in DS/ML — 97%, Grade A+",
      issuer: "ITT Council, Delhi (at Sachitech, Nashik)",
      date: "Sep 29, 2025"
    }
  ],

  terminalCommands: {
    help: "Available commands: about, skills, projects, resume, certs, contact, clear",
    about: "Nikhil Rajendra Dhakad — Final year BCA Data Science student, SRM IST KTR. AI/ML developer focused on computer vision and applied agents.",
  }

};

// Makes this file usable both in the browser (as a global) and in the
// Node.js serverless function at api/chat.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CORTANAX_DATA;
}
