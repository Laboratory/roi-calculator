/**
 * API services for Brevo integration
 */

const BREVO_API_ENDPOINT = 'https://offering.alphamind.co/api/brevo/subscribe';

/**
 * Subscribe a user's email to a Brevo mailing list
 *
 * @param {string} email - User's email address
 * @param {number} listId - Brevo list ID (default: 2 for ROI Calculator subscribers)
 * @returns {Promise} - Promise that resolves with the API response or rejects with error
 */
export const subscribeToBrevo = async (email, listId = 8) => {
  try {
    const response = await fetch(BREVO_API_ENDPOINT, {
      method: 'POST', headers: {
        'Content-Type': 'application/json',
      }, body: JSON.stringify({
        email, listId
      }),
    });

    if (!response.ok) {
      throw new Error('Subscription failed. Please try again later.');
    }

    return await response.json();
  } catch (error) {
    console.error('Error subscribing to Brevo:', error);
    throw error;
  }
};
