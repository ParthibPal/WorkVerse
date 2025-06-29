/**
 * Routing Test Utility
 * This utility helps test the routing logic for different user types
 * Use this to verify that users are routed to the correct dashboards
 */

/**
 * Test routing logic for different user types
 * @param {Object} user - User object with userType and isAdmin properties
 * @returns {string} - Expected route for the user
 */
export const testUserRouting = (user) => {
    if (!user) {
        return '/login';
    }

    // Check if user is admin (both isAdmin flag and userType must be 'admin')
    if (user.isAdmin && user.userType === 'admin') {
        return '/admin-dashboard';
    }

    // Check user type for non-admin users
    switch (user.userType) {
        case 'employer':
            return '/dashboard';
        case 'jobseeker':
            return '/home';
        case 'admin':
            // If userType is admin but isAdmin is false, treat as regular user
            return '/home';
        default:
            return '/home';
    }
};

/**
 * Test cases for routing logic
 */
export const routingTestCases = [
    {
        name: 'Admin User',
        user: { userType: 'admin', isAdmin: true },
        expectedRoute: '/admin-dashboard'
    },
    {
        name: 'Employer User',
        user: { userType: 'employer', isAdmin: false },
        expectedRoute: '/dashboard'
    },
    {
        name: 'Jobseeker User',
        user: { userType: 'jobseeker', isAdmin: false },
        expectedRoute: '/home'
    },
    {
        name: 'Invalid Admin (userType admin but isAdmin false)',
        user: { userType: 'admin', isAdmin: false },
        expectedRoute: '/home'
    },
    {
        name: 'No User',
        user: null,
        expectedRoute: '/login'
    }
];

/**
 * Run all routing tests
 */
export const runRoutingTests = () => {
    console.log('🧪 Running Routing Tests...');
    
    routingTestCases.forEach(testCase => {
        const result = testUserRouting(testCase.user);
        const passed = result === testCase.expectedRoute;
        
        console.log(`${passed ? '✅' : '❌'} ${testCase.name}:`);
        console.log(`   Expected: ${testCase.expectedRoute}`);
        console.log(`   Got: ${result}`);
        console.log(`   User:`, testCase.user);
        console.log('');
    });
    
    console.log('🏁 Routing tests completed!');
};

// Export for use in development
if (typeof window !== 'undefined') {
    window.testUserRouting = testUserRouting;
    window.runRoutingTests = runRoutingTests;
} 