/**
 * Did you call your sponsor first?
 * A sarcastic sponsor wisdom generator with category-based responses
 */

(function() {
  'use strict';

  // ============================================
  // DATA: Response pools by category
  // ============================================
  
  const responsePools = {
    backfired: [
      "[Clutches pearls]",
      "Shocked. Party of none.",
      "Must be necessary.",
      "Well that's brand new behavior.",
      "Interesting."
    ],
    god: [
      "That's a fascinating turn of events.",
      "Interesting.",
      "I'm so shocked. How will I ever sleep?"
    ],
    unwilling: [
      "Do you think bottling it up is working for you?",
      "But also, you can keep bitching. No judgment.",
      "This medicine tastes like shit.",
      "Cool. What's different this time?",
      "Don't be a dumbass."
    ],
    okiwill: [
      "Doubtful for 200, Alex.",
      "Honestly, I think you're full of shit. But also no judgment."
    ],
    whatdoido: [
      "I know it won't work, but pray on it.",
      "You already know the answer."
    ],
    stupid: [
      "Don't be a dumbass.",
      "Is there a question in there?",
      "Maybe ride that wave a bit backwards.",
      "Are you asking for permission?"
    ],
    angry: [
      "Save your fucks for shit that matters.",
      "And?",
      "Interesting choice of focus.",
      "Your bottle of fucks is full.",
      "They did it your way before and you were still a bitch, so why bother?"
    ]
  };

  // ============================================
  // DATA: Panic responses (immediate, no processing)
  // ============================================
  
  const panicResponses = [
    "Where are you with meetings?",
    "Have you called anyone today?",
    "Have you done your stepwork?"
  ];

  // ============================================
  // DATA: Thoughts during processing
  // ============================================
  
  const thoughts = [
    "Oh, this again…",
    "This should be good.",
    "I'm listening. Regretfully.",
    "Go on.",
    "Let's unpack that.",
    "Interesting opening statement."
  ];

  // ============================================
  // DATA: Diagnostics
  // ============================================
  
  const diagnostics = [
    "Meeting attendance below baseline.",
    "Calls: avoiding.",
    "Step work suspiciously quiet.",
    "Self-awareness buffering…",
    "Emotional volume: high.",
    "Main character syndrome detected.",
    "Prayer",
    "Stepwork",
    "Meeting attendance",
    "Make phone calls",
    "Be of service"
  ];

  // ============================================
  // DOM Elements
  // ============================================
  
  const categoryButtons = document.querySelectorAll('.category-btn');
  const panicBtn = document.getElementById('panic-btn');
  const processingSection = document.getElementById('processing-section');
  const speechBubble = document.getElementById('speech-bubble');
  const sponsorResponse = document.getElementById('sponsor-response');
  const diagnosticLine = document.getElementById('diagnostic-line');
  const sponsorAvatar = document.getElementById('sponsor-avatar');
  const thoughtBubble = document.getElementById('thought-bubble');
  const thoughtText = document.getElementById('thought-text');

  // ============================================
  // State: Track used responses per category
  // ============================================
  
  const usedResponses = {};
  let panicIndex = 0;
  
  // Initialize tracking for each category
  Object.keys(responsePools).forEach(category => {
    usedResponses[category] = [];
  });

  // ============================================
  // Utility Functions
  // ============================================
  
  function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Get a random unused response from a category
   * Resets when all responses have been used
   * @param {string} category - The category key
   * @returns {string} A response that hasn't been used yet
   */
  function getUnusedResponse(category) {
    const pool = responsePools[category];
    const used = usedResponses[category];
    
    // If all responses used, reset the tracking
    if (used.length >= pool.length) {
      usedResponses[category] = [];
    }
    
    // Get available (unused) responses
    const available = pool.filter((_, index) => !usedResponses[category].includes(index));
    
    // Pick a random one from available
    const randomIndex = Math.floor(Math.random() * available.length);
    const response = available[randomIndex];
    
    // Track this response as used (by its original index)
    const originalIndex = pool.indexOf(response);
    usedResponses[category].push(originalIndex);
    
    return response;
  }

  function getRandomDelay() {
    // 2 to 4 seconds
    return Math.floor(Math.random() * 2000) + 2000;
  }

  function setButtonsDisabled(disabled) {
    categoryButtons.forEach(btn => btn.disabled = disabled);
    panicBtn.disabled = disabled;
  }

  // ============================================
  // Thought Bubble
  // ============================================
  
  function showThought() {
    thoughtText.textContent = getRandomItem(thoughts);
    thoughtBubble.classList.remove('hidden', 'fade-out');
    void thoughtBubble.offsetWidth;
    thoughtBubble.classList.add('visible');
  }

  function hideThought() {
    thoughtBubble.classList.remove('visible');
    thoughtBubble.classList.add('fade-out');
    setTimeout(() => {
      thoughtBubble.classList.add('hidden');
      thoughtBubble.classList.remove('fade-out');
    }, 300);
  }

  // ============================================
  // Processing State
  // ============================================
  
  function showProcessing() {
    speechBubble.classList.add('hidden');
    diagnosticLine.classList.add('hidden');
    processingSection.classList.remove('hidden');
    setButtonsDisabled(true);
    
    sponsorAvatar.classList.remove('responding');
    sponsorAvatar.classList.add('processing');
    
    showThought();
  }

  function showResponse(responseText) {
    processingSection.classList.add('hidden');
    hideThought();
    
    sponsorAvatar.classList.remove('processing');
    sponsorAvatar.classList.add('responding');
    
    sponsorResponse.textContent = responseText;
    diagnosticLine.textContent = getRandomItem(diagnostics);
    
    speechBubble.classList.remove('hidden');
    diagnosticLine.classList.remove('hidden');
    setButtonsDisabled(false);
    
    setTimeout(() => {
      sponsorAvatar.classList.remove('responding');
    }, 500);
  }

  // ============================================
  // Main Flow
  // ============================================
  
  /**
   * Run the main response flow for a category
   * @param {string} category - The category key
   */
  function runFlow(category) {
    const pool = responsePools[category];
    if (!pool || pool.length === 0) {
      console.error('Invalid category:', category);
      return;
    }
    
    const responseText = getUnusedResponse(category);
    
    console.log({ category, response: responseText, usedCount: usedResponses[category].length, totalInPool: pool.length });
    
    showProcessing();
    
    const delay = getRandomDelay();
    setTimeout(() => showResponse(responseText), delay);
  }

  /**
   * Handle panic button - immediate response, no processing, no diagnostic
   * Goes through responses in order, loops back to start
   */
  function handlePanic() {
    const responseText = panicResponses[panicIndex];
    
    // Move to next, loop back if at end
    panicIndex = (panicIndex + 1) % panicResponses.length;
    
    console.log({ action: 'panic', response: responseText, nextIndex: panicIndex });
    
    // Hide any existing content
    processingSection.classList.add('hidden');
    thoughtBubble.classList.add('hidden');
    diagnosticLine.classList.add('hidden');
    
    // Show response immediately (no diagnostic)
    sponsorAvatar.classList.add('responding');
    sponsorResponse.textContent = responseText;
    
    speechBubble.classList.remove('hidden');
    
    setTimeout(() => {
      sponsorAvatar.classList.remove('responding');
    }, 500);
  }

  // ============================================
  // Event Listeners
  // ============================================
  
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;
      runFlow(category);
    });
  });

  panicBtn.addEventListener('click', handlePanic);

})();
