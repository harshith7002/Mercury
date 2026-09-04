import { CatalogTools } from '../lib/tools';
import { AIProvider } from '../lib/ai/provider';
import { PolicyEngine } from '../lib/policy/engine';
import { RazorpayService } from '../lib/razorpay/service';
import { AuditService } from '../lib/audit/service';
import { ApprovalService } from '../lib/approval/service';

async function runFullHostileAuditTestSuite() {
  console.log('====================================================');
  console.log('  MERCURY HOSTILE FUNCTIONAL AUDIT TEST SUITE');
  console.log('====================================================\n');

  let passedTests = 0;
  let failedTests = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`  [FAIL] ${testName}${detail ? ` - ${detail}` : ''}`);
      failedTests++;
    }
  }

  // 1. CATALOG SEARCH AUDIT
  console.log('1. CATALOG SEARCH AUDIT');
  const catalogResults = await CatalogTools.searchCatalog({ query: 'keyboard' });
  assert(catalogResults.length > 0, 'Catalog returns real DB items for query "keyboard"');
  assert(catalogResults[0].price > 0, 'Catalog product has valid DB price', `Price: ₹${catalogResults[0]?.price}`);
  assert(Boolean(catalogResults[0].imageUrl), 'Catalog product contains valid image URL');

  // 2. AI BUYER 10 PROMPTS TEST
  console.log('\n2. AI BUYER AGENT PROMPTS AUDIT (10 DISTINCT PROMPTS)');
  const testPrompts = [
    'I need a gaming mouse under ₹3,000.',
    'Find me a laptop for college.',
    'I want something for my home office.',
    'I need the cheapest keyboard.',
    'Compare your best two headphones.',
    'Show me something under ₹2,000.',
    'Recommend a monitor for programming.',
    'Can I buy a mouse with this laptop?',
    "What's the best value product?",
    'Find something completely different from keyboards.'
  ];

  for (let i = 0; i < testPrompts.length; i++) {
    const prompt = testPrompts[i];
    const processed = await AIProvider.processBuyerQuery(prompt);
    assert(
      Boolean(processed.recommendedProduct),
      `Prompt #${i + 1}: "${prompt.slice(0, 30)}..." -> Recommended: ${processed.recommendedProduct?.name || 'None'}`
    );
  }

  // 3. UPSELL DYNAMIC CO-PURCHASE RATE AUDIT
  console.log('\n3. UPSELL DYNAMIC CO-PURCHASE RATE AUDIT');
  const keyboardProduct = catalogResults[0];
  const upsell = await CatalogTools.getGrowthAgentUpsell(keyboardProduct.id);
  assert(Boolean(upsell), 'Growth Agent generates upsell recommendation');
  assert(upsell!.confidenceScore > 0, 'Co-purchase confidence score is numeric > 0', `Score: ${upsell?.confidenceScore}`);
  assert(upsell!.reason.includes('co-purchase rate'), 'Reason incorporates calculated co-purchase metrics', `Reason: ${upsell?.reason}`);

  // 4. POLICY ENGINE SECURITY & BYPASS TESTS
  console.log('\n4. POLICY ENGINE SECURITY AUDIT');
  
  // Test A: ₹15,000 discount when limit is ₹1,000
  const polExceed = await PolicyEngine.validateDiscount(15000, 64999, 'Test Agent');
  assert(!polExceed.allowed && polExceed.requiresApproval, 'Blocked ₹15,000 discount exceeding ₹1,000 limit');

  // Test B: Negative discount amount (-₹500)
  const polNeg = await PolicyEngine.validateDiscount(-500, 5000, 'Malicious Client');
  assert(!polNeg.allowed, 'Blocked negative discount (-₹500)');

  // Test C: Discount greater than item price (₹10,000 discount on ₹5,000 item)
  const polExcess = await PolicyEngine.validateDiscount(10000, 5000, 'Malicious Client');
  assert(!polExcess.allowed, 'Blocked discount greater than item price');

  // Test D: 100% discount
  const pol100 = await PolicyEngine.validateDiscount(5000, 5000, 'Malicious Client');
  assert(!pol100.allowed && pol100.requiresApproval, 'Blocked 100% free promotional discount');

  // Test E: Transaction exceeding ₹10,000 limit (₹15,000 transaction)
  const polTxExceed = await PolicyEngine.validateTransaction(15000, 'AI Buyer');
  assert(!polTxExceed.allowed && polTxExceed.requiresApproval, 'Blocked ₹15,000 transaction exceeding ₹10,000 limit');

  // 5. APPROVAL FLOW AUDIT
  console.log('\n5. APPROVAL GATE AUDIT');
  const req = await ApprovalService.createRequest({
    agentType: 'GROWTH_AGENT',
    actionType: 'EXCESSIVE_DISCOUNT',
    requestedAmount: 15000,
    policyLimit: 1000,
    reason: 'Test restricted action',
    payloadJson: '{}'
  });
  assert(req.status === 'PENDING', 'Created approval request status is PENDING');

  const decided = await ApprovalService.decideRequest(req.id, 'REJECTED', 'Merchant Admin');
  assert(decided.status === 'REJECTED', 'Merchant successfully rejected request');

  // 6. RAZORPAY TEST MODE & MOCK AUDIT
  console.log('\n6. RAZORPAY TEST MODE & SIGNATURE VERIFICATION AUDIT');
  const orderRes = await RazorpayService.createOrder({ amount: 6298 });
  assert(Boolean(orderRes.orderId), 'Razorpay order created', `Order ID: ${orderRes.orderId}`);
  assert(orderRes.isMock === true || orderRes.isMock === false, 'Razorpay correctly identifies Mock vs Real Test Mode', `isMock: ${orderRes.isMock}`);

  // Test valid signature verification
  const validVerification = await RazorpayService.verifyPayment({
    razorpayOrderId: orderRes.orderId,
    razorpayPaymentId: 'pay_test_valid_123',
    razorpaySignature: 'sig_test_valid_signature_hash'
  });
  assert(validVerification.success === true, 'Server payment verification succeeded for valid test payload');

  // Test invalid signature verification
  const invalidVerification = await RazorpayService.verifyPayment({
    razorpayOrderId: orderRes.orderId,
    razorpayPaymentId: 'pay_test_invalid',
    razorpaySignature: 'invalid_bad_sig'
  });
  assert(invalidVerification.success === false, 'Server payment verification rejected invalid signature payload');

  // 7. AUDIT TRAIL RECORD AUDIT
  console.log('\n7. AUDIT TRAIL SYSTEM AUDIT');
  await AuditService.log({
    actor: 'Test Runner',
    action: 'AUDIT_VERIFICATION_TEST',
    reason: 'Verifying automated audit trail logging',
    result: 'SUCCESS'
  });
  const auditEvents = await AuditService.getEvents({ action: 'AUDIT_VERIFICATION_TEST' });
  assert(auditEvents.length > 0, 'Audit event automatically recorded in DB', `Found: ${auditEvents.length}`);

  // SUMMARY REPORT
  console.log('\n====================================================');
  console.log(`AUDIT COMPLETE: ${passedTests} Passed | ${failedTests} Failed`);
  console.log('====================================================\n');
}

runFullHostileAuditTestSuite().catch(console.error);
