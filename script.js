/**
 * THE TINY HIVE - EARLY YEAR FOUNDATION SCHOOL
 * Interactive Logic, Audio Chimes, Mobile Drawer & Modal Handlers
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Sound Synthesizer (Web Audio API)
     Playful, gentle harmonic chimes with zero external dependencies
     ========================================================================== */
  let soundEnabled = false;
  let audioCtx = null;

  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundOffIcon = soundToggleBtn?.querySelector('.sound-off');
  const soundOnIcon = soundToggleBtn?.querySelector('.sound-on');

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playChime(freq = 523.25, type = 'sine', duration = 0.35) {
    if (!soundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio synthesis issue:', e);
    }
  }

  function playCelebrationFanfare() {
    if (!soundEnabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => playChime(freq, 'triangle', 0.4), idx * 110);
    });
  }

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      initAudio();
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        soundOffIcon?.classList.add('hidden');
        soundOnIcon?.classList.remove('hidden');
        soundToggleBtn.setAttribute('aria-label', 'Sound effects enabled. Click to mute.');
        playChime(659.25, 'sine', 0.25);
      } else {
        soundOffIcon?.classList.remove('hidden');
        soundOnIcon?.classList.add('hidden');
        soundToggleBtn.setAttribute('aria-label', 'Sound effects disabled. Click to enable.');
      }
    });
  }

  // Play subtle feedback on primary button clicks
  document.querySelectorAll('.btn, .tab-btn, .time-step-btn').forEach(elem => {
    elem.addEventListener('click', () => {
      if (soundEnabled) {
        playChime(587.33, 'sine', 0.18);
      }
    });
  });


  /* ==========================================================================
     2. Sticky Header & Enhanced Mobile Nav Drawer with Backdrop
     ========================================================================== */
  const header = document.getElementById('header');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mainNav = document.getElementById('main-nav');
  const navBackdrop = document.getElementById('navBackdrop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  function closeMobileNav() {
    mobileMenuBtn?.setAttribute('aria-expanded', 'false');
    mainNav?.classList.remove('open');
    navBackdrop?.classList.remove('active');
    document.body.style.overflow = '';
  }

  function openMobileNav() {
    mobileMenuBtn?.setAttribute('aria-expanded', 'true');
    mainNav?.classList.add('open');
    navBackdrop?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    // Close on backdrop tap
    navBackdrop?.addEventListener('click', closeMobileNav);

    // Close mobile menu on clicking any navigation link
    mainNav.querySelectorAll('.nav-link, button').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });
  }


  /* ==========================================================================
     3. Active Nav Link Highlighting via IntersectionObserver
     ========================================================================== */
  const sections = document.querySelectorAll('main > section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(sec => navObserver.observe(sec));


  /* ==========================================================================
     4. Dynamic Live Activity Ticker (Hero Image)
     ========================================================================== */
  const activityElem = document.getElementById('currentActivityText');
  const activities = [
    'Sensory Clay & Botanical Atelier',
    'Sunflower Watering in Mud Garden',
    'Wooden Block Castle Engineering',
    'Bilingual French Story Circle',
    'Lavender Mist & Storybook Nook'
  ];
  let actIndex = 0;

  if (activityElem) {
    setInterval(() => {
      actIndex = (actIndex + 1) % activities.length;
      activityElem.style.opacity = '0';
      activityElem.style.transform = 'translateY(4px)';
      setTimeout(() => {
        activityElem.textContent = activities[actIndex];
        activityElem.style.transition = 'all 0.3s ease';
        activityElem.style.opacity = '1';
        activityElem.style.transform = 'translateY(0)';
      }, 300);
    }, 4500);
  }


  /* ==========================================================================
     5. Programs Interactive Tabs
     ========================================================================== */
  const tabButtons = document.querySelectorAll('.program-tabs-nav .tab-btn');
  const programPanels = document.querySelectorAll('.program-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      // Update Tab Buttons
      tabButtons.forEach(b => {
        const isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-selected', String(isActive));
      });

      // Update Panels
      programPanels.forEach(panel => {
        if (panel.id === `panel-${targetId}`) {
          panel.classList.add('active');
          panel.removeAttribute('hidden');
        } else {
          panel.classList.remove('active');
          panel.setAttribute('hidden', '');
        }
      });
    });
  });


  /* ==========================================================================
     6. Philosophy Accordion ("4 Wings of Growth")
     ========================================================================== */
  const wingItems = document.querySelectorAll('.wing-item');

  wingItems.forEach(item => {
    const header = item.querySelector('.wing-header');
    const body = item.querySelector('.wing-body');
    const chevron = item.querySelector('.wing-chevron');

    header?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others
      wingItems.forEach(other => {
        other.classList.remove('active');
        other.querySelector('.wing-body')?.setAttribute('hidden', '');
        const otherChev = other.querySelector('.wing-chevron');
        if (otherChev) otherChev.textContent = '+';
      });

      if (!isActive) {
        item.classList.add('active');
        body?.removeAttribute('hidden');
        if (chevron) chevron.textContent = '−';
        if (soundEnabled) playChime(523.25, 'triangle', 0.15);
      }
    });
  });


  /* ==========================================================================
     7. Daily Rhythm Interactive Schedule
     ========================================================================== */
  const scheduleData = {
    '08:45': {
      timeBadge: '08:45 AM – 09:30 AM',
      category: 'Welcoming Routine',
      title: 'Gentle Arrival & Free Discovery Invitations',
      desc: 'Children arrive at their own pace, greeted by their primary educator with a warm smile. Soft classical music plays while children choose from sensory trays, block towers, or watercolor sketching.',
      highlights: ['👟 Shoe-changing independence', '🥪 Fresh fruit water station', '🤗 Warm educator check-in'],
      pedagogy: '"Slow mornings foster neurological safety and emotional readiness for the entire day."',
      img: 'assets/images/hero_kids.jpg'
    },
    '09:30': {
      timeBadge: '09:30 AM – 10:00 AM',
      category: 'Community Connection',
      title: 'Morning Song Circle & Daily Intentions',
      desc: 'Gathering on the cozy honeycomb rug with acoustic guitar or ukulele. Children sing welcome songs, discuss the weather wheel, share their feelings with emotion plushies, and set the day’s project focus.',
      highlights: ['🎵 Acoustic community singing', '☀️ Weather & seasons observation', '💛 Daily feeling check-ins'],
      pedagogy: '"Circle time teaches vocal confidence, turn-taking, and collective belonging."',
      img: 'assets/images/reading_nook.jpg'
    },
    '10:00': {
      timeBadge: '10:00 AM – 11:30 AM',
      category: 'Nature & Gross Motor',
      title: 'Forest Garden Exploration & Mud Kitchen Lab',
      desc: 'Outdoors in the fresh morning sun! Digging in the organic soil, making rosemary mud cakes, watering tomato vines, and running through grassy mounds to develop physical stamina and sensory joy.',
      highlights: ['🌱 Seedling care & worm hunts', '🥧 Creative mud concoctions', '🪵 Balance beam climbing'],
      pedagogy: '"Immersion in nature reduces cortisol and sparks boundless scientific questions."',
      img: 'assets/images/garden_play.jpg'
    },
    '11:30': {
      timeBadge: '11:30 AM – 12:30 PM',
      category: 'Nourishment & Etiquette',
      title: 'Chef\'s Organic Family-Style Feast',
      desc: 'Children set the wooden tables with ceramic plates and cloth napkins. Our in-house chef serves farm-to-table seasonal dishes. Children practice graceful scooping, pouring water, and thanking classmates.',
      highlights: ['🥕 100% Certified organic produce', '🍽️ Montessori table setting', '🥛 Self-serve water carafes'],
      pedagogy: '"Shared meals cultivate food positivity, gratitude, and communal conversational skills."',
      img: 'assets/images/hero_kids.jpg'
    },
    '12:30': {
      timeBadge: '12:30 PM – 02:30 PM',
      category: 'Restorative Sleep',
      title: 'Sweet Dreams, Lullabies & Mindfulness Rest',
      desc: 'Dimmable warm circadian lighting, lavender mist, and white noise or gentle lullabies. Children who nap rest comfortably in their designated organic cotton cot; non-nappers enjoy quiet book browsing.',
      highlights: ['😴 Individual cots & linens', '📖 Whisper book reading', '🌿 Calming herbal diffuser'],
      pedagogy: '"Sleep solidifies daily learning connections and restores emotional equilibrium."',
      img: 'assets/images/reading_nook.jpg'
    },
    '02:30': {
      timeBadge: '02:30 PM – 04:30 PM',
      category: 'Creative Expression',
      title: 'Atelier Art Masterpieces & STEAM Inquiry',
      desc: 'The Hundred Languages come alive! Children experiment with natural pigments, potter’s clay, ramp kinetics, shadow puppetry, and loose-parts design guided by our dedicated atelierista educator.',
      highlights: ['🎨 Large-scale canvas painting', '🔬 Light tables & prisms', '🧱 Architectural loose parts'],
      pedagogy: '"Art is not an isolated subject; it is the child’s primary language of wonder."',
      img: 'assets/images/art_atelier.jpg'
    },
    '04:30': {
      timeBadge: '04:30 PM – 06:00 PM',
      category: 'Sunset Reflection',
      title: 'Sunset Story Circle & Joyful Reunions',
      desc: 'Gathering to review the day\'s documentation photos on the projector. Children pack their tiny backpacks, sing the farewell rhyme, and share joyful reunion hugs with their parents at pick-up.',
      highlights: ['📸 Daily photo reflection', '🎒 Personal belongings independence', '👋 Warm parent handoffs'],
      pedagogy: '"Reflecting on the day cements pride in achievements and eases transitions home."',
      img: 'assets/images/hero_kids.jpg'
    }
  };

  const timeStepButtons = document.querySelectorAll('.time-step-btn');
  const rhythmTimeBadge = document.getElementById('rhythmTimeBadge');
  const rhythmCatTag = document.getElementById('rhythmCatTag');
  const rhythmCardTitle = document.getElementById('rhythmCardTitle');
  const rhythmCardDesc = document.getElementById('rhythmCardDesc');
  const rhythmHighlights = document.getElementById('rhythmHighlights');
  const rhythmPedagogy = document.getElementById('rhythmPedagogy');
  const rhythmCardImg = document.getElementById('rhythmCardImg');
  const rhythmDisplayCard = document.getElementById('rhythmDisplayCard');

  timeStepButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const timeKey = btn.getAttribute('data-time');
      const data = scheduleData[timeKey];
      if (!data) return;

      timeStepButtons.forEach(b => {
        const isSelected = b === btn;
        b.classList.toggle('active', isSelected);
        b.setAttribute('aria-selected', String(isSelected));
      });

      if (rhythmDisplayCard) {
        rhythmDisplayCard.style.opacity = '0.4';
        rhythmDisplayCard.style.transform = 'translateY(6px)';

        setTimeout(() => {
          if (rhythmTimeBadge) rhythmTimeBadge.textContent = data.timeBadge;
          if (rhythmCatTag) rhythmCatTag.textContent = data.category;
          if (rhythmCardTitle) rhythmCardTitle.textContent = data.title;
          if (rhythmCardDesc) rhythmCardDesc.textContent = data.desc;
          if (rhythmPedagogy) rhythmPedagogy.textContent = data.pedagogy;
          if (rhythmCardImg) rhythmCardImg.src = data.img;

          if (rhythmHighlights) {
            rhythmHighlights.innerHTML = data.highlights
              .map(h => `<span class="highlight-chip">${h}</span>`)
              .join('');
          }

          rhythmDisplayCard.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
          rhythmDisplayCard.style.opacity = '1';
          rhythmDisplayCard.style.transform = 'translateY(0)';
        }, 150);
      }
    });
  });


  /* ==========================================================================
     8. Admissions & Tour Priority Waitlist Modal (<dialog>)
     ========================================================================== */
  const tourDialog = document.getElementById('tourDialog');
  const closeTourDialogBtn = document.getElementById('closeTourDialogBtn');
  const tourBookingForm = document.getElementById('tourBookingForm');
  const dialogFormView = document.getElementById('dialogFormView');
  const dialogSuccessView = document.getElementById('dialogSuccessView');
  const finishBookingBtn = document.getElementById('finishBookingBtn');
  const childAgeSelect = document.getElementById('childAgeGroup');

  function openTourDialog(preselectedProgram = '') {
    if (!tourDialog) return;

    if (dialogFormView) dialogFormView.classList.remove('hidden');
    if (dialogSuccessView) dialogSuccessView.classList.add('hidden');

    if (preselectedProgram && childAgeSelect) {
      childAgeSelect.value = preselectedProgram;
    }

    if (typeof tourDialog.showModal === 'function') {
      tourDialog.showModal();
    } else {
      tourDialog.setAttribute('open', '');
    }
  }

  function closeTourDialog() {
    if (!tourDialog) return;
    if (typeof tourDialog.close === 'function') {
      tourDialog.close();
    } else {
      tourDialog.removeAttribute('open');
    }
  }

  // Open triggers
  document.querySelectorAll('[data-open-tour]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const preselect = btn.getAttribute('data-program-preselect') || '';
      openTourDialog(preselect);
    });
  });

  // Close triggers
  closeTourDialogBtn?.addEventListener('click', closeTourDialog);
  finishBookingBtn?.addEventListener('click', closeTourDialog);

  // Close when clicking outside the dialog card
  tourDialog?.addEventListener('click', (e) => {
    const dialogDimensions = tourDialog.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      closeTourDialog();
    }
  });

  // Handle Waitlist Form Submit
  tourBookingForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const parentName = document.getElementById('parentName')?.value || 'Valued Parent';
    const chosenAge = childAgeSelect?.options[childAgeSelect.selectedIndex]?.text || 'Early Years';
    const expectedYearSelect = document.getElementById('expectedYear');
    const chosenCohort = expectedYearSelect?.options[expectedYearSelect.selectedIndex]?.text || 'Autumn 2026';
    const prefTimeSelect = document.getElementById('preferredTime');
    const chosenTime = prefTimeSelect?.options[prefTimeSelect.selectedIndex]?.text || 'Morning Window';

    // Populate Recap
    const recapDate = document.getElementById('recapDate');
    const recapTime = document.getElementById('recapTime');
    const recapProgram = document.getElementById('recapProgram');
    const successMsg = document.getElementById('successMsgText');

    if (recapDate) recapDate.textContent = chosenCohort;
    if (recapTime) recapTime.textContent = chosenTime;
    if (recapProgram) recapProgram.textContent = chosenAge;
    if (successMsg) {
      successMsg.textContent = `Thank you, ${parentName}! Your family is registered for priority notification. As soon as campus infrastructure setup is complete, you will receive an exclusive early invite to book your tour.`;
    }

    // Switch view
    dialogFormView?.classList.add('hidden');
    dialogSuccessView?.classList.remove('hidden');

    // Trigger celebration effects
    playCelebrationFanfare();
    fireConfetti();
  });


  /* ==========================================================================
     9. Newsletter Form Submission
     ========================================================================== */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterFeedback = document.getElementById('newsletterFeedback');

  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('newsletterEmail');
    if (emailInput && emailInput.value) {
      if (newsletterFeedback) {
        newsletterFeedback.classList.remove('hidden');
      }
      emailInput.value = '';
      fireConfetti();
      playCelebrationFanfare();
    }
  });


  /* ==========================================================================
     10. Celebratory Confetti Animation (Canvas)
     ========================================================================== */
  const canvas = document.getElementById('confettiCanvas');
  let confettiCtx = null;
  let confettiPieces = [];
  let confettiAnimationId = null;

  if (canvas) {
    confettiCtx = canvas.getContext('2d');
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
  }

  function fireConfetti() {
    if (!canvas || !confettiCtx) return;

    confettiPieces = [];
    const colors = ['#FFB800', '#2EC4B6', '#FF6B6B', '#845EC2', '#FFE169', '#4D96FF'];

    for (let i = 0; i < 90; i++) {
      confettiPieces.push({
        x: canvas.width / 2,
        y: canvas.height / 2 + 50,
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.7) * 22,
        size: Math.random() * 8 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        alpha: 1,
        decay: Math.random() * 0.015 + 0.01
      });
    }

    if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);
    animateConfetti();
  }

  function animateConfetti() {
    if (!confettiCtx || !canvas) return;
    confettiCtx.clearRect(0, 0, canvas.width, canvas.height);

    let activeCount = 0;

    confettiPieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.45; // gravity
      p.vx *= 0.98; // air resistance
      p.rotation += p.rotSpeed;
      p.alpha -= p.decay;

      if (p.alpha > 0) {
        activeCount++;
        confettiCtx.save();
        confettiCtx.translate(p.x, p.y);
        confettiCtx.rotate((p.rotation * Math.PI) / 180);
        confettiCtx.globalAlpha = Math.max(0, p.alpha);
        confettiCtx.fillStyle = p.color;
        confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        confettiCtx.restore();
      }
    });

    if (activeCount > 0) {
      confettiAnimationId = requestAnimationFrame(animateConfetti);
    } else {
      confettiCtx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }


  /* ==========================================================================
     11. Progressive Fallback for Scroll Reveal (modern-web-guidance)
     Applies IntersectionObserver when CSS view-timeline is not supported
     ========================================================================== */
  if (!CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
    const revealTargets = document.querySelectorAll(
      '.pillar-card, .campus-card, .review-card, .safety-card, .rhythm-display-card'
    );

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealTargets.forEach(el => {
      el.classList.add('reveal-on-scroll');
      revealObserver.observe(el);
    });
  }

});
