import http from 'http';

const BASE_URL = 'http://localhost:5000/api/v1';

async function makeRequest(
  path: string,
  method: string = 'GET',
  body: any = null,
  token: string | null = null
): Promise<{ status: number; data: any }> {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}${path}`);
    const postData = body ? JSON.stringify(body) : '';

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (body) {
      headers['Content-Length'] = Buffer.byteLength(postData).toString();
    }

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method,
      headers,
    };

    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      res.on('end', () => {
        let parsed = responseBody;
        try {
          parsed = JSON.parse(responseBody);
        } catch (e) {
          // keep string if not json
        }
        resolve({ status: res.statusCode || 500, data: parsed });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (body) {
      req.write(postData);
    }
    req.end();
  });
}

async function runTestSuite() {
  console.log('====================================================');
  console.log('🧪 STARTING HAIRCARE AI END-TO-END AUTOMATED TEST SUITE');
  console.log('====================================================\n');

  let passedCount = 0;
  let failedCount = 0;

  function assert(condition: boolean, testName: string, res: { status: number; data: any } | null = null) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passedCount++;
    } else {
      const detail = res ? `(HTTP ${res.status}: ${JSON.stringify(res.data)})` : '';
      console.error(`❌ [FAIL] ${testName} ${detail}`);
      failedCount++;
    }
  }

  try {
    // 1. Health Check
    const healthRes = await makeRequest('/health');
    assert(healthRes.status === 200 && healthRes.data.status === 'ok', '1. Backend Health & DB Check');

    // 2. Auth - Signup
    const testEmail = `test_phase10_${Date.now()}@example.com`;
    const signupRes = await makeRequest('/auth/signup', 'POST', {
      email: testEmail,
      password: 'SecurePassword123!',
      name: 'Phase 10 Tester',
    });
    assert(signupRes.status === 201 && signupRes.data.success === true, '2. Auth - User Signup');
    const token = signupRes.data.token;
    assert(!!token, '2b. Auth - JWT Token Issuance');

    // 3. Auth - Login
    const loginRes = await makeRequest('/auth/login', 'POST', {
      email: testEmail,
      password: 'SecurePassword123!',
    });
    assert(loginRes.status === 200 && loginRes.data.success === true, '3. Auth - User Login');

    // 4. Authorization Guard Check (Unauthenticated request should fail or return no session)
    const unauthorizedRes = await makeRequest('/dashboard', 'GET');
    assert(unauthorizedRes.status === 401 || unauthorizedRes.data.isAuthenticated === false, '4. Security - Unauthorized Access Guard');

    // 5. Intake Questionnaire API
    const intakeRes = await makeRequest('/intake', 'POST', {
      ageRange: '25-34',
      gender: 'Male',
      concerns: ['Thinning hair', 'Receding hairline'],
      dietHabits: { waterIntake: '2L', protein: 'Moderate' },
      routineHabits: { washFrequency: 'Twice a week' },
    }, token);
    assert(intakeRes.status === 201 && intakeRes.data.success === true, '5. Intake - Submit Questionnaire');

    const latestIntakeRes = await makeRequest('/intake/latest', 'GET', null, token);
    assert(latestIntakeRes.status === 200 && latestIntakeRes.data.success === true, '5b. Intake - Fetch Latest Responses');

    // 6. Photo Session Creation
    const photoSessRes = await makeRequest('/photo-sessions', 'POST', {
      consentGiven: true,
    }, token);
    assert(photoSessRes.status === 201 && photoSessRes.data.success === true, '6. Photo - Create Photo Session');
    const sessionId = photoSessRes.data.session.id;

    // 7. Trigger Visual Assessment Analysis Pipeline
    const analyzeRes = await makeRequest(`/photo-sessions/${sessionId}/analyze`, 'POST', null, token);
    assert((analyzeRes.status === 200 || analyzeRes.status === 201) && analyzeRes.data.success === true, '7. AI Analysis - Trigger Assessment Pipeline', analyzeRes);

    // 8. Generate Wellness Plan
    const planGenRes = await makeRequest('/wellness-plans/generate', 'POST', null, token);
    assert((planGenRes.status === 200 || planGenRes.status === 201) && planGenRes.data.success === true, '8. Wellness Plan - AI Plan Generation', planGenRes);
    const planId = planGenRes.data?.plan?.id || 'mock_plan';

    // Accept Wellness Plan
    const planAcceptRes = await makeRequest(`/wellness-plans/${planId}/accept`, 'POST', null, token);
    assert((planAcceptRes.status === 200 || planAcceptRes.status === 201) && planAcceptRes.data.success === true, '8b. Wellness Plan - User Acceptance', planAcceptRes);

    // 9. Routines & Logs
    const routinesRes = await makeRequest('/routines', 'GET', null, token);
    assert(routinesRes.status === 200 && routinesRes.data.success === true, '9. Routines - List User Routines', routinesRes);

    // 10. Notification Preferences
    const notifPrefRes = await makeRequest('/notification-preferences', 'PATCH', {
      remindersEnabled: true,
      reminderTime: '08:30',
      timezone: 'America/New_York',
    }, token);
    assert(notifPrefRes.status === 200 && notifPrefRes.data.success === true, '10. Reminders - Update Notification Preferences', notifPrefRes);

    // 11. Progress Tracking & Reports
    const progressRes = await makeRequest('/progress', 'GET', null, token);
    assert(progressRes.status === 200 && progressRes.data.success === true, '11. Progress - Fetch Progress Timeline', progressRes);

    const createReportRes = await makeRequest('/progress/reports', 'POST', {
      baselineSessionId: sessionId,
      comparisonSessionId: sessionId,
      userNotes: 'Shedding is lower.',
    }, token);
    assert((createReportRes.status === 200 || createReportRes.status === 201) && createReportRes.data.success === true, '11b. Progress - Create Comparison Report', createReportRes);

    // 12. Dashboard Summary API
    const dashboardRes = await makeRequest('/dashboard', 'GET', null, token);
    assert(dashboardRes.status === 200 && dashboardRes.data.success === true, '12. Dashboard - Aggregated Overview API');

    // 13. Data Retention & Account Deletion (Privacy Rights Compliance)
    const deleteAccountRes = await makeRequest('/auth/account', 'DELETE', null, token);
    assert(deleteAccountRes.status === 200 && deleteAccountRes.data.success === true, '13. Security & Data Retention - Delete Account');

    // Verify deleted account login fails
    const reLoginRes = await makeRequest('/auth/login', 'POST', {
      email: testEmail,
      password: 'SecurePassword123!',
    });
    assert(reLoginRes.status === 401, '13b. Security - Deleted User Cannot Login');

    console.log('\n====================================================');
    console.log(`📊 TEST SUITE SUMMARY: ${passedCount} PASSED | ${failedCount} FAILED`);
    console.log('====================================================\n');
  } catch (err) {
    console.error('Test execution error:', err);
  }
}

runTestSuite();
