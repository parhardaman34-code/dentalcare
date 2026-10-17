/**
 * Dr Charan Singh Dental & Implant Centre (Phagwara, Punjab)
 * Hospital-Grade Sterilization & Advanced Dental Care
 * Core Interactive Script
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

  // 7. Live Demo Customizer (Edit Name, Phone, Address on the Fly)
  initDemoCustomizer();
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
  const nameInput = document.getElementById('booking-name');
  const selectedBanner = document.getElementById('booking-selected-banner');
  const selectedTreatmentName = document.getElementById('selected-treatment-name');

  const scrollToBooking = (treatmentVal = null) => {
    if (treatmentSelect && treatmentVal) {
      treatmentSelect.value = treatmentVal;

      // Update banner text and show banner
      if (selectedTreatmentName) {
        selectedTreatmentName.textContent = treatmentVal;
      }
      if (selectedBanner) {
        selectedBanner.classList.remove('hidden');
        selectedBanner.classList.add('flex');
      }

      // Trigger high-visibility highlight pulse on the select
      treatmentSelect.classList.remove('ring-4', 'ring-teal-400', 'bg-teal-900');
      void treatmentSelect.offsetWidth; // re-flow
      treatmentSelect.classList.add('ring-4', 'ring-teal-400', 'bg-teal-900');
      setTimeout(() => {
        treatmentSelect.classList.remove('ring-4', 'ring-teal-400', 'bg-teal-900');
      }, 2500);
    }

    if (bookingSection) {
      // Offset scroll calculation so sticky navbar doesn't cover heading
      const yOffset = -90;
      const y = bookingSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });

      // Auto-focus patient name input field
      setTimeout(() => {
        if (nameInput) {
          nameInput.focus();
        }
      }, 550);
    }
  };

  // Treatment Card Specific Buttons ("Book RCT", "Book Implant", etc.)
  treatmentButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const treatmentValue = button.dataset.treatment;
      scrollToBooking(treatmentValue);
    });
  });

  // Global "Book Appointment" Links (Navbar, Hero, Mobile, Footer)
  const generalBookingCTAs = document.querySelectorAll('a[href="#book-appointment"]');
  generalBookingCTAs.forEach((cta) => {
    if (!cta.classList.contains('book-treatment-btn')) {
      cta.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToBooking(null);
      });
    }
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

    // Random booking reference for Dr Charan Singh Centre
    const refCode = 'DCS-' + Math.floor(1000 + Math.random() * 9000);

    // Update modal details
    document.getElementById('modal-ref-id').textContent = refCode;
    document.getElementById('modal-patient-name').textContent = name;
    document.getElementById('modal-phone').textContent = phone;
    document.getElementById('modal-treatment').textContent = treatment;
    document.getElementById('modal-slot').textContent = `${formattedDate} (${shift})`;

    // Configure WhatsApp Message Button
    if (whatsappSendBtn) {
      const activeData = getCurrentClinicData();
      const waNumber = formatWhatsAppNumber(activeData.phone);
      const waMessage = encodeURIComponent(
        `Hello ${activeData.clinicName}! 👋\nI have requested an appointment:\n\n• Ref: ${refCode}\n• Patient: ${name}\n• Phone: ${phone}\n• Treatment: ${treatment}\n• Preferred Slot: ${formattedDate} (${shift})\n\nPlease confirm my appointment slot!`
      );
      whatsappSendBtn.href = `https://wa.me/${waNumber}?text=${waMessage}`;
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
 * 6. Live Clinic Status Indicator (Phagwara Timings)
 * ---------------------------------------------------- */
function updateClinicStatus() {
  const statusBadge = document.getElementById('clinic-status-badge');
  const statusText = document.getElementById('clinic-status-text');
  const statusDot = document.getElementById('clinic-status-dot');

  if (!statusBadge || !statusText) return;

  const now = new Date();
  const day = now.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = hours + minutes / 60;

  let isOpen = false;
  let message = '';

  if (day >= 1 && day <= 6) {
    // Monday – Saturday: Morning 9:30 AM - 2:00 PM (9.5 to 14.0), Evening 4:30 PM - 8:00 PM (16.5 to 20.0)
    if (currentTime >= 9.5 && currentTime < 14.0) {
      isOpen = true;
      message = 'Open Now • Morning OP until 2:00 PM';
    } else if (currentTime >= 14.0 && currentTime < 16.5) {
      isOpen = false;
      message = 'Break • Evening OP Opens at 4:30 PM';
    } else if (currentTime >= 16.5 && currentTime < 20.0) {
      isOpen = true;
      message = 'Open Now • Evening OP until 8:00 PM';
    } else if (currentTime < 9.5) {
      isOpen = false;
      message = 'Closed Now • Opens today at 9:30 AM';
    } else {
      isOpen = false;
      message = (day === 6) ? 'Closed Now • Sunday By Appointment' : 'Closed Now • Opens tomorrow at 9:30 AM';
    }
  } else {
    // Sunday
    isOpen = false;
    message = 'Sunday • By Prior Appointment Only';
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
    tag: 'Gentle, Pain-Free Endodontics',
    duration: '40 - 50 Minutes (Single Visit)',
    anesthesia: 'Computer-Controlled Painless Numbing',
    recovery: 'Immediate normal routine, zero surgical trauma',
    overview: 'Using advanced rotary endodontics and sub-millimeter digital apex locators, Dr. Charan Singh cleans, sterilizes, and seals infected tooth canals in a single comfortable visit, preserving your natural tooth and instantly eliminating pain.',
    benefits: [
      'Fast relief from acute toothache and thermal sensitivity',
      'Digital precision apex locators for exact sub-millimeter canal measurement',
      'Preserves your natural tooth structure for years to come',
      'Protective ceramic & zirconia crown restoration options available'
    ],
    pricing: 'Transparent upfront pricing • UPI & Cards accepted • 0% Interest EMI available'
  },
  'implants': {
    title: 'Permanent Precision Dental Implants',
    tag: 'Natural-Looking Tooth Replacement',
    duration: '30 - 45 Minutes per implant placement',
    anesthesia: 'Gentle Micro-Local Anesthesia',
    recovery: '2 - 3 Days soft diet, permanent osseointegration',
    overview: 'Dental implants are medical-grade titanium roots placed into the jawbone that support lifelike crowns, bridges, or full arches—restoring 100% natural chewing strength, appearance, and confidence.',
    benefits: [
      'Restores 100% natural chewing strength and aesthetic smile',
      'Prevents jawbone loss and keeps adjacent natural teeth firmly in place',
      'Never slips, clicks, or requires adhesives unlike traditional dentures',
      'Built to last a lifetime with proper routine dental hygiene'
    ],
    pricing: 'Convenient 0% Interest EMI plans available • All UPI & Cards accepted'
  },
  'aligners': {
    title: 'Clear Aligners & Orthodontic Care',
    tag: 'Discreet Smile Alignment',
    duration: '4 - 9 Months average treatment time',
    anesthesia: 'None required (completely non-invasive)',
    recovery: 'No downtime; aligners changed every 1-2 weeks',
    overview: 'Custom 3D-scanned invisible aligners designed to gently align crooked teeth and close gaps without awkward metal brackets, wires, or dietary restrictions.',
    benefits: [
      'Virtually invisible clear material fits comfortably over teeth',
      'Easily removable for regular eating, brushing, and flossing',
      'Fewer clinic visits with gentle, gradual orthodontic alignment',
      'Effective for spacing, crowding, and bite corrections'
    ],
    pricing: 'Transparent treatment package with flexible monthly EMI installment plans'
  },
  'whitening': {
    title: 'Professional Laser Teeth Whitening',
    tag: 'Brighter, Radiant Smile',
    duration: '45 - 60 Minutes in chair',
    anesthesia: 'Protective gingival barrier (no injections)',
    recovery: 'Immediate brighter results',
    overview: 'Safe, clinical-grade teeth whitening that lifts deep stains from coffee, tea, and everyday life in a single comfortable visit.',
    benefits: [
      'Visibly brighter results up to several shades lighter in one appointment',
      'Enamel-safe formulation minimizes tooth sensitivity',
      'Even, professional results far superior to over-the-counter strips',
      'Includes post-treatment care recommendations for lasting shine'
    ],
    pricing: 'Affordable in-clinic whitening packages • Complete shade guarantee'
  },
  'wisdom': {
    title: 'Gentle Tooth & Wisdom Extractions',
    tag: 'Safe, Comfortable Minor Oral Care',
    duration: '20 - 40 Minutes',
    anesthesia: 'Thorough Pain-Free Local Numbing',
    recovery: '3 - 5 days standard healing with simple home care',
    overview: 'When an impacted or damaged wisdom tooth causes pain or crowding, Dr. Charan Singh performs atraumatic, gentle extractions with patient comfort as top priority.',
    benefits: [
      'Relieves persistent jaw pain, gum irritation, and crowding pressure',
      'Careful atraumatic technique preserves surrounding bone and tissue',
      'Clear, supportive post-operative instructions for swift recovery',
      'Thorough pre-procedure digital X-rays to plan safe extraction'
    ],
    pricing: 'Upfront transparent cost • Immediate pain-relief medications provided'
  },
  'pediatric': {
    title: 'Gentle Kids & Family Dentistry',
    tag: 'Friendly Care for Children',
    duration: '30 Minutes interactive visit',
    anesthesia: 'Mild topical numbing gel when needed',
    recovery: 'Immediate happy return to school & play',
    overview: 'We treat children with warmth, patience, and anxiety-free gentle methods to establish healthy dental habits for life.',
    benefits: [
      'Child-friendly, welcoming atmosphere that eliminates dental fear',
      'Cavity prevention with painless dental sealants and fluoride',
      'Gentle tooth-colored fillings for growing smiles',
      'Interactive guidance on proper brushing and oral hygiene at home'
    ],
    pricing: 'Affordable preventive dental care packages for families'
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
        'whitening': 'Laser Teeth Whitening',
        'wisdom': 'Wisdom Tooth Extraction',
        'pediatric': 'Kids Dentistry'
      };

      const selectVal = keyMap[currentTreatmentKey];
      const treatmentSelect = document.getElementById('booking-treatment');
      const selectedBanner = document.getElementById('booking-selected-banner');
      const selectedTreatmentName = document.getElementById('selected-treatment-name');
      const nameInput = document.getElementById('booking-name');

      if (treatmentSelect && selectVal) {
        treatmentSelect.value = selectVal;
        if (selectedTreatmentName) selectedTreatmentName.textContent = selectVal;
        if (selectedBanner) {
          selectedBanner.classList.remove('hidden');
          selectedBanner.classList.add('flex');
        }
        treatmentSelect.classList.remove('ring-4', 'ring-teal-400', 'bg-teal-900');
        void treatmentSelect.offsetWidth;
        treatmentSelect.classList.add('ring-4', 'ring-teal-400', 'bg-teal-900');
        setTimeout(() => treatmentSelect.classList.remove('ring-4', 'ring-teal-400', 'bg-teal-900'), 2500);
      }

      const bookingSection = document.getElementById('book-appointment');
      if (bookingSection) {
        const yOffset = -90;
        const y = bookingSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
        setTimeout(() => {
          if (nameInput) nameInput.focus();
        }, 550);
      }
    });
  }
}

/* ----------------------------------------------------
 * 8. Live Demo Customizer (Edit Name, Phone, Address on the Fly)
 * ---------------------------------------------------- */
const DEFAULT_CLINIC_PRESET = {
  clinicName: 'Dr Charan Singh Dental & Implant Centre',
  doctorName: 'Dr. Charan Singh',
  phone: '09915515559',
  street: 'Scheme no 3, SCF-319',
  landmark: 'Near S. Sudhir Sweets',
  city: 'Phagwara, Punjab 144401',
  cityNameOnly: 'Phagwara'
};

const DEMO_PRESETS = {
  'dr-charan': DEFAULT_CLINIC_PRESET,
  'country-dental': {
    clinicName: 'Country Dental',
    doctorName: 'Dr. Dirk F. Roosma, DMD',
    phone: '+1 406-741-5031',
    street: '25 Little Bitterroot Rd',
    landmark: 'Hot Springs Valley',
    city: 'Hot Springs, MT 59845, Montana',
    cityNameOnly: 'Hot Springs, MT'
  },
  'apex-dental': {
    clinicName: 'Apex Smile Dental Studio',
    doctorName: 'Dr. Sameer Verma, BDS, MDS',
    phone: '+91 98765 43210',
    street: 'Civil Lines, Main Boulevard',
    landmark: 'Opposite City Mall',
    city: 'New Delhi, 110054',
    cityNameOnly: 'New Delhi'
  }
};

function getCurrentClinicData() {
  try {
    const saved = localStorage.getItem('custom_clinic_data');
    if (saved) {
      return { ...DEFAULT_CLINIC_PRESET, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Error reading from localStorage:', e);
  }
  return { ...DEFAULT_CLINIC_PRESET };
}

function formatWhatsAppNumber(phoneStr) {
  if (!phoneStr) return '919915515559';
  const clean = phoneStr.replace(/[^0-9]/g, '');
  if (clean.length === 11 && clean.startsWith('0')) {
    return '91' + clean.slice(1);
  }
  if (clean.length === 10) {
    return '91' + clean;
  }
  return clean;
}

function applyClinicData(data, showToast = false) {
  if (!data) return;

  const clinicName = data.clinicName || DEFAULT_CLINIC_PRESET.clinicName;
  const doctorName = data.doctorName || DEFAULT_CLINIC_PRESET.doctorName;
  const phone = data.phone || DEFAULT_CLINIC_PRESET.phone;
  const street = data.street || DEFAULT_CLINIC_PRESET.street;
  const landmark = data.landmark || '';
  const city = data.city || DEFAULT_CLINIC_PRESET.city;
  const cityNameOnly = data.cityNameOnly || (city.includes(',') ? city.split(',')[0].trim() : city);

  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const waNumber = formatWhatsAppNumber(phone);

  // 1. Update text content on all targeted tags
  document.querySelectorAll('.clinic-name-val').forEach((el) => {
    el.textContent = clinicName;
  });
  document.querySelectorAll('.doctor-name-val').forEach((el) => {
    el.textContent = doctorName;
  });
  document.querySelectorAll('.clinic-phone-val').forEach((el) => {
    el.textContent = phone;
  });
  document.querySelectorAll('.clinic-street-val').forEach((el) => {
    el.textContent = street;
  });
  document.querySelectorAll('.clinic-landmark-val').forEach((el) => {
    el.textContent = landmark;
  });
  document.querySelectorAll('.clinic-city-val').forEach((el) => {
    el.textContent = city;
  });
  document.querySelectorAll('.clinic-city-name').forEach((el) => {
    el.textContent = cityNameOnly;
  });
  document.querySelectorAll('.clinic-full-address-val').forEach((el) => {
    el.textContent = `${street}, ${landmark ? landmark + ', ' : ''}${city}`;
  });
  document.querySelectorAll('.clinic-landmark-banner').forEach((el) => {
    el.textContent = `Located near ${landmark || street} in ${city}`;
  });

  // 2. Update interactive telephone and WhatsApp links
  document.querySelectorAll('.clinic-phone-link').forEach((link) => {
    link.href = `tel:${cleanPhone}`;
  });

  document.querySelectorAll('.clinic-whatsapp-link').forEach((link) => {
    const defaultMsg = encodeURIComponent(`Hi ${clinicName}! I would like to inquire about an appointment.`);
    link.href = `https://wa.me/${waNumber}?text=${defaultMsg}`;
  });

  // 3. Update document title
  document.title = `${clinicName} | ${cityNameOnly}`;

  // 4. Update Google Maps iframe embed and directions link
  const fullAddressQuery = `${street}, ${landmark ? landmark + ', ' : ''}${city}`;
  const mapIframe = document.getElementById('clinic-google-map-iframe');
  if (mapIframe) {
    mapIframe.src = `https://maps.google.com/maps?q=${encodeURIComponent(fullAddressQuery)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
    mapIframe.title = `${clinicName} Location Map`;
  }
  document.querySelectorAll('.clinic-directions-link').forEach((link) => {
    link.href = `https://maps.google.com/?q=${encodeURIComponent(fullAddressQuery)}`;
  });

  // 5. Update booking form phone placeholder
  const bookingPhone = document.getElementById('booking-phone');
  if (bookingPhone) {
    bookingPhone.placeholder = phone;
  }

  // 6. Save state in browser localStorage
  try {
    localStorage.setItem('custom_clinic_data', JSON.stringify({
      clinicName,
      doctorName,
      phone,
      street,
      landmark,
      city,
      cityNameOnly
    }));
  } catch (e) {
    console.warn('Error saving to localStorage:', e);
  }

  // 7. Toast feedback
  if (showToast) {
    showDemoToast(`Updated: ${clinicName}`);
  }
}

function showDemoToast(msg) {
  const toast = document.getElementById('demo-toast');
  const toastMsg = document.getElementById('demo-toast-msg');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = msg;
  toast.classList.remove('hidden');
  toast.classList.add('flex');

  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    toast.classList.add('hidden');
    toast.classList.remove('flex');
  }, 2800);
}

function initDemoCustomizer() {
  const triggerWrap = document.getElementById('demo-customizer-trigger-wrap');
  const openBtn = document.getElementById('open-demo-customizer');
  const footerOpenBtn = document.getElementById('footer-demo-trigger');
  const modal = document.getElementById('demo-customizer-modal');
  const closeBtn = document.getElementById('close-demo-customizer');
  const form = document.getElementById('demo-customizer-form');
  const resetBtn = document.getElementById('btn-reset-demo');
  const presentationBtn = document.getElementById('btn-presentation-mode');

  const presetDrCharan = document.getElementById('preset-dr-charan');
  const presetCountryDental = document.getElementById('preset-country-dental');
  const presetApexDental = document.getElementById('preset-apex-dental');

  const inputClinic = document.getElementById('demo-input-clinic-name');
  const inputDoctor = document.getElementById('demo-input-doctor-name');
  const inputPhone = document.getElementById('demo-input-phone');
  const inputStreet = document.getElementById('demo-input-street');
  const inputLandmark = document.getElementById('demo-input-landmark');
  const inputCity = document.getElementById('demo-input-city');

  // Load and apply initial data immediately
  const currentData = getCurrentClinicData();
  applyClinicData(currentData, false);

  // Check presentation mode
  try {
    const isPresentationMode = localStorage.getItem('presentation_mode') === 'true';
    if (isPresentationMode && triggerWrap) {
      triggerWrap.classList.add('hidden');
    }
  } catch (e) {}

  const populateForm = (data) => {
    if (inputClinic) inputClinic.value = data.clinicName || '';
    if (inputDoctor) inputDoctor.value = data.doctorName || '';
    if (inputPhone) inputPhone.value = data.phone || '';
    if (inputStreet) inputStreet.value = data.street || '';
    if (inputLandmark) inputLandmark.value = data.landmark || '';
    if (inputCity) inputCity.value = data.city || '';
  };

  const openModal = () => {
    if (!modal) return;
    const activeData = getCurrentClinicData();
    populateForm(activeData);
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  };

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (footerOpenBtn) footerOpenBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Keyboard shortcut Ctrl + Shift + E or Cmd + Shift + E
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'E' || e.key === 'e')) {
      e.preventDefault();
      // Unhide trigger button if hidden
      if (triggerWrap) triggerWrap.classList.remove('hidden');
      try {
        localStorage.removeItem('presentation_mode');
      } catch (err) {}
      if (modal && !modal.classList.contains('hidden')) {
        closeModal();
      } else {
        openModal();
      }
    }
  });

  // Preset Handlers
  if (presetDrCharan) {
    presetDrCharan.addEventListener('click', () => {
      populateForm(DEMO_PRESETS['dr-charan']);
      applyClinicData(DEMO_PRESETS['dr-charan'], true);
    });
  }

  if (presetCountryDental) {
    presetCountryDental.addEventListener('click', () => {
      populateForm(DEMO_PRESETS['country-dental']);
      applyClinicData(DEMO_PRESETS['country-dental'], true);
    });
  }

  if (presetApexDental) {
    presetApexDental.addEventListener('click', () => {
      populateForm(DEMO_PRESETS['apex-dental']);
      applyClinicData(DEMO_PRESETS['apex-dental'], true);
    });
  }

  // Reset Handler
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      try {
        localStorage.removeItem('custom_clinic_data');
      } catch (e) {}
      populateForm(DEFAULT_CLINIC_PRESET);
      applyClinicData(DEFAULT_CLINIC_PRESET, true);
    });
  }

  // Presentation Mode Toggle
  if (presentationBtn) {
    presentationBtn.addEventListener('click', () => {
      if (triggerWrap) triggerWrap.classList.add('hidden');
      try {
        localStorage.setItem('presentation_mode', 'true');
      } catch (e) {}
      closeModal();
      showDemoToast('Presentation Mode: Trigger hidden. Press Ctrl+Shift+E to restore.');
    });
  }

  // Form Submit Handler
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const updatedData = {
        clinicName: inputClinic.value.trim(),
        doctorName: inputDoctor.value.trim(),
        phone: inputPhone.value.trim(),
        street: inputStreet.value.trim(),
        landmark: inputLandmark.value.trim(),
        city: inputCity.value.trim()
      };

      applyClinicData(updatedData, true);
      closeModal();
    });
  }
}

