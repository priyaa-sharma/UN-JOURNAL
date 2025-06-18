let currentEntryId = null;

document.addEventListener('DOMContentLoaded', function() {
  loadEntries();
});

function toggleMenu() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("show");
}

function loadEntries() {
  const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
  const entriesGrid = document.getElementById('entriesGrid');
  const emptyState = document.getElementById('emptyState');

  if (entries.length === 0) {
    entriesGrid.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  entriesGrid.style.display = 'grid';
  emptyState.style.display = 'none';

  entriesGrid.innerHTML = entries.map((entry, index) => {
    const date = new Date(entry.date);
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const preview = entry.content.length > 150 
      ? entry.content.substring(0, 150) + '...' 
      : entry.content;

    return `
      <div class="entry-card" onclick="openModal(${entry.id})" style="animation-delay: ${index * 0.1}s">
        <div class="entry-date">${formattedDate} at ${formattedTime}</div>
        <div class="entry-mood mood-${entry.mood}">${entry.mood}</div>
        ${entry.prompt ? `<div class="entry-prompt">"${entry.prompt}"</div>` : ''}
        <div class="entry-preview">${preview}</div>
        <div class="entry-stats">
          <span>${entry.wordCount} words</span>
          <span>${getReadingTime(entry.wordCount)} min read</span>
        </div>
      </div>
    `;
  }).join('');

  // Add staggered animation to cards
  const cards = entriesGrid.querySelectorAll('.entry-card');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.animation = `slideInUp 0.6s ease-out ${index * 0.1}s forwards`;
  });
}

function getReadingTime(wordCount) {
  return Math.max(1, Math.ceil(wordCount / 200));
}

function openModal(entryId) {
  const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
  const entry = entries.find(e => e.id === entryId);
  
  if (!entry) return;

  currentEntryId = entryId;

  const modal = document.getElementById('entryModal');
  const date = new Date(entry.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  document.getElementById('modalDate').textContent = `${formattedDate} at ${formattedTime}`;
  
  const moodBadge = document.getElementById('modalMood');
  moodBadge.textContent = entry.mood;
  moodBadge.className = `mood-badge mood-${entry.mood}`;
  
  const promptElement = document.getElementById('modalPrompt');
  if (entry.prompt && entry.mood !== 'freewrite') {
    promptElement.textContent = `"${entry.prompt}"`;
    promptElement.style.display = 'block';
  } else {
    promptElement.style.display = 'none';
  }
  
  document.getElementById('modalContent').textContent = entry.content;
  document.getElementById('modalWordCount').textContent = entry.wordCount;

  modal.style.display = 'block';
  
  // Close modal when clicking outside
  modal.onclick = function(event) {
    if (event.target === modal) {
      closeModal();
    }
  };
}

function closeModal() {
  const modal = document.getElementById('entryModal');
  modal.style.animation = 'fadeOut 0.3s ease-out forwards';
  setTimeout(() => {
    modal.style.display = 'none';
    modal.style.animation = '';
    currentEntryId = null;
  }, 300);
}

function deleteEntry() {
  if (!currentEntryId) return;

  if (confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
    let entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    entries = entries.filter(entry => entry.id !== currentEntryId);
    localStorage.setItem('journalEntries', JSON.stringify(entries));
    
    closeModal();
    loadEntries();
    showNotification('Entry deleted successfully.', 'success');
  }
}

// Enhanced notification system
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
    notification.style.background = "linear-gradient(135deg, #4caf50, #45a049)";
  } else if (type === "warning") {
    notification.style.background = "linear-gradient(135deg, #ff9800, #f57c00)";
  } else {
    notification.style.background = "linear-gradient(135deg, #2196f3, #1976d2)";
  }

  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.5s ease-out forwards";
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeModal();
  }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeOut {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.95);
    }
  }
  
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