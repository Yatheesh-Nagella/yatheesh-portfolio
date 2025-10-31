export const pageview = (url) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-CW7Y84LP7M', {
      page_path: url,
    });
  }
};

export const event = ({ action, category, label, value }) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Specific tracking functions
export const trackProjectClick = (projectName, url) => {
  event({
    action: 'click',
    category: 'Projects',
    label: `${projectName} - ${url}`,
    value: 1,
  });
};

export const trackSectionView = (sectionName) => {
  event({
    action: 'view',
    category: 'Navigation',
    label: sectionName,
    value: 1,
  });
};

export const trackContactClick = () => {
  event({
    action: 'click',
    category: 'Contact',
    label: 'Get in Touch Button',
    value: 1,
  });
};

export const trackSocialClick = (platform) => {
  event({
    action: 'click',
    category: 'Social',
    label: platform,
    value: 1,
  });
};

// Tutorial-specific tracking functions
export const trackTutorialView = (tutorialName, step) => {
  event({
    action: 'view',
    category: 'Tutorial',
    label: `${tutorialName} - Step ${step}`,
    value: 1,
  });
};

export const trackCodeCopy = (snippetTitle) => {
  event({
    action: 'code_copy',
    category: 'Tutorial',
    label: snippetTitle,
    value: 1,
  });
};

export const trackTutorialAction = (action, label) => {
  event({
    action: action,
    category: 'Tutorial',
    label: label,
    value: 1,
  });
};

export const trackTutorialNavigation = (destination) => {
  event({
    action: 'navigation',
    category: 'Tutorial',
    label: destination,
    value: 1,
  });
};

export const trackTutorialShare = (platform) => {
  event({
    action: 'social_share',
    category: 'Tutorial',
    label: platform,
    value: 1,
  });
};