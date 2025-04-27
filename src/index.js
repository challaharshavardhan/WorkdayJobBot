const { chromium } = require('playwright');
const profile = require('./data/profile.json');

const { handleMyInformationPage } = require('./functions/handleMyInformationPage');
const { handleMyExperiencePage } = require('./functions/handleMyExperiencePage');
const { handleMyAppQuestionPage } = require('./functions/handleMyAppQuestionPage');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Set default timeout globally for the page
  page.setDefaultTimeout(200000); // 200 seconds

  // const jobURL = 'https://ohiohealth.wd5.myworkdayjobs.com/en-US/OhioHealthJobs/job/BLOM-ADMINISTRATIVE-CAMPUS/IT-End-Point-Tech-Lead_JR126984/apply/autofillWithResume?q=engineer';
  // const jobURL = 'https://workday.wd5.myworkdayjobs.com/Workday/job/USA-GA-Atlanta/Software-Development-Engineer---US-Federal_JR-0095852?source=website_linkedin'
  const jobURL='https://ohiohealth.wd5.myworkdayjobs.com/OhioHealthJobs/job/DOCTORS-HOSPITAL/Nuclear-Medicine-Technologist_JR115091/apply?utm_source=careers_site_applyclick&utm_medium=referral&utm_campaign=careersapply_Radiology/Imaging';
  await page.goto(jobURL);

  // Wait for the user icon to appear (clickable)
  console.log('🔐 Waiting for the user icon...');
  await page.waitForSelector('.wd-icon-user', { timeout: 200000 });

  // Click the user icon to open the modal
  console.log('➡️ Clicking on the "User Icon"...');
  const userIcon = await page.$('.wd-icon-user');
  if (userIcon) {
    await userIcon.click();
    console.log('✅ Clicked on "User Icon"');
  } else {
    console.error('❌ User Icon not found!');
  }

  // Wait for the login form modal to appear
  console.log('🧾 Waiting for the login form modal...');
  await page.waitForSelector('[data-automation-id="signInContent"]', { timeout: 20000 });

  // Fill in the email and password in the modal
  console.log('✅ Filling in email and password...');
  await page.fill('input[data-automation-id="email"]', profile.email);
  await page.fill('input[data-automation-id="password"]', profile.password);

  // Click the "Sign In" button inside the modal (force click)
  console.log('➡️ Clicking "Sign In" button inside the modal...');
  await page.waitForTimeout(3000);
  const signInButton = await page.$('[data-automation-id="signInSubmitButton"]');
  if (signInButton) {
    await signInButton.scrollIntoViewIfNeeded(); // Scroll the button into view
    await signInButton.click({ force: true }); // Force the click even if intercepted
    console.log('✅ Clicked "Sign In" button');
  } else {
    console.error('❌ "Sign In" button not found!');
  }

  // Wait for page load after sign in
  console.log('🔍 Waiting for page to load...');
  await page.waitForTimeout(5000); // Wait a few seconds to ensure login

  // Check for login success by looking for progress bar or another indicator
  const progressBar = await page.$('[data-automation-id="progressBar"]');
  if (progressBar) {
    console.log('✅ Logged in successfully — Progress bar detected');
  } else {
    console.error('❌ Login failed: Progress bar not found');
  }

  // const myInfoHeader = await page.locator('h2.css-1ylcaf3').innerText();


  const pageTitleSelector = 'h2'; // You can adjust this based on the element that contains page titles (like <h1> for My Information, etc.)

  while (true) {
    try {
      // Check if the "My Information" page is displayed
      // const title = await page.locator(pageTitleSelector).innerText();
      const titleElement = await page.$(pageTitleSelector);
      if (!titleElement) {
        console.log("❌ No page title found — possible page transition or closed tab");
        break; // or optionally continue;
      }

      const title = await titleElement.innerText();
      if (title.includes('My Information')) {
        console.log("➡️ You're on the 'My Information' page.");
        // Perform actions for 'My Information' page
        // Move to the next page or step (after actions)
        await handleMyInformationPage(page,profile);  // Replace with your function for handling the My Information page
        // Wait for a short time before checking again (to avoid high CPU usage)
        await page.waitForTimeout(3000); // 3 seconds
      }
      // Check if the "My Experience" page is displayed
      else if (title.includes('My Experience')) {
        console.log("➡️ You're on the 'My Experience' page.");
        // Perform actions for 'My Experience' page

        // Move to the next page or step (after actions)
        await handleMyExperiencePage(page, profile);  // Replace with your function for handling the My Experience page
        // await page.pause();
      }

      else if(title.includes('Application Questions')){
        console.log("We are in Application Questionarie page.!!");
        await handleMyAppQuestionPage(page, [
          { question: "Are you authorized to work for any employer in the United States of America?", answer: "Yes" },
          { question: "Do you have any relatives employed with OhioHealth?", answer: "No" },
          { question: "Have you ever been convicted of a crime", answer: "No" },
          { question: "Do you have a non-competition agreement", answer: "No" },
          { question: "Are you able to perform", answer: "Yes" },
          { question: "Do you now, or will you in the future, need Visa sponsorship?", answer: "No" },
          { question: "Are you at least 18 years of age?", answer: "Yes" }
        ]);
        await page.pause();
      }
      // You can add more checks for other pages if needed
      else {
        console.log("➡️ Unknown page detected: " + title);
      }

      // Wait for a short time before checking again (to avoid high CPU usage)
      await page.waitForTimeout(3000); // 3 seconds

    } catch (error) {
      // If the page is closed or there’s an error, break the loop
      console.log("❌ Error or website closed, exiting loop");
      break; // Exit the loop if an error occurs or the page is no longer available
    }
  }
            
  }

  // await browser.close();
)();
