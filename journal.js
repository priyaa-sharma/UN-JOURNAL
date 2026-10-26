const prompts = {
  hopeful: [
    "What dream are you quietly holding close to your heart today?",
    "When did you last feel a spark of light inside your chest?",
    "Describe a moment where you believed in something bigger than the sadness.",
    "What does healing feel like today?",
    "What part of you is still trying to grow back?",
    "What would you say to the version of yourself that almost gave up?",
    "Who or what reminds you that softness is strength?",
    "What future version of you are you writing for?",
    "What does love look like when it's safe?",
    "When did you surprise yourself with your strength?",
    "What do you want to feel when you wake up tomorrow?",
    "Write a letter to your future self who made it.",
    "What is a quiet moment that felt like a small miracle?",
    "What would you tell someone who's losing hope?",
    "Describe the feeling of choosing yourself for the first time."
  ],
  melancholic: [
    "What memory keeps playing in the background of your thoughts?",
    "If your sadness had a color, what would it look like today?",
    "What do you miss that you're afraid to say out loud?",
    "What did you leave behind when you stopped loving them?",
    "When did silence feel louder than words?",
    "Describe the moment something inside you quietly broke.",
    "Whose voice do you still hear in empty rooms?",
    "What's the thing you wish they'd asked you before they walked away?",
    "If your sadness had a shape, what would it look like today?",
    "Write about a goodbye you never got to give.",
    "What secret are you carrying that feels too heavy for your chest?",
    "What's a lie you've told yourself to survive?",
    "Who do you still write poems about in your mind?",
    "What would you say to the part of you that's still waiting?",
    "Describe the weight of loving someone who can't love you back."
  ],
  nostalgic: [
    "Write about a room you once knew by heart.",
    "What scent brings someone back to you instantly?",
    "What piece of your childhood still whispers to you?",
    "Write about the way your bedroom felt when you were 15.",
    "What song unlocks a memory you didn't know you buried?",
    "What does your younger self miss about you now?",
    "Describe the smell of someone you used to love.",
    "When did laughter stop feeling safe?",
    "What piece of clothing do you still keep for no reason?",
    "Who taught you to hold in your tears?",
    "What moment from your childhood haunts you in silence?",
    "What's the photo you can't delete, but can't look at either?",
    "Who was your first heartbreak and how did it echo?",
    "What tradition did your family have that you miss?",
    "Write about a place that doesn't exist anymore but lives in your heart."
  ],
  anxious: [
    "What thought keeps circling in your mind like a bird that won't land?",
    "If your fear could write you a letter, what would it say?",
    "What would calm feel like right now, if you could paint it?",
    "What memory replays at night when you're trying to sleep?",
    "What if the worst thing you think about yourself isn't true?",
    "Who do you pretend to be when you're scared?",
    "What would it mean to be truly seen without judgment?",
    "If you could stop time, what moment would you freeze?",
    "What fear are you hiding behind your smile?",
    "What do you wish people understood when you go quiet?",
    "What truth do you avoid because it hurts too much?",
    "What would happen if you forgave yourself for the thing you hate?",
    "What are you running from that still finds you?",
    "Describe the feeling of your chest when worry takes over.",
    "What would you do if you knew you were enough, exactly as you are?"
  ],
  freewrite: [
    "Take your time. Spill the silence you never learned to scream :)",
    "Let your thoughts flow like water finding its way to the sea.",
    "Write without thinking. Let your heart speak first.",
    "What's been sitting in your chest, waiting to be released?",
    "Pour out everything that's been too heavy to carry alone."
  ]
};

let currentMood = '';
let currentPrompt = '';


document.addEventListener('DOMContentLoaded', function() {
  const dateElement = document.getElementById('date');
  const today = new Date();
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  dateElement.textContent = today.toLocaleDateString('en-US', options);
});

function selectMood(mood) {
  const promptBox = document.getElementById('promptBox');
  const journalEntry = document.getElementById('journalEntry');

  if (!promptBox || !journalEntry) {
    console.log("PromptBox or journalEntry not found!");
    return;
  }

  currentMood = mood;

  
  document.querySelectorAll('.mood-button').forEach(btn => {
    btn.classList.remove('active');
  });

  
  event.target.classList.add('active');

  if (mood === 'freewrite') {
    const freewritePrompts = prompts.freewrite;
    currentPrompt = freewritePrompts[Math.floor(Math.random() * freewritePrompts.length)];
    promptBox.textContent = currentPrompt;
  } else {
    const promptList = prompts[mood];
    const randomPrompt = promptList[Math.floor(Math.random() * promptList.length)];
    currentPrompt = randomPrompt;
    promptBox.textContent = randomPrompt;
  }

  journalEntry.placeholder = "Start writing here...";
  journalEntry.focus();

  
  promptBox.style.animation = 'none';
  setTimeout(() => {
    promptBox.style.animation = 'fadeInUp 0.6s ease-out';
  }, 10);
}

function toggleMenu() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("show");
}

function saveEntry() {
  const journalEntry = document.getElementById('journalEntry');
  const entryText = journalEntry.value.trim();

  if (!entryText) {
    showNotification('Please write something before saving your entry.', 'warning');
    return;
  }

  if (!currentMood) {
    showNotification('Please select a mood before saving your entry.', 'warning');
    return;
  }

  
  const entry = {
    id: Date.now(),
    date: new Date().toISOString(),
    mood: currentMood,
    prompt: currentPrompt,
    content: entryText,
    wordCount: entryText.split(/\s+/).filter(word => word.length > 0).length
  };

  
  let entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
  
  
  entries.unshift(entry);
  
  
  localStorage.setItem('journalEntries', JSON.stringify(entries));

  
  const saveBtn = document.querySelector('.save-btn');
  const originalHTML = saveBtn.innerHTML;
  saveBtn.innerHTML = '<span class="save-icon">✅</span> Entry Saved!';
  saveBtn.style.background = 'linear-gradient(135deg, #d2cc1f, #d2cc1f)';
  
  setTimeout(() => {
    saveBtn.innerHTML = originalHTML;
    saveBtn.style.background = 'linear-gradient(135deg, #e7dd23, #e7dd23, #e7dd23)';
    
    
    window.location.href = 'entries.html';
  }, 1500);

  showNotification('Your entry has been saved!', 'success');
}


function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 25px;
    border-radius: 50px;
    color: white;
    font-family: "Roboto Mono", monospace;
    font-weight: 500;
    z-index: 10000;
    animation: slideInRight 0.5s ease-out;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
  `;

  if (type === "success") {
    notification.style.background = "linear-gradient(135deg, #d2cc1f, #d2cc1f)";
  } else if (type === "warning") {
    notification.style.background = "linear-gradient(135deg, #d2cc1f, #d2cc1f)";
  } else {
    notification.style.background = "linear-gradient(135deg, #d2cc1f, #d2cc1f)";
  }

  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.5s ease-out forwards";
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}


const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideOutRight {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100px);
    }
  }
`;
document.head.appendChild(style);