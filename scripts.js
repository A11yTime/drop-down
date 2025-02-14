// Access the button and menu
const dropdownButton = document.getElementById('dropdownButton');
const dropdownMenu = document.getElementById('dropdown');

// Get all the option elements
const options = Array.from(dropdownMenu.querySelectorAll('li'));

// Toggle dropdown visibility on button click or key press
dropdownButton.addEventListener('click', toggleDropdown);
dropdownButton.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault(); // Prevent default behavior (like scrolling on Spacebar)
    toggleDropdown();
  }
});

// Toggle the dropdown state and update aria-expanded
function toggleDropdown() {
  const isExpanded = dropdownMenu.getAttribute('aria-expanded') === 'true';
  dropdownMenu.setAttribute('aria-expanded', !isExpanded);
  setRovingTabindex();  // Adjust tabindex when dropdown is toggled
}

// Close the dropdown when clicking outside of it
document.addEventListener('click', (event) => {
  if (!dropdownButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
    dropdownMenu.setAttribute('aria-expanded', 'false');
    setRovingTabindex();  // Reset tabindex when dropdown is closed
  }
});

// Allow keyboard navigation in the dropdown
dropdownButton.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    focusNextOption();
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    focusPrevOption();
  } else if (event.key === 'Escape') {
    dropdownMenu.setAttribute('aria-expanded', 'false');
    setRovingTabindex();  // Reset tabindex when dropdown is closed
    dropdownButton.focus();
  }
});

// Focus the next option
function focusNextOption() {
  const currentIndex = options.findIndex(option => option === document.activeElement);
  const nextIndex = (currentIndex + 1) % options.length;
  options[nextIndex].focus();
  setRovingTabindex();  // Update tabindex when navigating to the next option
}

// Focus the previous option
function focusPrevOption() {
  const currentIndex = options.findIndex(option => option === document.activeElement);
  const prevIndex = (currentIndex - 1 + options.length) % options.length;
  options[prevIndex].focus();
  setRovingTabindex();  // Update tabindex when navigating to the previous option
}

// Toggle selection for the currently focused option
function toggleSelection() {
  const currentOption = document.activeElement;
  const isSelected = currentOption.getAttribute('aria-selected') === 'true';
  currentOption.setAttribute('aria-selected', !isSelected);
  updateButtonText();
}

// Update the dropdown button text with selected options
function updateButtonText() {
  const selectedOptions = options.filter(option => option.getAttribute('aria-selected') === 'true')
    .map(option => option.textContent.trim());
  if (selectedOptions.length > 0) {
    dropdownButton.textContent = selectedOptions.join(', ');
  } else {
    dropdownButton.textContent = 'Select Options';
  }
}

// Set roving tabindex for the options
function setRovingTabindex() {
  // If the dropdown is open, manage tabindex for the options
  if (dropdownMenu.getAttribute('aria-expanded') === 'true') {
    // Set all options to tabindex="-1"
    options.forEach(option => {
      option.setAttribute('tabindex', '-1');
    });

    // Ensure the focused option has tabindex="0"
    const focusedOption = options.find(option => option === document.activeElement);
    if (focusedOption) {
      focusedOption.setAttribute('tabindex', '0');
    }
  } else {
    // If dropdown is closed, ensure all options have tabindex="-1"
    options.forEach(option => {
      option.setAttribute('tabindex', '-1');
    });
  }
}

// Allow mouse click to toggle selection
dropdownMenu.addEventListener('click', (event) => {
  const option = event.target.closest('li');
  if (option && option.getAttribute('role') === 'option') {
    const isSelected = option.getAttribute('aria-selected') === 'true';
    option.setAttribute('aria-selected', !isSelected);
    updateButtonText();
  }
});

// Set tabindex initially when the dropdown is closed
setRovingTabindex();
