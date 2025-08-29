// Test utility to examine PCA API response structure
import { getPCAResultByUserId, checkPCAStatus, getAllPCAEvaluations } from '../services/pcaService';

/**
 * Test PCA API endpoints and log response structures
 */
export async function testPCAAPIStructure() {
  console.log('=== Testing PCA API Structure ===');
  
  try {
    // Test with a sample user ID
    const testUserId = 'test-user-123';
    
    console.log('\n1. Testing getAllPCAEvaluations:');
    try {
      const allEvaluations = await getAllPCAEvaluations();
      console.log('All PCA Evaluations Response:', JSON.stringify(allEvaluations, null, 2));
      console.log('Type:', typeof allEvaluations);
      console.log('Is Array:', Array.isArray(allEvaluations));
      if (Array.isArray(allEvaluations) && allEvaluations.length > 0) {
        console.log('First evaluation structure:', JSON.stringify(allEvaluations[0], null, 2));
      }
    } catch (error) {
      console.log('getAllPCAEvaluations Error:', error);
    }
    
    console.log('\n2. Testing getPCAResultByUserId:');
    try {
      const pcaResult = await getPCAResultByUserId(testUserId);
      console.log('PCA Result Response:', JSON.stringify(pcaResult, null, 2));
      console.log('Type:', typeof pcaResult);
      console.log('Keys:', Object.keys(pcaResult || {}));
    } catch (error) {
      console.log('getPCAResultByUserId Error:', error);
    }
    
    console.log('\n3. Testing checkPCAStatus:');
    try {
      const pcaStatus = await checkPCAStatus(testUserId);
      console.log('PCA Status Response:', JSON.stringify(pcaStatus, null, 2));
      console.log('Status:', pcaStatus.status);
      console.log('Has Results:', pcaStatus.hasResults);
      console.log('PCA Code:', pcaStatus.pcaCod);
      console.log('Last Activity:', pcaStatus.lastActivity);
    } catch (error) {
      console.log('checkPCAStatus Error:', error);
    }
    
  } catch (error) {
    console.error('Test PCA API Structure Error:', error);
  }
}

/**
 * Test with real user data if available
 */
export async function testPCAAPIWithRealUser(userId: string) {
  console.log(`=== Testing PCA API with User ID: ${userId} ===`);
  
  try {
    console.log('\n1. Checking PCA Status:');
    const status = await checkPCAStatus(userId);
    console.log('Status Result:', JSON.stringify(status, null, 2));
    
    if (status.hasResults) {
      console.log('\n2. Fetching PCA Results:');
      try {
        const result = await getPCAResultByUserId(userId);
        console.log('PCA Result:', JSON.stringify(result, null, 2));
      } catch (error) {
        console.log('Error fetching results:', error);
      }
    } else {
      console.log('\n2. No PCA results available for this user');
    }
    
  } catch (error) {
    console.error('Test PCA API with Real User Error:', error);
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).testPCAAPI = {
    testStructure: testPCAAPIStructure,
    testWithUser: testPCAAPIWithRealUser
  };
}