#!/usr/bin/env node
/**
 * Phase 7 Email System Testing Helper
 *
 * Quick test runner for common Phase 7 operations
 * Run: node test-phase7.js [command]
 */

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = 'http://localhost:3000';
const ADMIN_URL = 'http://admin.localhost:3000';
const FINANCE_URL = 'http://finance.localhost:3000';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'blue');
  console.log('='.repeat(60) + '\n');
}

// Helper to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    const req = protocol.request(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

// Test: Environment Variables
async function testEnvVars() {
  logSection('Testing Environment Variables');

  try {
    const { env } = require('./lib/env');

    log('✓ SUPABASE_URL: ' + (env.supabase.url ? 'Set' : 'Missing'), env.supabase.url ? 'green' : 'red');
    log('✓ SUPABASE_ANON_KEY: ' + (env.supabase.anonKey ? 'Set' : 'Missing'), env.supabase.anonKey ? 'green' : 'red');
    log('✓ RESEND_API_KEY: ' + (env.email.apiKey ? 'Set' : 'Missing'), env.email.apiKey ? 'green' : 'red');
    log('✓ RESEND_FROM_EMAIL: ' + env.email.fromEmail, 'green');
    log('✓ CRON_SECRET: ' + (process.env.CRON_SECRET ? 'Set' : 'Missing'), process.env.CRON_SECRET ? 'green' : 'red');

    log('\n✅ Environment check complete', 'green');
  } catch (error) {
    log('❌ Error checking environment: ' + error.message, 'red');
  }
}

// Test: Budget Alerts Cron Job
async function testBudgetAlertsCron() {
  logSection('Testing Budget Alerts Cron Job');

  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    log('❌ CRON_SECRET not set in environment', 'red');
    log('Set it in .env file and try again', 'yellow');
    return;
  }

  try {
    log('Calling cron endpoint...', 'yellow');

    const result = await makeRequest(`${BASE_URL}/api/cron/budget-alerts`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${cronSecret}`,
      },
    });

    if (result.status === 200) {
      log('✅ Cron job executed successfully', 'green');
      console.log('\nResponse:', result.data);

      if (result.data.alerts_sent > 0) {
        log(`\n📧 ${result.data.alerts_sent} alert(s) sent`, 'green');
      }

      if (result.data.alerts_skipped > 0) {
        log(`⏭️  ${result.data.alerts_skipped} alert(s) skipped (already sent today or notifications disabled)`, 'yellow');
      }

      if (result.data.errors_count > 0) {
        log(`\n⚠️  ${result.data.errors_count} error(s) occurred`, 'red');
        console.log('Errors:', result.data.errors);
      }

      log(`\n⏱️  Execution time: ${result.data.duration_ms}ms`, 'blue');
    } else {
      log('❌ Cron job failed with status ' + result.status, 'red');
      console.log(result.data);
    }
  } catch (error) {
    log('❌ Error calling cron endpoint: ' + error.message, 'red');
    log('Make sure dev server is running: npm run dev', 'yellow');
  }
}

// Test: Cron Authentication
async function testCronAuth() {
  logSection('Testing Cron Authentication (Security)');

  try {
    log('Attempting to call cron without auth token...', 'yellow');

    const result = await makeRequest(`${BASE_URL}/api/cron/budget-alerts`, {
      method: 'GET',
    });

    if (result.status === 401) {
      log('✅ Unauthorized request correctly rejected', 'green');
      console.log('Response:', result.data);
    } else {
      log('❌ Security issue: Endpoint should return 401 without auth', 'red');
      console.log('Status:', result.status);
    }
  } catch (error) {
    log('❌ Error testing auth: ' + error.message, 'red');
  }
}

// Test: Send Test Email
async function testSendEmail(toEmail) {
  logSection('Testing Email Sending');

  if (!toEmail) {
    log('❌ Email address required', 'red');
    log('Usage: node test-phase7.js send-email your@email.com', 'yellow');
    return;
  }

  try {
    const { sendEmail } = require('./lib/email');

    log(`Sending test email to: ${toEmail}`, 'yellow');

    const result = await sendEmail({
      to: toEmail,
      subject: 'OneLibro Test Email',
      templateKey: 'welcome_email',
      templateProps: {
        user_name: 'Test User',
      },
      category: 'transactional',
    });

    if (result.success) {
      log('✅ Email sent successfully!', 'green');
      console.log('Email ID:', result.emailId);
      log('\nCheck your inbox (and spam folder)', 'blue');
    } else {
      log('❌ Failed to send email', 'red');
      console.log('Error:', result.error);
    }
  } catch (error) {
    log('❌ Error sending email: ' + error.message, 'red');
  }
}

// Test: Database Tables
async function testDatabase() {
  logSection('Testing Database Tables');

  try {
    const { createClient } = require('@supabase/supabase-js');
    const { env } = require('./lib/env');

    const supabase = createClient(env.supabase.url, env.supabase.anonKey);

    const tables = [
      'notification_preferences',
      'email_templates',
      'email_logs',
      'email_campaigns',
      'budget_alert_history',
    ];

    log('Checking Phase 7 tables...', 'yellow');

    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('id').limit(1);

      if (error && error.code === '42P01') {
        log(`❌ Table "${table}" does not exist`, 'red');
      } else if (error) {
        log(`⚠️  Table "${table}" exists but query failed: ${error.message}`, 'yellow');
      } else {
        log(`✓ Table "${table}" exists`, 'green');
      }
    }

    log('\n✅ Database check complete', 'green');
  } catch (error) {
    log('❌ Error checking database: ' + error.message, 'red');
  }
}

// Show help
function showHelp() {
  console.log(`
${colors.blue}OneLibro Phase 7 Testing Helper${colors.reset}

Usage: node test-phase7.js [command] [args]

Commands:
  env               Check environment variables
  db                Check database tables exist
  cron              Test budget alerts cron job
  auth              Test cron authentication (security)
  send-email        Send test email
                    Example: node test-phase7.js send-email your@email.com
  all               Run all tests (except send-email)
  help              Show this help message

Examples:
  node test-phase7.js env
  node test-phase7.js cron
  node test-phase7.js send-email test@example.com
  node test-phase7.js all

${colors.yellow}Note: Make sure dev server is running before testing${colors.reset}
  `);
}

// Run all tests
async function runAll() {
  await testEnvVars();
  await testDatabase();
  await testCronAuth();
  await testBudgetAlertsCron();

  logSection('All Tests Complete');
  log('✅ Testing complete! Check results above', 'green');
  log('\nFor detailed testing instructions, see: PHASE7_TESTING_GUIDE.md', 'blue');
}

// Main
async function main() {
  const command = process.argv[2];
  const arg = process.argv[3];

  switch (command) {
    case 'env':
      await testEnvVars();
      break;
    case 'db':
      await testDatabase();
      break;
    case 'cron':
      await testBudgetAlertsCron();
      break;
    case 'auth':
      await testCronAuth();
      break;
    case 'send-email':
      await testSendEmail(arg);
      break;
    case 'all':
      await runAll();
      break;
    case 'help':
    default:
      showHelp();
      break;
  }
}

main().catch((error) => {
  log('\n❌ Fatal error: ' + error.message, 'red');
  console.error(error);
  process.exit(1);
});
