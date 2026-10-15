/**
 * Apex Smile Dental Care - Core Interactive Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 1. Mobile Menu Toggle
  initMobileMenu();

  // 2. Treatment Booking Pre-selection & Smooth Scroll
  initTreatmentCards();

  // 3. Appointment Form Validation & Confirmation Modal
  initBookingForm();

  // 4. FAQ Accordion
  initFaqAccordion();

  // 5. Live Clinic Status Indicator
  updateClinicStatus();

  // 6. Treatment Details Modal
  initTreatmentModal();
});

/* ----------------------------------------------------
 * 1. Mobile Menu Functionality
 * ---------------------------------------------------- */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !mobileMenu) return;

  let isOpen = false;

  const toggleMenu = (open) => {
    isOpen = open;
    if (open) {
      mobileMenu.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      // Change hamburger icon to close if possible
      menuBtn.setAttribute('aria-expanded', 'true');
    } else {
      mobileMenu.classList.add('hidden');
      document.body.style.overflow = '';
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  };

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu(!isOpen);
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu(false);
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close when clicking outside of menu
  document.addEventListener('click', (e) => {
    if (isOpen && !mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
      toggleMenu(false);
    }
  });
}


/* ----------------------------------------------------
 * 2. Treatment Pre-Selection & Smooth Scroll
 * ---------------------------------------------------- */
function initTreatmentCards() {
  const treatmentButtons = document.querySelectorAll('.book-treatment-btn');
  const treatmentSelect = document.getElementById('booking-treatment');
  const bookingSection = document.getElementById('book-appointment');

  treatmentButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const treatmentValue = button.dataset.treatment;
      
      if (treatmentSelect && treatmentValue) {
        treatmentSelect.value = treatmentValue;
        // Trigger subtle highlight pulse on select
        treatmentSelect.classList.add('ring-4', 'ring-teal-400', 'bg-teal-900');
        setTimeout(() => {
          treatmentSelect.classList.remove('ring-4', 'ring-teal-400', 'bg-teal-900');
        }, 1500);
      }

      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ----------------------------------------------------
 * 4. Booking Form Validation & Confirmation Modal
 * ---------------------------------------------------- */
function initBookingForm() {
  const form = document.getElementById('appointment-form');
  const dateInput = document.getElementById('booking-date');
  const modal = document.getElementById('confirmation-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const whatsappSendBtn = document.getElementById('send-whatsapp-booking-btn');

  // Set minimum date to today
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('booking-name')?.value.trim();
    const phone = document.getElementById('booking-phone')?.value.trim();
    const treatment = document.getElementById('booking-treatment')?.value;
    const shift = document.getElementById('booking-shift')?.value;
    const date = document.getElementById('booking-date')?.value;

    if (!name || !phone || !treatment || !shift || !date) {
      alert('Please fill out all required fields to request your priority dental slot.');
      return;
    }

    // Format human readable date
    const dateObj = new Date(date);
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString('en-US', options);

    // Random booking reference
    const refCode = 'APX-' + Math.floor(1000 + Math.random() * 9000);

    // Update modal details
    document.getElementById('modal-ref-id').textContent = refCode;
    document.getElementById('modal-patient-name').textContent = name;
    document.getElementById('modal-phone').textContent = phone;
    document.getElementById('modal-treatment').textContent = treatment;
    document.getElementById('modal-slot').textContent = `${formattedDate} (${shift})`;

    // Configure WhatsApp Button
    if (whatsappSendBtn) {
      const waMessage = encodeURIComponent(
        `Hello Apex Smile Dental Care! 👋\nI have requested an appointment:\n\n• Ref: ${refCode}\n• Name: ${name}\n• Phone: ${phone}\n• Treatment: ${treatment}\n• Preferred Slot: ${formattedDate} (${shift})\n\nPlease confirm my slot!`
      );
      whatsappSendBtn.href = `https://wa.me/919876543210?text=${waMessage}`;
    }

    // Show Modal
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }

    // Reset Form
    form.reset();
    if (dateInput) {
      dateInput.value = new Date().toISOString().split('T')[0];
    }
  });

  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    });

    // Close on outside click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }
    });
  }
}

/* ----------------------------------------------------
 * 5. FAQ Accordion
 * ---------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (!trigger || !content) return;

    trigger.addEventListener('click', () => {
      const isOpen = !content.classList.contains('hidden');

      // Close all others
      faqItems.forEach((otherItem) => {
        const otherContent = otherItem.querySelector('.faq-content');
        const otherIcon = otherItem.querySelector('.faq-icon');
        if (otherContent) otherContent.classList.add('hidden');
        if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
      });

      if (!isOpen) {
        content.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}

/* ----------------------------------------------------
 * 6. Live Clinic Status Indicator
 * ---------------------------------------------------- */
function updateClinicStatus() {
  const statusBadge = document.getElementById('clinic-status-badge');
  const statusText = document.getElementById('clinic-status-text');
  const statusDot = document.getElementById('clinic-status-dot');

  if (!statusBadge || !statusText) return;

  const now = new Date();
  const day = now.getDay(); // 0 is Sunday
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = hours + minutes / 60;

  let isOpen = false;
  let message = '';

  if (day === 0) {
    // Sunday: 10:00 AM - 1:30 PM (10.0 to 13.5)
    if (currentTime >= 10.0 && currentTime < 13.5) {
      isOpen = true;
      message = 'Open Now (Sunday OP until 1:30 PM)';
    } else {
      isOpen = false;
      message = 'Closed (Sunday Emergency on Call)';
    }
  } else {
    // Mon - Sat: Morning OP (9.5 to 14.0) & Evening OP (16.5 to 20.5)
    if (currentTime >= 9.5 && currentTime < 14.0) {
      isOpen = true;
      message = 'Open Now • Morning OP until 2:00 PM';
    } else if (currentTime >= 16.5 && currentTime < 20.5) {
      isOpen = true;
      message = 'Open Now • Evening OP until 8:30 PM';
    } else if (currentTime < 9.5) {
      isOpen = false;
      message = 'Closed Now • Opens at 9:30 AM';
    } else if (currentTime >= 14.0 && currentTime < 16.5) {
      isOpen = false;
      message = 'Break • Evening OP Opens at 4:30 PM';
    } else {
      isOpen = false;
      message = 'Closed Now • Opens tomorrow at 9:30 AM';
    }
  }

  statusText.textContent = message;

  if (isOpen) {
    statusBadge.className = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20';
    if (statusDot) statusDot.className = 'w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse';
  } else {
    statusBadge.className = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20';
    if (statusDot) statusDot.className = 'w-1.5 h-1.5 rounded-full bg-amber-400';
  }
}

/* ----------------------------------------------------
 * 7. Treatment Details Modal (Learn More)
 * ---------------------------------------------------- */
const treatmentDetailsData = {
  'rct': {
    title: 'Single-Sitting Rotary Root Canal (RCT)',
    tag: '100% Painless Endodontics',
    duration: '45 - 60 Minutes (Single Sitting)',
    anesthesia: 'Computer-Controlled Local Numbing',
    recovery: 'Immediate normal activities, mild soreness for 24h',
    overview: 'Our clinic uses 6th generation motorized rotary nickel-titanium files with integrated 3D electronic apex locators. Infection is cleared thoroughly and sealed with thermoplastic bio-ceramic obturation in a single appointment, eliminating multi-visit discomfort.',
    benefits: [
      'Zero pain or pinch with computer-calibrated local anesthesia',
      'Advanced digital apex locator for sub-millimeter precision',
      'Preserves your natural tooth structure for decades',
      'Same-day temporary or permanent ceramic crown placement option'
    ],
    pricing: 'Starting at ₹4,500 with zero-cost EMI plans available'
  },
  'implants': {
    title: 'Precision Dental Implants',
    tag: 'Permanent Natural Tooth Replacement',
    duration: '30 - 45 Minutes per implant',
    anesthesia: 'Micro-Anesthesia + Optional Conscious Sedation',
    recovery: '2 - 3 Days soft diet, permanent osseointegration',
    overview: 'Dental implants are medical-grade titanium and zirconia roots surgically positioned into your jawbone. They look, feel, and function exactly like natural healthy teeth, preventing jawbone shrinkage and restoring 100% chewing force.',
    benefits: [
      'Lifetime warranty with Swiss & German implant systems (Straumann/Nobel)',
      'CBCT 3D guided computer surgery prevents nerve impingement',
      'Zero damage to neighboring adjacent natural teeth',
      'Eat crunchy nuts, apples, and tough foods with complete confidence'
    ],
    pricing: 'Starting at ₹24,999 with 0% EMI (₹2,083/month for 12 mos)'
  },
  'aligners': {
    title: 'Clear Aligners & Invisible Braces',
    tag: 'Discreet Orthodontic Straightening',
    duration: '4 - 9 Months average treatment time',
    anesthesia: 'None required (completely non-invasive)',
    recovery: 'No downtime; trays changed every 10-14 days',
    overview: 'Customized clear plastic trays engineered via 3D intraoral digital scans. Straightens crooked teeth, closes gaps, and fixes overbites discreetly without ugly wires, brackets, or emergency wire pricks.',
    benefits: [
      '100% transparent and virtually invisible to colleagues and friends',
      'Removable for meals, brushing, and special celebrations',
      'Digital 3D outcome preview: see your final smile before starting',
      'Zero wire-tightening visits—comfortable gentle tooth movement'
    ],
    pricing: 'Full treatment starting at ₹45,000 (EMI from ₹3,750/month)'
  },
  'whitening': {
    title: 'Cold-Laser Teeth Whitening',
    tag: 'Brighter Smile in 45 Minutes',
    duration: '45 Minutes in clinic chair',
    anesthesia: 'Gingival barrier protection (zero injection)',
    recovery: 'Immediate glowing results; avoid dark curries/coffee for 48h',
    overview: 'Professional laser teeth whitening utilizes pharmaceutical-grade hydrogen peroxide activated by specific blue spectrum cold laser light. It breaks down deep molecular stains from tea, coffee, smoking, and aging safely.',
    benefits: [
      'Up to 6 to 8 shades noticeably whiter in a single visit',
      'Formulated with potassium nitrate desensitizers for zero post-sensitivity',
      'Safely preserves dental enamel and gum health',
      'Includes complimentary home maintenance kit and sensitivity paste'
    ],
    pricing: 'In-office full session starting at ₹6,500'
  },
  'wisdom': {
    title: 'Safe Wisdom Tooth Extraction',
    tag: 'Painless Minor Oral Surgery',
    duration: '20 - 40 Minutes',
    anesthesia: 'Atraumatic Local Anesthesia block',
    recovery: '3 - 5 days mild recovery with PRF healing gel',
    overview: 'Impacted or horizontally angled wisdom teeth frequently cause severe jaw aches, cheek biting, and damage to adjacent molars. Our specialist oral maxillofacial surgeons extract them safely with micro-instruments and PRF (platelet-rich fibrin).',
    benefits: [
      'Minimally invasive atraumatic sectioning minimizes bone loss',
      'Platelet-Rich Fibrin (PRF) from your own blood accelerates socket healing by 50%',
      'Detailed 3D panoramic imaging maps mandibular nerve safely',
      'Zero pain during procedure with attentive gentle care'
    ],
    pricing: 'Starting at ₹3,500 depending on impaction level'
  },
  'pediatric': {
    title: 'Gentle Pediatric Dentistry',
    tag: 'Happy, Fear-Free Dental Care for Kids',
    duration: '30 Minutes interactive session',
    anesthesia: 'Fruit-flavored topical numbing gel',
    recovery: 'Immediate smiling return to play',
    overview: 'Childhood dental experiences shape lifelong dental health. Our clinic features a warm, colorful pediatric lounge where gentle specialists explain every step playfully, turning checkups into fun adventures.',
    benefits: [
      'Painless cavity fillings with biocompatible tooth-colored glass ionomer',
      'Fluoride varnish treatments & pit and fissure sealants to prevent decay',
      'Thumb-sucking, mouth breathing, and bite habit correction therapy',
      'Zero-scare philosophy with reward tokens and brave smile certificates'
    ],
    pricing: 'Pediatric consultation ₹500 (Free with preventive sealants)'
  }
};

function initTreatmentModal() {
  const modal = document.getElementById('treatment-modal');
  const closeBtn = document.getElementById('close-treatment-modal');
  const triggers = document.querySelectorAll('.learn-more-btn');
  const bookFromModalBtn = document.getElementById('modal-book-this-treatment');

  let currentTreatmentKey = '';

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const key = trigger.dataset.treatmentKey;
      const data = treatmentDetailsData[key];

      if (!data || !modal) return;
      currentTreatmentKey = key;

      document.getElementById('t-modal-title').textContent = data.title;
      document.getElementById('t-modal-tag').textContent = data.tag;
      document.getElementById('t-modal-duration').textContent = data.duration;
      document.getElementById('t-modal-anesthesia').textContent = data.anesthesia;
      document.getElementById('t-modal-recovery').textContent = data.recovery;
      document.getElementById('t-modal-overview').textContent = data.overview;
      document.getElementById('t-modal-pricing').textContent = data.pricing;

      const benefitsList = document.getElementById('t-modal-benefits');
      if (benefitsList) {
        benefitsList.innerHTML = '';
        data.benefits.forEach((benefit) => {
          const li = document.createElement('li');
          li.className = 'flex items-start gap-2 text-sm text-slate-600';
          li.innerHTML = `<span class="text-teal-600 font-bold">✓</span> <span>${benefit}</span>`;
          benefitsList.appendChild(li);
        });
      }

      modal.classList.remove('hidden');
      modal.classList.add('flex');
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }
    });
  }

  if (bookFromModalBtn && modal) {
    bookFromModalBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');

      // Map key to dropdown text
      const keyMap = {
        'rct': 'Root Canal (RCT)',
        'implants': 'Dental Implants',
        'aligners': 'Braces / Clear Aligners',
        'whitening': 'Routine Cleaning & Polishing',
        'wisdom': 'Tooth Pain / Emergency',
        'pediatric': 'Kids Dentistry'
      };

      const selectVal = keyMap[currentTreatmentKey];
      const treatmentSelect = document.getElementById('booking-treatment');
      if (treatmentSelect && selectVal) {
        treatmentSelect.value = selectVal;
        treatmentSelect.classList.add('ring-4', 'ring-teal-400');
        setTimeout(() => treatmentSelect.classList.remove('ring-4', 'ring-teal-400'), 1500);
      }

      const bookingSection = document.getElementById('book-appointment');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}
