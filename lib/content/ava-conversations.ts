export interface AvaNode {
  id: string;
  avaMessage: string;
  quickReplies?: string[];
  isTerminal?: boolean;
  autoFollowUp?: string;
  /** If set, use this follow-up when the last two AVA lines already showed products/subscriptions/pricing (avoid repeating). */
  autoFollowUpAlternate?: string;
  autoFollowUpDelay?: number;
}

export interface AvaIntent {
  keywords: string[];
  nodeId: string;
}

/** True if text looks like a product list, subscription line, or price (used to skip redundant relisting). */
const PRODUCT_SUBSCRIPTION_OR_PRICE = /•\s*(Revit|AutoCAD)|\$\d|\d+\s*\/\s*(mo|yr)/i;

/** @param lastTwoAvaTexts Last two AVA message bodies (oldest first). */
export function shouldSuppressDetailRepeat(lastTwoAvaTexts: string[]): boolean {
  return lastTwoAvaTexts.some((t) => PRODUCT_SUBSCRIPTION_OR_PRICE.test(t));
}

export const AVA_INTRO: AvaNode = {
  id: "intro",
  avaMessage:
    "Hi, I'm AVA — Autodesk Virtual Assistant. Subscriptions, downloads and installs, or account issues. What do you need?",
  quickReplies: ["Subscription help", "Download or install", "Account question"],
};

export const AVA_NODES: Record<string, AvaNode> = {
  // ─── Greetings ───
  "greeting": {
    id: "greeting",
    avaMessage:
      "Hi, I'm AVA. Subscriptions, downloads and installs, or account issues — what do you need?",
    quickReplies: ["Subscription help", "Download or install", "Account question"],
  },

  "more-help": {
    id: "more-help",
    avaMessage: "What can I help you with?",
    quickReplies: ["Subscription help", "Download or install", "Account question"],
  },

  // ═══════════════════════════════════════════
  // ─── Subscription path ───
  // ═══════════════════════════════════════════
  "sub-start": {
    id: "sub-start",
    avaMessage:
      "Subscriptions: renew, cancel, change plan, or billing?",
    quickReplies: ["Renew", "Cancel", "Change plan", "Billing question"],
  },

  // Renew
  "sub-renew": {
    id: "sub-renew",
    avaMessage:
      "Pulling up your subscriptions.",
    autoFollowUp: "sub-renew-result",
    autoFollowUpDelay: 2200,
  },
  "sub-renew-result": {
    id: "sub-renew-result",
    avaMessage:
      "Two active subscriptions:\n\n• Revit — monthly, renews June 14\n• AutoCAD LT — annual, renews Sept 1\n\nRenew one early?",
    quickReplies: ["Renew Revit", "Renew AutoCAD LT", "Both", "Neither, something else"],
  },
  "sub-renew-confirm": {
    id: "sub-renew-confirm",
    avaMessage:
      "Processing renewal.",
    autoFollowUp: "sub-renew-done",
    autoFollowUpDelay: 1800,
  },
  "sub-renew-done": {
    id: "sub-renew-done",
    avaMessage:
      "Done. Confirmation email is on the way. Anything else?",
    quickReplies: ["Yes, something else", "No, that's all"],
  },

  // Cancel
  "sub-cancel": {
    id: "sub-cancel",
    avaMessage:
      "Pulling up your subscriptions.",
    autoFollowUp: "sub-cancel-result",
    autoFollowUpDelay: 2000,
  },
  "sub-cancel-result": {
    id: "sub-cancel-result",
    avaMessage:
      "Active subscriptions:\n\n• Revit — monthly ($35/mo), renews June 14\n• AutoCAD LT — annual ($229/yr), renews Sept 1\n\nWhich should I cancel?",
    quickReplies: ["Cancel Revit", "Cancel AutoCAD LT", "Actually, nevermind"],
  },
  "sub-cancel-process": {
    id: "sub-cancel-process",
    avaMessage:
      "Processing cancellation. You keep access through the end of this billing period.",
    autoFollowUp: "sub-cancel-done",
    autoFollowUpDelay: 2200,
  },
  "sub-cancel-done": {
    id: "sub-cancel-done",
    avaMessage:
      "Canceled. Access through period end; local files stay on your machine. Anything else?",
    quickReplies: ["Yes, something else", "No, that's all"],
  },

  // Change plan
  "sub-change": {
    id: "sub-change",
    avaMessage:
      "Pulling up your plans.",
    autoFollowUp: "sub-change-result",
    autoFollowUpDelay: 2000,
  },
  "sub-change-result": {
    id: "sub-change-result",
    avaMessage:
      "You're on:\n\n• Revit — monthly ($35/mo)\n• AutoCAD LT — annual ($229/yr)\n\nChange billing cycle or switch products?",
    quickReplies: ["Change billing cycle", "Switch products", "Something else"],
  },
  "sub-change-cycle": {
    id: "sub-change-cycle",
    avaMessage:
      "One moment.",
    autoFollowUp: "sub-change-cycle-result",
    autoFollowUpAlternate: "sub-change-cycle-result-prompt",
    autoFollowUpDelay: 1800,
  },
  "sub-change-cycle-result": {
    id: "sub-change-cycle-result",
    avaMessage:
      "You're on:\n\n• Revit — monthly ($35/mo)\n• AutoCAD LT — annual ($229/yr)\n\nWhich should I switch?",
    quickReplies: ["Switch Revit to annual", "Switch AutoCAD LT to monthly", "Something else"],
  },
  "sub-change-cycle-result-prompt": {
    id: "sub-change-cycle-result-prompt",
    avaMessage:
      "Which product should I switch?\n\nRevit annually to $299/yr\nAutoCAD LT monthly to $22/mo",
    quickReplies: ["Switch Revit to annual", "Switch AutoCAD LT to monthly", "Something else"],
  },
  "sub-change-to-annual": {
    id: "sub-change-to-annual",
    avaMessage:
      "Switching Revit to annual — $299/yr, about 29% less than a full year at the monthly rate ($420).",
    autoFollowUp: "sub-change-to-annual-done",
    autoFollowUpDelay: 2400,
  },
  "sub-change-to-annual-done": {
    id: "sub-change-to-annual-done",
    avaMessage:
      "Done. Revit is annual now, effective June 14. Anything else?",
    quickReplies: ["Yes, something else", "No, that's all"],
  },
  "sub-change-to-monthly": {
    id: "sub-change-to-monthly",
    avaMessage:
      "Switching AutoCAD LT to monthly at $22/mo.",
    autoFollowUp: "sub-change-to-monthly-done",
    autoFollowUpDelay: 2200,
  },
  "sub-change-to-monthly-done": {
    id: "sub-change-to-monthly-done",
    avaMessage:
      "Done. Monthly billing starts when your annual ends (Sept 1). Anything else?",
    quickReplies: ["Yes, something else", "No, that's all"],
  },
  "sub-change-product": {
    id: "sub-change-product",
    avaMessage:
      "Which subscription should I replace, and with what?",
    quickReplies: ["Replace Revit", "Replace AutoCAD LT", "Connect to support"],
  },
  "sub-change-product-replace": {
    id: "sub-change-product-replace",
    avaMessage:
      "That's cancel plus a new product — I'll connect you with someone who can price it and keep you online through the switch.",
    quickReplies: ["Connect to support", "Something else", "No, that's all"],
  },

  // Billing
  "sub-billing": {
    id: "sub-billing",
    avaMessage:
      "Pulling up billing.",
    autoFollowUp: "sub-billing-result",
    autoFollowUpDelay: 2200,
  },
  "sub-billing-result": {
    id: "sub-billing-result",
    avaMessage:
      "Recent charges:\n\n• May 14 — Revit monthly: $35.00\n• Apr 14 — Revit monthly: $35.00\n• Sept 1 — AutoCAD LT annual: $229.00\n\nWhich one?",
    quickReplies: ["Unexpected charge", "Need an invoice", "That's all I needed"],
  },
  "sub-billing-charge": {
    id: "sub-billing-charge",
    avaMessage:
      "Scanning for duplicate or odd charges.",
    autoFollowUp: "sub-billing-charge-result",
    autoFollowUpAlternate: "sub-billing-charge-result-compact",
    autoFollowUpDelay: 2400,
  },
  "sub-billing-charge-result": {
    id: "sub-billing-charge-result",
    avaMessage:
      "No duplicates. Revit monthly and AutoCAD LT annual match what I expect. Charge still doesn't look right? I can connect billing.",
    quickReplies: ["Connect to support", "Something else", "No, that's all"],
  },
  "sub-billing-charge-result-compact": {
    id: "sub-billing-charge-result-compact",
    avaMessage:
      "No duplicate charges. Still doesn't look right? I can connect billing.",
    quickReplies: ["Connect to support", "Something else", "No, that's all"],
  },
  "sub-billing-invoice": {
    id: "sub-billing-invoice",
    avaMessage:
      "Which invoice do you need?",
    quickReplies: ["Most recent", "All from this year", "Something else"],
  },
  "sub-billing-invoice-send": {
    id: "sub-billing-invoice-send",
    avaMessage:
      "Generating invoice.",
    autoFollowUp: "sub-billing-invoice-done",
    autoFollowUpDelay: 1800,
  },
  "sub-billing-invoice-done": {
    id: "sub-billing-invoice-done",
    avaMessage:
      "Sent to j.martinez@designstudio.com — PDF in a few minutes. Anything else?",
    quickReplies: ["Yes, something else", "No, that's all"],
  },

  // ═══════════════════════════════════════════
  // ─── Download / Install path ───
  // ═══════════════════════════════════════════
  "dl-start": {
    id: "dl-start",
    avaMessage:
      "Which product?",
    quickReplies: ["AutoCAD", "AutoCAD LT", "Revit", "Other product"],
  },
  "dl-autocad": {
    id: "dl-autocad",
    avaMessage:
      "Checking AutoCAD on your account.",
    autoFollowUp: "dl-autocad-result",
    autoFollowUpDelay: 1800,
  },
  "dl-autocad-result": {
    id: "dl-autocad-result",
    avaMessage:
      "No full AutoCAD here — you have AutoCAD LT (annual). Download LT or add AutoCAD?",
    quickReplies: ["Download AutoCAD LT", "Add AutoCAD subscription", "Something else"],
  },
  "dl-lt": {
    id: "dl-lt",
    avaMessage:
      "Checking AutoCAD LT.",
    autoFollowUp: "dl-lt-result",
    autoFollowUpDelay: 1800,
  },
  "dl-lt-result": {
    id: "dl-lt-result",
    avaMessage:
      "AutoCAD LT is active (annual, Sept 1). Specs: Windows 10/11 64-bit, 4 GB RAM, 6 GB disk. Start download?",
    quickReplies: ["Start download", "Check system requirements", "Something else"],
  },
  "dl-lt-download": {
    id: "dl-lt-download",
    avaMessage:
      "Starting AutoCAD LT download.",
    autoFollowUp: "dl-lt-download-done",
    autoFollowUpDelay: 2400,
  },
  "dl-lt-download-done": {
    id: "dl-lt-download-done",
    avaMessage:
      "Should show in your browser. Install usually runs 5–10 minutes. Anything else?",
    quickReplies: ["Yes, something else", "No, that's all"],
  },
  "dl-revit": {
    id: "dl-revit",
    avaMessage:
      "Checking Revit.",
    autoFollowUp: "dl-revit-result",
    autoFollowUpDelay: 1800,
  },
  "dl-revit-result": {
    id: "dl-revit-result",
    avaMessage:
      "Revit is active (monthly, June 14). Needs 16 GB RAM, 30 GB disk; install ~20–30 min. Start download?",
    quickReplies: ["Start download", "Check system requirements", "Something else"],
  },
  "dl-revit-download": {
    id: "dl-revit-download",
    avaMessage:
      "Starting Revit download.",
    autoFollowUp: "dl-revit-download-done",
    autoFollowUpDelay: 2800,
  },
  "dl-revit-download-done": {
    id: "dl-revit-download-done",
    avaMessage:
      "Large file — give it a minute. Run the installer as admin. Anything else?",
    quickReplies: ["Yes, something else", "No, that's all"],
  },
  "dl-other": {
    id: "dl-other",
    avaMessage:
      "Checking what you have licensed.",
    autoFollowUp: "dl-other-result",
    autoFollowUpDelay: 1800,
  },
  "dl-other-result": {
    id: "dl-other-result",
    avaMessage:
      "Licensed products:\n\n• Revit (monthly)\n• AutoCAD LT (annual)\n\nDownload one of these, or something else?",
    quickReplies: ["Download Revit", "Download AutoCAD LT", "Different product"],
  },
  "dl-error": {
    id: "dl-error",
    avaMessage:
      "Running a quick install check.",
    autoFollowUp: "dl-error-result",
    autoFollowUpDelay: 2800,
  },
  "dl-error-result": {
    id: "dl-error-result",
    avaMessage:
      "Two likely culprits:\n\n• Leftover installer files in temp\n• Antivirus blocking the installer\n\nI can clear temp. Pause antivirus and rerun the installer yourself. Clear temp now?",
    quickReplies: ["Yes, clear them", "Connect to support", "Something else"],
  },
  "dl-error-fix": {
    id: "dl-error-fix",
    avaMessage:
      "Clearing leftover installer files.",
    autoFollowUp: "dl-error-fix-done",
    autoFollowUpDelay: 2200,
  },
  "dl-error-fix-done": {
    id: "dl-error-fix-done",
    avaMessage:
      "Cleared. Retry as admin with antivirus off. Still failing? Send me the error code. Anything else?",
    quickReplies: ["Yes, something else", "No, that's all"],
  },
  "dl-wontstart": {
    id: "dl-wontstart",
    avaMessage:
      "Checking your licenses.",
    autoFollowUp: "dl-wontstart-result",
    autoFollowUpDelay: 2000,
  },
  "dl-wontstart-result": {
    id: "dl-wontstart-result",
    avaMessage:
      "Licenses look fine. Try Chrome or Edge, clear cache, or disable download blockers. Want me to push the download from here?",
    quickReplies: ["Yes, try it", "Connect to support", "Something else"],
  },
  "dl-wontstart-retry": {
    id: "dl-wontstart-retry",
    avaMessage:
      "Pushing download to your account.",
    autoFollowUp: "dl-wontstart-retry-done",
    autoFollowUpDelay: 2400,
  },
  "dl-wontstart-retry-done": {
    id: "dl-wontstart-retry-done",
    avaMessage:
      "Check your downloads folder. Still dead? Support can remote in. Anything else?",
    quickReplies: ["Connect to support", "Yes, something else", "No, that's all"],
  },
  "dl-sysreq": {
    id: "dl-sysreq",
    avaMessage:
      "Specs for your licenses:\n\n• Revit: Windows 10/11 64-bit, 16 GB RAM, 30 GB disk\n• AutoCAD LT: Windows 10/11 64-bit, 4 GB RAM, 6 GB disk\n\nAnything else?",
    quickReplies: ["Yes, something else", "No, that's all"],
  },

  // ═══════════════════════════════════════════
  // ─── Account path ───
  // ═══════════════════════════════════════════
  "acct-start": {
    id: "acct-start",
    avaMessage:
      "Password, email, permissions, or sign-in?",
    quickReplies: ["Reset password", "Update email", "Access permissions", "Can't sign in"],
  },
  "acct-password": {
    id: "acct-password",
    avaMessage:
      "Sending reset link to your email.",
    autoFollowUp: "acct-password-result",
    autoFollowUpDelay: 2000,
  },
  "acct-password-result": {
    id: "acct-password-result",
    avaMessage:
      "Sent to j.martinez@designstudio.com. Link expires in 24 hours. See it?",
    quickReplies: ["Yes, got it", "No email received", "Wrong email address"],
  },
  "acct-password-noemail": {
    id: "acct-password-noemail",
    avaMessage:
      "Resending and checking delivery.",
    autoFollowUp: "acct-password-noemail-result",
    autoFollowUpDelay: 2200,
  },
  "acct-password-noemail-result": {
    id: "acct-password-noemail-result",
    avaMessage:
      "Resent — check spam. Nothing in a few minutes? I can hand you off for a manual reset.",
    quickReplies: ["Connect to support", "Let me check spam first", "Something else"],
  },
  "acct-password-wrongemail": {
    id: "acct-password-wrongemail",
    avaMessage:
      "Updating a stale email needs verification — I'll connect you with account support.",
    quickReplies: ["Connect to support", "Something else"],
  },
  "acct-email": {
    id: "acct-email",
    avaMessage:
      "Registered email is j.martinez@designstudio.com. What should I change it to?",
    quickReplies: ["Type new email", "Actually, nevermind"],
  },
  "acct-email-update": {
    id: "acct-email-update",
    avaMessage:
      "Updating email. Verification goes to the new address.",
    autoFollowUp: "acct-email-done",
    autoFollowUpDelay: 2200,
  },
  "acct-email-done": {
    id: "acct-email-done",
    avaMessage:
      "Verification sent. Finish in that email; until then you can still sign in with the old one. Anything else?",
    quickReplies: ["Yes, something else", "No, that's all"],
  },
  "acct-signin": {
    id: "acct-signin",
    avaMessage:
      "Checking account status.",
    autoFollowUp: "acct-signin-result",
    autoFollowUpDelay: 2000,
  },
  "acct-signin-result": {
    id: "acct-signin-result",
    avaMessage:
      "Account is active. Sign-in trouble is usually password — want a reset link?",
    quickReplies: ["Send reset link", "It's something else", "Connect to support"],
  },
  "acct-permissions": {
    id: "acct-permissions",
    avaMessage:
      "Checking access.",
    autoFollowUp: "acct-permissions-result",
    autoFollowUpDelay: 1800,
  },
  "acct-permissions-result": {
    id: "acct-permissions-result",
    avaMessage:
      "You're primary admin — full user and product control. Add or remove someone?",
    quickReplies: ["Add a user", "Remove a user", "Something else"],
  },
  "acct-permissions-add": {
    id: "acct-permissions-add",
    avaMessage:
      "Email to invite?",
    quickReplies: ["Type email", "Connect to support", "Something else"],
  },
  "acct-permissions-invite": {
    id: "acct-permissions-invite",
    avaMessage:
      "Sending invite.",
    autoFollowUp: "acct-permissions-invite-done",
    autoFollowUpDelay: 1800,
  },
  "acct-permissions-invite-done": {
    id: "acct-permissions-invite-done",
    avaMessage:
      "Sent. Assign products after they accept. Anything else?",
    quickReplies: ["Yes, something else", "No, that's all"],
  },

  // ═══════════════════════════════════════════
  // ─── Pricing ───
  // ═══════════════════════════════════════════
  "sub-pricing": {
    id: "sub-pricing",
    avaMessage:
      "Pulling up your rates.",
    autoFollowUp: "sub-pricing-result",
    autoFollowUpDelay: 1800,
  },
  "sub-pricing-result": {
    id: "sub-pricing-result",
    avaMessage:
      "Current charges:\n\n• Revit — $35/mo ($420 over 12 months)\n• AutoCAD LT — $229/yr (~$19/mo)\n\nRevit annual is $299/yr — ~29% less than a full year at the monthly rate. Switch Revit to annual?",
    quickReplies: ["Yes, switch Revit to annual", "No thanks", "Something else"],
  },

  // ═══════════════════════════════════════════
  // ─── Refund ───
  // ═══════════════════════════════════════════
  "sub-cancel-refund": {
    id: "sub-cancel-refund",
    avaMessage:
      "Checking refund eligibility.",
    autoFollowUp: "sub-cancel-refund-result",
    autoFollowUpDelay: 2200,
  },
  "sub-cancel-refund-result": {
    id: "sub-cancel-refund-result",
    avaMessage:
      "Revit renewed 12 days ago — still inside 30 days. AutoCAD LT renewed in September — outside the window. Refund Revit?",
    quickReplies: ["Yes, refund Revit", "Connect to support", "No, that's all"],
  },
  "sub-refund-process": {
    id: "sub-refund-process",
    avaMessage:
      "Processing Revit refund.",
    autoFollowUp: "sub-refund-done",
    autoFollowUpDelay: 2400,
  },
  "sub-refund-done": {
    id: "sub-refund-done",
    avaMessage:
      "$35.00 back in 5–10 business days. Revit access through June 14. Anything else?",
    quickReplies: ["Yes, something else", "No, that's all"],
  },

  // ═══════════════════════════════════════════
  // ─── Shared terminal / transition nodes ───
  // ═══════════════════════════════════════════
  "end-thanks": {
    id: "end-thanks",
    avaMessage:
      "Anytime — I'm here if you need more.",
    isTerminal: true,
  },
  "end-thanks-2": {
    id: "end-thanks-2",
    avaMessage:
      "Done. Come back when you need to.",
    isTerminal: true,
  },
  "end-connect": {
    id: "end-connect",
    avaMessage:
      "Connecting you to an agent in this thread who will help you further.",
    isTerminal: true,
  },
  "still-stuck": {
    id: "still-stuck",
    avaMessage:
      "That needs a person. Connect to support?",
    quickReplies: ["Connect to support", "Let me try something else"],
  },
  "fallback-1": {
    id: "fallback-1",
    avaMessage:
      "I didn't catch that. Subscriptions, downloads, or accounts — pick one:",
    quickReplies: ["Subscription help", "Download or install", "Account question"],
  },
  "fallback-2": {
    id: "fallback-2",
    avaMessage:
      "Try rephrasing or pick an option:",
    quickReplies: ["Subscription help", "Download or install", "Account question"],
  },
  "fallback-3": {
    id: "fallback-3",
    avaMessage:
      "I can't handle that one here. Support can.",
    quickReplies: ["Connect to support", "Start over"],
  },
};

export const QUICK_REPLY_MAP: Record<string, string> = {
  // Top-level navigation
  "subscription help": "sub-start",
  "download or install": "dl-start",
  "account question": "acct-start",

  // Subscription sub-navigation
  "renew": "sub-renew",
  "cancel": "sub-cancel",
  "change plan": "sub-change",
  "billing question": "sub-billing",

  // Subscription: renew
  "renew revit": "sub-renew-confirm",
  "renew autocad lt": "sub-renew-confirm",
  "both": "sub-renew-confirm",

  // Subscription: cancel
  "cancel revit": "sub-cancel-process",
  "cancel autocad lt": "sub-cancel-process",
  "actually, nevermind": "end-thanks-2",

  // Subscription: change
  "change billing cycle": "sub-change-cycle",
  "switch products": "sub-change-product",
  "switch revit to annual": "sub-change-to-annual",
  "switch autocad lt to monthly": "sub-change-to-monthly",
  "replace revit": "sub-change-product-replace",
  "replace autocad lt": "sub-change-product-replace",

  // Subscription: billing
  "unexpected charge": "sub-billing-charge",
  "need an invoice": "sub-billing-invoice",
  "most recent": "sub-billing-invoice-send",
  "all from this year": "sub-billing-invoice-send",

  // Download
  "autocad": "dl-autocad",
  "autocad lt": "dl-lt",
  "revit": "dl-revit",
  "other product": "dl-other",
  "different product": "dl-other",
  "download revit": "dl-revit",
  "download autocad lt": "dl-lt",
  "start download": "dl-revit-download",
  "check system requirements": "dl-sysreq",
  "installation error": "dl-error",
  "download won't start": "dl-wontstart",
  "yes, clear them": "dl-error-fix",
  "yes, try it": "dl-wontstart-retry",
  "add autocad subscription": "end-connect",

  // Account
  "reset password": "acct-password",
  "send reset link": "acct-password",
  "update email": "acct-email",
  "access permissions": "acct-permissions",
  "can't sign in": "acct-signin",
  "it's something else": "end-connect",
  "yes, got it": "end-thanks",
  "no email received": "acct-password-noemail",
  "wrong email address": "acct-password-wrongemail",
  "let me check spam first": "end-thanks-2",
  "type new email": "acct-email-update",
  "type email": "acct-permissions-invite",
  "add a user": "acct-permissions-add",
  "remove a user": "end-connect",

  // Pricing
  "yes, switch revit to annual": "sub-change-to-annual",
  "yes, refund revit": "sub-refund-process",
  "no thanks": "end-thanks-2",

  // Shared exits
  "yes, something else": "more-help",
  "something else": "intro",
  "let me try something else": "intro",
  "neither, something else": "intro",
  "no, that's all": "end-thanks",
  "that helps, thanks": "end-thanks",
  "that's all i needed": "end-thanks",
  "yes, thanks": "end-thanks-2",
  "no, that covers it": "end-thanks-2",
  "connect to support": "end-connect",
  "start over": "intro",
};

export const KEYWORD_INTENTS: AvaIntent[] = [
  // Greetings
  { keywords: ["hello", "hi ", "hi!", "hey", "good morning", "good afternoon"], nodeId: "greeting" },

  // ─── Product-specific subscription changes (MUST come before generic product keywords) ───
  { keywords: ["revit to annual", "revit annual", "change revit", "switch revit", "make revit annual", "revit to yearly"], nodeId: "sub-change-to-annual" },
  { keywords: ["autocad to monthly", "autocad monthly", "change autocad", "switch autocad", "make autocad monthly"], nodeId: "sub-change-to-monthly" },
  { keywords: ["cancel revit", "stop revit", "end revit"], nodeId: "sub-cancel-process" },
  { keywords: ["cancel autocad", "stop autocad", "end autocad"], nodeId: "sub-cancel-process" },
  { keywords: ["renew revit"], nodeId: "sub-renew-confirm" },
  { keywords: ["renew autocad"], nodeId: "sub-renew-confirm" },

  // ─── Pricing / cost questions ───
  { keywords: ["how much", "cost", "price", "pricing", "what does it cost", "what's the price"], nodeId: "sub-pricing" },

  // ─── Specific subscription actions ───
  { keywords: ["switch to annual", "annual subscription", "monthly to annual", "make it annual", "annual plan", "yearly plan", "switch to monthly", "annual to monthly", "to annual", "to monthly"], nodeId: "sub-change-cycle" },
  { keywords: ["switch product", "change product", "different product", "swap product", "replace"], nodeId: "sub-change-product" },
  { keywords: ["refund", "money back", "get my money"], nodeId: "sub-cancel-refund" },
  { keywords: ["cancel my", "cancel subscription", "cancel the", "want to cancel", "how to cancel", "stop my subscription", "cancel it"], nodeId: "sub-cancel" },
  { keywords: ["renew my", "renewal", "renew subscription", "want to renew", "how to renew", "auto-renew", "auto renew"], nodeId: "sub-renew" },
  { keywords: ["invoice", "receipt", "proof of purchase"], nodeId: "sub-billing-invoice" },
  { keywords: ["unexpected charge", "charged twice", "wrong charge", "overcharged", "double charged"], nodeId: "sub-billing-charge" },
  { keywords: ["billing", "payment", "pay my", "update payment", "credit card", "payment method"], nodeId: "sub-billing" },
  { keywords: ["change plan", "upgrade", "downgrade", "switch plan", "change my plan", "change billing"], nodeId: "sub-change" },

  // Generic subscription
  { keywords: ["subscri"], nodeId: "sub-start" },

  // ─── Specific download/install actions ───
  { keywords: ["won't download", "download stuck", "can't download", "download failed", "download not working"], nodeId: "dl-wontstart" },
  { keywords: ["install error", "installation failed", "won't install", "can't install", "install problem", "installation error", "error code"], nodeId: "dl-error" },
  { keywords: ["download autocad lt", "install autocad lt", "get autocad lt"], nodeId: "dl-lt" },
  { keywords: ["download autocad", "install autocad", "get autocad"], nodeId: "dl-autocad" },
  { keywords: ["download revit", "install revit", "get revit"], nodeId: "dl-revit" },
  { keywords: ["system req", "specs", "minimum req", "ram", "disk space", "compatible"], nodeId: "dl-sysreq" },

  // Generic product names (only match in download context or as standalone)
  { keywords: ["autocad lt"], nodeId: "dl-lt" },
  { keywords: ["autocad"], nodeId: "dl-autocad" },
  { keywords: ["revit"], nodeId: "dl-revit" },

  // Generic download/install
  { keywords: ["download", "install", "setup"], nodeId: "dl-start" },

  // ─── Specific account actions ───
  { keywords: ["update email", "change email", "new email", "wrong email"], nodeId: "acct-email" },
  { keywords: ["reset password", "forgot password", "change password", "new password", "can't remember"], nodeId: "acct-password" },
  { keywords: ["can't sign in", "can't log in", "login failed", "locked out", "access denied", "can't login"], nodeId: "acct-signin" },
  { keywords: ["permission", "access", "admin", "user management", "add user", "remove user"], nodeId: "acct-permissions" },

  // Generic account
  { keywords: ["account", "login", "sign in", "sign-in", "profile"], nodeId: "acct-start" },

  // ─── Exits ───
  { keywords: ["thank", "thanks", "bye", "goodbye", "that's all", "all set", "that's it", "i'm good"], nodeId: "end-thanks" },
  { keywords: ["human", "agent", "person", "support", "talk to someone", "real person", "live chat"], nodeId: "end-connect" },
];

export function matchIntent(input: string): string | null {
  const lower = input.toLowerCase().trim();

  const exactMatch = QUICK_REPLY_MAP[lower];
  if (exactMatch) return exactMatch;

  for (const intent of KEYWORD_INTENTS) {
    if (intent.keywords.some((kw) => lower.includes(kw))) {
      return intent.nodeId;
    }
  }

  return null;
}
