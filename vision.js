document.addEventListener("DOMContentLoaded", function () {
  const boardColumns = document.getElementById("boardColumns");

  // Enhanced drag and drop functionality
  boardColumns.addEventListener("dragstart", function (e) {
    if (e.target.classList.contains("board-item")) {
      e.dataTransfer.setData("text/plain", e.target.id);
      e.target.style.opacity = "0.5";
    }
  });

  boardColumns.addEventListener("dragend", function (e) {
    if (e.target.classList.contains("board-item")) {
      e.target.style.opacity = "1";
    }
  });

  boardColumns.addEventListener("dragover", function (e) {
    e.preventDefault();
    const dropTarget = e.target.closest(".board-column");
    if (dropTarget) {
      dropTarget.style.background = "rgba(255, 255, 255, 0.7)";
    }
  });

  boardColumns.addEventListener("dragleave", function (e) {
    const dropTarget = e.target.closest(".board-column");
    if (dropTarget) {
      dropTarget.style.background = "rgba(255, 255, 255, 0.5)";
    }
  });

  boardColumns.addEventListener("drop", function (e) {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    const draggedEl = document.getElementById(draggedId);
    const dropTarget = e.target.closest(".board-column");

    if (dropTarget && draggedEl) {
      dropTarget.appendChild(draggedEl);
      dropTarget.style.background = "rgba(255, 255, 255, 0.5)";
      
      // Add success animation
      draggedEl.style.animation = "none";
      setTimeout(() => {
        draggedEl.style.animation = "slideInUp 0.5s ease-out";
      }, 10);
    }
  });

  // Load saved boards on page load
  loadSavedBoards();
});

let currentCategory = "";
const boardColumns = document.getElementById("boardColumns");

function selectCategory(category) {
  currentCategory = category;

  // Remove previous selection highlight
  document.querySelectorAll(".theme-buttons button").forEach((btn) =>
    btn.classList.remove("selected")
  );

  // Add highlight to the selected one
  const activeBtn = document.querySelector(
    `.theme-buttons button[onclick="selectCategory('${category}')"]`
  );
  if (activeBtn) {
    activeBtn.classList.add("selected");
    
    // Add selection animation
    activeBtn.style.animation = "none";
    setTimeout(() => {
      activeBtn.style.animation = "pulse 0.6s ease-out";
    }, 10);
  }

  let column = document.getElementById(category);
  if (!column) {
    column = createNewColumn(category);
    boardColumns.appendChild(column);
    
    // Add creation animation
    column.style.animation = "slideInUp 0.6s ease-out";
  }

  // Scroll to the selected column
  column.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function createNewColumn(category) {
  const column = document.createElement("div");
  column.className = "board-column";
  column.id = category;

  // Enhanced title with emoji
  const title = document.createElement("h3");
  const categoryEmojis = {
    inspirational: "✨",
    career: "💼",
    love: "💕",
    travel: "🌍",
    food: "🍃",
    photography: "📸",
    music: "🎵",
    wellness: "🧘",
    fashion: "👗",
    randoms: "🌈"
  };
  
  const emoji = categoryEmojis[category] || "🌟";
  title.textContent = `${emoji} ${category.charAt(0).toUpperCase() + category.slice(1)}`;
  column.appendChild(title);

  // Enhanced dropdown for delete options
  const deleteWrapper = document.createElement("div");
  deleteWrapper.className = "delete-dropdown";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-all-icon";
  deleteBtn.innerHTML = "🗑️";
  deleteBtn.title = "Board Options";

  const dropdown = document.createElement("div");
  dropdown.className = "delete-menu";

  const deleteCards = document.createElement("div");
  deleteCards.innerHTML = "🗑️ Clear All Items";
  deleteCards.onclick = () => {
    if (confirm(`Are you sure you want to clear all items from ${category}?`)) {
      const items = column.querySelectorAll(".board-item");
      items.forEach((item, index) => {
        setTimeout(() => {
          item.style.animation = "fadeOut 0.3s ease-out forwards";
          setTimeout(() => item.remove(), 300);
        }, index * 100);
      });
      saveBoardsToStorage();
    }
    dropdown.classList.remove("visible");
  };

  const deleteCategory = document.createElement("div");
  deleteCategory.innerHTML = "❌ Delete Board";
  deleteCategory.onclick = () => {
    if (confirm(`Are you sure you want to delete the entire ${category} board?`)) {
      column.style.animation = "fadeOut 0.5s ease-out forwards";
      setTimeout(() => {
        column.remove();
        if (currentCategory === category) currentCategory = "";
        saveBoardsToStorage();
      }, 500);
    }
    dropdown.classList.remove("visible");
  };

  const exportBoard = document.createElement("div");
  exportBoard.innerHTML = "📤 Export Board";
  exportBoard.onclick = () => {
    exportBoardAsJSON(category);
    dropdown.classList.remove("visible");
  };

  dropdown.appendChild(deleteCards);
  dropdown.appendChild(deleteCategory);
  dropdown.appendChild(exportBoard);
  deleteWrapper.appendChild(deleteBtn);
  deleteWrapper.appendChild(dropdown);
  column.appendChild(deleteWrapper);

  // Toggle dropdown visibility
  deleteBtn.onclick = (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("visible");
  };

  // Close dropdown on click outside
  document.addEventListener("click", () =>
    dropdown.classList.remove("visible")
  );

  return column;
}

function addToBoard() {
  const imageInput = document.getElementById("imageUpload");
  const quoteInput = document.getElementById("quoteInput");

  if (!currentCategory) {
    showNotification("Please select a category first! 💕", "warning");
    return;
  }

  if (!imageInput.files[0] && !quoteInput.value.trim()) {
    showNotification("Please add an image or text to create your mood item! ✨", "warning");
    return;
  }

  const column = document.getElementById(currentCategory);
  if (!column) return;

  const item = document.createElement("div");
  item.className = "board-item";
  item.draggable = true;
  item.id = "item-" + Date.now();

  // Enhanced delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "×";
  deleteBtn.className = "delete-btn";
  deleteBtn.title = "Remove item";
  deleteBtn.onclick = (e) => {
    e.stopPropagation();
    if (confirm("Remove this item from your mood board?")) {
      item.style.animation = "fadeOut 0.3s ease-out forwards";
      setTimeout(() => {
        item.remove();
        saveBoardsToStorage();
      }, 300);
    }
  };
  item.appendChild(deleteBtn);

  // Enhanced drag icon
  const dragIcon = document.createElement("div");
  dragIcon.className = "drag-icon";
  dragIcon.textContent = "⋮⋮";
  dragIcon.title = "Drag to move";
  item.appendChild(dragIcon);

  if (imageInput.files && imageInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.alt = "Mood board image";
      item.appendChild(img);

      if (quoteInput.value.trim() !== "") {
        const quote = document.createElement("p");
        quote.textContent = quoteInput.value;
        item.appendChild(quote);
      }

      column.appendChild(item);
      
      // Add creation animation
      item.style.animation = "slideInUp 0.5s ease-out";
      
      resetInputs();
      saveBoardsToStorage();
      showNotification("Added to your mood board! 🎉", "success");
    };
    reader.readAsDataURL(imageInput.files[0]);
  } else if (quoteInput.value.trim() !== "") {
    const quote = document.createElement("p");
    quote.textContent = quoteInput.value;
    item.appendChild(quote);
    
    // Add emoji for text-only items
    const textIcon = document.createElement("div");
    textIcon.style.fontSize = "2rem";
    textIcon.style.marginBottom = "10px";
    textIcon.textContent = "💭";
    item.insertBefore(textIcon, quote);
    
    column.appendChild(item);
    
    // Add creation animation
    item.style.animation = "slideInUp 0.5s ease-out";
    
    resetInputs();
    saveBoardsToStorage();
    showNotification("Added to your mood board! 🎉", "success");
  }
}

function resetInputs() {
  document.getElementById("imageUpload").value = "";
  document.getElementById("quoteInput").value = "";
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

// Local storage functionality
function saveBoardsToStorage() {
  const boards = {};
  document.querySelectorAll('.board-column').forEach(column => {
    const category = column.id;
    const items = [];
    
    column.querySelectorAll('.board-item').forEach(item => {
      const img = item.querySelector('img');
      const text = item.querySelector('p');
      
      items.push({
        id: item.id,
        image: img ? img.src : null,
        text: text ? text.textContent : null
      });
    });
    
    boards[category] = items;
  });
  
  localStorage.setItem('moodBoards', JSON.stringify(boards));
}

function loadSavedBoards() {
  const savedBoards = localStorage.getItem('moodBoards');
  if (!savedBoards) return;
  
  const boards = JSON.parse(savedBoards);
  
  Object.keys(boards).forEach(category => {
    if (boards[category].length > 0) {
      const column = createNewColumn(category);
      boardColumns.appendChild(column);
      
      boards[category].forEach(itemData => {
        const item = document.createElement("div");
        item.className = "board-item";
        item.draggable = true;
        item.id = itemData.id;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "×";
        deleteBtn.className = "delete-btn";
        deleteBtn.onclick = (e) => {
          e.stopPropagation();
          if (confirm("Remove this item from your mood board?")) {
            item.remove();
            saveBoardsToStorage();
          }
        };
        item.appendChild(deleteBtn);

        const dragIcon = document.createElement("div");
        dragIcon.className = "drag-icon";
        dragIcon.textContent = "⋮⋮";
        item.appendChild(dragIcon);

        if (itemData.image) {
          const img = document.createElement("img");
          img.src = itemData.image;
          item.appendChild(img);
        } else if (itemData.text) {
          const textIcon = document.createElement("div");
          textIcon.style.fontSize = "2rem";
          textIcon.style.marginBottom = "10px";
          textIcon.textContent = "💭";
          item.appendChild(textIcon);
        }

        if (itemData.text) {
          const quote = document.createElement("p");
          quote.textContent = itemData.text;
          item.appendChild(quote);
        }

        column.appendChild(item);
      });
    }
  });
}

// Export functionality
function exportBoardAsJSON(category) {
  const column = document.getElementById(category);
  if (!column) return;
  
  const items = [];
  column.querySelectorAll('.board-item').forEach(item => {
    const img = item.querySelector('img');
    const text = item.querySelector('p');
    
    items.push({
      image: img ? img.src : null,
      text: text ? text.textContent : null,
      timestamp: new Date().toISOString()
    });
  });
  
  const exportData = {
    category: category,
    items: items,
    exportDate: new Date().toISOString()
  };
  
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], {type: 'application/json'});
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `mood-board-${category}-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  showNotification(`${category} board exported! 📤`, "success");
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
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
      transform: scale(0.8);
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
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;
document.head.appendChild(style);