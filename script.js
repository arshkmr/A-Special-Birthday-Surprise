// Birthday Surprise Website Engine
document.addEventListener("DOMContentLoaded", () => {
  // Local state to keep track of user changes
  let state = {
    currentPasscode: "",
    config: { ...CONFIG },
    ageTimer: null,
    wishesInterval: null,
    activeCanvas: false,
    timerCount: 15,
    musicPlaying: false,
  };

  // DOM Cache
  const bgMusic = document.getElementById("bg-music");
  const musicToggle = document.getElementById("music-toggle");
  const iconPlay = musicToggle.querySelector(".icon-play");
  const iconMute = musicToggle.querySelector(".icon-mute");
  const particleContainer = document.getElementById("particle-container");

  // Section cache
  const secPassword = document.getElementById("section-password");
  const secLoader = document.getElementById("section-loader");
  const secReveal = document.getElementById("section-reveal");
  const secEnvelope = document.getElementById("section-envelope");
  const secMemory = document.getElementById("section-memory");
  const secLetter = document.getElementById("section-letter");
  const secCake = document.getElementById("section-cake");
  const secFinale = document.getElementById("section-finale");
  const secEnding = document.getElementById("section-ending");

  // ==========================================================================
  // INITIALIZATION & CONFIG LOADING
  // ==========================================================================
  function loadConfig() {
    // Attempt to load from localStorage first
    const savedConfig = localStorage.getItem("birthday_surprise_config");
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        // Merge with defaults to ensure all key configurations exist
        state.config = { ...CONFIG, ...parsed };
      } catch (e) {
        console.error("Error parsing saved config, using default CONFIG", e);
      }
    }

    // Force passcode to default if it's not 8 characters (legacy 6-digit passcode clean up)
    if (state.config.passcode && state.config.passcode.length !== 8) {
      state.config.passcode = CONFIG.passcode;
      try {
        localStorage.setItem(
          "birthday_surprise_config",
          JSON.stringify(state.config),
        );
      } catch (e) {}
    }

    // Apply assets
    document.getElementById("polaroid-img").src =
      state.config.images.polaroidPlaceholder;
    document.getElementById("memory-img").src = state.config.images.memoryImage;
    document.getElementById("letter-photo-img").src =
      state.config.images.letterPhoto;
    document.getElementById("envelope-name-span").textContent =
      state.config.nickname;
    document.getElementById("polaroid-text").textContent =
      `Happy Birthday! ${state.config.nickname}`;

    // Memory Quotes
    document.getElementById("memory-text-title").textContent =
      state.config.memoryHeading;
    document.getElementById("memory-quote-val").textContent =
      state.config.memoryQuote;

    // Set audio music source
    bgMusic.src = state.config.musicUrl;
  }

  // ==========================================================================
  // FLOATING PARTICLES ENGINE
  // ==========================================================================
  function createParticle(type = "bubble", container = particleContainer) {
    const particle = document.createElement("div");
    const size = Math.random() * 15 + 8;
    const startX = Math.random() * window.innerWidth;
    const duration = Math.random() * 8 + 6;
    const delay = Math.random() * 2;

    if (type === "heart") {
      particle.className = "particle-heart";
      particle.innerHTML = Math.random() > 0.5 ? "❤️" : "💖";
      particle.style.fontSize = `${size + 4}px`;
    } else if (type === "sparkle") {
      particle.className = "particle-sparkle";
      particle.style.width = `${size - 2}px`;
      particle.style.height = `${size - 2}px`;
    } else {
      particle.className = "particle";
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      const palettes = ["#ffb7c5", "#ffe4e8", "#b76e79", "#e6e6fa", "#ffd700"];
      particle.style.backgroundColor =
        palettes[Math.floor(Math.random() * palettes.length)];
    }

    particle.style.left = `${startX}px`;
    particle.style.bottom = `-50px`;
    particle.style.opacity = Math.random() * 0.5 + 0.3;
    particle.style.transition = `transform ${duration}s linear ${delay}s, opacity ${duration}s ease-out ${delay}s`;

    container.appendChild(particle);

    // Trigger animation via thread yielding
    setTimeout(() => {
      const upwardDistance = window.innerHeight + 100;
      const driftX = (Math.random() - 0.5) * 200; // Left-right swaying
      particle.style.transform = `translate(${driftX}px, -${upwardDistance}px) rotate(${Math.random() * 360}deg)`;
      particle.style.opacity = "0";
    }, 50);

    // Clean up DOM after animation finishes
    setTimeout(
      () => {
        particle.remove();
      },
      (duration + delay) * 1000,
    );
  }

  // Keep ambient particles floating continuously
  setInterval(() => {
    // Generate only if tab is visible
    if (!document.hidden) {
      const types = ["bubble", "heart", "sparkle"];
      const chosenType = types[Math.floor(Math.random() * types.length)];
      createParticle(chosenType);
    }
  }, 350);

  // Parallax movement on cursor for polaroid card
  const polaroidWrapper = document.querySelector(".polaroid-wrapper");
  if (polaroidWrapper) {
    document.addEventListener("mousemove", (e) => {
      const xAxis = (window.innerWidth / 2 - e.clientX) / 45;
      const yAxis = (window.innerHeight / 2 - e.clientY) / 45;
      polaroidWrapper.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });
  }

  // ==========================================================================
  // SECTION 1: PASSCODE GATE LOGIC
  // ==========================================================================
  const codeDots = document.querySelectorAll(".code-dot");
  const keys = document.querySelectorAll(".key-btn");
  const passcodeContainer = document.getElementById("passcode-container");
  const statsContainer = document.getElementById("stats-container");
  const errorMsg = document.getElementById("password-error");

  keys.forEach((key) => {
    key.addEventListener("click", () => {
      const keyValue = key.getAttribute("data-key");

      // Play a subtle luxury mechanical click sound (synthesized with Web Audio API)
      playClickSound();

      if (keyValue === "clear") {
        state.currentPasscode = "";
      } else if (keyValue === "backspace") {
        state.currentPasscode = state.currentPasscode.slice(0, -1);
      } else {
        if (state.currentPasscode.length < 8) {
          state.currentPasscode += keyValue;
        }
      }

      // Update dots UI
      codeDots.forEach((dot, index) => {
        if (index < state.currentPasscode.length) {
          dot.classList.add("filled");
        } else {
          dot.classList.remove("filled");
        }
      });

      // Hide error on typing
      errorMsg.classList.add("hidden");

      // Check passcode when full
      if (state.currentPasscode.length === 8) {
        verifyPasscode();
      }
    });
  });

  function verifyPasscode() {
    if (state.currentPasscode === state.config.passcode) {
      // SUCCESS ANIMATION
      passcodeContainer.classList.add("unlocked");
      playSuccessSound();

      // Spawn extra hearts & sparkles locally around lock
      for (let i = 0; i < 20; i++) {
        setTimeout(
          () =>
            createParticle("heart", document.querySelector(".local-hearts")),
          i * 50,
        );
      }

      // Start music
      startMusic();

      // Proceed to show Stats Card with delay
      setTimeout(() => {
        passcodeContainer.classList.add("hidden");
        statsContainer.classList.remove("hidden");
        document.getElementById("stat-dob-val").textContent = formatDOB(
          state.config.dob,
        );

        // Start age counter
        startAgeTicker();
      }, 1000);
    } else {
      // WRONG PASSWORD - SHAKE CARD
      passcodeContainer.classList.add("shake");
      playErrorSound();
      errorMsg.classList.remove("hidden");

      // Reset passcode and dots after shake finishes
      setTimeout(() => {
        passcodeContainer.classList.remove("shake");
        state.currentPasscode = "";
        codeDots.forEach((dot) => dot.classList.remove("filled"));
      }, 600);
    }
  }

  // Audio Player Engine
  function startMusic() {
    if (!state.musicPlaying) {
      bgMusic
        .play()
        .then(() => {
          state.musicPlaying = true;
          musicToggle.classList.remove("hidden");
          iconPlay.classList.add("hidden");
          iconMute.classList.remove("hidden");
        })
        .catch((err) => {
          console.log(
            "Music play blocked, showing play button for manual click",
            err,
          );
          musicToggle.classList.remove("hidden");
          iconPlay.classList.remove("hidden");
          iconMute.classList.add("hidden");
        });
    }
  }

  musicToggle.addEventListener("click", () => {
    if (state.musicPlaying) {
      bgMusic.pause();
      state.musicPlaying = false;
      iconPlay.classList.remove("hidden");
      iconMute.classList.add("hidden");
    } else {
      bgMusic.play().then(() => {
        state.musicPlaying = true;
        iconPlay.classList.add("hidden");
        iconMute.classList.remove("hidden");
      });
    }
  });

  // Synthesize soft premium click sounds via Web Audio API (to avoid loading large asset files)
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  }

  function playClickSound() {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = "triangle";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  }

  function playSuccessSound() {
    try {
      const ctx = getAudioContext();
      // Chime note 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      gain1.gain.setValueAtTime(0.1, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.3);

      // Chime note 2 after 100ms
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
        gain2.gain.setValueAtTime(0.1, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.4);
      }, 100);

      // Chime note 3 after 200ms
      setTimeout(() => {
        const osc3 = ctx.createOscillator();
        const gain3 = ctx.createGain();
        osc3.connect(gain3);
        gain3.connect(ctx.destination);
        osc3.frequency.setValueAtTime(783.99, ctx.currentTime); // G5
        gain3.gain.setValueAtTime(0.1, ctx.currentTime);
        gain3.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
        osc3.start();
        osc3.stop(ctx.currentTime + 0.6);
      }, 200);
    } catch (e) {}
  }

  function playErrorSound() {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(130, ctx.currentTime); // Deep low buzz
      osc.frequency.setValueAtTime(110, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  }

  // Format YYYY-MM-DD to beautiful localized text
  function formatDOB(dateStr) {
    if (!dateStr) return "03 / 08 / 1994";

    const [day, month, year] = dateStr.split("-");

    return `${day} / ${month} / ${year}`;
  }

  // ==========================================================================
  // AGE CALCULATIONS TIMER
  // ==========================================================================
  function startAgeTicker() {
    if (state.ageTimer) clearInterval(state.ageTimer);

    function updateAge() {
      const [day, month, year] = state.config.dob.split("-");
      const dobDate = new Date(year, month - 1, day);
      const now = new Date();

      let diffMs = now - dobDate;
      if (isNaN(diffMs) || diffMs < 0) {
        // Fallback if DOB is in future
        diffMs = 0;
      }

      // Cumulative Calculations
      const totalSeconds = Math.floor(diffMs / 1000);
      const totalMinutes = Math.floor(diffMs / (1000 * 60));
      const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
      const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      // Calculate years and remaining months
      let years = now.getFullYear() - dobDate.getFullYear();
      let months =
        (now.getFullYear() - dobDate.getFullYear()) * 12 +
        (now.getMonth() - dobDate.getMonth());

      // Adjust if birthday hasn't occurred this year yet
      const currentMonth = now.getMonth();
      const currentDay = now.getDate();
      const birthMonth = dobDate.getMonth();
      const birthDay = dobDate.getDate();

      if (
        currentMonth < birthMonth ||
        (currentMonth === birthMonth && currentDay < birthDay)
      ) {
        years--;
      }

      // Display Values inside stats grid
      document.getElementById("stat-age-years").textContent = years;
      document.getElementById("stat-months").textContent =
        months.toLocaleString();
      document.getElementById("stat-days").textContent =
        totalDays.toLocaleString();
      document.getElementById("stat-hours").textContent =
        totalHours.toLocaleString();
      document.getElementById("stat-minutes").textContent =
        totalMinutes.toLocaleString();
      document.getElementById("stat-seconds").textContent =
        totalSeconds.toLocaleString();
    }

    updateAge();
    state.ageTimer = setInterval(updateAge, 1000);
  }

  // Navigation Transition Engine
  function transitionTo(currentSection, nextSection) {
    currentSection.classList.add("fade-out");

    setTimeout(() => {
      currentSection.classList.remove("active");
      currentSection.classList.remove("fade-out");

      nextSection.classList.add("active");
    }, 1000);
  }

  // Proceed from Passcode Page to loader
  document
    .getElementById("btn-proceed-loader")
    .addEventListener("click", () => {
      transitionTo(secPassword, secLoader);
      startLoaderSequence();
    });

  // ==========================================================================
  // SECTION 2: LOADER EXPERIENCE LOGIC
  // ==========================================================================
  function startLoaderSequence() {
    const loaderPhrase = document.getElementById("loader-phrase");
    const progressBar = document.getElementById("loader-progress");
    const phrases = state.config.loaderPhrases;
    let phraseIndex = 0;

    // Cycle phrases dynamically
    loaderPhrase.textContent = phrases[0];
    const phraseTimer = setInterval(() => {
      phraseIndex++;
      if (phraseIndex < phrases.length) {
        loaderPhrase.style.opacity = 0;
        setTimeout(() => {
          loaderPhrase.textContent = phrases[phraseIndex];
          loaderPhrase.style.opacity = 1;
        }, 300);
      }
    }, 1000);

    // Smoothly fill progress bar
    let progress = 0;
    const progressTimer = setInterval(() => {
      progress += 2;
      progressBar.style.width = `${progress}%`;

      // Emit sparkles as loader fills
      if (progress % 10 === 0) {
        createParticle("sparkle");
      }

      if (progress >= 100) {
        clearInterval(progressTimer);
        clearInterval(phraseTimer);
        setTimeout(() => {
          transitionTo(secLoader, secReveal);
          startRevealSequence();
        }, 500);
      }
    }, 100);
  }

  // ==========================================================================
  // SECTION 3: GRAND REVEAL LOGIC
  // ==========================================================================
  function startRevealSequence() {
    // Reveal birthday badge date
    const formattedDate = formatDOB(state.config.dob);
    document.getElementById("reveal-date-badge").textContent = formattedDate;

    // Inject heading text letter by letter
    const headingVal = state.config.birthdayHeading;
    const titleEl = document.getElementById("reveal-title");
    titleEl.innerHTML = "";

    // Split into individual letters
    headingVal.split("").forEach((char, index) => {
      const span = document.createElement("span");
      span.textContent = char === " " ? "\u00A0" : char;
      span.style.animationDelay = `${index * 0.08}s`;
      titleEl.appendChild(span);
    });

    document.getElementById("reveal-subtitle").textContent =
      state.config.birthdaySubtitle;

    // Trigger explosive canvas particles around reveal
    setTimeout(() => {
      for (let i = 0; i < 40; i++) {
        createParticle(Math.random() > 0.5 ? "sparkle" : "heart");
      }
    }, 1000);
  }

  document
    .getElementById("btn-proceed-envelope")
    .addEventListener("click", () => {
      transitionTo(secReveal, secEnvelope);
    });

  // ==========================================================================
  // SECTION 4: INTERACTIVE ENVELOPE LOGIC
  // ==========================================================================
  const envelopeWrapper = document.getElementById("envelope-wrapper");
  const envelopeLetterCard = document.getElementById("envelope-letter-card");

  envelopeWrapper.addEventListener("click", () => {
    if (!envelopeWrapper.classList.contains("open")) {
      envelopeWrapper.classList.add("open");
      playSuccessSound();

      // Slide letter paper up, wait, then trigger transitions automatically!
      setTimeout(() => {
        transitionTo(secEnvelope, secMemory);
        loadMemorySection();
      }, 2500);
    }
  });

  // ==========================================================================
  // SECTION 5: MEMORY REVEAL LOGIC
  // ==========================================================================
  function loadMemorySection() {
    document.getElementById("memory-top-date-val").textContent = formatDOB(
      state.config.dob,
    );
  }

  document
    .getElementById("btn-proceed-letter")
    .addEventListener("click", () => {
      transitionTo(secMemory, secLetter);
    });

  // ==========================================================================
  // SECTION 6: LOVE LETTER UNWIND LOGIC
  // ==========================================================================
  const letterPackage = document.getElementById("letter-package");
  const paperLetter = document.getElementById("paper-letter");
  const waxSeal = document.getElementById("wax-seal");
  const flaps = letterPackage.querySelectorAll(".envelope-flap");
  const ribbons = letterPackage.querySelectorAll(
    '[class*="ribbon-vertical-half"], [class*="ribbon-horizontal-half"]',
  );

  let packageOpened = false;

  // 3D Parallax Tilt Effect on Closed Envelope
  letterPackage.addEventListener("mousemove", (e) => {
    if (packageOpened) return;
    const rect = letterPackage.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Max 15 degrees tilt
    const rotateY = (x / (rect.width / 2)) * 15;
    const rotateX = -(y / (rect.height / 2)) * 15;

    letterPackage.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  });

  letterPackage.addEventListener("mouseleave", () => {
    if (packageOpened) return;
    letterPackage.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
  });

  // Staggered Unfolding Timeline on click
  letterPackage.addEventListener("click", () => {
    if (packageOpened) return;
    packageOpened = true;

    // Reset rotation before unfolding animation
    letterPackage.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
    playClickSound();

    // 1. Crack wax seal
    if (waxSeal) waxSeal.classList.add("cracked");

    // 2. Slide ribbons off
    ribbons.forEach((rib) => {
      rib.classList.add("slide-away");
    });

    // 3. Open flaps sequentially
    setTimeout(() => {
      const topFlap = letterPackage.querySelector(".flap-top");
      const bottomFlap = letterPackage.querySelector(".flap-bottom");
      const leftFlap = letterPackage.querySelector(".flap-left");
      const rightFlap = letterPackage.querySelector(".flap-right");

      if (topFlap) topFlap.classList.add("flap-opened");

      setTimeout(() => {
        if (bottomFlap) bottomFlap.classList.add("flap-opened");
      }, 150);

      setTimeout(() => {
        if (leftFlap) leftFlap.classList.add("flap-opened");
        if (rightFlap) rightFlap.classList.add("flap-opened");
      }, 300);
    }, 450);

    // 4. Fade envelope, scale and pop paper letter out
    setTimeout(() => {
      letterPackage.classList.add("unfolded-package");

      // Trigger custom rose petal burst and magic sparkles
      triggerRosePetalBurst();
      for (let i = 0; i < 15; i++) {
        setTimeout(() => createParticle("sparkle"), i * 150);
      }

      setTimeout(() => {
        letterPackage.classList.add("hidden");
        paperLetter.classList.remove("hidden-initial");
        // Force reflow
        paperLetter.offsetHeight;
        paperLetter.classList.add("active");

        // Reveal letter paragraphs sequentially
        revealLetterText();
      }, 400);
    }, 1250);
  });

  // Staggered paragraph reveal
  function revealLetterText() {
    const greeting = document.getElementById("letter-greet");
    const closing = document.getElementById("letter-close");
    const signature = document.getElementById("letter-sig");
    const actions = document.querySelector(".letter-actions");
    const textBody = document.getElementById("letter-body-paragraphs");

    // Set textual values and reset visual classes
    greeting.textContent = state.config.letterContent.greeting;
    greeting.classList.remove("revealed");

    textBody.innerHTML = "";
    state.config.letterContent.paragraphs.forEach((para) => {
      const p = document.createElement("p");
      p.textContent = para;
      textBody.appendChild(p);
    });

    closing.textContent = state.config.letterContent.closing;
    closing.classList.remove("revealed");

    signature.textContent = state.config.letterContent.signature;
    signature.classList.remove("revealed");

    actions.classList.remove("revealed");

    // Trigger reveal sequence
    let currentDelay = 300;

    setTimeout(() => {
      greeting.classList.add("revealed");
    }, currentDelay);
    currentDelay += 800;

    const paragraphs = textBody.querySelectorAll("p");
    paragraphs.forEach((p) => {
      setTimeout(() => {
        p.classList.add("revealed");
      }, currentDelay);
      currentDelay += 1400; // staggered delay per paragraph
    });

    setTimeout(() => {
      closing.classList.add("revealed");
    }, currentDelay);
    currentDelay += 800;

    setTimeout(() => {
      signature.classList.add("revealed");
    }, currentDelay);
    currentDelay += 1000;

    setTimeout(() => {
      actions.classList.add("revealed");
    }, currentDelay);
  }

  // Rose Petal Burst Generator
  function triggerRosePetalBurst() {
    const colors = ["#ff4d6d", "#c31432", "#ff85a1", "#ff0a54"];

    for (let i = 0; i < 30; i++) {
      const petal = document.createElement("div");
      petal.className = "particle-petal";

      const size = Math.random() * 12 + 10;
      petal.style.width = `${size}px`;
      petal.style.height = `${size * 1.3}px`;

      // Spawn near the screen center (envelope area)
      const startX = window.innerWidth / 2 - 20 + (Math.random() - 0.5) * 80;
      const startY = window.innerHeight / 2 - 20 + (Math.random() - 0.5) * 60;

      petal.style.left = `${startX}px`;
      petal.style.top = `${startY}px`;

      // Calculate custom curve movement values for CSS variables
      const angle1 = Math.random() * Math.PI * 2;
      const dist1 = Math.random() * 120 + 60;
      const dx1 = Math.cos(angle1) * dist1;
      const dy1 = Math.sin(angle1) * dist1;

      const angle2 = Math.random() * Math.PI + Math.PI / 4; // mostly downward direction
      const dist2 = Math.random() * 320 + 200;
      const dx2 = dx1 + Math.cos(angle2) * dist2;
      const dy2 = dy1 + Math.sin(angle2) * dist2 + 180;

      petal.style.setProperty("--dx1", `${dx1}px`);
      petal.style.setProperty("--dy1", `${dy1}px`);
      petal.style.setProperty("--dx2", `${dx2}px`);
      petal.style.setProperty("--dy2", `${dy2}px`);

      // Pick a random petal red/rose gradient
      const color = colors[Math.floor(Math.random() * colors.length)];
      petal.style.background = `linear-gradient(135deg, ${color} 0%, #5c0612 100%)`;

      const duration = Math.random() * 3.5 + 3.5; // 3.5s - 7.0s
      petal.style.animation = `petal-fall ${duration}s cubic-bezier(0.25, 1, 0.5, 1) forwards`;

      document.body.appendChild(petal);

      // Self cleanup
      setTimeout(() => {
        petal.remove();
      }, duration * 1000);
    }
  }

  document.getElementById("btn-proceed-cake").addEventListener("click", () => {
    transitionTo(secLetter, secCake);
    startCakeSection();
  });

  // ==========================================================================
  // SECTION 7: BIRTHDAY CAKE & WISHES LOGIC
  // ==========================================================================
  function startCakeSection() {
    document.getElementById("cake-heading-val").textContent =
      state.config.cakeHeading;
    state.timerCount = state.config.timerDuration;

    const timerText = document.getElementById("wish-countdown-number");
    timerText.textContent = state.timerCount;

    // Reset candles blown state in DOM
    const candles = document.querySelectorAll(".candle");
    candles.forEach((candle) => {
      candle.setAttribute("data-blown", "false");
      candle.style.opacity = "1";
    });

    // Handle clicking candle to blow it out
    candles.forEach((candle) => {
      candle.addEventListener("click", () => {
        if (candle.getAttribute("data-blown") === "false") {
          candle.setAttribute("data-blown", "true");
          playClickSound();
          createBlowSmoke(candle);

          // Check if all candles blown
          const allBlown = Array.from(candles).every(
            (c) => c.getAttribute("data-blown") === "true",
          );
          if (allBlown) {
            // Blow success
            triggerFinaleEarly();
          }
        }
      });
    });

    // No countdown timer, transition happens only when all candles are blown

    // Generate floating wishes continuously
    generateWishes();
    state.wishesInterval = setInterval(generateWishes, 1200);
  }

  function createBlowSmoke(candleEl) {
    // Create smoke rings rising from blown candle
    const rect = candleEl.getBoundingClientRect();
    for (let i = 0; i < 5; i++) {
      const smoke = document.createElement("div");
      smoke.style.position = "fixed";
      smoke.style.width = "8px";
      smoke.style.height = "8px";
      smoke.style.borderRadius = "50%";
      smoke.style.background = "rgba(255,255,255,0.7)";
      smoke.style.left = `${rect.left + rect.width / 2}px`;
      smoke.style.top = `${rect.top - 10}px`;
      smoke.style.pointerEvents = "none";
      smoke.style.zIndex = "100";
      smoke.style.transition = "all 0.8s ease-out";
      document.body.appendChild(smoke);

      setTimeout(() => {
        smoke.style.transform = `translate(${(Math.random() - 0.5) * 40}px, -${Math.random() * 50 + 20}px) scale(${Math.random() * 2 + 1})`;
        smoke.style.opacity = "0";
      }, 20);

      setTimeout(() => smoke.remove(), 900);
    }
  }

  function generateWishes() {
    if (document.hidden) return;
    const wishesList = state.config.floatingWishes;
    const chosenWish =
      wishesList[Math.floor(Math.random() * wishesList.length)];

    const wishEl = document.createElement("div");
    wishEl.className = "floating-wish";
    wishEl.textContent = chosenWish;

    // Position bottom right
    const startX = window.innerWidth - (Math.random() * 200 + 100);
    const startY = window.innerHeight - 50;

    wishEl.style.left = `${startX}px`;
    wishEl.style.top = `${startY}px`;
    document.body.appendChild(wishEl);

    // Animate and clean up
    setTimeout(() => {
      wishEl.remove();
    }, 6000);
  }

  function triggerFinaleEarly() {
    clearInterval(state.cakeTimerRef);
    clearInterval(state.wishesInterval);

    setTimeout(() => {
      transitionTo(secCake, secFinale);

      initFinaleRibbonCanvas();
      startGrandFinale();
    }, 800);
  }

  // ==========================================================================
  // SECTION 8: GRAND FINALE CANVAS SYSTEM
  // ==========================================================================
  let canvas, ctx, animationFrameId;
  let fireworks = [];
  let confettiArr = [];

  function startGrandFinale() {
    playSuccessSound();

    const finaleText = document.getElementById("finale-main-phrase");

    const messages = state.config.finaleMessages;

    let messageIndex = 0;

    finaleText.textContent = messages[0];

    const textTimer = setInterval(() => {
      messageIndex++;

      if (messageIndex < messages.length) {
        finaleText.style.opacity = 0;
        finaleText.style.transform = "scale(0.95)";

        setTimeout(() => {
          finaleText.textContent = messages[messageIndex];

          finaleText.style.opacity = 1;

          finaleText.style.transform = "scale(1)";
        }, 500);
      } else {
        clearInterval(textTimer);

        document
          .getElementById("btn-proceed-ending")
          .classList.remove("hidden");
      }
    }, 4500);
  }

  function resizeCanvas() {
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }

  // 1. Fireworks sparks
  class Spark {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.gravity = 0.08;
      this.friction = 0.96;
      this.alpha = 1;
      this.decay = Math.random() * 0.02 + 0.01;
    }
    update() {
      this.vy += this.gravity;
      this.vx *= this.friction;
      this.vy *= this.friction;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // 2. Rising Firework rocket
  class Rocket {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height;
      this.tx = Math.random() * canvas.width;
      this.ty = Math.random() * (canvas.height * 0.5) + 50;
      this.speed = Math.random() * 4 + 7;
      const angle = Math.atan2(this.ty - this.y, this.tx - this.x);
      this.vx = Math.cos(angle) * this.speed;
      this.vy = Math.sin(angle) * this.speed;
      this.sparks = [];
      this.exploded = false;
      this.colors = [
        "#ffb7c5",
        "#ffc0cb",
        "#b76e79",
        "#ffd700",
        "#e6e6fa",
        "#ff4d6d",
      ];
      this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    }
    update() {
      if (!this.exploded) {
        this.x += this.vx;
        this.y += this.vy;

        // Spawn tail sparks
        if (Math.random() > 0.4) {
          this.sparks.push({
            x: this.x,
            y: this.y,
            alpha: 0.8,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
          });
        }

        this.sparks.forEach((s) => {
          s.x += s.vx;
          s.y += s.vy;
          s.alpha -= 0.04;
        });
        this.sparks = this.sparks.filter((s) => s.alpha > 0);

        if (this.vy >= 0 || this.y <= this.ty) {
          this.explode();
        }
      } else {
        this.sparks.forEach((s) => s.update());
        this.sparks = this.sparks.filter((s) => s.alpha > 0);
      }
    }
    explode() {
      this.exploded = true;
      const particlesCount = Math.floor(Math.random() * 60 + 50);
      for (let i = 0; i < particlesCount; i++) {
        this.sparks.push(new Spark(this.x, this.y, this.color));
      }
    }
    draw() {
      if (!this.exploded) {
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();

        this.sparks.forEach((s) => {
          ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        });
      } else {
        this.sparks.forEach((s) => s.draw());
      }
    }
  }

  // 3. Confetti Particle Factory
  function createConfettiParticle() {
    const colors = [
      "#ffb7c5",
      "#b76e79",
      "#e6e6fa",
      "#ffd700",
      "#352245",
      "#ff4d6d",
    ];
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * -window.innerHeight,
      size: Math.random() * 8 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 4 - 2,
      vx: Math.random() * 2 - 1,
      vy: Math.random() * 2 + 2,
    };
  }

  function tickCanvas() {
    if (!state.activeCanvas) return;

    // Clear with slight trailing overlay blur
    ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 1. Spawning rockets at intervals
    if (Math.random() < 0.04 && fireworks.length < 8) {
      fireworks.push(new Rocket());
    }

    // 2. Animate Fireworks
    fireworks.forEach((f) => f.update());
    fireworks.forEach((f) => f.draw());
    // filter finished explosions
    fireworks = fireworks.filter((f) => !f.exploded || f.sparks.length > 0);

    // 3. Animate Confetti
    confettiArr.forEach((c) => {
      c.y += c.vy;
      c.x += c.vx;
      c.rotation += c.rotationSpeed;

      // Wrap-around screen
      if (c.y > canvas.height) {
        c.y = -20;
        c.x = Math.random() * canvas.width;
      }

      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate((c.rotation * Math.PI) / 180);
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
      ctx.restore();
    });

    animationFrameId = requestAnimationFrame(tickCanvas);
  }

  document
    .getElementById("btn-proceed-ending")
    .addEventListener("click", () => {
      // Terminate canvas
      state.activeCanvas = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);

      transitionTo(secFinale, secEnding);
    });

  // ==========================================================================
  // SECTION 9: CINEMATIC ENDING / RESTART LOGIC
  // ==========================================================================
  document.getElementById("btn-restart").addEventListener("click", () => {
    // Reset variables
    state.currentPasscode = "";
    codeDots.forEach((dot) => dot.classList.remove("filled"));

    // Reset active panels
    statsContainer.classList.add("hidden");
    passcodeContainer.classList.remove("hidden");
    passcodeContainer.classList.remove("unlocked");
    document.getElementById("btn-proceed-ending").classList.add("hidden");

    // Untie letter classes reset
    packageOpened = false;
    if (waxSeal) waxSeal.classList.remove("cracked");
    ribbons.forEach((rib) => rib.classList.remove("slide-away"));
    flaps.forEach((fl) => fl.classList.remove("flap-opened"));

    // Reset letter text reveal classes
    const greetingEl = document.getElementById("letter-greet");
    const closingEl = document.getElementById("letter-close");
    const signatureEl = document.getElementById("letter-sig");
    const actionsEl = document.querySelector(".letter-actions");
    const textBodyEl = document.getElementById("letter-body-paragraphs");
    if (greetingEl) greetingEl.classList.remove("revealed");
    if (closingEl) closingEl.classList.remove("revealed");
    if (signatureEl) signatureEl.classList.remove("revealed");
    if (actionsEl) actionsEl.classList.remove("revealed");
    if (textBodyEl) {
      const paragraphs = textBodyEl.querySelectorAll("p");
      paragraphs.forEach((p) => p.classList.remove("revealed"));
    }

    letterPackage.classList.remove("unfolded-package");
    letterPackage.classList.remove("hidden");
    letterPackage.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";

    paperLetter.classList.add("hidden-initial");
    paperLetter.classList.remove("active");

    // Envelope wrapper class reset
    envelopeWrapper.classList.remove("open");

    // Return to password gate section
    transitionTo(secEnding, secPassword);
  });

  // Load configuration on entry
  loadConfig();
});

function initFinaleRibbonCanvas() {
  const canvas = document.getElementById("finale-ribbon-canvas");

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener("resize", resize);

  const items = [];

  for (let i = 0; i < 60; i++) {
    items.push({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      size: Math.random() * 18 + 10,
      speed: Math.random() * 2 + 1,
      swing: Math.random() * 2,
      angle: Math.random() * Math.PI * 2,
      type: Math.random() > 0.4 ? "heart" : "ribbon",
    });
  }

  function drawHeart(x, y, size) {
    ctx.save();
    ctx.translate(x, y);

    ctx.fillStyle = "#ff4d88";

    ctx.beginPath();
    ctx.moveTo(0, size / 4);

    ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, size / 4);

    ctx.bezierCurveTo(-size / 2, size / 2, 0, size, 0, size);

    ctx.bezierCurveTo(0, size, size / 2, size / 2, size / 2, size / 4);

    ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, size / 4);

    ctx.fill();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    items.forEach((item) => {
      item.y += item.speed;

      item.angle += 0.03;

      item.x += Math.sin(item.angle) * item.swing;

      if (item.type === "heart") {
        drawHeart(item.x, item.y, item.size);
      } else {
        ctx.save();

        ctx.translate(item.x, item.y);

        ctx.rotate(item.angle);

        ctx.fillStyle = Math.random() > 0.5 ? "#ff6b9d" : "#ffd166";

        ctx.fillRect(-3, -item.size, 6, item.size * 2);

        ctx.restore();
      }

      if (item.y > canvas.height + 50) {
        item.y = -50;
        item.x = Math.random() * canvas.width;
      }
    });

    requestAnimationFrame(animate);
  }

  animate();
}
