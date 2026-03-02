// Email template for successful purchase
function generateConfirmationEmail(
  email: string,
  planName: string,
  planAmount: number,
) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4ade80 0%, #16a34a 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; }
          .content { padding: 30px; background: #f9fafb; }
          .section { margin: 20px 0; }
          .button { background: #16a34a; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; display: inline-block; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .plan-details { background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #4ade80; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Congratulations!</h1>
            <p>Your Personalized Baby Gear Plan is Ready</p>
          </div>

          <div class="content">
            <div class="section">
              <p>Hi Parent,</p>
              <p>Thank you for your purchase! Your personalized newborn gear & survival plan is now ready to access.</p>
            </div>

            <div class="plan-details">
              <h3 style="margin-top: 0;">Plan Summary</h3>
              <p><strong>Plan:</strong> ${planName}</p>
              <p><strong>Amount Paid:</strong> $${planAmount}</p>
              <p><strong>Status:</strong> ✅ Instant Access (No Shipping)</p>
            </div>

            <div class="section">
              <h3>Next Steps</h3>
              <ol>
                <li>Click the button below to view your personalized plan</li>
                <li>Review your Must-Have, Optional, and Skip lists</li>
                <li>Check out the 3-Pick Matchmaker for big-ticket items</li>
                <li>Download the PDF or create a shopping list</li>
              </ol>
            </div>

            <div class="section" style="text-align: center;">
              <a href="https://yoursite.com/plan" class="button">View My Personalized Plan</a>
            </div>

            <div class="section">
              <h3>What You're Getting</h3>
              <ul>
                <li>✅ Personalized Must-Have gear list based on YOUR home & lifestyle</li>
                <li>✅ Items to skip (save $300+)</li>
                <li>✅ 3 vetted recommendations for strollers, car seats, and more</li>
                <li>✅ Safety-vetted, AAP-approved recommendations</li>
                <li>✅ Download as PDF for offline access</li>
              </ul>
            </div>

            <div class="section" style="background: #fef3c7; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b;">
              <h3 style="margin-top: 0; color: #92400e;">💡 Pro Tip</h3>
              <p style="color: #78350f;">Share the "Skip List" with friends and family—they'll love that you're avoiding wasteful purchases.</p>
            </div>

            <div class="section">
              <h3>Questions?</h3>
              <p>We're here to help! Reply to this email or contact us at support@babygearplanner.com</p>
              <p><strong>30-Day Refund Guarantee:</strong> If you're not satisfied, we offer a full refund within 30 days, no questions asked.</p>
            </div>
          </div>

          <div class="footer">
            <p>© 2024 Baby Gear Planner. All rights reserved.</p>
            <p>You're receiving this email because you purchased our personalized baby gear plan.</p>
            <p><a href="https://yoursite.com/unsubscribe" style="color: #666;">Unsubscribe from emails</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// Email template for feedback request
function generateFeedbackEmail(email: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4ade80 0%, #16a34a 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; }
          .content { padding: 30px; background: #f9fafb; }
          .section { margin: 20px 0; }
          .button { background: #16a34a; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; display: inline-block; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>How's It Going?</h1>
            <p>We'd Love Your Feedback</p>
          </div>

          <div class="content">
            <div class="section">
              <p>Hi Parent,</p>
              <p>It's been 48 hours since you got your personalized baby gear plan. We hope it's been helpful!</p>
            </div>

            <div class="section">
              <h3>Quick Questions for You</h3>
              <ul>
                <li>Did the personalized list save you time and money?</li>
                <li>Was there anything confusing or missing?</li>
                <li>Will you be using this plan before your baby arrives?</li>
              </ul>
            </div>

            <div class="section" style="text-align: center;">
              <a href="https://yoursite.com/feedback" class="button">Share Your Feedback (2 min)</a>
            </div>

            <div class="section">
              <p><strong>💝 Bonus:</strong> Reply with feedback and get 20% off our future products (coming soon!).</p>
            </div>

            <div class="section">
              <p>Thanks for being an early believer in our mission to help parents make smarter gear choices.</p>
              <p>- The Baby Gear Planner Team</p>
            </div>
          </div>

          <div class="footer">
            <p>© 2024 Baby Gear Planner. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export { generateConfirmationEmail, generateFeedbackEmail };
