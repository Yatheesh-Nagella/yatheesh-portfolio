/**
 * Email Components and Templates Exports
 * Central export file for all email-related components
 */

// Export base components
export { EmailLayout } from './components/EmailLayout';
export { Header } from './components/Header';
export { Footer } from './components/Footer';
export { Button } from './components/Button';

// Export email templates
export { default as WelcomeEmail } from './templates/WelcomeEmail';
export { default as AccountCreatedEmail } from './templates/AccountCreatedEmail';
export { default as PasswordResetEmail } from './templates/PasswordResetEmail';
export { default as PlaidItemErrorEmail } from './templates/PlaidItemErrorEmail';
export { default as InviteCodeEmail } from './templates/InviteCodeEmail';

// Additional templates to be added:
// export { default as BudgetAlertEmail } from './templates/BudgetAlertEmail';
